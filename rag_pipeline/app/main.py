# main.py
import json
import uvicorn
import asyncio
import socketio
import redis
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
from app.services.rag_pipeline import rag_pipeline, process_user_input
from app.utils.response_utils import response_generator  # ✅ Streaming import
from app.utils.fo_mini_api import call_4o_mini
from app.services.redis_utils import get_recent_history
from app.utils.sys_prompt_dict import sys_prompt

app = FastAPI()

# Redis 연결
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # credential 설정과 같이 쓸 경우 규정 위반이라 무시됩니다.
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE 등
    allow_headers=["*"],   # Authorization, Content-Type 등
    expose_headers=["ChatTag"],  # 클라이언트에서 접근할 수 있도록 명시
)

# FastAPI + Socket.IO 설정
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True,
    transports=["websocket", "polling"]
)

socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="/socket.io")

# room_id -> asyncio.Queue(챗봇)
chatbot_queues: Dict[str, asyncio.Queue] = {}

# room_id: {user_id: nickname} 맵, room_id: {sid: user_id} 맵
room_user_nicknames: Dict[str, Dict[str, str]] = {}
sid_user_mapping: Dict[str, Dict[str, str]] = {}

# # 챗봇 백그라운드 태스크
# async def chatbot_worker(room_id: str):
#     queue = chatbot_queues[room_id]
#     while True:
#         data = await queue.get()  # ✅ 큐에서 데이터를 가져옴 (딕셔너리 형태)
#         if data is None:
#             break
#         try:
#             user_input = data["user_input"]
#             user_id = data["user_id"]
#             bot_id = data["bot_id"]
#             type = data["type"]

#             print(f"🟢 사용자 입력 감지: {user_input}")  # ✅ 로그 추가
#             print(f"🟢 user_id: {user_id}, bot_id: {bot_id}, type: {type}")  # ✅ 로그 추가
#             other_nicknames = [nick for uid, nick in room_user_nicknames[room_id].items() if uid != user_id]
#             print(f"""
#                   🟢 닉네임 감지
#                   UserNickname {room_user_nicknames[room_id][user_id]}
#                   OtherNickname {other_nicknames}
# """)

#             # ✅ 챗봇 처리 로직 실행 (rag_pipeline 호출)
#             answer, tag = await rag_pipeline(room_id, user_input, type, user_id, bot_id)
            
#             nicknames = list(room_user_nicknames.get(room_id, {}).values())
#             print(f"룸 {room_id} 참여자: {', '.join(nicknames)}")

#         except Exception as e:
#             answer = f"[Error] RAG 파이프라인 실패: {str(e)}"

#         # ✅ 챗봇 응답을 방에 브로드캐스트
#         await sio.emit("chatbot_message", {
#             "message": answer,
#             "role" : "assistant",
#             "chat_tag" : tag,
#         }, room=room_id)

#         print(f"🟣 현재 세션 ID: {room_id}")  # ✅ 로그 추가
#         print(f"🟣 chatbot_message 브로드캐스트 완료: {answer}, 채팅 태그: {tag}")  # ✅ 로그 추가

# 챗봇 백그라운드 태스크 (스트리밍 방식, 사용자 새 메시지 수신 시 중단)
async def chatbot_worker(room_id: str):
    queue = chatbot_queues[room_id]
    while True:
        data = await queue.get()  # 큐에서 데이터를 가져옴
        if data is None:
            break
        try:
            user_input = data["user_input"]
            user_id = data["user_id"]
            bot_id = int(data["bot_id"])
            type = data["type"]

            print(f"🟢 사용자 입력 감지: {user_input}")
            print(f"🟢 user_id: {user_id}, bot_id: {bot_id}, type: {type}")

            other_nicknames = [nick for uid, nick in room_user_nicknames[room_id].items() if uid != user_id]
            print(f"""
                  🟢 닉네임 감지
                  UserNickname {room_user_nicknames[room_id][user_id]}
                  OtherNickname {other_nicknames}
            """)

            # 전처리 작업 실행하여 context, keywords, chat_tag 생성
            context, keywords, chat_tag = await process_user_input(room_id, user_input, type, user_id, bot_id)

            # response_generator를 통해 스트리밍 응답을 생성 (async generator)
            generator = response_generator(
                room_id, user_input, context,
                bot_id=bot_id, keywords=keywords, user_id=user_id, type=type, chat_tag=chat_tag
            )

            # generator를 통해 스트리밍으로 전송
            async for chunk in generator:
                # 만약 큐에 새 메시지가 들어왔다면 스트리밍 응답을 중단합니다.
                if not queue.empty():
                    print("새로운 사용자 메시지 감지, 스트리밍 응답 중단")
                    break
                await sio.emit("chatbot_message", {
                    "message": chunk,
                    "role": "assistant",
                    "chat_tag": chat_tag,
                }, room=room_id)

            print(f"🟣 스트리밍 응답 완료: 채팅 태그: {chat_tag}")

        except Exception as e:
            answer = f"[Error] Streaming 응답 생성 실패: {str(e)}"
            # 에러 발생 시 전체 에러 메시지를 전송
            await sio.emit("chatbot_message", {
                "message": answer,
                "role": "assistant",
                "chat_tag": "",
            }, room=room_id)
            print(f"❌ 오류 발생: {e}")
    
# Socket.IO 이벤트
@sio.event
async def connect(sid, environ):
    print(f"[connect] 클라이언트 연결: {sid}")
    
@sio.event
async def connect_error(sid, data):
    print(f"❌ WebSocket 연결 실패: {data}")

@sio.event
async def disconnect(sid):
    # sid에 해당하는 room_id와 user_id 찾기
    mapping = sid_user_mapping.get(sid)
    if mapping:
        room_id = mapping["room_id"]
        user_id = mapping["user_id"]
        if room_id in room_user_nicknames and user_id in room_user_nicknames[room_id]:
            print(f"룸 {room_id}에서 user_id {user_id} 제거됨.")
            del room_user_nicknames[room_id][user_id]
        # sid 매핑 제거
        del sid_user_mapping[sid]
    print(f"[disconnect] 클라이언트 해제: {sid}")

@sio.on("join_room")
async def handle_join_room(sid, data):
    """
    data = { "room_id": "some_room_id" }
    """
    room_id = data["room_id"]
    await sio.enter_room(sid, room_id)
    print(f"[join_room] {sid} joined {room_id}")

    user_id = data.get("user_id")
    nickname = data.get("nickname")
    # 해당 room_id에 대한 매핑 딕셔너리가 없으면 생성
    if room_id not in room_user_nicknames:
        room_user_nicknames[room_id] = {}

    # user_id와 nickname 저장
    if user_id and nickname:
        room_user_nicknames[room_id][user_id] = nickname
        # sid에서 room_id와 user_id 정보도 저장
        sid_user_mapping[sid] = {"room_id": room_id, "user_id": user_id}
        print(f"🔍 룸 {room_id}에 user_id {user_id}: '{nickname}' 저장됨.")
    else: print("nono")

    print(f"🔍 현재 {sid}의 Room 리스트: {sio.rooms(sid)}")

    if room_id not in chatbot_queues:
        chatbot_queues[room_id] = asyncio.Queue()
        asyncio.create_task(chatbot_worker(room_id))

    # 클라이언트에게 알림
    await sio.emit("room_joined", {"room_id": room_id}, room=sid)

@sio.on("chat_message")
async def handle_chat_message(sid, data):
    """
    data = {
        "room_id": "...",
        "user_id": "...",
        "bot_id": ...,
        "user_input": "...",
        "type": "..."
    }
    """
    room_id = data["room_id"]

    # 사용자 메시지 브로드캐스트
    await sio.emit("chat_message", {
        "message": data["user_input"],
        "role": data["user_id"],
        "type" : data["type"],
        "bot_id": data["bot_id"],
        }, room=room_id)

    # 챗봇 Queue에 메시지 투입
    if room_id in chatbot_queues:
        await chatbot_queues[room_id].put(data)

# --- 아래는 WebRTC signaling 이벤트 추가 부분 ---

@sio.on("offer")
async def handle_offer(sid, data):
    """
    data = { "room_id": "some_room_id", "sdp": { ... } }
    """
    room_id = data.get("room_id")
    print(f"[offer] {sid} sent offer for room {room_id}")
    await sio.emit("offer", data, room=room_id, skip_sid=sid)

@sio.on("answer")
async def handle_answer(sid, data):
    """
    data = { "room_id": "some_room_id", "sdp": { ... } }
    """
    room_id = data.get("room_id")
    print(f"[answer] {sid} sent answer for room {room_id}")
    await sio.emit("answer", data, room=room_id, skip_sid=sid)

@sio.on("ice-candidate")
async def handle_ice_candidate(sid, data):
    """
    data = { "room_id": "some_room_id", "candidate": { ... } }
    """
    room_id = data.get("room_id")
    print(f"[ice-candidate] {sid} sent ICE candidate for room {room_id}")
    await sio.emit("ice-candidate", data, room=room_id, skip_sid=sid)

class ChatRequest(BaseModel):
    session_id: str
    user_input: str
    user_id: str
    bot_id: int
    type: str

class CloseChatRequest(BaseModel):
    sessionId: str

class ChatSummaryResponse(BaseModel):
    summary: str
    title: str
    tag: List[str]
    cardImageUrl: str

@app.get("/", tags=["Health Check"])
async def read_root():
    """Check if the API is running."""
    return {"message": "Hello, RAG MVP with Redis!"}

# type을 쿼리 파라미터에 추가하고, 응답에 chatTag를 반환하도록 설정
@app.post("/chat")
async def chat(session_id: str, user_input: str, type: str = ""):
    result, tag = await rag_pipeline(session_id, user_input, type, stream=False)
    return {"answer": result, "chatTag": tag}

@app.post("/chat/session/load")
async def sessionload(request: CloseChatRequest):
    log = await get_recent_history(session_id=request.sessionId, count=0)
    return log

# 상담 종료 신호 수신
@app.post("/chat/close", response_model=ChatSummaryResponse)
async def chat(request: CloseChatRequest):
    # 상담 기록 전체 불러오기 및 요약해서 정보 넘기기
    if not request.sessionId:
        raise HTTPException(status_code=400, detail="Session ID required")
    
    # Redis에서 채팅 로그 가져오기
    chat_logs = await get_recent_history(session_id=request.sessionId, count=0)
    if not chat_logs:
        raise HTTPException(status_code=404, detail="No chat logs found")
    
    # ✅ 한 번의 API 호출로 JSON 응답을 받음
    response = await call_4o_mini(f"{chat_logs}", system_prompt=sys_prompt["diary"], max_tokens=500)

    try:
        result = json.loads(response)  # ✅ JSON 응답 파싱
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Failed to parse response from AI")

    return result  # ✅ JSON 객체 반환

@app.post("/chat/stream")
async def chat_stream(request: ChatRequest): # Json body 형태로 변환
    """
    OpenAI API의 Streaming 응답을 제공하는 엔드포인트
    """
    try:
        # ✅ 기존 비동기 입력 처리 로직 활용
        # chat_tag를 여기서 받아서 리턴해야해서 여기서 전처리를 실행함
        context, keywords, chat_tag = await process_user_input(
            request.session_id, request.user_input, request.type,
            request.user_id, request.bot_id
        )

        # ✅ StreamingResponse로 실시간 응답 제공
        return StreamingResponse(
            response_generator(request.session_id, request.user_input, context, bot_id=request.bot_id,
                               keywords=keywords, user_id=request.user_id, type=request.type, chat_tag=chat_tag),
            media_type="text/plain",
            headers={"ChatTag": chat_tag}  # ✅ chatTag를 헤더에 포함
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming API 오류: {str(e)}")

@app.post("/store")
async def store_data(key: str, value: str):
    redis_client.set(key, value)
    return {"status": "ok", "key": key, "value": value}

@app.get("/retrieve")
async def retrieve_data(key: str):
    val = redis_client.get(key)
    return {"key": key, "value": val}

# uvicorn 실행
def start_server():
    uvicorn.run(
        socket_app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    start_server()
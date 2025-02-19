# main.py
import json
import uvicorn
import asyncio
import socketio
import redis
import time
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional

from app.services.rag_pipeline import rag_pipeline, process_user_input
from app.utils.response_utils import response_generator  # ✅ Streaming import
from app.utils.fo_mini_api import call_4o_mini
from app.services.redis_utils import get_recent_history, save_message
from app.utils.sys_prompt_dict import sys_prompt

app = FastAPI()

# Redis 연결
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # credential 설정과 같이 쓸 경우 규정 위반이라 무시됩니다.
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE 등
    allow_headers=["*"],   # Authorization, Content-Type 등
    expose_headers=["ChatTag"],  # 클라이언트에서 접근할 수 있도록 명시
)

# FastAPI + Socket.IO 설정
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    logger=False,
    engineio_logger=False,
    transports=["websocket", "polling"]
)
socket_app = socketio.ASGIApp(sio, other_asgi_app=app, socketio_path="/socket.io")

# --------------------------------------------------------------------------------
# 참여자 / 매핑 관리
# --------------------------------------------------------------------------------
room_user_nicknames: Dict[str, Dict[str, str]] = {}
sid_user_mapping: Dict[str, Dict[str, str]] = {}

# --------------------------------------------------------------------------------
# 챗봇 워커 (기존)
# --------------------------------------------------------------------------------
chatbot_queues: Dict[str, asyncio.Queue] = {}

# 챗봇 백그라운드 태스크 (스트리밍 방식, 사용자 새 메시지 수신 시 중단)
async def chatbot_worker(room_id: str):
    """
    기존 RAG 파이프라인을 위한 챗봇 워커.
    batch_queue를 flush할 때, flush된 메시지를 여기로 put하면 
    한 번에 처리(스트리밍 응답)합니다.
    """
    queue = chatbot_queues[room_id]
    while True:
        data = await queue.get()
        if data is None:
            break
        try:
            user_input = data["user_input"]
            user_id = data["user_id"]
            bot_id = int(data["bot_id"])
            type_ = data["type"]

            # 참여자 수 (멀티 모드 여부)
            current_participants = len(room_user_nicknames.get(room_id, {}))
            is_multi_mode = current_participants >= 2

            print(f"🟢 Room {room_id} participant count = {current_participants}")
            print(f"🟢 사용자 입력 감지: {user_input}")
            print(f"🟢 user_id: {user_id}, bot_id: {bot_id}, type: {type_}")

            other_nicknames = [nick for uid, nick in room_user_nicknames[room_id].items() if uid != user_id]
            print(f"""
                  🟢 닉네임 감지
                  UserNickname {room_user_nicknames[room_id][user_id]}
                  OtherNickname {other_nicknames}
            """)

            # RAG 전처리
            context, keywords, chat_tag = await process_user_input(
                room_id, user_input, type_, user_id, bot_id, is_multi_mode
            )

            # 스트리밍 응답 생성
            generator = response_generator(
                room_id, user_input, context,
                bot_id=bot_id, keywords=keywords, user_id=user_id,
                type=type_, chat_tag=chat_tag
            )

            # 각 청크를 파싱 후 Socket.IO로 전송
            async for chunk in generator:
                try:
                    payload = json.loads(chunk)
                except Exception:
                    payload = {"chunk": chunk, "response_id": None, "sequence": None}
                # 만약 큐에 새 메시지가 있다면 스트리밍 중단
                # if not queue.empty():
                #     print("새로운 사용자 메시지 감지, 스트리밍 응답 중단")
                #     break
                await sio.emit("chatbot_message", {
                    "message": payload["chunk"],
                    "response_id": payload["response_id"],
                    "sequence": payload["sequence"],
                    "role": "assistant",
                    "chat_tag": chat_tag,
                }, room=room_id)

            print(f"🟣 스트리밍 응답 완료: 채팅 태그: {chat_tag}")

        except Exception as e:
            answer = f"[Error] Streaming 응답 생성 실패: {str(e)}"
            await sio.emit("chatbot_message", {
                "message": answer,
                "response_id": None,
                "sequence": None,
                "role": "assistant",
                "chat_tag": "",
            }, room=room_id)
            print(f"❌ 오류 발생: {e}")
    
# --------------------------------------------------------------------------------
# 배치 큐 / 입력 중 로직
# --------------------------------------------------------------------------------
room_batch_queues: Dict[str, List[Dict[str, str]]] = {}
room_last_input_signal: Dict[str, float] = {}

BATCH_CHECK_INTERVAL = 0.5   # 0.5초마다 배치 큐 상태 확인
BATCH_FLUSH_DELAY = 1.0      # 마지막 입력 중단 후 1초 지나면 flush

async def batch_worker():
    """
    주기적으로 배치 큐를 확인하여,
    '사용자 입력이 멈춘 시점'으로부터 1초 이상 경과하면 
    그동안 쌓인 메시지를 한 번에 챗봇 큐에 넣고 Redis에 저장.
    """
    while True:
        await asyncio.sleep(BATCH_CHECK_INTERVAL)
        now = time.time()

        for room_id, messages in list(room_batch_queues.items()):
            if not messages:
                continue

            print(f"🟠 [배치큐 상태] room={room_id}, 대기 중 메시지 수: {len(messages)}")

            # 마지막 입력 시그널 시점
            last_input_time = room_last_input_signal.get(room_id, now)
            if (now - last_input_time) >= BATCH_FLUSH_DELAY:
                # flush
                flush_msgs = messages[:]
                room_batch_queues[room_id] = []

                print(f"🟢 [batch_worker] room_id={room_id}, {len(flush_msgs)}개 메시지 flush")

                # 1) Redis 저장
                # 2) 챗봇 큐(chatbot_queues)에 put -> RAG 응답
                for msg in flush_msgs:
                    user_input = msg["user_input"]
                    user_id = msg["user_id"]
                    bot_id = msg["bot_id"]
                    type_ = msg["type"]

                    # Redis 저장
                    await save_message(room_id, user_id, user_input)

                    # 챗봇 워커가 응답 생성하도록 큐에 넣음
                    if room_id in chatbot_queues:
                        data = {
                            "room_id": room_id,
                            "user_input": user_input,
                            "user_id": user_id,
                            "bot_id": bot_id,
                            "type": type_
                        }
                        await chatbot_queues[room_id].put(data)


# --------------------------------------------------------------------------------
# Socket.IO 이벤트
# --------------------------------------------------------------------------------
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
    data = { "room_id": "...", "user_id": "...", "nickname": "..." }
    """
    room_id = data["room_id"]
    user_id = data.get("user_id")
    nickname = data.get("nickname")

    await sio.enter_room(sid, room_id)
    print(f"[join_room] {sid} joined {room_id}")
    # 해당 room_id에 대한 매핑 딕셔너리가 없으면 생성
    if room_id not in room_user_nicknames:
        room_user_nicknames[room_id] = {}

    # user_id와 nickname 저장
    if user_id and nickname:
        room_user_nicknames[room_id][user_id] = nickname
        # sid에서 room_id와 user_id 정보도 저장
        sid_user_mapping[sid] = {"room_id": room_id, "user_id": user_id}
        print(f"🔍 룸 {room_id}에 user_id {user_id}: '{nickname}' 저장됨.")
    # else: print("nono")
    print(f"🔍 룸 {room_id}에 user_id {user_id}: '{nickname}' 저장됨.")

    print(f"🔍 현재 {sid}의 Room 리스트: {sio.rooms(sid)}")

    if room_id not in chatbot_queues:
        chatbot_queues[room_id] = asyncio.Queue()
        asyncio.create_task(chatbot_worker(room_id))
        
    if room_id not in room_batch_queues:
        room_batch_queues[room_id] = []
    room_last_input_signal[room_id] = time.time()

    # 클라이언트에게 알림
    await sio.emit("room_joined", {"room_id": room_id}, room=sid)

@sio.on("typing_start")
async def handle_typing_start(sid, data):
    """
    data = { "room_id": "..." }
    """
    room_id = data["room_id"]
    user_id = sid_user_mapping[sid]["user_id"]
    # "상대방이 입력 중입니다." 표시를 위해 브로드캐스트
    await sio.emit("typing_indicator", {
        "user_id": user_id,
        "typing": True
    }, room=room_id, skip_sid=sid)

@sio.on("typing_stop")
async def handle_typing_stop(sid, data):
    """
    data = { "room_id": "..." }
    """
    room_id = data["room_id"]
    user_id = sid_user_mapping[sid]["user_id"]
    # "입력 중지" 알림
    await sio.emit("typing_indicator", {
        "user_id": user_id,
        "typing": False
    }, room=room_id, skip_sid=sid)
    # 마지막 입력 중단 시점 기록
    room_last_input_signal[room_id] = time.time()

@sio.on("chat_message")
async def handle_chat_message(sid, data):
    """
    data = {
      "room_id": "...",
      "user_id": "...",
      "bot_id": ...,
      "user_input": "...",
      "type": "..."
      (role는 생략, user_id가 곧 user 역할)
    }

    - user가 보낸 메시지는 배치 큐에 저장 후 1초 뒤 flush
    - assistant + macro 메시지는 즉시 Redis 저장
    """
    room_id = data["room_id"]
    user_id = data["user_id"]
    bot_id = data["bot_id"]
    user_input = data["user_input"]
    msg_type = data.get("type", "none")

    print(f"🟢 [chat_message] 수신됨: room={room_id}, user={user_id}, input={user_input}")

    # typing_stop 처리
    await sio.emit("typing_indicator", {
        "user_id": user_id,
        "typing": False
    }, room=room_id, skip_sid=sid)
    room_last_input_signal[room_id] = time.time()

    # 클라이언트 측에 우선 표시 (UI 반영)
    await sio.emit("chat_message", {
        "message": user_input,
        "role": user_id,
        "type": msg_type,
        "bot_id": bot_id,
    }, room=room_id)

    # "assistant" + "macro" 메시지면, RAG 없이 즉시 Redis 저장
    if user_id == "assistant" and msg_type == "macro":
        await save_message(room_id, "assistant", user_input)
        return

    # 그 외 (user) -> 배치 큐에 쌓음
    if room_id not in room_batch_queues:
        room_batch_queues[room_id] = []
    room_batch_queues[room_id].append({
        "user_id": user_id,
        "bot_id": bot_id,
        "user_input": user_input,
        "type": msg_type
    })

    # "saying" 이벤트 (봇이 응답 준비중)
    await sio.emit("saying", {}, room=room_id)

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

# --------------------------------------------------------------------------------
# FastAPI 엔드포인트
# --------------------------------------------------------------------------------
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
    loop = asyncio.get_event_loop()
    # 배치 워커 실행
    loop.create_task(batch_worker())
    uvicorn.run(
        socket_app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    start_server()
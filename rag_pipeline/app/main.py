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
from app.utils.max_tokens import max_tokens_for_type

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 서버 시작 시 배치 워커 실행
    task = asyncio.create_task(batch_worker())
    yield
    # 서버 종료 시 배치 워커 정리
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

app = FastAPI(lifespan=lifespan)

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
    작업 큐(chatbot_queues)를 모니터링하여,
    메시지가 들어오면 RAG 응답을 생성 및 스트리밍 전송
    """
    queue = chatbot_queues[room_id]
    while True:
        data = await queue.get()
        if data is None:
            break
        try:
            combined_input = data["user_input"]
            flush_msgs = data["flush_msgs"]
            all_user_ids = data["all_user_ids"]  # ← 새 필드
            bot_id = int(data["bot_id"])
            type_ = data["type"]
            user_id = data["user_id"]  # 마지막 메시지 발화자 (단순 보관용)

            # 참여자 수 (멀티 모드 여부)
            current_participants = len(room_user_nicknames.get(room_id, {}))
            is_multi_mode = current_participants >= 2

            print(f"🟢 Room {room_id} participant count = {current_participants}")
            print(f"🟢 사용자 입력 감지: {combined_input}")
            print(f"🟢 user_id: {user_id}, bot_id: {bot_id}, type: {type_}")

            other_nicknames = [nick for uid, nick in room_user_nicknames[room_id].items() if uid != user_id]
            print(f"""
                  🟢 닉네임 감지
                  UserNickname {room_user_nicknames[room_id][user_id]}
                  OtherNickname {other_nicknames}
            """)

            # RAG 전처리
            # context, keywords, chat_tag = await process_user_input(
            #     room_id, user_input, type_, user_id, bot_id, is_multi_mode
            # )
            
            # RAG 전처리
            # 1) RAG 전처리 -> all_user_ids를 넘겨서 멀티 유저 검색
            context, keywords, chat_tag = await process_user_input(
                session_id=room_id,
                combined_input=combined_input,
                type_=type_,
                user_ids=all_user_ids,  # ← 모든 user_id를 넘김
                bot_id=bot_id,
                multi_mode=is_multi_mode
            )

            # 스트리밍 응답 생성
            # none 타입, 의도 분석 결과 tarot 아니고, 20자 미만의 짧은 채팅이면 short
            if (type_ == "none" and chat_tag != "tarot" and len(combined_input) < 20):
                type_ = "short"
                context += "\n짧은 대화이니 반드시 30자 이내로 대답하세요."

            token_num = max_tokens_for_type.get(type_, max_tokens_for_type["none"])

            # response_generator를 통해 스트리밍 응답을 생성 (async generator)
            # response_generator에 flush_msgs를 추가로 넘김
            generator = response_generator(
                session_id=room_id,
                user_input=combined_input,
                context=context,
                bot_id=bot_id,
                keywords=keywords,            # ← 명시적으로 param 이름 작성
                user_id=user_id,
                type=type_,
                chat_tag=chat_tag,
                flush_msgs=flush_msgs,        # ← 반드시 키워드 인자로
                max_tokens=token_num
            )

            # 청크를 수신하고 Socket.IO로 전송
            async for chunk in generator:
                # 1) chunk는 JSON 문자열일 가능성이 높으나, 혹시 아니면 fallback
                #    (예: LLM이 partial code block 등으로 준 경우)
                
                try:
                    # 🔍 혹시 백틱(````json`)이 섞여 있다면 제거
                    safe_chunk = chunk.replace("```json", "").replace("```", "").strip()
                    payload = json.loads(safe_chunk)
                
                except Exception as e:
                    # (디버그용) 예외 로그 남기기
                    print(f"[WARNING] JSON 파싱 실패: {e}, chunk=({chunk})")
                    payload = {
                        "chunk": chunk,
                        "response_id": None,
                        "sequence": None
                    }
                
                await sio.emit("chatbot_message", {
                    "message": payload.get("chunk", ""),
                    "response_id": payload.get("response_id"),
                    "sequence": payload.get("sequence"),
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
# typing_stop을 “end”로 간주 -> 모든 참가자가 stop하면 batch flush
room_typing_stop_signals: Dict[str, set] = {}

# BATCH_CHECK_INTERVAL = 0.5   # 0.5초마다 배치 큐 상태 확인
# BATCH_FLUSH_DELAY = 1.0      # 마지막 입력 중단 후 1초 지나면 flush

async def batch_worker():
    """
    0.5초마다 배치 큐 상태 확인:
      - 메시지 수 ≥ 8개 or 글자수 ≥ 250 => 강제 flush
      - typing_stop은 별도 이벤트에서 flush 처리
    """
    print("배치 워커 시작")
    while True:
        await asyncio.sleep(0.5)
        for room_id, messages in list(room_batch_queues.items()):
            if not messages:
                continue

            total_length = sum(len(m["user_input"]) for m in messages)
            if len(messages) >= 8 or total_length >= 250:
                print(f"🟡 [batch_worker] room={room_id}, 배치 큐 과다 => flush")
                flush_messages(room_id)

def combine_messages(room_id: str, flush_msgs: List[dict]) -> str:
    """
    여러 메시지를 닉네임: 발화 형태로 합쳐서 하나의 문자열로 만든다.
    """
    lines = []
    for msg in flush_msgs:
        user_id = msg["user_id"]
        nickname = room_user_nicknames[room_id].get(user_id, user_id)
        lines.append(f"{nickname}: {msg['user_input']}")
    return "\n".join(lines)

def flush_messages(room_id: str):
    """
    배치 큐 -> 챗봇 큐 이동 + Redis 저장
    - Redis 저장은 기존처럼 각 메시지를 개별적으로 저장합니다.
    - 작업큐로 넘어갈 메시지는 사용자별로 그룹화하여, 
      aggregated(합쳐진) user_input을 전달합니다.
    """
    if room_id not in room_batch_queues:
        return
    messages = room_batch_queues[room_id]
    if not messages:
        return

    flush_msgs = messages[:]
    room_batch_queues[room_id] = []

    # 응답 생성중 표시
    asyncio.create_task(
        sio.emit("saying", {}, room=room_id)
    )

    print(f"🟢 flush_messages: room_id={room_id}, {len(flush_msgs)}개 메시지 이동")

    for msg in flush_msgs:
        user_input = msg["user_input"]
        user_id = msg["user_id"]
        bot_id = msg["bot_id"]
        type_ = msg["type"]
        # room_user_nicknames에서 nickname 조회 (없으면 user_id 사용)
        nickname = room_user_nicknames.get(room_id, {}).get(user_id, user_id)
        # Redis 저장
        asyncio.create_task(save_message(room_id, user_id, user_input, nickname=nickname))
    
    # 1) 모든 user_id 추출
    all_user_ids = list({m["user_id"] for m in flush_msgs})
    
    # 2) 여러 메시지를 합쳐 하나의 user_input으로 만듦
    combined_input = combine_messages(room_id, flush_msgs)

    # 3) 대표 메시지(마지막 메시지 기준)에서 bot_id, type 정보만 차용
    last_msg = flush_msgs[-1]
    user_id = last_msg["user_id"]
    bot_id = last_msg["bot_id"]
    type_ = last_msg["type"]
    print(f'flush_msgs: {flush_msgs}')
    # 챗봇 큐로 이동
    if room_id in chatbot_queues:
        data = {
            "room_id": room_id,
            "user_input": combined_input,
            "bot_id": bot_id,
            "type": type_,
            "user_id": user_id,
            "flush_msgs": flush_msgs,  # ← 새로 추가. response_generator에 넘겨줄 원본 메시지 리스트
            "all_user_ids": all_user_ids  # ← 새 필드
        }
        asyncio.create_task(chatbot_queues[room_id].put(data))


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
        # disconnect 시 타이핑 상태에서도 제거
        if room_id in room_typing_stop_signals and user_id in room_typing_stop_signals[room_id]:
            room_typing_stop_signals[room_id].remove(user_id)
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
    else: print("nono")

    print(f"🔍 현재 {sid}의 Room 리스트: {sio.rooms(sid)}")

    if room_id not in chatbot_queues:
        chatbot_queues[room_id] = asyncio.Queue()
        asyncio.create_task(chatbot_worker(room_id))
        
    if room_id not in room_batch_queues:
        room_batch_queues[room_id] = []

    # 여기서 해당 방의 타이핑 상태를 초기화: 기본적으로 모든 사용자는 '멈춤(stop)' 상태로 설정
    if room_id not in room_typing_stop_signals:
        room_typing_stop_signals[room_id] = set()
    room_typing_stop_signals[room_id].add(user_id)

    # 클라이언트에게 알림
    await sio.emit("room_joined", {"room_id": room_id}, room=sid)

@sio.on("typing_start")
async def handle_typing_start(sid, data):
    """
    data = { "room_id": "..." }
    """
    room_id = data["room_id"]
    if sid not in sid_user_mapping:
        return
    user_id = sid_user_mapping[sid]["user_id"]

    # 사용자가 입력 시작하면, '멈춤' 상태에서 제거
    if room_id in room_typing_stop_signals and user_id in room_typing_stop_signals[room_id]:
        room_typing_stop_signals[room_id].remove(user_id)
        
    # nickname 정보를 가져옴 (없으면 user_id 사용)
    nickname = room_user_nicknames.get(room_id, {}).get(user_id, user_id)

    print(f"🟢 [typing_start] room={room_id}, user={user_id}, current stop_cnt={len(room_typing_stop_signals.get(room_id, set()))}")
    await sio.emit("typing_indicator", {
        "user_id": user_id,
        "nickname": nickname,
        "typing": True
    }, room=room_id, skip_sid=sid)

@sio.on("typing_stop")
async def handle_typing_stop(sid, data):
    """
    data = { "room_id": "..." }
    -> 한 사용자가 입력을 마침 (end)
    -> 모든 참가자가 stop이면 batch flush
    """
    room_id = data["room_id"]
    if sid not in sid_user_mapping:
        return
    user_id = sid_user_mapping[sid]["user_id"]
    
    # nickname 정보를 가져옴
    nickname = room_user_nicknames.get(room_id, {}).get(user_id, user_id)

    # 입력 중지 알림 전송
    await sio.emit("typing_indicator", {
        "user_id": user_id,
        "nickname": nickname,
        "typing": False
    }, room=room_id, skip_sid=sid)
    
    # typing_stop 기록
    if room_id not in room_typing_stop_signals:
        room_typing_stop_signals[room_id] = set()

    room_typing_stop_signals[room_id].add(user_id)
    participants = len(room_user_nicknames.get(room_id, {}))
    print(f"🛑 [typing_stop] room={room_id}, user={user_id}, stop_cnt={len(room_typing_stop_signals[room_id])}/{participants}")

    # 모든 참가자가 stop이면 -> flush
    if len(room_typing_stop_signals[room_id]) == participants:
        print(f"🔴 [typing_stop] 모든 참가자 stop -> flush_messages")
        flush_messages(room_id)
        # flush 후 기존 clear() 대신, 현재 방의 모든 사용자로 재설정
        room_typing_stop_signals[room_id] = set(room_user_nicknames[room_id].keys())

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

    # typing_indicator 종료
    await sio.emit("typing_indicator", {
        "user_id": user_id,
        "typing": False
    }, room=room_id, skip_sid=sid)

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
    # await sio.emit("saying", {}, room=room_id)

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
    uvicorn.run(
        socket_app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )

if __name__ == "__main__":
    start_server()
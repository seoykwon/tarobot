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
from app.core.openvidu_api import create_openvidu_session, create_openvidu_connection
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

# 챗봇 백그라운드 태스크
async def chatbot_worker(room_id: str):
    queue = chatbot_queues[room_id]
    while True:
        data = await queue.get()  # ✅ 큐에서 데이터를 가져옴 (딕셔너리 형태)
        if data is None:
            break
        try:
            user_input = data["user_input"]
            user_id = data["user_id"]
            bot_id = data["bot_id"]
            type = data["type"]

            print(f"🟢 사용자 입력 감지: {user_input}")  # ✅ 로그 추가
            print(f"🟢 user_id: {user_id}, bot_id: {bot_id}, type: {type}")  # ✅ 로그 추가

            # ✅ 챗봇 처리 로직 실행 (rag_pipeline 호출)
            answer, tag = await rag_pipeline(room_id, user_input, type, user_id, bot_id)

        except Exception as e:
            answer = f"[Error] RAG 파이프라인 실패: {str(e)}"

        # ✅ 챗봇 응답을 방에 브로드캐스트
        await sio.emit("chatbot_message", {
            "message": answer,
            "role" : "assistant",
            "chat_tag" : tag,
        }, room=room_id)

        print(f"🟣 현재 세션 ID: {room_id}")  # ✅ 로그 추가
        print(f"🟣 chatbot_message 브로드캐스트 완료: {answer}, 채팅 태그: {tag}")  # ✅ 로그 추가
    
# Socket.IO 이벤트
@sio.event
async def connect(sid, environ):
    print(f"[connect] 클라이언트 연결: {sid}")
    
@sio.event
async def connect_error(sid, data):
    print(f"❌ WebSocket 연결 실패: {data}")

@sio.event
async def disconnect(sid):
    print(f"[disconnect] 클라이언트 해제: {sid}")

@sio.on("join_room")
async def handle_join_room(sid, data):
    """
    data = { "room_id": "some_room_id" }
    """
    room_id = data["room_id"]
    await sio.enter_room(sid, room_id)
    print(f"[join_room] {sid} joined {room_id}")

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
        }, room=room_id)

    # 챗봇 Queue에 메시지 투입
    if room_id in chatbot_queues:
        await chatbot_queues[room_id].put(data)
        
# OpenVidu API 라우트
@app.post("/openvidu/sessions")
def create_session(custom_session_id: str = None):
    return create_openvidu_session(custom_session_id)

class TokenRequest(BaseModel):
    session_id: str

class ChatRequest(BaseModel):
    session_id: str
    user_input: str
    user_id: str
    bot_id: int
    type: str

class ChatResponse(BaseModel):
    answer: str

class CloseChatRequest(BaseModel):
    sessionId: str

class ChatSummaryResponse(BaseModel):
    summary: str
    title: str
    tag: List[str]
    cardImageUrl: str

@app.post("/openvidu/connections")
def create_connection(body: TokenRequest):
    session_id = body.session_id
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id is required")
    return create_openvidu_connection(session_id)

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
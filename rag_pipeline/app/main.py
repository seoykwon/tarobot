# main.py
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import redis
from app.services.rag_pipeline import rag_pipeline, process_user_input
from app.utils.response_utils import response_generator  # ✅ Streaming import

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js 프론트엔드의 주소
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# Redis 연결
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

class ChatResponse(BaseModel):
    answer: str

class CloseChatRequest(BaseModel):
    userId: int


@app.get("/", tags=["Health Check"])
async def read_root():
    """Check if the API is running."""
    return {"message": "Hello, RAG MVP with Redis!"}

# type을 쿼리 파라미터에 추가하고, 응답에 chatTag를 반환하도록 설정
@app.post("/chat")
async def chat(session_id: str, user_input: str, type: str = ""):
    result, tag = await rag_pipeline(session_id, user_input, type, stream=False)
    return {"answer": result, "chatTag": tag}

# 상담 종료 신호 수신
@app.post("/chat/close")
async def chat(request: CloseChatRequest):
    return {"message": f"userId: {request.userId}의 상담이 종료되었습니다."}

@app.post("/chat/stream")
async def chat_stream(session_id: str, user_input: str, type: str =""):
    """
    OpenAI API의 Streaming 응답을 제공하는 엔드포인트
    """
    context = await process_user_input(session_id, user_input, type)

    try:
        return StreamingResponse(response_generator(session_id, user_input, context), media_type="text/plain")
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

# main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import redis
from app.services.rag_pipeline import rag_pipeline, process_user_input
from app.utils.response_utils import response_generator  # ✅ Streaming import

app = FastAPI()

# Redis 연결
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

class ChatResponse(BaseModel):
    answer: str

@app.get("/", tags=["Health Check"])
async def read_root():
    """Check if the API is running."""
    return {"message": "Hello, RAG MVP with Redis!"}

@app.post("/chat")
async def chat(session_id: str, user_input: str):
    return {"answer": await rag_pipeline(session_id, user_input, stream=False)}

@app.post("/chat/stream")
async def chat_stream(session_id: str, user_input: str):
    """
    OpenAI API의 Streaming 응답을 제공하는 엔드포인트
    """
    context = await process_user_input(session_id, user_input)

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

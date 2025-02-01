# main.py
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import redis
import asyncio
from app.services.rag_pipeline import rag_pipeline
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
    context = await rag_pipeline(session_id, user_input, stream=False)  # ✅ 컨텍스트 생성
    return StreamingResponse(response_generator(session_id, user_input, context), media_type="text/plain")

@app.post("/store")
async def store_data(key: str, value: str):
    redis_client.set(key, value)
    return {"status": "ok", "key": key, "value": value}

@app.get("/retrieve")
async def retrieve_data(key: str):
    val = redis_client.get(key)
    return {"key": key, "value": val}

# main.py
from fastapi import FastAPI

import redis
from app.services.rag_pipeline import rag_pipeline  # ✅ 올바른 경로

app = FastAPI()

# Redis 연결
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

@app.get("/")
def read_root():
    return {"message": "Hello, RAG MVP with Redis!"}

@app.post("/chat")
def chat(session_id: str, user_input: str):
    """
    RAG 파이프라인 호출
    """
    answer = rag_pipeline(session_id, user_input)
    return {"answer": answer}

@app.post("/store")
def store_data(key: str, value: str):
    redis_client.set(key, value)
    return {"status": "ok", "key": key, "value": value}

@app.get("/retrieve")
def retrieve_data(key: str):
    val = redis_client.get(key)
    return {"key": key, "value": val}

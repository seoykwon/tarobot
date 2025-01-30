from fastapi import FastAPI
import redis

app = FastAPI()

# Redis 연결
redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

@app.get("/")
def read_root():
    return {"message": "Hello, RAG MVP with Redis!"}

@app.post("/store")
def store_data(key: str, value: str):
    redis_client.set(key, value)
    return {"status": "ok", "key": key, "value": value}

@app.get("/retrieve")
def retrieve_data(key: str):
    val = redis_client.get(key)
    return {"key": key, "value": val}

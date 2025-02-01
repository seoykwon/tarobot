# redis_utils.py
import json
import asyncio
import redis.asyncio as aioredis
from app.core.settings import settings

# Redis 연결 설정
async def get_redis_connection():
    return await aioredis.from_url(f"redis://{settings.redis_host}:{settings.redis_port}", decode_responses=True)

async def save_message(session_id: str, role: str, message):
    """
    Redis에 메시지를 비동기적으로 저장 (Streaming 대응)
    """
    key = f"session:{session_id}:messages"

    # ✅ `message`가 `async_generator`인 경우 변환
    if isinstance(message, (asyncio.StreamReader, asyncio.StreamWriter)) or hasattr(message, "__aiter__"):
        message = "".join([chunk async for chunk in message])

    message_data = json.dumps({"role": role, "message": message})

    redis = await get_redis_connection()
    async with redis.client() as conn:
        await conn.rpush(key, message_data)
    await redis.close()

async def get_recent_history(session_id: str, count: int = 10):
    """
    Redis에서 최근 메시지 기록을 비동기적으로 가져오기
    """
    key = f"session:{session_id}:messages"
    redis = await get_redis_connection()  # ✅ 비동기 Redis 연결
    async with redis.client() as conn:
        messages = await conn.lrange(key, -count, -1)  # ✅ `await` 적용
    await redis.close()  # ✅ 연결 닫기
    return [json.loads(msg) for msg in messages]

# redis_utils.py
import json
import asyncio
import redis.asyncio as aioredis
from app.core.settings import settings
from app.utils.fo_mini_api import call_4o_mini

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

async def get_summary_history(session_id: str):
    """
    ✅ Redis에서 요약된 대화 기록을 비동기적으로 가져오기
    """
    key = f"summary:{session_id}"
    redis = await get_redis_connection()  # ✅ 비동기 Redis 연결
    async with redis.client() as conn:
        summary = await conn.get(key)  # ✅ `get()` 사용
    await redis.close()  # ✅ 연결 닫기
    return summary or ""  # ✅ 데이터가 없으면 빈 문자열 반환

async def save_summary_history(session_id: str, new_message: str):
    """
    ✅ 기존 요약을 가져와 새로운 메시지를 추가한 후 다시 요약하여 저장
    """
    redis = await get_redis_connection()
    
    # ✅ 기존 요약 불러오기
    async with redis.client() as conn:
        existing_summary = await conn.get(f"summary:{session_id}")
    
    existing_summary = existing_summary or ""  # ✅ 기존 데이터가 없으면 빈 문자열 처리

    # ✅ 새로운 대화를 기존 요약과 합쳐서 다시 요약 요청
    new_summary = await call_4o_mini(
        f"다음 대화 내용을 기존 요약에 추가하여 300자 이내로 갱신하세요:\n\n기존 요약: {existing_summary}\n\n새로운 대화: {new_message}",
        max_tokens=400
    )

    # ✅ Redis에 업데이트된 요약 저장
    async with redis.client() as conn:
        await conn.set(f"summary:{session_id}", new_summary)

    await redis.close()  # ✅ 연결 닫기

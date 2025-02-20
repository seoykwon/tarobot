import json
from app.core.settings import settings
import redis.asyncio as aioredis

# 중앙 집중식 상태 관리를 위한 Redis 클라이언트 (연결 풀 사용)
redis_state = aioredis.from_url(
    f"redis://{settings.redis_host}:{settings.redis_port}",
    decode_responses=True,
    max_connections=20
)

async def add_user_to_room(room_id: str, user_id: str, nickname: str):
    key = f"room:{room_id}:users"
    await redis_state.hset(key, user_id, nickname)

async def remove_user_from_room(room_id: str, user_id: str):
    key = f"room:{room_id}:users"
    await redis_state.hdel(key, user_id)

async def get_room_users(room_id: str):
    key = f"room:{room_id}:users"
    return await redis_state.hgetall(key)

async def set_typing_state(room_id: str, user_id: str, is_typing: bool):
    key = f"room:{room_id}:typing"
    if is_typing:
        await redis_state.sadd(key, user_id)
    else:
        await redis_state.srem(key, user_id)

async def get_typing_users(room_id: str):
    key = f"room:{room_id}:typing"
    return await redis_state.smembers(key)

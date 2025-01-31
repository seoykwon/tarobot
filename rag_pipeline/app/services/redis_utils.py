import redis
import json

# Redis 연결 설정
r = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

def save_message(session_id: str, role: str, message: str):
    """
    Redis에 메시지 저장 (FastAPI에서도 사용 가능)
    """
    key = f"session:{session_id}:messages"
    message_data = json.dumps({"role": role, "message": message})
    r.rpush(key, message_data)

def get_recent_history(session_id: str, count: int = 10):
    """
    Redis에서 최근 메시지 기록 가져오기 (FastAPI에서도 사용 가능)
    """
    key = f"session:{session_id}:messages"
    messages = r.lrange(key, -count, -1)  # 최신 10개 메시지 가져오기
    return [json.loads(msg) for msg in messages]

from fastapi import APIRouter
from app.services.chatbot import get_response

router = APIRouter()

# 히스토리 관리
history = []

@router.post("/chat/")
async def chat(message: str):
    """
    사용자의 메시지를 받아 모델 응답 반환
    """
    global history

    # 모델 응답 생성
    response = get_response(message, history)

    # 히스토리에 추가
    history.append(f"User: {message}")
    history.append(f"Bot: {response}")

    return {"user_message": message, "chatbot_response": response, "history": history}

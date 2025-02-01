# response_utils.py
from app.utils.fo_mini_api import stream_openai_response

async def response_generator(chat_prompt: str):
    """
    OpenAI 스트리밍 응답을 반환하는 비동기 제너레이터
    """
    async for chunk in stream_openai_response(chat_prompt, max_tokens=256, temperature=0.7):
        yield chunk  # ✅ 청크 단위로 응답

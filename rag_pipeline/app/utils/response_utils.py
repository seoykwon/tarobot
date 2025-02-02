# response_utils.py
from typing import AsyncGenerator
from app.utils.fo_mini_api import call_4o_mini, make_prompt_chat

from typing import AsyncGenerator
from app.utils.fo_mini_api import call_4o_mini, make_prompt_chat

async def response_generator(session_id: str, user_input: str, context: str) -> AsyncGenerator[str, None]:
    """
    OpenAI API의 스트리밍 응답을 처리하는 비동기 제너레이터
    """
    try:
        chat_prompt = make_prompt_chat(context, user_input)

        # ✅ `call_4o_mini()` 호출
        response = await call_4o_mini(chat_prompt, max_tokens=256, stream=True)

        # ✅ 응답을 비동기 순회
        async for chunk in response:
            if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content  # ✅ 스트리밍 응답 전송

    except Exception as e:
        yield f"[ERROR] OpenAI Streaming 오류: {str(e)}"  # ✅ 에러 발생 시 메시지 반환

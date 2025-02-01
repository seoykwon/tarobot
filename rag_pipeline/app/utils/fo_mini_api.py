# fo_mini_api.py
import openai
from typing import AsyncGenerator
from app.core.settings import settings

# OpenAI API 설정
FO_MINI_MODEL = "gpt-4o-mini"

async def call_4o_mini(prompt: str, max_tokens=256, temperature=0.7, stream=False):
    """
    OpenAI API를 호출하는 비동기 함수 (Streaming 지원)
    """
    try:
        client = openai.AsyncOpenAI(api_key=settings.openai_api_key)  # ✅ 비동기 클라이언트 사용
        response = await client.chat.completions.create(
            model=FO_MINI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=stream
        )

        if stream:
            return response  # ✅ `async for`을 위한 비동기 응답 반환

        return response.choices[0].message.content  # ✅ 일반 응답 반환

    except openai.OpenAIError as e:
        print(f"[Error] OpenAI API 호출 실패: {str(e)}")
        return "죄송합니다, API 호출 중 오류가 발생했습니다."

async def stream_openai_response(prompt: str, max_tokens=256, temperature=0.7) -> AsyncGenerator[str, None]:
    """
    OpenAI API의 스트리밍 응답을 처리하는 비동기 제너레이터
    """
    try:
        client = openai.AsyncOpenAI(api_key=settings.openai_api_key)  # ✅ 비동기 클라이언트 사용
        response = await client.chat.completions.create(
            model=FO_MINI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=True  # ✅ Streaming 활성화
        )

        async for chunk in response:  # ✅ `async for` 사용 가능
            if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content  # ✅ 부분 응답을 반환

    except Exception as e:
        yield f"[ERROR] OpenAI Streaming 오류: {str(e)}"  # ✅ 에러 발생 시 메시지 반환

# ✅ 프롬프트 생성 함수
def make_prompt_summarize(text: str) -> str:
    return f"다음 한국어 텍스트를 간단히 요약해 주세요:\n{text}"

def make_prompt_ner(text: str) -> str:
    return f"다음 문장에서 인물, 장소, 조직, 이벤트 등의 개체명을 찾아 JSON 형식으로 반환해 주세요:\n{text}"

def make_prompt_sentiment(text: str) -> str:
    return f"다음 문장의 감정을 분석해 주세요. JSON 형식으로 반환해 주세요 (예: {{'label': 'positive', 'confidence': 0.85}})\n{text}"

def make_prompt_chat(context: str, user_input: str) -> str:
    return f"[Context]\n{context}\n\nUser input: {user_input}\n\n위 정보를 바탕으로 친절하고 정확한 답변을 해주세요."

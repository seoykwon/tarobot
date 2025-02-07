# fo_mini_api.py
import asyncio
import openai
from typing import AsyncGenerator
from app.core.settings import settings

# OpenAI API 설정
FO_MINI_MODEL = "gpt-4o-mini"

async def call_4o_mini(prompt: str, max_tokens=256, temperature=0.7, system_prompt: str=None, stream=False) -> AsyncGenerator[str, None]:
    """
    OpenAI API를 호출하는 비동기 함수 (Streaming 지원)
    """
    try:
        client = openai.AsyncOpenAI(api_key=settings.openai_api_key)  # ✅ 비동기 클라이언트 사용

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})  # ✅ 시스템 프롬프트로 컨셉 전달
        messages.append({"role": "user", "content": prompt})

        response = await client.chat.completions.create(
            model=FO_MINI_MODEL,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=stream
        )

        if not stream:
            return response.choices[0].message.content  # ✅ 일반 응답 반환

        # ✅ 스트리밍 모드 처리 (비동기 제너레이터 반환)
        async def stream_generator():
            async for chunk in response:  # ✅ 응답을 한 줄씩 가져오기
                content = chunk.choices[0].delta.get("content", "")  # ✅ LLM이 생성한 내용 가져오기
                if content:
                    yield content  # ✅ 프론트엔드로 한 조각씩 전송
                await asyncio.sleep(0.1)  # ✅ 부드러운 스트리밍 효과 추가
            yield "[END]"  # ✅ 종료 신호 추가

        return stream_generator()  # ✅ 비동기 제너레이터 반환

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

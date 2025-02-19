# fo_mini_api.py
import asyncio
import openai
from typing import AsyncGenerator
from app.core.settings import settings

# OpenAI API 설정
FO_MINI_MODEL = "gpt-4o-mini"

async def call_4o_mini(prompt: str, max_tokens=256, temperature=0.7, system_prompt: str=None, stream=False):
    """
    OpenAI API를 호출하는 비동기 함수 (Streaming 지원)
    """
    try:
        client = openai.AsyncOpenAI(api_key=settings.openai_api_key)  # ✅ 비동기 클라이언트 사용

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt}) # 시스템 프롬프트로 컨셉 전달
        messages.append({"role": "user", "content": prompt})

        response = await client.chat.completions.create(
            model=FO_MINI_MODEL,
            messages=messages,
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

# 비동기 레츠고고
async def call_4o_mini_str(prompt: str, max_tokens=256, temperature=0.7, system_prompt: str=None, stream=False) -> AsyncGenerator[str, None]:
    """
    OpenAI API를 호출하는 비동기 함수 (Streaming 지원)
    """
    try:
        client = openai.AsyncOpenAI(api_key=settings.openai_api_key)

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        response = await client.chat.completions.create(
            model=FO_MINI_MODEL,
            messages=messages,
            max_tokens=max_tokens,
            temperature=temperature,
            stream=stream
        )

        if not stream:
            yield response.choices[0].message.content  # ✅ 일반 응답 반환 (stream=False)

        # ✅ `async generator`를 직접 반환
        async for chunk in response:
            print("📌 DEBUG: CHUNK = ", chunk)  # ✅ 디버깅 추가

            if not isinstance(chunk, dict):
                print("❌ [ERROR] chunk가 dict가 아님! 타입:", type(chunk))
                
            if "choices" not in chunk:
                print("❌ [ERROR] chunk에 'choices' 키 없음! 내용:", chunk)
                
            if not isinstance(chunk["choices"], list):
                print("❌ [ERROR] chunk['choices']가 리스트가 아님! 내용:", chunk["choices"])
                
            if len(chunk["choices"]) == 0:
                print("❌ [ERROR] chunk['choices']가 비어 있음!")
                
            if "delta" not in chunk["choices"][0]:
                print("❌ [ERROR] chunk['choices'][0]에 'delta' 키 없음! 내용:", chunk["choices"][0])
                
            if "content" not in chunk["choices"][0]["delta"]:
                print("❌ [ERROR] chunk['choices'][0]['delta']에 'content' 키 없음! 내용:", chunk["choices"][0]["delta"])
                
            content = chunk["choices"][0]["delta"]["content"]  # <-- 기존 코드
            print("✅ DEBUG: 추출된 content =", content)

            if content:
                yield content  # ✅ 한 줄씩 응답 반환
            await asyncio.sleep(0.05)  # ✅ 부드러운 스트리밍 효과

    except openai.OpenAIError as e:
        print(f"[Error] OpenAI API 호출 실패: {str(e)}")
        yield "죄송합니다, API 호출 중 오류가 발생했습니다."


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

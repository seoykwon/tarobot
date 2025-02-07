# response_utils.py
import asyncio
import datetime
from typing import AsyncGenerator

import pytz
from app.utils.fo_mini_api import call_4o_mini_str
from app.utils.prompt_generation import make_prompt_chat
from app.utils.chatbot_concept import concept
from app.services.pinecone_integration import upsert_documents
from app.services.redis_utils import save_message

async def response_generator(session_id: str, user_input: str, context: str, keywords: list[str], user_id: str) -> AsyncGenerator[str, None]:
    """
    OpenAI API의 스트리밍 응답을 처리하는 비동기 제너레이터
    """
    try:
        chat_prompt = make_prompt_chat(context, user_input)
        llm_answer = ""  # ✅ 모든 chunk를 저장할 변수

        async for chunk in call_4o_mini_str(chat_prompt, max_tokens=256, system_prompt=concept["Lacu"], stream=True):  
            if not chunk:  
                break
            llm_answer += chunk  
            yield chunk

        # ✅ Pinecone 업서트할 metadata 구성
        metadata = {
            "created_at": int(datetime.datetime.now(pytz.timezone("Asia/Seoul")).timestamp()),
            "keywords": keywords if keywords else ["(없음)"],
            "user_input": user_input,
            "response": llm_answer
        }

        # Pinecone 업서트 & Redis 저장 (비동기 실행)
        asyncio.create_task(upsert_documents(user_id, [user_input], [metadata]))
        asyncio.create_task(save_message(session_id, "assistant", llm_answer))

    except Exception as e:
        yield f"[ERROR] OpenAI Streaming 오류: {str(e)}"


# async def response_generator(session_id: str, user_input: str, context: str, keywords: list[str], user_id: str) -> AsyncGenerator[str, None]:
#     """
#     OpenAI API의 스트리밍 응답을 처리하는 비동기 제너레이터
#     """
#     try:
#         chat_prompt = make_prompt_chat(context, user_input)

#         # # ✅ `call_4o_mini()` 호출
#         # response = await call_4o_mini(chat_prompt, max_tokens=256, system_prompt=concept["Lacu"], stream=True)

#         # # ✅ 응답을 비동기 순회
#         # async for chunk in response:
#         #     if chunk.choices and chunk.choices[0].delta and chunk.choices[0].delta.content:
#         #         yield chunk.choices[0].delta.content  # ✅ 스트리밍 응답 전송

#         # 수정된 코드. 기존 코드는 call_4o_mini 결과를 await 하기 때문에 기존에 비해 속도 향상이 없었음.
#         llm_answer = ""  # ✅ 모든 chunk를 저장할 변수

#         async for chunk in call_4o_mini(context, max_tokens=256, system_prompt=concept["Lacu"], stream=True):  # ✅ 실시간으로 한 줄씩 받음
#             if not chunk:  # ✅ 빈 응답이 오면 종료 감지
#                 break
#             llm_answer += chunk  # ✅ 모든 chunk를 합쳐서 저장
#             yield chunk  # ✅ 즉시 프론트엔드에 전송
#             await asyncio.sleep(0.1)  # ✅ 출력 속도를 조절하여 자연스럽게 보이도록 함

#         # break 되면 이후 로직 실행 -> 임시로 rag_pipeline의 코드를 그대로 사용하나, 나중에 재사용성을 높이기
#         # ✅ Pinecone에 업서트할 metadata 구성
#         metadata = {
#             "created_at": int(datetime.datetime.now(pytz.timezone("Asia/Seoul")).timestamp()),
#             "keywords": keywords if keywords else ["(없음)"],  # 빈 배열 방지
#             "user_input" : user_input,
#             "response" : llm_answer
#         }

#         # Pinecone 업서트
#         print(f"🔹 Pinecone 업서트 데이터: {metadata}")  # 디버깅용 로그
#         upsert_task = asyncio.create_task(upsert_documents(user_id, [user_input], [metadata]))

#         # ✅ 업서트 응답 확인
#         print(f"✅ Pinecone 업서트 결과: {upsert_task}")
#         # redis 저장
#         save_response_task = asyncio.create_task(save_message(session_id, "assistant", llm_answer))



#     except Exception as e:
#         yield f"[ERROR] OpenAI Streaming 오류: {str(e)}"  # ✅ 에러 발생 시 메시지 반환

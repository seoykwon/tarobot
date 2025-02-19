# app/utils/response_utils.py
import asyncio
import datetime
import uuid
import json
import pytz
from typing import AsyncGenerator
from app.utils.fo_mini_api import call_4o_mini_str
from app.utils.prompt_generation import make_prompt_chat, make_prompt_tarot
from app.utils.chatbot_concept import names, concepts
from app.services.pinecone_integration import upsert_documents
from app.services.redis_utils import get_recent_history, save_message

async def response_generator(
    session_id: str,
    user_input: str,
    context: str,
    bot_id: int,
    keywords: list[str],
    user_id: str,
    type: str,
    chat_tag: str,
    max_tokens: int = 512,
) -> AsyncGenerator[str, None]:
    """
    OpenAI API의 스트리밍 응답을 처리하는 비동기 제너레이터  
    각 청크에 고유 response_id와 sequence 번호를 추가하여 JSON 문자열로 반환합니다.
    """
    try:
        # 타로/일반 대화 프롬프트 구성
        if type == "tarot":
            chat_prompt = make_prompt_tarot(context, user_input)
            lastconv = await get_recent_history(session_id, 3)  # 직전 대화 기록 불러오기
            if lastconv:
                chat_prompt += "\n[직전의 대화]\n" + lastconv[0]["message"]
        else:
            chat_prompt = make_prompt_chat(context, user_input)
            if chat_tag == "tarot":
                chat_prompt += """
사용자가 타로 점을 보고 싶어하는 것 같습니다.
이번 대답에 즉시 타로 점을 봐주지 말고 사용자에게 타로 점을 보고 싶어하는 지 물어보세요.
"""
        # 새로운 응답에 대한 고유 ID 생성 및 sequence 초기화
        response_id = str(uuid.uuid4())
        sequence = 1
        llm_answer = ""
        
        print(f"📌 생성된 Chat Prompt: {chat_prompt}")  # ✅ 로그 추가
        
        # OpenAI 스트리밍 응답 처리 (청크 단위)
        async for chunk in call_4o_mini_str(
            chat_prompt,
            max_tokens=max_tokens,
            system_prompt=concepts[names[bot_id]],
            stream=True
        ):
            if not chunk:
                break
            llm_answer += chunk
            payload = {
                "response_id": response_id,
                "sequence": sequence,
                "chunk": chunk
            }
            sequence += 1
            # 각 청크를 JSON 문자열로 yield (줄바꿈으로 구분)
            yield json.dumps(payload) + "\n"

        # Pinecone 업서트 및 Redis 저장(백그라운드 실행)
        metadata = {
            "created_at": int(datetime.datetime.now(pytz.timezone("Asia/Seoul")).timestamp()),
            "keywords": keywords if keywords else ["(없음)"],
            "user_input": user_input,
            "response": llm_answer
        }
        asyncio.create_task(upsert_documents(bot_id, user_id, [user_input], [metadata]))
        asyncio.create_task(save_message(session_id, "assistant", llm_answer))
    except Exception as e:
        error_payload = {
            "response_id": response_id if 'response_id' in locals() else None,
            "sequence": sequence if 'sequence' in locals() else None,
            "chunk": f"[ERROR] OpenAI Streaming 오류: {str(e)}"
        }
        yield json.dumps(error_payload) + "\n"

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

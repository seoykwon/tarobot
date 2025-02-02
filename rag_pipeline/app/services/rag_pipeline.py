# rag_pipeline.py
import asyncio
import json
from app.services.redis_utils import get_recent_history, save_message, get_summary_history, save_summary_history
from app.services.pinecone_integration import upsert_documents, retrieve_documents
from app.utils.fo_mini_api import call_4o_mini, make_prompt_chat, make_prompt_ner
from app.utils.response_utils import response_generator  # ✅ Streaming 분리

async def process_user_input(session_id: str, user_input: str):
    """
    사용자 입력을 처리하는 비동기 함수 (Redis 저장, NER 분석, Pinecone 업서트 & 검색)
    """
    # recent_history = await get_recent_history(session_id)
    recent_summary = await get_summary_history(session_id)

    # 새로운 메시지 Redis에 저장 (요약 갱신)
    asyncio.create_task(save_summary_history(session_id, user_input))

    save_task = asyncio.create_task(save_message(session_id, "user", user_input))

    # ✅ NER 분석 수행 (NER만 실행)
    ner_prompt = make_prompt_ner(user_input)
    ner_response = await call_4o_mini(ner_prompt, max_tokens=300, stream=False)

    try:
        ner_info = json.loads(ner_response)
    except json.JSONDecodeError:
        ner_info = {
            "persons": [], "dates": [], "locations": [],
            "organizations": [], "events": [], "keywords": []
        }

    # Pinecone에 업서트할 metadata 구성
    metadata = {
        "session_id": session_id,
        "persons": ner_info.get("persons", []),
        "dates": ner_info.get("dates", []),
        "locations": ner_info.get("locations", []),
        "organizations": ner_info.get("organizations", []),
        "events": ner_info.get("events", []),
        "keywords": ner_info.get("keywords", [])
    }

    upsert_task = asyncio.create_task(upsert_documents([user_input], [metadata]))
    retrieve_task = asyncio.create_task(retrieve_documents(user_input, top_k=3))

    pine_results = await retrieve_task

    # ✅ 컨텍스트 구성 (감정 분석 제거)
    context = prepare_context(recent_summary, pine_results, ner_info)

    # 필수 비동기 작업 완료 보장
    await asyncio.gather(save_task, upsert_task)

    return context

def prepare_context(recent_history, pine_results, ner_info):
    """
    최종 컨텍스트를 생성하는 함수 (NER 기반으로 구성)
    """
    # ✅ Pinecone 검색 결과 요약
    pine_summary = []
    for doc in pine_results:
        metadata = doc["metadata"]
        pine_summary.append(f"- 관련 키워드: {', '.join(metadata.get('keywords', []))}")

    pine_summary_text = "\n".join(pine_summary) if pine_summary else "관련 검색 결과가 없습니다."

    # NER 정보 정리
    ner_text = ""
    for key, value in ner_info.items():
        formatted_key = key  # 인물, 장소, 조직, 이벤트 등
        if value:
            ner_text += f"- {formatted_key}: {', '.join(value)}\n"
        else:
            ner_text += f"- {formatted_key}: 없음\n"

    # ✅ 감정 분석 및 요약 제거, 최신 NER 정보만 활용
    context = f"""
[최근 대화 기록]:
{recent_history}

[Pinecone 검색 요약]: 
{pine_summary_text}

[NER 정보]:
{ner_text}
    """

    return context.strip()

async def rag_pipeline(session_id: str, user_input: str, stream: bool = False):
    """
    비동기 최적화된 RAG 기반 챗봇 파이프라인 (Streaming 지원)
    """
    context = await process_user_input(session_id, user_input)

    if stream:
        return response_generator(session_id, user_input, context)

    chat_prompt = make_prompt_chat(context, user_input)
    print(chat_prompt)
    llm_answer = await call_4o_mini(chat_prompt, max_tokens=256, stream=False)

    save_response_task = asyncio.create_task(save_message(session_id, "assistant", llm_answer))

    # 🔥 챗봇 응답 저장 완료 보장
    await save_response_task

    return llm_answer

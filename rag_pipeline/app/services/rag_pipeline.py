# rag_pipeline.py
import asyncio
from app.services.redis_utils import get_recent_history, save_message
from app.services.pinecone_integration import upsert_documents, retrieve_documents
from app.services.multitask import parallel_tasks
from app.utils.fo_mini_api import call_4o_mini, make_prompt_chat
from app.utils.response_utils import response_generator  # ✅ Streaming 분리

async def process_user_input(session_id: str, user_input: str):
    """
    사용자 입력을 처리하는 비동기 함수 (Redis 저장, 분석, Pinecone 업서트 & 검색)
    """
    save_task = asyncio.create_task(save_message(session_id, "user", user_input))
    analysis_result = await parallel_tasks(user_input)

    ner_info = analysis_result.get("ner", "")
    summary = analysis_result.get("summarize", "")
    sentiment_info = analysis_result.get("sentiment", "")

    metadata = {"session_id": session_id, "ner": ner_info, "sentiment": sentiment_info, "summary": summary}
    upsert_task = asyncio.create_task(upsert_documents([user_input], [metadata]))
    retrieve_task = asyncio.create_task(retrieve_documents(user_input, top_k=3))

    pine_results = await retrieve_task
    recent_history = await get_recent_history(session_id)

    context = prepare_context(recent_history, pine_results, summary, ner_info, sentiment_info)
    return context

def prepare_context(recent_history, pine_results, summary, ner_info, sentiment_info):
    """
    최종 컨텍스트를 생성하는 함수
    """
    return f"""
    [최근 대화 기록]: {recent_history}
    [Pinecone 검색 결과]: {pine_results}
    [문장 요약]: {summary}
    [NER 정보]: {ner_info}
    [감정 분석]: {sentiment_info}
    """

async def rag_pipeline(session_id: str, user_input: str, stream: bool = False):
    """
    비동기 최적화된 RAG 기반 챗봇 파이프라인 (Streaming 지원)
    """
    context = await process_user_input(session_id, user_input)

    if stream:
        return response_generator(session_id, user_input, context)  # ✅ Streaming을 분리하여 호출

    chat_prompt = make_prompt_chat(context, user_input)
    llm_answer = await call_4o_mini(chat_prompt, max_tokens=256, stream=False)

    save_response_task = asyncio.create_task(save_message(session_id, "assistant", llm_answer))
    return llm_answer

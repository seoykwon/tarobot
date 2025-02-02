# rag_pipeline.py
import asyncio
import json
from app.services.redis_utils import get_recent_history, save_message, get_summary_history, save_summary_history
from app.services.pinecone_integration import upsert_documents, retrieve_documents
from app.services.multitask import parallel_tasks
from app.utils.fo_mini_api import call_4o_mini, make_prompt_chat
from app.utils.response_utils import response_generator  # ✅ Streaming 분리

async def process_user_input(session_id: str, user_input: str):
    """
    사용자 입력을 처리하는 비동기 함수 (Redis 저장, 분석, Pinecone 업서트 & 검색)
    """
    # recent_history = await get_recent_history(session_id)
    recent_summary = await get_summary_history(session_id)

    # 새로운 메시지 Redis에 저장 (요약 갱신)
    asyncio.create_task(save_summary_history(session_id, user_input))

    save_task = asyncio.create_task(save_message(session_id, "user", user_input))
    analysis_result = await parallel_tasks(user_input)

    ner_info = analysis_result.get("ner", "")
    summary = analysis_result.get("summarize", "")
    sentiment_info = analysis_result.get("sentiment", "")

    metadata = {"session_id": session_id, "ner": ner_info, "sentiment": sentiment_info, "summary": summary}
    upsert_task = asyncio.create_task(upsert_documents([user_input], [metadata]))
    retrieve_task = asyncio.create_task(retrieve_documents(user_input, top_k=3))

    pine_results = await retrieve_task
    # recent history 위치 변경

    context = prepare_context(recent_summary, pine_results, summary, ner_info, sentiment_info)
    return context

def prepare_context(recent_history, pine_results, summary, ner_info, sentiment_info):
    """
    최종 컨텍스트를 생성하는 함수
    """

    # ✅ Pinecone 검색 결과 요약
    pine_summary = []
    for doc in pine_results:
        metadata = doc["metadata"]
        
        # ✅ 검색 요약만 추가
        pine_summary.append(f"- {metadata.get('summary', '검색 결과 없음')}")

    pine_summary_text = "\n".join(pine_summary) if pine_summary else "관련 검색 결과가 없습니다."

    ner_data = json.loads(ner_info)
    sentiment_data = json.loads(sentiment_info)

    # NER 정보 정리
    ner_text = ""
    for key, value in ner_data.items():
        formatted_key = key  # 인물, 장소, 조직, 이벤트 등
        if value:
            ner_text += f"- {formatted_key}: {', '.join(value)}\n"
        else:
            ner_text += f"- {formatted_key}: 없음\n"

            

    # 감정 분석 정리
    sentiment_label = sentiment_data.get("label", "unknown")
    confidence = sentiment_data.get("confidence", 0)
    sentiment_text = f"- 현재 감정은 {confidence * 100:.0f}%의 확률로 {sentiment_label}입니다."

    

    # ✅ 최적화된 컨텍스트 구성
    context = f"""
[최근 대화 기록]:
{recent_history}

[Pinecone 검색 요약]: 
{pine_summary_text}

[문장 요약]: {summary}

[NER 정보]:
{ner_text}

[감정 분석]:
{sentiment_text}
    """

    return context.strip()  # ✅ 불필요한 공백 제거

    # return f"""
    # [최근 대화 기록]: {recent_history}
    # [Pinecone 검색 결과]: {pine_results}
    # [문장 요약]: {summary}
    # [NER 정보]: {ner_info}
    # [감정 분석]: {sentiment_info}
    # """

async def rag_pipeline(session_id: str, user_input: str, stream: bool = False):
    """
    비동기 최적화된 RAG 기반 챗봇 파이프라인 (Streaming 지원)
    """
    context = await process_user_input(session_id, user_input)

    if stream:
        return response_generator(session_id, user_input, context)  # ✅ Streaming을 분리하여 호출

    chat_prompt = make_prompt_chat(context, user_input)
    print(chat_prompt)
    llm_answer = await call_4o_mini(chat_prompt, max_tokens=256, stream=False)

    save_response_task = asyncio.create_task(save_message(session_id, "assistant", llm_answer))
    return llm_answer

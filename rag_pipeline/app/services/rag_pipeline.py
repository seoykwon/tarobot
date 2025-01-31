# rag_pipeline.py
from app.services.redis_utils import get_recent_history, save_message
from app.services.pinecone_integration import upsert_documents, retrieve_documents
from app.services.multitask import parallel_tasks
from app.utils.fo_mini_api import call_4o_mini, make_prompt_chat  # ✅ 모듈명 변경

def rag_pipeline(session_id: str, user_input: str) -> str:
    """
    RAG 기반 챗봇 파이프라인
    """
    # 1) Redis 저장 (사용자 메시지)
    save_message(session_id, "user", user_input)

    # 2) Pinecone 업서트 (임베딩 저장)
    upsert_documents([user_input], [{"session_id": session_id}])

    # 3) Pinecone 검색 (연관 문서 검색)
    pine_results = retrieve_documents(user_input, top_k=3)

    # 4) 멀티스레드로 Summarization, NER, Sentiment 수행 ✅
    multi_result = parallel_tasks(user_input)  # ✅ 프롬프트 생성은 `multitask.py` 내부에서 수행
    summary = multi_result.get("summarize", "")
    ner_info = multi_result.get("ner", "")
    sentiment_info = multi_result.get("sentiment", "")

    # 5) 최종 컨텍스트 생성
    recent_history = get_recent_history(session_id)
    context = f"""
        [최근 기록]: {recent_history}
        [장기 검색]: {pine_results}
        [문장 요약]: {summary}
        [NER]: {ner_info}
        [감정 분석]: {sentiment_info}
    """

    # 6) OpenAI API 호출 (4o-mini 모델 사용) ✅
    chat_prompt = make_prompt_chat(context, user_input)
    llm_answer = call_4o_mini(chat_prompt, max_tokens=256)

    # 7) Redis에 봇 메시지 저장
    save_message(session_id, "assistant", llm_answer)

    return llm_answer

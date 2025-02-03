# rag_pipeline.py
import asyncio
import datetime
import pytz
import json
from app.services.redis_utils import get_recent_history, save_message, get_summary_history, save_summary_history
from app.services.pinecone_integration import upsert_documents, retrieve_documents
from app.utils.fo_mini_api import call_4o_mini
from app.utils.prompt_generation import make_prompt_chat, make_prompt_ner
from app.utils.response_utils import response_generator  # ✅ Streaming 분리

# 한국 시간대 적용
seoul_tz = pytz.timezone("Asia/Seoul")

# 🔥 [개발용] 임시 사용자 데이터 (백엔드 연동 전)
dummy_user_profile = {
    "user_id": "test_user_123",  # ✅ 개발용 user_id
    "name": "테스트 유저",  # 🏷️ 사용자 이름
    "birth_date": "1995-06-21",  # 🎂 생년월일
    "astro_sign": "Gemini",  # ♈ 별자리
    "preferences": {  
        "preferred_reading_style": "detailed",  # 상세한 리딩을 원하는지 여부
        "fav_tarot_cards": ["The High Priestess", "The Moon"]  # 선호하는 타로 카드
    }
}

async def process_user_input(session_id: str, user_input: str):
    """
    사용자 입력을 처리하는 비동기 함수 (Redis 저장, 분석, Pinecone 업서트 & 검색)
    """

    # ✅ user_id를 namespace로 활용
    user_id = dummy_user_profile["user_id"]  

    # 🔥 Redis에서 최근 대화 히스토리 가져오기
    # recent_history = await get_recent_history(session_id)
    recent_history = await get_summary_history(session_id)

    # 🔥 새로운 메시지 Redis에 저장 (요약 갱신)
    await save_summary_history(session_id, user_input)
    save_task = asyncio.create_task(save_message(session_id, "user", user_input))
    
    # ✅ NER 분석 (개체명 추출)
    ner_prompt = make_prompt_ner(user_input)
    ner_info_str = await call_4o_mini(ner_prompt, max_tokens=300)

    # ✅ NER 결과를 JSON으로 변환
    try:
        ner_info = json.loads(ner_info_str)  
    except json.JSONDecodeError:
        ner_info = {}  

    # ✅ Pinecone에 업서트할 metadata 구성
    metadata = {
        "created_at": int(datetime.datetime.now(seoul_tz).timestamp()),
        "persons": ner_info.get("persons", []),  
        "locations": ner_info.get("locations", []),  
        "organizations": ner_info.get("organizations", []),  
        "events": ner_info.get("events", []),  
        "keywords": ner_info.get("keywords", [])  
    }

    # ✅ Pinecone namespace 활용하도록 변경
    upsert_task = asyncio.create_task(upsert_documents(user_id, [user_input], [metadata]))
    retrieve_task = asyncio.create_task(retrieve_documents(user_id, user_input, ner_info, top_k=3))

    pine_results = await retrieve_task

    # ✅ 최적화된 컨텍스트 생성
    context = prepare_context(recent_history, pine_results, ner_info)

    # 🔥 필수 비동기 작업 완료 보장
    await asyncio.gather(save_task, upsert_task)

    return context

def prepare_context(recent_history, pine_results, ner_info):
    """
    최종 컨텍스트를 생성하는 함수
    """
    # ✅ Pinecone 검색 결과 요약
    pine_summary = []
    for doc in pine_results:
        metadata = doc.get("metadata", {})  # 🔥 `metadata`가 없을 경우 빈 딕셔너리 반환
        pine_summary.append(f"- {metadata.get('summary', '검색 결과 없음')}")

    pine_summary_text = "\n".join(pine_summary) if pine_summary else "관련 검색 결과가 없습니다."

    # ✅ NER 정보 정리
    ner_text = "\n".join([f"- {key}: {', '.join(value) if value else '없음'}" for key, value in ner_info.items()])

    # ✅ 최적화된 컨텍스트 구성
    context = f"""
[최근 대화 기록]:
{recent_history}

[Pinecone 검색 요약]: 
{pine_results}

[NER 정보]:
{ner_text}
    """

    return context.strip()  # ✅ 불필요한 공백 제거

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

# rag_pipeline.py
import asyncio
import datetime
import pytz
import json
from app.services.redis_utils import save_message, get_summary_history, save_summary_history
from app.services.pinecone_integration import upsert_documents, retrieve_documents
from app.utils.fo_mini_api import call_4o_mini
from app.utils.prompt_generation import make_prompt_chat, make_prompt_ner, make_prompt_tag
from app.utils.response_utils import response_generator  # ✅ Streaming 분리

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
    try:
        print("🟢 process_user_input 시작")  # ✅ 로그 추가
        user_id = dummy_user_profile["user_id"]

        ### 선행되어야 하는 Tag, Keyword 추출 작업 먼저 실행
        # 유저 인풋으로 부터 타로 점을 보고 싶은 지 분석하는 함수로, 결과에 따라 다른 로직 실행
        chat_tag_task = asyncio.create_task(call_4o_mini(make_prompt_tag(user_input), max_tokens=10))

        # NER 키워드 추출 => 선행되어야 pinecone 검색 가능
        ner_prompt = make_prompt_ner(user_input)
        keywords_str_task = asyncio.create_task(call_4o_mini(ner_prompt, max_tokens=300))

        # 2가지 작업 완료 후 값 할당
        chat_tag, keywords_str = await asyncio.gather(chat_tag_task, keywords_str_task)

        # 채팅 태그 작업
        if (chat_tag == "tarot"):
            print("tarot 코드 실행")

        # 키워드 작업
        try:
            keywords_dict = json.loads(keywords_str)
            keywords = keywords_dict.get("keywords", [])
        except json.JSONDecodeError:
            keywords = []

        print(f'📌 after_parsing: {keywords}')  # ✅ 로그 추가

        ### context 생성 관련 작업 수행
        # 요약 불러오기
        recent_history_task = asyncio.create_task(get_summary_history(session_id))
        
        # Pinecone RAG 검색
        retrieve_task = asyncio.create_task(retrieve_documents(user_id, user_input, keywords, top_k=3))

        # 2가지 비동기 task 완료 대기 후 값 할당
        recent_history, pine_results = await asyncio.gather(recent_history_task ,retrieve_task)

        print(f"📌 Pinecone 검색 결과: {pine_results}")  # ✅ 로그 추가

        # context 합치기
        context = prepare_context(recent_history, pine_results, keywords)

        ### 저장 관련 작업 수행
        # 요약 갱신
        save_summary_task = asyncio.create_task(save_summary_history(session_id, user_input))
        # Redis에 인풋 저장
        save_task = asyncio.create_task(save_message(session_id, "user", user_input))

        # asyncio.gather(save_task, save_summary_task) # 저장 작업 완료 대기. 업로드 작업은 이미 asyncio.create_task로 인해 백그라운드에서 실행 보장됨.

        print("🟣 process_user_input 완료")  # ✅ 로그 추가
        return context, keywords, user_id, chat_tag

    except Exception as e:
        print(f"❌ process_user_input 실패: {e}")  # ✅ 예외 출력
        return None, None, None  # 예외 발생 시 None 반환

def prepare_context(recent_history, pine_results, keywords):
    """
    최종 컨텍스트를 생성하는 함수
    """
    # ✅ Pinecone 검색 결과에서 content 파싱
    pine_content = []
    for doc in pine_results:
        metadata = doc.get("metadata", {})  # 🔥 `metadata`가 없을 경우 빈 딕셔너리 반환
        pine_content.append(f"- user_input : {metadata.get('user_input', '검색 결과 없음')}")
        pine_content.append(f"- response : {metadata.get('response', '검색 결과 없음')}")

    pine_content_text = "\n".join(pine_content) if pine_content else "관련 검색 결과가 없습니다."

    # ✅ NER 정보 정리
    keywords = "\n".join(keywords)

    # ✅ 최적화된 컨텍스트 구성
    context = f"""
[최근 대화 기록]:
{recent_history}

[Pinecone 검색 요약]: 
{pine_content_text}

[NER 정보]:
{keywords}
"""

    return context.strip()  # ✅ 불필요한 공백 제거

async def rag_pipeline(session_id: str, user_input: str, stream: bool = False):
    """
    비동기 최적화된 RAG 기반 챗봇 파이프라인 (Streaming 지원)
    """
    print("🟢 rag_pipeline 시작")  # ✅ 로그 추가
    # 업서트를 위해 keywords와 user_id도 리턴 받기
    context, keywords, user_id, chat_tag = await process_user_input(session_id, user_input)

    if stream:
        print("🟡 Streaming 모드로 실행")  # ✅ 로그 추가
        return response_generator(session_id, user_input, context)

    chat_prompt = make_prompt_chat(context, user_input)
    print(f"📌 생성된 Chat Prompt: {chat_prompt}")  # ✅ 로그 추가
    llm_answer = await call_4o_mini(chat_prompt, max_tokens=256, stream=False)
    print(f"🟣 LLM 응답 생성 완료: {llm_answer}")  # ✅ 로그 추가

    # ✅ Pinecone에 업서트할 metadata 구성
    metadata = {
        "created_at": int(datetime.datetime.now(pytz.timezone("Asia/Seoul")).timestamp()),
        "keywords": keywords if keywords else ["(없음)"],  # 빈 배열 방지
        "user_input" : user_input,
        "response" : llm_answer
    }

    # Pinecone 업서트
    print(f"🔹 Pinecone 업서트 데이터: {metadata}")  # 디버깅용 로그
    upsert_task = asyncio.create_task(upsert_documents(user_id, [user_input], [metadata]))

    # ✅ 업서트 응답 확인
    print(f"✅ Pinecone 업서트 결과: {upsert_task}")
    # redis 저장
    save_response_task = asyncio.create_task(save_message(session_id, "assistant", llm_answer))
    
    # 🔥 필수 비동기 작업 완료 보장
    # await asyncio.gather(save_response_task, upsert_task) # 업로드 작업은 이미 asyncio.create_task로 인해 백그라운드에서 실행 보장됨.
    # print("🎯 모든 비동기 작업 완료")  # ✅ 로그 추가

    print("분석 된 태그 :", chat_tag)

    return llm_answer, chat_tag

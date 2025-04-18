# rag_pipeline.py
import asyncio
import datetime
import pytz
import json
from typing import List
from app.services.redis_utils import save_message, get_recent_history
from app.services.pinecone_integration import upsert_documents, retrieve_documents
from app.utils.fo_mini_api import call_4o_mini
from app.utils.prompt_generation import make_prompt_chat, make_prompt_ner, make_prompt_tarot
from app.utils.response_utils import response_generator  # ✅ Streaming 분리
from app.utils.chatbot_concept import names, concepts
from app.utils.sys_prompt_dict import sys_prompt

# 🔥 [개발용] 임시 사용자 데이터 (백엔드 연동 전)
# dummy_user_profile = {
#     "user_id": "test_user_123",  # ✅ 개발용 user_id
#     "name": "테스트 유저",  # 🏷️ 사용자 이름
#     "birth_date": "1995-06-21",  # 🎂 생년월일
#     "astro_sign": "Gemini",  # ♈ 별자리
#     "preferences": {  
#         "preferred_reading_style": "detailed",  # 상세한 리딩을 원하는지 여부
#         "fav_tarot_cards": ["The High Priestess", "The Moon"]  # 선호하는 타로 카드
#     }
# }

async def process_user_input(
    session_id: str,
    combined_input: str,
    type_: str,
    user_ids: List[str],
    bot_id: int,
    multi_mode: bool = False
):
    """
    멀티 유저를 지원하는 단일 process_user_input.
    1) gettag, NER
    2) Redis 최근 로그
    3) user_ids 각각에 대해 Pinecone 검색 (top_k=3), 결과를 합쳐서 context 생성
    4) return context, keywords, chat_tag
    """
    try:
        print("🟢 process_user_input 시작")  # ✅ 로그 추가

        ### 선행되어야 하는 Tag, Keyword 추출 작업 먼저 실행
        # tarot 의 경우 태그와 키워드 고정
        if (type_=="tarot"):
            chat_tag = "tarot result"
            keywords = ["타로 점 결과", combined_input]
        else:
            # 유저 인풋으로 부터 타로 점을 보고 싶은 지 분석하는 함수로, 결과에 따라 다른 로직 실행
            # chat_tag_task = asyncio.create_task(call_4o_mini(make_prompt_tag(user_input), max_tokens=10))
            chat_tag_task = asyncio.create_task(call_4o_mini(combined_input, max_tokens=10, system_prompt=sys_prompt["gettag"]))

            # NER 키워드 추출 => 선행되어야 pinecone 검색 가능
            ner_prompt = make_prompt_ner(combined_input)
            keywords_str_task = asyncio.create_task(call_4o_mini(ner_prompt, max_tokens=300))
            
            # NER은 대체 해보니 성능이 안나옴..! 꼭 대체한다고 다 좋은 건 아닌듯.
            # 너무 긴 템플릿은 적용해서 뽑아내고, 짧은 템플릿은 그냥 기존 방식을 쓰는게 좋아보임.
            # keywords_str_task = asyncio.create_task(call_4o_mini(user_input, max_tokens=300, system_prompt=sys_prompt["ner"]))

            # 2가지 작업 완료 후 값 할당
            chat_tag, keywords_str = await asyncio.gather(chat_tag_task, keywords_str_task)

            # 키워드 파싱 작업
            try:
                keywords_dict = json.loads(keywords_str)
                keywords = keywords_dict.get("keywords", [])
            except json.JSONDecodeError:
                keywords = []

            print(f'📌 after_parsing: {keywords}')  # ✅ 로그 추가

        ### context 생성 관련 작업 수행
        # 세션 전체 기억 불러오기
        # recent_history_task = asyncio.create_task(get_recent_history(session_id, 50))

        # (2) Redis 최근 대화 기록
        recent_logs = await get_recent_history(session_id, 50)
        # nickname:message 형태로 정리
        recent_log_texts = []
        for msg in recent_logs:
            nick = msg.get("nickname", msg["role"])
            recent_log_texts.append(f"{nick}: {msg['message']}")
        recent_history_block = "\n".join(recent_log_texts)
        
        # # 요약 불러오기
        # recent_summary_task = asyncio.create_task(get_summary_history(session_id))
        
        # Pinecone RAG 검색
        # retrieve_task = asyncio.create_task(retrieve_documents(bot_id, user_id, user_input, keywords, top_k=3))
        
        # (3) Pinecone 검색: user_ids 각각에 대해
        pine_content_lines = []
        for uid in user_ids:
            retrieved = await retrieve_documents(
                bot_id=bot_id,
                user_id=uid,
                query=combined_input,
                keywords=keywords,
                top_k=2
            )
            for doc in retrieved:
                meta = doc.get("metadata", {})
                user_input = meta.get("user_input", "")
                response = meta.get("response", "")
                pine_content_lines.append(f"[{uid}] user_input: {user_input}\n -> response: {response}")
        
        pine_text = "\n".join(pine_content_lines) if pine_content_lines else "관련 검색 결과가 없습니다."
        
        # print(f"📌 Pinecone 검색 결과: {pine_text}")  # ✅ 로그 추가

        # context 합치기
        # context = prepare_context(recent_history, pine_results, keywords)
        

        ### 저장 관련 작업 백그라운드 수행
        # 요약 갱신
        # save_summary_task = asyncio.create_task(save_summary_history(session_id, user_input))
        # Redis에 인풋 저장
        # save_task = asyncio.create_task(save_message(session_id, user_id, user_input))

        # 모든 사용자의 입력의 저장을 보장합니다.
        # if (type=="tarot"):
        # try:
        #     await asyncio.gather(
        #         # save_summary_task,
        #         save_task,
        #         return_exceptions=True  # ✅ 하나의 태스크가 실패해도 나머지 태스크 실행 유지
        #     )
        # except Exception as e:
        #     print(f"⚠️ 비동기 작업 실행 중 오류 발생: {e}") # tarot의 경우 직전 대화를 불러오는 과정이 있어서 경쟁 접근 방지

        # asyncio.gather(save_task, save_summary_task) # 저장 작업 완료 대기. 업로드 작업은 이미 asyncio.create_task로 인해 백그라운드에서 실행 보장됨.

        # (4) 최종 컨텍스트 구성
        # multi_mode 표시
        context = f"""
            [직전 대화 로그(일부)]:
            {recent_history_block}

            [과거 연관 대화 로그 (모든 유저 검색)]:
            {pine_text}
        """
        # 멀티 모드에 따라 context를 조금 다르게 생성
        if multi_mode:
            context = f"\n[멀티 모드]: 이 방에는 여러 사람이 있습니다. 짧고 자연스러운 대화를 유지하세요.\n{context}"
        else:
            context = f"\n[싱글 모드]: 1:1 타로 상담 상황입니다.\n{context}"
            
        if chat_tag == "tarot result":
            context = f"[스프레드]: 원 카드 스프레드 입니다. 과거 연관 대화는 대화의 맥락을 위한 것이지 타로 리딩에 사용하지 마세요.\n{context}" 

        # (5) chat_tag trim
        chat_tag = chat_tag.strip()

        print(f"🟣 process_user_input(멀티) 완료 -> chat_tag={chat_tag}")
        return context, keywords, chat_tag

    except Exception as e:
        print(f"❌ process_user_input(멀티) 실패: {e}")
        return "", [], "none"

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
            [직전 대화 기록]:
            {recent_history}

            [과거 연관 대화 기록]: 
            {pine_content_text}
        """

    return context.strip()  # ✅ 불필요한 공백 제거

# 이 함수는 스트리밍을 지원하지 않습니다. 스트리밍 기능이 추가된 함수는 response_utils.py의 함수를 찾아가세요.
async def rag_pipeline(session_id: str, user_input: str, type: str, user_id: str, bot_id: int, stream: bool = False):
    """
    비동기 최적화된 RAG 기반 챗봇 파이프라인 (Streaming 지원)
    """
    print("🟢 rag_pipeline 시작")  # ✅ 로그 추가
    # 업서트를 위해 keywords도 리턴 받기
    context, keywords, chat_tag = await process_user_input(session_id, user_input, type, user_id, bot_id)
    print("🟢 인풋 전처리 완료")  # ✅ 로그 추가
    # type에 따라 input과 chat_prompt 템플릿 분리
    if type == "tarot":
        chat_prompt = make_prompt_tarot(context, user_input)
        lastconv = await get_recent_history(session_id, 3) # 직전 대화 기록 불러오기
        print(lastconv)
        if lastconv:
            chat_prompt += "\n[직전의 대화]\n" + lastconv[0]["message"]
    else:
        chat_prompt = make_prompt_chat(context, user_input)
        # 챗 태그가 tarot이면 바로 결과를 내지 말고, 사용자가 타로를 보고 싶다고 하길 유도하라
        if chat_tag == "tarot":
            chat_prompt += """
사용자가 타로 점을 보고 싶어하는 것 같습니다.
이번 대답에 즉시 타로 점을 봐주지 말고 사용자에게 타로 점을 보고 싶어하는 지 물어보세요.
"""

    if stream:
        print("🟡 Streaming 모드로 실행")  # ✅ 로그 추가
        return response_generator(session_id, user_input, context)

    print(f"📌 생성된 Chat Prompt: {chat_prompt}")  # ✅ 로그 추가
    # 캐릭터 컨셉을 시스템 프롬프트로 추가
    llm_answer = await call_4o_mini(chat_prompt, max_tokens=256, system_prompt=concepts["온달"], stream=False)
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
    upsert_task = asyncio.create_task(upsert_documents(bot_id, user_id, [user_input], [metadata]))

    # ✅ 업서트 응답 확인
    print(f"✅ Pinecone 업서트 결과: {upsert_task}")
    # redis 저장
    save_response_task = asyncio.create_task(save_message(session_id, "assistant", llm_answer))

    print("분석 된 태그 :", chat_tag)

    return llm_answer, chat_tag
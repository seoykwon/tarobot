# prompt_generation.py
import pytz
from datetime import datetime

# ✅ 프롬프트 생성 함수
def make_prompt_summarize(text: str) -> str:
    return f"다음 한국어 텍스트를 간단히 요약해 주세요:\n{text}"

def make_prompt_timestamp(user_query: str) -> str:
    """
    사용자의 입력에서 날짜 정보를 YYYY-MM-DD 형식으로 추출하되,  
    문장의 맥락에서 날짜가 검색 필터로 의미가 있을 때만 `"use_as_filter": true"`를 반환.
    """
    
    # 한국 시간 가져오기
    seoul_tz = pytz.timezone("Asia/Seoul")
    current_time = datetime.now(seoul_tz).strftime("%Y-%m-%d %H:%M:%S")
    print(f'📌 현재 시간: {current_time}')
    
    return f"""
    현재 시각은 {current_time}이야.
    사용자의 입력에서 날짜 관련 키워드가 문장의 맥락에서 필수적인지 판단하고,  
    필요한 경우만 YYYY-MM-DD 형식으로 변환하세요.  
    현재 시각을 기준으로 검색필터로 이용할 수 있는 연월일 데이터를 계산해 줘.
    
    검색 필터로 이용할 수 없는 미래에 대한 내용이나, 날짜가 중요하지 않다면 `"use_as_filter": false"`를 반환하세요.

    ✅ 날짜가 핵심적이고 RAG로 쓸 수 있는 과거 혹은 가까운 과거 경우 → `true` (검색 필터 적용)  
    ✅ 단순한 배경 정보 또는 트렌드 언급 또는 미래에 대한 이야기 → `false` (검색 필터 제외)  

    [출력 예시]
    - "지난주 타로 결과 다시 보고 싶어." → `{{"use_as_filter": true, "start_date": "2024-02-05", "end_date": "2024-02-11"}}`
    - "2023년 12월에 상담한 운세 기억나?" → `{{"use_as_filter": true, "start_date": "2023-12-01", "end_date": "2023-12-31"}}`
    - "어제 본 연애운 다시 확인하고 싶어요." → `{{"use_as_filter": true, "start_date": "2024-02-13", "end_date": "2024-02-13"}}`
    - "올해의 타로 트렌드는 어떤가요?" → `{{"use_as_filter": false}}`
    - "타로 리딩은 작년에도 인기가 많았어." → `{{"use_as_filter": false}}`
    - "운세를 보고 싶어요." → `{{"use_as_filter": false}}`
    - "내일은 어떤 운세가 기다리고 있니?" → `{{"use_as_filter": false}}`

    [입력]
    "{user_query}"

    [출력]
    """

def make_prompt_chat(context: str, user_input: str) -> str:
    return f"[Context]\n{context}\n\nUser input: {user_input}\n\n위 정보를 바탕으로 친절하고 정확한 답변을 해주세요."


def make_prompt_tarot(context: str, user_input: str) -> str:
    return f"""
[Context]
{context}

사용자가 뽑은 카드: {user_input}

위 정보를 바탕으로 친절하고 정확한 타로 점을 봐주세요.
최근 대화기록과 특히 직전의 대화로 부터 내가 어떤 고민을 가지고 있는 지 파악하여,
타로 카드를 활용해 그 고민에 대한 해설을 해주세요.
결과를 200자 이내로 요약해서 대답해주세요.
"""

def make_prompt_ner(text: str) -> str:
    
    return f"""
    다음 문장에서 주요 개체명을 추출하고 `JSON` 형식으로 반환하세요.
    용언을 keyword로 추출할 때는 원형으로 입력할 것.
    각 항목이 없으면 빈 배열 `[]`을 반환하세요.

    [출력 예시]
    문장: "홍길동은 서울에서 열린 연말 회식에 참석했다."
    출력: {{ "keywords": ["홍길동", "서울", "연말 회식", "회식", "참석"] }}
    
    문장: "{text}"
    출력:
    """

### sys_prompt로 대체 된 프롬프트 함수들
# def make_prompt_tag(text: str) -> str:
#     return f"""
# 다음 유저의 입력을 분석해 사용자가 타로 점을 보고 싶은 지 분석해주세요.
# 유저의 입력: {text}

# 대답은 짧은 태그 형태로 반환해 주세요.
# ex) 사용자가 타로 점을 보고 싶어하는 경우 응답:
# tarot
# 사용자가 사주를 보고 싶어하는 경우 응답:
# saju
# 그 외의 경우
# none
# """
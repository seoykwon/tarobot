# fo_mini_api.py
import openai
from app.core.settings import settings

# OpenAI API 설정
openai.api_key = settings.openai_api_key
FO_MINI_MODEL = "gpt-4o-mini"  # OpenAI 모델

def call_4o_mini(prompt: str, max_tokens=256, temperature=0.7, stream=False):
    """
    OpenAI API를 호출하는 함수
    """
    try:
        client = openai.OpenAI()  # ✅ 최신 방식으로 클라이언트 생성
        response = client.chat.completions.create(
            model=FO_MINI_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=max_tokens,
            temperature=temperature,
            stream=stream
        )

        if stream:
            return (chunk["choices"][0]["delta"]["content"] for chunk in response)

        return response.choices[0].message.content  # ✅ 최신 응답 형식

    except openai.OpenAIError as e:  # ✅ 예외 처리 수정
        print(f"[Error] OpenAI API 호출 실패: {str(e)}")
        return "죄송합니다, API 호출 중 오류가 발생했습니다."

# ✅ 프롬프트 생성 함수 추가
def make_prompt_summarize(text: str) -> str:
    return f"다음 한국어 텍스트를 간단히 요약해 주세요:\n{text}"

def make_prompt_ner(text: str) -> str:
    return f"다음 문장에서 인물, 장소, 조직, 이벤트 등의 개체명을 찾아 JSON 형식으로 반환해 주세요:\n{text}"

def make_prompt_sentiment(text: str) -> str:
    return f"다음 문장의 감정을 분석해 주세요. JSON 형식으로 반환해 주세요 (예: {{'label': 'positive', 'confidence': 0.85}})\n{text}"

def make_prompt_chat(context: str, user_input: str) -> str:
    return f"[Context]\n{context}\n\nUser input: {user_input}\n\n위 정보를 바탕으로 친절하고 정확한 답변을 해주세요."

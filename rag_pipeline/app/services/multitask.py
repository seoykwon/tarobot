# mutitask.py
import asyncio
from app.utils.fo_mini_api import call_4o_mini, make_prompt_summarize, make_prompt_ner, make_prompt_sentiment

async def parallel_tasks(text: str):
    """
    Summarization / NER / Sentiment 분석을 병렬 처리하는 비동기 함수
    """
    # 프롬프트 생성
    summarize_prompt = make_prompt_summarize(text)
    ner_prompt = make_prompt_ner(text)
    sentiment_prompt = make_prompt_sentiment(text)

    # ✅ 비동기 실행을 한 번에 처리 (asyncio.gather 사용)
    summarize, ner, sentiment = await asyncio.gather(
        call_4o_mini(summarize_prompt, max_tokens=200),
        call_4o_mini(ner_prompt, max_tokens=300),
        call_4o_mini(sentiment_prompt, max_tokens=100),
    )

    return {
        "summarize": summarize,
        "ner": ner,
        "sentiment": sentiment
    }

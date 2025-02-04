from concurrent.futures import ThreadPoolExecutor
from app.utils.fo_mini_api import call_4o_mini, make_prompt_summarize, make_prompt_ner, make_prompt_sentiment

def parallel_tasks(text: str):
    """
    Summarization / NER / Sentiment 분석을 병렬 처리하는 함수
    """
    results = {}

    summarize_prompt = make_prompt_summarize(text)
    ner_prompt = make_prompt_ner(text)
    sentiment_prompt = make_prompt_sentiment(text)

    def task_summarize():
        results["summarize"] = call_4o_mini(summarize_prompt, max_tokens=200)

    def task_ner():
        results["ner"] = call_4o_mini(ner_prompt, max_tokens=300)

    def task_sentiment():
        results["sentiment"] = call_4o_mini(sentiment_prompt, max_tokens=100)

    with ThreadPoolExecutor(max_workers=3) as executor:
        executor.submit(task_summarize)
        executor.submit(task_ner)
        executor.submit(task_sentiment)

    return results

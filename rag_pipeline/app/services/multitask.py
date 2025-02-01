from concurrent.futures import ThreadPoolExecutor
from app.utils.fo_mini_api import call_4o_mini, make_prompt_summarize, make_prompt_ner, make_prompt_sentiment

def parallel_tasks(text: str):
    """
    Summarization / NER / Sentiment 분석을 병렬 처리하는 함수
    """
    # 프롬프트 생성
    summarize_prompt = make_prompt_summarize(text)
    ner_prompt = make_prompt_ner(text)
    sentiment_prompt = make_prompt_sentiment(text)

    # 작업 함수 정의
    def task_summarize():
        return call_4o_mini(summarize_prompt, max_tokens=200)

    def task_ner():
        return call_4o_mini(ner_prompt, max_tokens=300)

    def task_sentiment():
        return call_4o_mini(sentiment_prompt, max_tokens=100)

    # ThreadPoolExecutor를 사용하여 작업 병렬 실행
    with ThreadPoolExecutor(max_workers=3) as executor:
        future_to_task = {
            'summarize': executor.submit(task_summarize),
            'ner': executor.submit(task_ner),
            'sentiment': executor.submit(task_sentiment)
        }

        results = {}
        for task_name, future in future_to_task.items():
            try:
                # 작업 완료를 기다리고 결과 저장
                results[task_name] = future.result()
            except Exception as e:
                # 작업 중 예외 발생 시 처리
                results[task_name] = f"Error: {e}"

    return results

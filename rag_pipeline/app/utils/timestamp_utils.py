# timestamp_utils.py
import json
import logging
from datetime import datetime
import pytz
from app.utils.fo_mini_api import call_4o_mini
from app.utils.prompt_generation import make_prompt_timestamp

KST = pytz.timezone("Asia/Seoul")

async def generate_timestamp_filter(user_query: str) -> dict:
    """
    사용자 입력을 기반으로 timestamp 필터를 자동 생성하는 함수.
    """
    timestamp_prompt = make_prompt_timestamp(user_query)
    timestamp_response = await call_4o_mini(timestamp_prompt, max_tokens=100)

    try:
        timestamp_data = json.loads(timestamp_response)
    except json.JSONDecodeError as e:
        logging.error(f"JSON 변환 실패: {e} - 응답: {timestamp_response}")
        return {}

    if not timestamp_data.get("use_as_filter", False):
        logging.info("날짜 정보가 검색 필터로 적절하지 않음")
        return {}

    return convert_date_to_timestamp(timestamp_data)


def convert_date_to_timestamp(timestamp_data: dict) -> dict:
    """
    YYYY-MM-DD 형식의 날짜를 Unix timestamp(KST -> UTC)로 변환.
    """
    start_date_str = timestamp_data.get("start_date")
    end_date_str = timestamp_data.get("end_date")
    filter_query = {}

    try:
        if start_date_str:
            start_dt = datetime.strptime(start_date_str, "%Y-%m-%d").replace(hour=0, minute=0, second=0, tzinfo=KST)
            filter_query["created_at"] = {"$gte": int(start_dt.timestamp())}

        if end_date_str:
            end_dt = datetime.strptime(end_date_str, "%Y-%m-%d").replace(hour=23, minute=59, second=59, tzinfo=KST)
            if "created_at" in filter_query:
                filter_query["created_at"]["$lte"] = int(end_dt.timestamp())
            else:
                filter_query["created_at"] = {"$lte": int(end_dt.timestamp())}

        return filter_query
    except (ValueError, TypeError) as e:
        logging.error(f"Datetime 변환 실패: {e} - 데이터: {timestamp_data}")
        return {}

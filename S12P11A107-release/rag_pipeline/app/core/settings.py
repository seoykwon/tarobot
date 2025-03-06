# settings.py
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

# ✅ .env 파일 명시적으로 로드
load_dotenv()

class AppSettings(BaseSettings):
    pinecone_api_key: str = Field(..., env="PINECONE_API_KEY")
    pinecone_env: str = Field(..., env="PINECONE_ENV")

    upstage_api_key: str = Field(..., env="UPSTAGE_API_KEY")

    redis_host: str = Field(..., env="REDIS_HOST")
    redis_port: int = Field(..., env="REDIS_PORT")
    
    # ✅ 4o-mini API 추가
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")

    openvidu_url: str
    openvidu_secret: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = 'allow'

settings = AppSettings()

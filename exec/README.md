# 포팅 가이드

## 가입 해야 하는 서비스
1. pinecone

    [pinecone](https://www.pinecone.io/)
    pinecone에 가입해 API_KEY를 발급 받아 /rag_pipeline 폴더의 .env에 PINECONE_API_KEY를 설정한다.
    PINECONE_ENV 값 또한 DB 서버의 지역에 따라서 PINECONE_ENV=us-east-1 등으로 설정한다. 

2. Upstage

    [Upstage](https://www.upstage.ai/)
    Upstage에 가입해 API_KEY를 발급 받아 /rag_pipeline 폴더의 .env에 UPSTAGE_API_KEY를 설정한다.

3. OpenAI

    [OpenAI console](https://platform.openai.com/)
    OpenAI에 가입해 API_KEY를 발급 받아 /rag_pipeline 폴더의 .env에 OPENAI_API_KEY를 설정한다.

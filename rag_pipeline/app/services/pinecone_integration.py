# pinecone_integration.py
import time
import uuid
from typing import List, Dict
from pinecone import Pinecone, ServerlessSpec
from langchain_community.vectorstores import Pinecone as LangChainPinecone
from langchain_upstage.embeddings import UpstageEmbeddings
from app.core.settings import settings
import asyncio  # ✅ 비동기 지원 추가

# Pinecone 인덱스 이름
INDEX_NAME = "my-rag-index"

# Pinecone 클라이언트 초기화
pc = Pinecone(api_key=settings.pinecone_api_key, environment=settings.pinecone_env)

# 기존 인덱스 확인 후 없으면 생성
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
if INDEX_NAME not in existing_indexes:
    pc.create_index(
        name=INDEX_NAME,
        dimension=4096,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
        deletion_protection="enabled"
    )
    while not pc.describe_index(INDEX_NAME).status["ready"]:
        time.sleep(1)

# Pinecone 인덱스 객체 연결
index = pc.Index(INDEX_NAME)

# Upstage Embeddings 객체 생성
upstage_embeddings = UpstageEmbeddings(
    api_key=settings.upstage_api_key,
    model="embedding-query"
)

# Pinecone 벡터 저장소 생성
vectorstore = LangChainPinecone.from_existing_index(
    index_name=INDEX_NAME,
    embedding=upstage_embeddings,
    text_key="session_id"
)

# Retriever 생성
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 3}
)

# ✅ upsert_documents()를 비동기 함수로 변경
async def upsert_documents(docs: List[str], metadatas: List[Dict] = None):
    """
    Pinecone 인덱스에 문서를 비동기적으로 업서트하는 함수
    """
    if metadatas is None:
        metadatas = [{"content": doc} for doc in docs]

    # 문서를 벡터로 변환 (비동기 처리)
    embeddings = await asyncio.to_thread(upstage_embeddings.embed_documents, docs)

    # Pinecone에 저장할 데이터 구성
    vectors = [
        {"id": str(uuid.uuid4()), "values": embedding, "metadata": metadata}
        for embedding, metadata in zip(embeddings, metadatas)
    ]

    # Pinecone 업서트 실행 (비동기 처리)
    await asyncio.to_thread(index.upsert, vectors)

    return f"Upserted {len(docs)} documents into Pinecone"

# ✅ retrieve_documents()도 비동기 함수로 변경
async def retrieve_documents(query: str, top_k=3):
    """
    Pinecone Retriever를 사용하여 유사한 문서 검색
    """
    retrieved_docs = await asyncio.to_thread(retriever.invoke, query)

    results = [
        {"content": doc.metadata.get("content", "No content"), "metadata": doc.metadata}
        for doc in retrieved_docs
    ]

    return results

# pinecone_integration.py
import time
import uuid
from typing import List, Dict
from pinecone import Pinecone, ServerlessSpec
from langchain_community.vectorstores import Pinecone as LangChainPinecone
from langchain_upstage.embeddings import UpstageEmbeddings
from app.core.settings import settings  # ✅ 올바른 경로

# Pinecone 인덱스 이름
INDEX_NAME = "my-rag-index"

# Pinecone 클라이언트 초기화
pc = Pinecone(api_key=settings.pinecone_api_key, environment=settings.pinecone_env)

# 기존 인덱스 확인 후 없으면 생성
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
if INDEX_NAME not in existing_indexes:
    pc.create_index(
        name=INDEX_NAME,
        dimension=4096,  # Upstage 임베딩과 일치해야 함
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
    text_key="session_id"  # ✅ 검색 키를 "session_id"으로 변경
)

# Retriever 생성
retriever = vectorstore.as_retriever(
    search_type="mmr",  # 또는 "similarity"
    search_kwargs={"k": 3}
)

def upsert_documents(docs: List[str], metadatas: List[Dict] = None):
    """
    Pinecone 인덱스에 문서를 업서트하는 함수
    Args:
        docs (List[str]): 문서 목록
        metadatas (List[Dict], optional): 문서별 메타데이터. Defaults to None.
    Returns:
        str: 성공 메시지
    """
    if metadatas is None:
        # 문서에 맞는 메타데이터 설정, 예: "content" 또는 "session_id"
        metadatas = [{"content": doc} for doc in docs]  # content를 메타데이터로 설정

    # 문서를 벡터로 변환
    embeddings = upstage_embeddings.embed_documents(docs)

    # Pinecone에 저장할 데이터 구성
    vectors = [
        {"id": str(uuid.uuid4()), "values": embedding, "metadata": metadata}
        for embedding, metadata in zip(embeddings, metadatas)
    ]

    # 업서트 실행
    index.upsert(vectors=vectors)

    return f"Upserted {len(docs)} documents into Pinecone"


def retrieve_documents(query: str, top_k=3):
    """
    Pinecone Retriever를 사용하여 유사한 문서 검색
    Args:
        query (str): 질의 문장
        top_k (int, optional): 검색할 상위 개수. Defaults to 3.
    Returns:
        List[Dict]: 검색 결과 목록
    """
    retrieved_docs = retriever.invoke(query)

    # 검색 결과 변환
    results = [
        {"content": doc.metadata.get("content", "No content"), "metadata": doc.metadata}  # content를 메타데이터로 반환
        for doc in retrieved_docs
    ]

    return results

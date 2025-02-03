# pinecone_integration.py
import time
import uuid
import asyncio
from typing import List, Dict
from pinecone import Pinecone, ServerlessSpec
from langchain_community.vectorstores import Pinecone as LangChainPinecone
from langchain_upstage.embeddings import UpstageEmbeddings
from sklearn.feature_extraction.text import TfidfVectorizer
from app.core.settings import settings
from app.utils.timestamp_utils import generate_timestamp_filter

# Pinecone 인덱스 이름
INDEX_NAME = "my-rag-index"

# Pinecone 클라이언트 초기화
pc = Pinecone(api_key=settings.pinecone_api_key, environment=settings.pinecone_env)

# 기존 인덱스 확인 후 없으면 생성
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
# 기존 인덱스 확인 후 없으면 생성 (하이브리드 검색 지원 설정 추가)
if INDEX_NAME not in existing_indexes:
    pc.create_index(
        name=INDEX_NAME,
        dimension=4096,  # 밀집 벡터 차원
        metric="dotproduct",  # ✅ 하이브리드 검색 지원 (cosine → dotproduct 변경)
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

# ✅ 희소 벡터 변환 최적화 (scipy.sparse 직접 접근)
def convert_tfidf_to_pinecone_format(tfidf_matrix, index: int) -> dict:
    """
    TF-IDF 벡터를 Pinecone `sparse_values` 형식에 맞게 변환하는 함수.
    - `numpy` 변환 없이 `scipy.sparse` 직접 접근하여 성능 최적화.

    Args:
        tfidf_matrix (scipy.sparse.csr_matrix): TF-IDF 희소 행렬
        index (int): 변환할 문서의 인덱스

    Returns:
        dict: Pinecone이 요구하는 `sparse_values` 형식 (indices + values)
    """
    row = tfidf_matrix[index]  # 특정 문서의 TF-IDF 벡터
    return {
        "indices": row.indices.tolist(),  # 희소 행렬 인덱스
        "values": row.data.tolist()  # 해당 인덱스의 TF-IDF 가중치
    }


# ✅ 하이브리드 검색을 위한 문서 저장 (Pinecone 업서트)
async def upsert_documents(user_id: str, docs: List[str], metadatas: List[Dict] = None):
    """
    Pinecone 인덱스에 문서를 비동기적으로 업서트하는 함수 (하이브리드 검색 지원)
    - 밀집 벡터 (Dense Vector) + 희소 벡터 (Sparse Vector) 함께 저장
    """
    if metadatas is None:
        metadatas = [{"content": doc} for doc in docs]

    # 1️⃣ 밀집 벡터 생성 (비동기)
    dense_embeddings = await asyncio.to_thread(upstage_embeddings.embed_documents, docs)

    # 2️⃣ 희소 벡터 생성 (TF-IDF) - 직접 접근하여 성능 최적화
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(docs)

    # 3️⃣ Pinecone에 저장할 데이터 구성
    vectors = []
    for i, embedding in enumerate(dense_embeddings):
        sparse_vector = convert_tfidf_to_pinecone_format(tfidf_matrix, i)  # ✅ 최적화된 변환 방식 적용

        vectors.append({
            "id": str(uuid.uuid4()),
            "values": embedding,  # 밀집 벡터
            "sparse_values": sparse_vector,  # 희소 벡터
            "metadata": metadatas[i]  # 문서 메타데이터
        })

    # 4️⃣ Pinecone 업서트 실행 (namespace: user_id 적용)
    await asyncio.to_thread(index.upsert, vectors, namespace=user_id)

    return f"Upserted {len(docs)} documents into Pinecone (Hybrid Search Enabled, namespace: {user_id})"


# ✅ 하이브리드 검색 적용 (NER 기반 필터 + 희소 벡터 검색 추가)
async def retrieve_documents(user_id: str, query: str, ner_info: dict, top_k: int = 3):
    """
    특정 사용자의 namespace에서 Pinecone 하이브리드 검색을 수행하는 비동기 함수
    - 밀집 벡터 (Dense Vector) + 희소 벡터 (Sparse Vector) 동시 검색
    - NER 필터 및 날짜 필터링 적용
    """
    # 🔥 필터 적용 (NER 기반 검색)
    filter_query = {}
    if ner_info.get("keywords"):
        filter_query["keywords"] = {"$in": ner_info["keywords"]}
    if ner_info.get("events"):
        filter_query["events"] = {"$in": ner_info["events"]}
    if ner_info.get("persons"):
        filter_query["persons"] = {"$in": ner_info["persons"]}
    if ner_info.get("locations"):
        filter_query["locations"] = {"$in": ner_info["locations"]}

    # 🔥 날짜 필터 적용 (Timestamp 변환 후 추가)
    timestamp_filter = await generate_timestamp_filter(query)
    if timestamp_filter:
        filter_query.update(timestamp_filter)

    # 🔥 쿼리 벡터 변환 (밀집 벡터)
    query_vector = await asyncio.to_thread(upstage_embeddings.embed_query, query)

    # 🔥 희소 벡터 변환 (TF-IDF) - 직접 접근하여 성능 최적화
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([query])
    sparse_vector = convert_tfidf_to_pinecone_format(tfidf_matrix, 0)  # ✅ 최적화된 변환 방식 적용

    # 🔥 Pinecone 검색 실행 (밀집 벡터 + 희소 벡터 적용)
    response = await asyncio.to_thread(
        index.query,
        vector=query_vector,
        sparse_vector=sparse_vector,  # 희소 벡터 추가
        top_k=top_k,
        include_metadata=True,
        namespace=user_id,
        filter=filter_query if filter_query else {}
    )

    # 🔥 검색 결과 반환
    results = [
        {
            "content": match["metadata"].get("content", "No content"),
            "metadata": match["metadata"]
        }
        for match in response.get("matches", [])
    ]

    return results

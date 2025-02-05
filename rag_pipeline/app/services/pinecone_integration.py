# pinecone_integration.py
import time
import uuid
import asyncio
from typing import List, Dict
from pinecone import Pinecone, ServerlessSpec
from langchain_community.vectorstores import Pinecone as LangChainPinecone
from langchain_upstage.embeddings import UpstageEmbeddings
from app.core.settings import settings
from app.utils.timestamp_utils import generate_timestamp_filter

# Pinecone 인덱스 이름
INDEX_NAME = "test-1"

# Pinecone 클라이언트 초기화
pc = Pinecone(api_key=settings.pinecone_api_key)

# 기존 인덱스 확인 후 없으면 생성
existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
# 기존 인덱스 확인 후 없으면 생성 (하이브리드 검색 지원 설정 추가)
if INDEX_NAME not in existing_indexes:
    pc.create_index(
        name=INDEX_NAME,
        dimension=4096,  # 밀집 벡터 차원
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
    embedding=upstage_embeddings
)

# Retriever 생성
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 3}
)

# ✅ 문서 저장 (밀집 벡터만 사용, Metadata 문제 해결)
async def upsert_documents(user_id: str, docs: List[str], metadatas: List[Dict] = None):
    try:
        print('🟢 upsert_documents 실행')  # ✅ 로그 추가

        # ✅ 1. 입력 데이터 검증
        if not isinstance(user_id, str):
            raise ValueError(f"❌ user_id가 문자열이 아닙니다: {type(user_id)}")
        
        if not isinstance(docs, list) or not all(isinstance(doc, str) for doc in docs):
            raise ValueError(f"❌ docs는 문자열 리스트여야 합니다: {docs}")

        if metadatas is None:
            metadatas = [{"content": doc} for doc in docs]

        if not isinstance(metadatas, list) or not all(isinstance(meta, dict) for meta in metadatas):
            raise ValueError(f"❌ metadatas는 딕셔너리 리스트여야 합니다: {metadatas}")

        if len(docs) != len(metadatas):
            raise ValueError(f"❌ docs와 metadatas의 길이가 일치해야 합니다. (docs: {len(docs)}, metadatas: {len(metadatas)})")

        # ✅ 2. 임베딩 생성 (비동기 실행)
        dense_embeddings = await asyncio.to_thread(upstage_embeddings.embed_documents, docs)

        if not isinstance(dense_embeddings, list) or not all(isinstance(vec, list) for vec in dense_embeddings):
            raise ValueError(f"❌ dense_embeddings는 리스트여야 합니다: {dense_embeddings}")

        if any(len(vec) != 4096 for vec in dense_embeddings):
            raise ValueError(f"❌ 모든 벡터는 4096 차원이어야 합니다. (실제 차원: {[len(vec) for vec in dense_embeddings]})")

        print(f"📌 Dense Embeddings 검증 완료: {dense_embeddings[0][:5]}")  # ✅ 일부 출력

        # ✅ 3. Pinecone 업서트 데이터 구성 및 검증
        vectors = [
            {
                "id": str(uuid.uuid4()),
                "values": embedding,
                "metadata": metadatas[i]
            }
            for i, embedding in enumerate(dense_embeddings)
        ]

        if not isinstance(vectors, list) or not all(isinstance(vec, dict) for vec in vectors):
            raise ValueError(f"❌ vectors는 딕셔너리 리스트여야 합니다: {vectors}")

        if any(not all(key in vec for key in ["id", "values", "metadata"]) for vec in vectors):
            raise ValueError(f"❌ vectors 내부 필드(id, values, metadata) 확인 필요.")

        if any(not isinstance(vec["id"], str) or not isinstance(vec["values"], list) or not isinstance(vec["metadata"], dict) for vec in vectors):
            raise ValueError(f"❌ vectors 필드 타입 불일치: {vectors}")

        print(f"📌 Upsert Vectors 검증 완료: {vectors[0]['id'], vectors[0]['values'][:5]}")  # ✅ 일부 출력

        # ✅ 4. Pinecone에 업서트 실행
        await asyncio.to_thread(index.upsert, vectors, namespace=user_id)
        print(f"✅ Pinecone 업서트 성공 (user_id: {user_id})")

    except Exception as e:
        print(f"❌ upsert_documents 실패: {e}")  # ✅ 예외 출력

# ✅ NER 기반 필터
async def retrieve_documents(user_id: str, query: str, keywords: List[str], top_k: int = 3):
    print(f"🟢 retrieve_documents 시작 (user_id: {user_id}, query: {query}, keywords: {keywords})")  # ✅ 로그 추가

    filter_query = {}
    if keywords:
        filter_query["keywords"] = {"$in": keywords}

    timestamp_filter = await generate_timestamp_filter(query)
    if timestamp_filter:
        filter_query.update(timestamp_filter)

    print(f"📌 적용된 필터: {filter_query}")  # ✅ 필터 출력

    query_vector = await asyncio.to_thread(upstage_embeddings.embed_query, query)
    print(f"📌 생성된 벡터: {query_vector[:5]}...")  # ✅ 벡터 일부 출력

    response = await asyncio.to_thread(
        index.query,
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        namespace=user_id,
        filter=filter_query if filter_query else {}
    )

    print(f"📌 Pinecone 검색 응답: {response}")  # ✅ 결과 출력

    results = [
        {"metadata": match["metadata"]}
        for match in response.get("matches", [])
    ]
    print(f"📌 최종 검색 결과: {results}")  # ✅ 결과 출력

    return results

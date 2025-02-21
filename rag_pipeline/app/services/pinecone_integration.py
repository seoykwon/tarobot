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

# Pinecone 클라이언트 초기화
pc = Pinecone(api_key=settings.pinecone_api_key)

# Upstage Embeddings 객체 생성
upstage_embeddings = UpstageEmbeddings(
    api_key=settings.upstage_api_key,
    model="embedding-query"
)

def get_index_for_bot(bot_id: int):
    """
    주어진 bot_id에 따라 Pinecone 인덱스를 생성 및 반환하는 함수.
    인덱스 이름은 "tarot-bot-{bot_id}" 형식입니다.
    """
    index_name = f"tarot-bot-{bot_id}"
    existing_indexes = [index_info["name"] for index_info in pc.list_indexes()]
    if index_name not in existing_indexes:
        pc.create_index(
            name=index_name,
            dimension=4096,  # 밀집 벡터 차원
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1"),
            deletion_protection="enabled"
        )
        while not pc.describe_index(index_name).status["ready"]:
            time.sleep(1)
    return pc.Index(index_name)

async def upsert_documents(bot_id: int, user_id: str, docs: List[str], metadatas: List[Dict]):
    """
    문서 업서트를 실행하는 비동기 함수.
    봇별 인덱스를 사용하며, 인덱스 이름은 "tarot-bot-{bot_id}" 형식입니다.
    """
    try:
        print('🟢 upsert_documents 실행')

        # 입력 데이터 검증
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

        # 임베딩 생성 (비동기 실행)
        dense_embeddings = await asyncio.to_thread(upstage_embeddings.embed_documents, docs)

        if not isinstance(dense_embeddings, list) or not all(isinstance(vec, list) for vec in dense_embeddings):
            raise ValueError(f"❌ dense_embeddings는 리스트여야 합니다: {dense_embeddings}")

        if any(len(vec) != 4096 for vec in dense_embeddings):
            raise ValueError(f"❌ 모든 벡터는 4096 차원이어야 합니다. (실제 차원: {[len(vec) for vec in dense_embeddings]})")

        print(f"📌 Dense Embeddings 검증 완료: {dense_embeddings[0][:5]}")

        # 업서트할 데이터 구성
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

        print(f"📌 Upsert Vectors 검증 완료: {(vectors[0]['id'], vectors[0]['values'][:5])}")

        # 봇별 인덱스 가져오기
        index = get_index_for_bot(bot_id)
        await asyncio.to_thread(index.upsert, vectors, namespace=user_id)
        print(f"✅ Pinecone 업서트 성공 (user_id: {user_id}, bot_id: {bot_id})")

    except Exception as e:
        print(f"❌ upsert_documents 실패: {e}")

async def retrieve_documents(bot_id: int, user_id: str, query: str, keywords: List[str], top_k: int = 3):
    """
    Pinecone에서 문서를 검색하는 비동기 함수.
    봇별 인덱스를 사용하며, 인덱스 이름은 "tarot-bot-{bot_id}" 형식입니다.
    """
    print(f"🟢 retrieve_documents 시작 (user_id: {user_id}, query: {query}, keywords: {keywords})")

    filter_query = {}
    if keywords:
        filter_query["keywords"] = {"$in": keywords}

    timestamp_filter = await generate_timestamp_filter(query)
    if timestamp_filter:
        filter_query.update(timestamp_filter)

    print(f"📌 적용된 필터: {filter_query}")
    query_vector = await asyncio.to_thread(upstage_embeddings.embed_query, query)
    print(f"📌 생성된 벡터: {query_vector[:5]}...")

    # 봇별 인덱스 가져오기
    index = get_index_for_bot(bot_id)
    response = await asyncio.to_thread(
        index.query,
        vector=query_vector,
        top_k=top_k,
        include_metadata=True,
        namespace=user_id,
        filter=filter_query if filter_query else {}
    )

    print(f"📌 Pinecone 검색 응답: {response}")
    results = [
        {"metadata": match["metadata"]}
        for match in response.get("matches", [])
    ]
    print(f"📌 최종 검색 결과: {results}")

    return results

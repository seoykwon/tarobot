from pinecone_integration import upsert_documents, retrieve_documents

# 문서 업서트 테스트
print(upsert_documents(
    docs=["오늘은 날씨가 맑다.", "AI 컨퍼런스가 열렸다."],
    metadatas=[{"topic": "weather"}, {"topic": "event"}]
))

# 검색 수행
query_text = "날씨는 어땠나요?"
retrieved_docs = retrieve_documents(query_text)

# 검색 결과 출력
print("검색 결과:")
for i, doc in enumerate(retrieved_docs):
    print(f"{i+1}. {doc['content']} (Metadata: {doc['metadata']})")

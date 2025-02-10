# RAG Pipeline (WIP)

이 프로젝트는 **FastAPI** + **Redis** + **Pinecone** + **OpenAI** 등을 연동하여 간단한 RAG( Retrieval-Augmented Generation ) 파이프라인을 구현한 예시입니다.  
아직 최종 버전이 아니므로, 주요 기능과 코드 구조에 대한 설명은 **간략**하게만 소개하고, **개발 환경 구축 및 실행 방법**을 중심으로 정리합니다.

---

## 주요 기능
- FastAPI를 사용한 서버 애플리케이션
- Redis를 통한 대화 히스토리 관리
- Pinecone 벡터 데이터베이스를 이용한 문서 검색(RAG)
- OpenAI(또는 유사 API) 연동으로 LLM 답변 생성
- Socket.IO를 통해 실시간 통신(챗봇 메시지 전달)
- OpenVidu를 연동하여 화상 세션을 생성/연결 (실험용)

**주의:**
- 본 레포지토리는 **개발 중인 WIP(Work In Progress)** 상태이며, 일부 기능은 정상 동작하지 않거나 수정될 수 있습니다.

---

## 개발 환경

### 요구 사항 (Requirements)
- Python 3.12 이상
- [Pinecone](https://www.pinecone.io/) 계정 및 API Key
- [Redis](https://redis.io/) 서버
- [OpenAI API Key](https://platform.openai.com/) 또는 이에 준하는 호환 키
- [Upstage Embeddings](https://github.com/upstage-co/langchain-upstage) 계정/키  
- [OpenVidu](https://openvidu.io/) 서버(실행 중이어야 함)  
- 그 외 `requirements.txt`(또는 직접 정의) 에 포함된 패키지들

### 설치 방법
1. **레포지토리 클론**  
   ```bash
   git clone https://github.com/yourname/rag_pipeline.git
   cd rag_pipeline
   ```
2. **의존성 설치**  
   - `requirements.txt` 파일이 있다고 가정할 경우:
     ```bash
     pip install -r requirements.txt
     ```
   - 혹은 Poetry 등을 사용한다면:
     ```bash
     poetry install
     ```
3. **.env 파일 준비**  
   - `settings.py`에서 `pydantic`을 통해 환경 변수를 불러옵니다.
   - 프로젝트 루트 혹은 적절한 위치에 `.env` 파일을 생성하고, 아래와 유사한 내용으로 작성합니다:
     ```
     PINECONE_API_KEY=YOUR_PINECONE_API_KEY
     PINECONE_ENV=YOUR_PINECONE_ENV

     UPSTAGE_API_KEY=YOUR_UPSTAGE_API_KEY

     REDIS_HOST=localhost
     REDIS_PORT=6379

     OPENAI_API_KEY=YOUR_OPENAI_OR_4O_MINI_KEY
     OPENVIDU_URL=https://localhost:4443
     OPENVIDU_SECRET=MY_SECRET
     ```
   - 실제 서비스 환경에 맞춰 값을 수정하세요.

---

## 실행 방법

### FastAPI 서버 실행
- 로컬에서 개발 서버를 띄우려면, 보통 아래 명령을 사용합니다:
  ```bash
  uvicorn main:socket_app --host 0.0.0.0 --port 8000 --reload
  ```
  혹은 `main.py`의 `start_server()` 함수를 통해 직접 실행도 가능합니다.

- 실행 후, 브라우저에서 `http://localhost:8000` (또는 설정한 포트)로 접속하면 **Health Check** 엔드포인트 메시지를 볼 수 있습니다.

### Socket.IO
- `main.py` 안에 Socket.IO 설정이 포함되어 있으며,  
  `/socket.io` 경로를 통해 웹소켓/폴링 방식으로 통신합니다.

### OpenVidu 연동
- `/openvidu/sessions` 또는 `/openvidu/connections` 라우트를 통해 세션 생성/토큰 발급 등을 합니다.  
- 반드시 `OPENVIDU_URL`과 `OPENVIDU_SECRET` 값이 `.env`에 설정되어 있어야 합니다.  
- 실제 OpenVidu 서버가 동작 중이어야 정상 작동합니다.

---

## 파일 구조 (간략 소개)
```
.
├── main.py                # FastAPI 및 Socket.IO 서버 진입점
├── openvidu_api.py        # OpenVidu 연동 함수
├── settings.py            # 환경 변수 로딩 & pydantic 설정
├── pinecone_integration.py# Pinecone 인덱스 초기화 & 업서트/검색
├── rag_pipeline.py        # RAG 주요 파이프라인 (챗봇 로직)
├── redis_utils.py         # Redis 저장/로드 헬퍼
├── fo_mini_api.py         # 4o-mini (OpenAI 호환) API 호출 모듈
├── prompt_generation.py   # 프롬프트 템플릿 생성 모듈
├── response_utils.py      # 스트리밍 응답용 헬퍼
├── timestamp_utils.py     # 날짜 필터링 (NER기반) 유틸
└── ...
```
- 각 파일은 주석을 통해 간단히 용도를 표시하였으며, 세부 구현은 확정되지 않았을 수 있습니다.

---

## 주의 사항 & 추가 안내
- 현재까지 **임시/테스트** 용도로 작성된 코드가 많으므로, 프로덕션에서 사용 시 **세부 로직 수정 및 보안 점검**이 필요합니다.
- Pinecone과 Redis를 동시에 사용하므로, 네트워크나 레이트 리밋 이슈가 있을 수 있습니다.
- OpenAI(또는 유사 API) 호출 시 비용이 발생하므로, 키 관리와 호출 횟수에 유의하세요.

---

## 라이선스
- 본 레포지토리의 라이선스가 명시되지 않았다면, 팀 내 정책 혹은 개인 용도로만 활용하시기 바랍니다. (추후 별도 라이선스 추가 가능)

---

## 문의
- 개발 관련 문의는 저장소 이슈(issues) 또는 별도 연락처를 통해 문의해 주세요.
- 본 코드는 학습/프로토타입 용도로 작성되었습니다. 실제 서비스 적용 시 **안정성 검증** 과정을 거치길 권장합니다.  

---

> **NOTE:**  
> 본 문서는 아직 **초안**이며, 프로젝트 구조나 구성 요소가 변경될 수 있습니다. 향후 업데이트에서 세부 기능이나 모듈이 바뀔 수 있으니 참고 바랍니다.  
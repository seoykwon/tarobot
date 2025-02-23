# 웹/모바일(웹 기술) 스켈레톤 프로젝트

> **AI 기반 타로 상담 서비스**로, 프론트엔드(Next.js), 백엔드(Spring Boot), RAG Pipeline(FastAPI)를 연동하여  
> 실시간 채팅/타로 상담/화상 미팅 기능 등을 제공하는 프로젝트입니다.

<br/>

## 목차

- [웹/모바일(웹 기술) 스켈레톤 프로젝트](#웹모바일웹-기술-스켈레톤-프로젝트)
  - [목차](#목차)
  - [카테고리](#카테고리)
  - [프로젝트 소개](#프로젝트-소개)
  - [팀 소개](#팀-소개)
  - [프로젝트 상세 설명](#프로젝트-상세-설명)
    - [4.1 전체 기술 스택](#41-전체-기술-스택)
    - [4.2 전체 시스템 구성도](#42-전체-시스템-구성도)
    - [4.3 아키텍처 개요](#43-아키텍처-개요)
    - [4.4 주요 기능](#44-주요-기능)
    - [4.5 프로젝트 폴더 구조](#45-프로젝트-폴더-구조)
  - [프론트엔드 (Next.js)](#프론트엔드-nextjs)
    - [주요 내용 (요약)](#주요-내용-요약)
  - [백엔드 (Spring Boot)](#백엔드-spring-boot)
    - [주요 내용 (요약)](#주요-내용-요약-1)
  - [RAG Pipeline (FastAPI)](#rag-pipeline-fastapi)
    - [주요 내용 (요약)](#주요-내용-요약-2)
  - [배포 및 포팅 가이드](#배포-및-포팅-가이드)
    - [1. 가입해야 하는 외부 서비스](#1-가입해야-하는-외부-서비스)
    - [2. AWS 인프라 구성](#2-aws-인프라-구성)
    - [3. Jenkins 파이프라인 설정](#3-jenkins-파이프라인-설정)
    - [4. Docker Compose 구성](#4-docker-compose-구성)
    - [5. Nginx Reverse Proxy](#5-nginx-reverse-proxy)
    - [6. 배포 절차 요약](#6-배포-절차-요약)
  - [FAQ / 참고사항](#faq--참고사항)
  - [마무리](#마무리)

---

## 카테고리

| Application              | Domain         | Language         | Framework         |
| ------------------------ | -------------- | ---------------- | ----------------- |
| :white_check_mark: Desktop Web | :white_check_mark: AI       | :black_square_button: JavaScript | :black_square_button: Vue.js |
| :white_check_mark: Mobile Web  | :black_square_button: Big Data | :white_check_mark: TypeScript | :white_check_mark: React |
| :white_check_mark: Responsive Web | :black_square_button: Blockchain | :black_square_button: C/C++ | :black_square_button: Angular |
| :black_square_button: Android App  | :black_square_button: IoT       | :black_square_button: C#        | :white_check_mark: Next.js |
| :black_square_button: iOS App      | :black_square_button: AR/VR/Metaverse | :white_check_mark: Python  | :white_check_mark: FastAPI |
| :black_square_button: Desktop App  | :black_square_button: Game     | :white_check_mark: Java    | :white_check_mark: Spring/Springboot |
|                              |                    | :black_square_button: Kotlin |                     |

<br/>

## 프로젝트 소개

- **프로젝트명**: 타로 서비스
- **서비스 특징**: 웹/모바일(웹 기술) 프로젝트를 위한 스켈레톤 및 AI 챗봇 기반 타로 상담 서비스
- **주요 기능**  
  - 회원 관리 (JWT, OAuth2)  
  - 실시간 채팅(WebSocket + Socket.IO)  
  - 음성 통화(WebRTC/미구현)  
  - AI 타로 상담 (RAG Pipeline)  
  - 다이어리(타로 결과 요약)  
- **참조 리소스**  
  - Upstage Embeddings, Pinecone, OpenAI API, Redis 등
- **배포 환경**  
  - URL 예시: `https://tarotvora.com` (AWS EC2 + Nginx + Docker Compose)  
  - 테스트 계정: 구글 로그인

---

## 팀 소개

- **민경훈**: 팀장, 백엔드 개발, 챗봇 개발
- **원기훈**: 기획 및 와이어프레임 작성, 프론트엔드 개발, 챗봇 개발
- **송경민**: 와이어프레임 작성, 프론트엔드 개발
- **김건일**: 프론트엔드 개발, Next.js
- **황예원**: 백엔드 개발 및 QA 담당
- **권서영**: 코드 리뷰 및 인프라 담당, CI/CD, HTTPS, Docker 구성

---

## 프로젝트 상세 설명

### 4.1 전체 기술 스택

- **프론트엔드**  
  - Next.js (React 기반, SSR/SSG 지원)  
  - Tailwind CSS, TypeScript(선택)  
  - WebRTC, WebSocket, Socket.IO 클라이언트  

- **백엔드**  
  - Java 17, Spring Boot 3.x  
  - Spring Security + OAuth2 (Google, Kakao)  
  - JPA(MySQL), QueryDSL  

- **RAG Pipeline**  
  - FastAPI (Python 3.12)  
  - Redis, Pinecone 벡터 DB, OpenAI API  
  - Upstage Embeddings  

- **인프라**  
  - AWS EC2(m5.xlarge), Route53, Elastic IP, ALB(선택)  
  - Docker & Docker Compose, Nginx Reverse Proxy  
  - Jenkins를 활용한 CI/CD (GitLab Webhook)  

<br/>

### 4.2 전체 시스템 구성도

```
사용자 브라우저
       |
(AWS Route53 - tarotvora.com)
       |
(AWS ALB or EC2 Elastic IP)
       |
     Nginx (Docker Container)
       |
       ├── Frontend (Next.js) :3000
       ├── Backend (Spring Boot) :8080
       ├── RAG Pipeline (FastAPI) :8000
       ├── MySQL :3306
       └── Redis :6379
```

- **Nginx** 에서 경로 기반 라우팅:  
  - `/` → Frontend  
  - `/api` → Backend  
  - `/rag` → RAG Pipeline  
- **Docker Compose**로 각 서비스(컨테이너) 실행  
- **MySQL**, **Redis** 등 DB/캐시 구성  

<br/>

### 4.3 아키텍처 개요

1. **프론트엔드 (Next.js)**  
   - 채팅 UI, 타로 카드 선택 UI, Google/Kakao OAuth2 로그인 등

2. **백엔드 (Spring Boot)**  
   - 회원 인증/인가(JWT, OAuth2)  
   - API (게시판, 리뷰, 커뮤니티, 기타 REST)  
   - DB(MySQL) 연동

3. **RAG Pipeline (FastAPI)**  
   - Chatbot 질의 처리  
   - Pinecone과 연동해 벡터 검색(유사 문서)  
   - OpenAI/Upstage API 호출로 AI 답변 생성  
   - Redis에 대화 로그 저장, Socket.IO를 통한 실시간 응답 스트리밍

---

### 4.4 주요 기능

- **회원 관리**  
  - 회원가입, 로그인, 로그아웃, 프로필 수정  
  - Google/Kakao OAuth2로 소셜 로그인  
  - JWT 토큰 기반 인증 (Refresh 토큰)

- **화상 미팅룸**  
  - WebRTC를 통해 1:1 또는 그룹 화상 채팅(미구현)
  - Socket.IO로 신호(offer, answer, ICE candidate) 교환

- **그룹 채팅 / 타로 상담**  
  - Socket.IO를 이용한 실시간 채팅  
  - 챗봇(타로 봇)과의 대화 시 RAG Pipeline 연동  
  - 메시지 저장/조회 (Redis + MySQL 조합)

- **AI 타로 상담 & 다이어리**  
  - RAG 기반(Upstage 임베딩 + Pinecone)으로 질문과 관련 높은 문맥을 찾고, OpenAI API로 응답 생성  
  - 타로 결과를 짧게 요약해 다이어리에 저장  
  - 특정 날짜에 대한 타로 점 기록을 다시 확인 가능

---

### 4.5 프로젝트 폴더 구조

```plaintext
S12P11A107/
├── README.md                # (본 문서) 최종 통합 README
├── frontend/                # Next.js 프론트엔드
│   ├── package.json
│   ├── src/
│   ├── public/
│   └── ...
├── backend/                 # Spring Boot 백엔드
│   ├── build.gradle
│   ├── src/
│   └── ...
├── rag_pipeline/            # FastAPI 기반 RAG
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── docker-compose.yml       # 전체 서비스 도커 컴포즈
├── nginx.conf               # Nginx reverse proxy 설정
├── Jenkinsfile              # CI/CD 파이프라인 스크립트
└── exec/                    # 포팅 가이드, 추가 배포 문서 등
    └── README.md
```

> **하위 디렉토리별 세부 README**:  
> - **frontend**/README.md  
> - **backend**/README.md  
> - **rag_pipeline**/README.md  
> - **exec**/README.md (포팅 가이드)

---

## 프론트엔드 (Next.js)

> **디렉토리**: `frontend/`  
>  
> Node.js(>=18.x), npm(>=9.x) 사용

### 주요 내용 (요약)

1. **Next.js 14 / React**  
   - 서버 사이드 렌더링(SSR) 및 정적 사이트 생성(SSG) 지원  
2. **핵심 기능**  
   - AI 타로 챗봇과 연동되는 채팅 화면  
   - 소셜 로그인 (Google, Kakao)  
   - 다이어리(채팅 세션 요약, 타로 결과 확인)  
3. **프로젝트 명령어** (`package.json`)  
   - `npm install` : 의존성 설치  
   - `npm run dev` : 개발 모드 실행 (http://localhost:3000)  
   - `npm run build` : 프로덕션 빌드  
   - `npm start` : 빌드된 결과 실행  
4. **주요 폴더 구조**  
   ```plaintext
   frontend/
   ├── public/
   │   ├── basic/     # 타로 카드 리소스
   │   ├── bots/      # 봇 이미지
   │   └── images/    # UI 이미지
   ├── src/
   │   ├── app/       # Next.js 라우팅 페이지
   │   ├── components/ # 공통 UI 컴포넌트
   │   ├── config/    # API url 등 설정
   │   ├── libs/      # API 호출 함수 모음
   │   └── ...
   └── ...
   ```

> 더 자세한 내용은 **[frontend/README.md](#)**(예: 실제 경로) 참고.

---

## 백엔드 (Spring Boot)

> **디렉토리**: `backend/`  
>  
> Java 17, Spring Boot 3.x, Gradle 8.x

### 주요 내용 (요약)

1. **AI Tarot Chatbot REST API**  
   - AI 상담(채팅) 시 필요한 사용자 정보, 세션 관리, OAuth2 로그인, JWT 인증, DB 연동  
2. **Spring Security + JWT + OAuth2**  
   - Google OAuth2, Kakao REST API 연동  
   - Access Token + Refresh Token 관리  
3. **JPA(MySQL), QueryDSL**  
   - MySQL 8.x, `ssafy_web_db` DB  
   - DB Migration은 직접 쿼리 or Flyway/Liquibase(선택)  
4. **주요 빌드/실행**  
   - `gradle clean build -x test` : 빌드  
   - 빌드 산출물 `build/libs/*.jar`  
5. **주요 폴더 구조**  
   ```plaintext
   backend/
   └── src/main/java/com/ssafy
       ├── api
       │   ├── controller  # 예: UserController, AuthController
       │   ├── request     # DTO: *Req
       │   └── response    # DTO: *Res
       ├── config          # SecurityConfig, SwaggerConfig 등
       ├── db
       │   ├── entity      # JPA Entity
       │   └── repository  # JpaRepository
       └── ...
   ```

> 더 자세한 내용은 **[backend/README.md](#)** 참고.

---

## RAG Pipeline (FastAPI)

> **디렉토리**: `rag_pipeline/`  
>  
> Python 3.12, FastAPI, Redis, Pinecone, OpenAI API 사용

### 주요 내용 (요약)

1. **RAG(Retrieval-Augmented Generation)**  
   - 사용자 입력 → 키워드/개체 추출(Upstage Embedding, NER 등) → Pinecone에서 유사 문맥 검색 → OpenAI API로 답변 생성  
   - Redis에 대화 기록 저장, Socket.IO로 실시간 스트리밍 응답  
2. **파일 구조**  
   ```plaintext
   rag_pipeline/
   ├── app/
   │   ├── main.py          # FastAPI + Socket.IO 진입점
   │   ├── services/        # pinecone_integration, rag_pipeline 등
   │   ├── utils/           # prompt_generation, response_utils 등
   │   └── core/settings.py # Pydantic BaseSettings (.env)
   ├── requirements.txt
   ├── Dockerfile
   └── ...
   ```
3. **실행**  
   - `pip install -r requirements.txt`  
   - `.env` 파일에 `OPENAI_API_KEY`, `UPSTAGE_API_KEY`, `REDIS_HOST`, `PINECONE_API_KEY` 등 설정 후,  
   - `uvicorn app.main:socket_app --host 0.0.0.0 --port 8000`

> 더 자세한 내용은 **[rag_pipeline/README.md](#)** 참고.

---

## 배포 및 포팅 가이드

> **디렉토리**: `exec/`  
>  
> 아래 내용은 `exec/README.md`(포팅 가이드)에서 발췌하였습니다.  
> AWS를 통해 배포 시 필요한 설정, CI/CD 파이프라인(Jenkinsfile), Docker Compose 구성, Nginx 설정 등이 담겨 있습니다.

### 1. 가입해야 하는 외부 서비스

- [Pinecone](https://www.pinecone.io/) → `PINECONE_API_KEY`, `PINECONE_ENV`  
- [Upstage](https://www.upstage.ai/) → `UPSTAGE_API_KEY`  
- [OpenAI](https://platform.openai.com/) → `OPENAI_API_KEY`  
- Google Cloud Console → OAuth2 Client ID/Secret  
- Kakao Developers → `KAKAO_API_KEY`

### 2. AWS 인프라 구성

- **EC2(m5.xlarge)**, **Docker, Docker Compose**, (선택) Jenkins  
- **Route53**로 도메인 관리 (예: `tarotvora.com`)  
- **보안 그룹**: 80,443,22 포트 등  
- **Elastic IP**, **Load Balancer**(HTTPS 처리) 등

### 3. Jenkins 파이프라인 설정

`Jenkinsfile` 개요:

1. **Checkout** → GitLab release2 브랜치  
2. **Create .env files** → Credentials로 API 키, DB PW, etc.  
3. **Detect Changes** → `git diff` 후 변경 디렉토리만 빌드  
4. **Local Build** → `docker-compose build`  
5. **Deploy** → `docker-compose up -d`  
6. **Cleanup** → `docker image prune`  

### 4. Docker Compose 구성

> **`docker-compose.yml`**

```yaml
services:
  nginx:
    image: nginx:1.25.3
    ...
    ports: ["80:80","443:443"]
    depends_on:
      - frontend
      - backend
      - rag_pipeline
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/nginx/ssl:/etc/nginx/ssl:ro

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    ...

  backend:
    build: ./backend
    ports: ["8080:8080"]
    env_file:
      - .env

  rag_pipeline:
    build: ./rag_pipeline
    ports: ["8000:8000"]
    env_file:
      - .env

  mysql:
    image: mysql:8.0.36
    ...

  redis:
    image: redis:7.2.3
    ...

volumes:
  mysql_data:
  redis_data:
```

### 5. Nginx Reverse Proxy

> **`nginx.conf`** 예시:

```nginx
http {
    upstream frontend_upstream { server frontend:3000; }
    upstream backend_upstream { server backend:8080; }
    upstream rag_pipeline_upstream { server rag_pipeline:8000; }

    server {
        listen 80;
        server_name tarotvora.com www.tarotvora.com ...;

        location / {
            proxy_pass http://frontend_upstream;
        }
        location /api/ {
            proxy_pass http://backend_upstream;
        }
        location /rag/ {
            rewrite ^/rag/(.*) /$1 break;
            proxy_pass http://rag_pipeline_upstream;
        }
        ...
    }
}
```

### 6. 배포 절차 요약

1. EC2에 SSH 접속 → `git pull`  
2. `.env` 파일 작성 (PINECONE, OPENAI, MySQL PW 등)  
3. `docker-compose build && docker-compose up -d`  
4. DNS(Route53) 또는 ELB 설정하여 `tarotvora.com` 도메인 연결  
5. 문제 발생 시 `docker logs`, `nginx.log` 확인

> 더 자세한 내용은 **[exec/README.md](#)** 참고.

---

## FAQ / 참고사항

1. **JWT 비밀키는 어디에 저장하나요?**  
   - Jenkins Credential이나 `.env` 파일 등 안전한 방법으로 주입하세요. `.gitignore`에 포함해 소스에 노출되지 않도록 합니다.

2. **RDS, ElastiCache 등 매니지드 서비스로 대체 가능한가요?**  
   - 예, 장기 운영 시 `MySQL` 대신 **AWS RDS**, `Redis` 대신 **ElastiCache**를 권장합니다.

3. **다중 봇(타로봇 2종 등)을 어떻게 관리하나요?**  
   - RAG Pipeline에서 Pinecone 인덱스를 봇별로 분리하여 운영할 수 있습니다. (예: `tarot-bot-jini`, `tarot-bot-bumdal`)

4. **로그인 Redirect 주소(Front/Back) 충돌 문제**  
   - Google OAuth 설정 시, `https://tarotvora.com/oauth2/authorization/google` 등 리다이렉트 URI를 정확히 등록해야 합니다.

5. **자주 발생하는 에러**  
   - **CORS 에러**: Nginx 또는 Spring Security에서 CORS 정책 조정  
   - **도커 환경 변수 인식 안 됨**: `env_file` 설정을 확인하고, Jenkins 파이프라인의 `.env` 생성 로직도 점검  
   - **포트 충돌**: EC2에서 동일 포트를 이미 사용 중일 때, `docker-compose down`으로 정리 후 재시도

---

## 마무리

본 **README.md**는 다음 내용을 통합했습니다.

- **Frontend/Backend/RAG Pipeline 하위 README** 주요 요약  
- **exec/README (포팅 가이드)**의 AWS, Jenkins, Docker Compose, Nginx 설정 등  

프로젝트 협업 시, 각각의 하위 디렉토리(`frontend`, `backend`, `rag_pipeline`)에 존재하는 **세부 README**를 함께 참고하시면 개발 및 배포 과정을 빠르게 이해할 수 있습니다.

> **문의 / 피드백**:  
> - GitLab Issues 혹은 Wiki를 통해 문의해주세요.  
> - 이메일: lasnier@naver.com

---
끝.  
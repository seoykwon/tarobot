# Gitlab 소스 클론 이후 빌드 및 배포할 수 있도록 정리한 문서

## 사용한 JVM, 웹서버, WAS 제품 등의 종류와 설정 값, 버전 (IDE 버전 포함) 기재
**BACKEND**   
[JVM]     
- 종류: OpenJDK    
- 버전: 17    
- 설정: UTF-8 인코딩 (LANG=C.UTF-8, LC_ALL=C.UTF-8)    

[웹서버]    
- 종류: Nginx    
- 포트 매핑: 80 → 8080   

[WAS]   
- 종류: Spring Boot 내장 Tomcat   
- 버전: 10.1.x (Spring Boot 3.2.12 기준)   
- 포트: 8080  

[빌드 및 개발 환경]   
- 빌드 도구: Gradle 8.3  
- IDE: Visual Studio Code (VSCode)  
- 주요 플러그인: Spring Boot Gradle Plugin (3.2.12), SonarQube (3.5.0.2730)  
- 자바 버전: 17  
- 테스트 제외 빌드 설정: gradle clean build -x test  

[주요 의존성]  
- QueryDSL: 5.0.0  
- Lombok: 1.18.28  
- Swagger: springdoc-openapi-starter-webmvc-ui 2.3.0  
- Webflux: Spring Webflux Starter  
- Guava: 31.1-jre  
- JWT: java-jwt 3.19.2  

**FRONTEND**
[Node.js]  
종류: Node.js  
버전: 18 (node:18-alpine)  

[프레임워크]  
종류: Next.js  
버전: 14.2.23  
포트: 8020 (npm run start)  

[라이브러리 및 주요 의존성]  
React: 18  
React DOM: 18  
Tailwind CSS: 3.4.1  
Framer Motion: 12.1.0  
React Hook Form: 7.54.2  
Zod: 3.24.1  
Axios: 1.7.9  
Lucide React: 0.473.0  
Class Variance Authority: 0.7.1  
Sonner: 1.7.4  
HTML2Canvas: 1.4.1  
JS-Cookie: 3.0.5  

[빌드 및 개발 환경]  
빌드 도구: npm (npm run build)  
IDE: Visual Studio Code (VSCode)  
테스트 도구: Jest 29.7.0 (jest-sonar-reporter 2.0.0 사용)  
ESLint: 8 (eslint-config-next 14.2.23)  
TypeScript: 5  
이미지 설정: images.domains에 tarotvora.com 허용  

[Docker 설정]
베이스 이미지: node:18-alpine  
작업 디렉토리: /app  
설치 명령어: npm install --omit=dev  
빌드 명령어: npm run build  
실행 명령어: npm run start (8020 포트)  

[웹서버]
종류: Nginx  
포트 매핑: 80 → 8020   

**RAG_PIPELINE**   
[Python]  
종류: Python  
버전: 3.12 (python:3.12-slim)  

[프레임워크]  
종류: FastAPI  
버전: 0.115.7  
실행 명령어: uvicorn app.main:socket_app --host 0.0.0.0 --port 8000  
포트: 8000  

[라이브러리 및 주요 의존성]  
FastAPI-SocketIO: 0.0.10  
Uvicorn: 0.34.0  
Langchain: 0.3.17  
Langchain-OpenAI: 0.3.3  
Langchain-Pinecone: 0.2.0  
Pinecone Client: 5.0.1  
OpenAI: 1.60.2  
SQLAlchemy: 2.0.37  
Redis: 5.2.1  
Orjson: 3.10.15  
Requests: 2.32.3  
Numpy: 1.26.4  
Pydantic: 2.10.6  
Starlette: 0.45.3  

[빌드 및 개발 환경]  
빌드 도구: pip (pip install --no-cache-dir -r requirements.txt)  
IDE: Visual Studio Code (VSCode)  
작업 디렉토리: /app  
테스트 도구: (별도 테스트 도구 미정, 필요 시 언급 가능)  

[Docker 설정]
베이스 이미지: python:3.12-slim  
작업 디렉토리: /app  
의존성 설치: pip install --no-cache-dir -r requirements.txt  
실행 명령어: uvicorn app.main:socket_app --host 0.0.0.0 --port 8000  
포트 설정: EXPOSE 8000  

[웹서버]  
종류: Nginx  
포트 매핑: 80 → 8000     

## 빌드 시 사용되는 환경 변수 등의 내용 상세 기재 
**[환경 변수]**
*MYSQL_PW*  
설명: MySQL 비밀번호 (Jenkins Credentials 사용)  
설정: credentials('MYSQL_PW')   

*GOOGLE_CLIENT_ID*  
설명: Google Client ID (Jenkins Credentials 사용)  
설정: credentials('GOOGLE_CLIENT_ID')  

*GOOGLE_CLIENT_SECRET*  
설명: Google Client Secret (Jenkins Credentials 사용)  
설정: credentials('GOOGLE_CLIENT_SECRET')  

*FASTAPI_URL*
설명: FastAPI 서비스 URL  
설정: http://rag_pipeline:8000  

*PINECONE_API_KEY*  
설명: Pinecone API Key (Jenkins Credentials 사용)  
설정: credentials('PINECONE_API_KEY')  

*UPSTAGE_API_KEY*  
설명: Upstage API Key (Jenkins Credentials 사용)  
설정: credentials('UPSTAGE_API_KEY')  

*OPENAI_API_KEY*  
설명: OpenAI API Key (Jenkins Credentials 사용)  
설정: credentials('OPENAI_API_KEY')  

*KAKAO_API_KEY*  
설명: Kakao API Key (Jenkins Credentials 사용)  
설정: credentials('KAKAO_API_KEY')  

*GITLAB_ACCESS_TOKEN*  
설명: GitLab Access Token (Webhook 인증용, Jenkins Credentials 사용)  
설정: credentials('GITLAB_ACCESS_TOKEN')  

**[.env 파일 생성 단계]**  
백엔드/레거시용 .env 파일:  
MYSQL_PW=$MYSQL_PW  
GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID  
GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET  
FASTAPI_URL=https://tarotvora.com/rag  
PINECONE_API_KEY=$PINECONE_API_KEY  
UPSTAGE_API_KEY=$UPSTAGE_API_KEY  
OPENAI_API_KEY=$OPENAI_API_KEY  
PINECONE_ENV=us-east1-gcp  
REDIS_HOST=redis  
REDIS_PORT=6379  
프런트엔드 Next.js용 .env 파일:  
NEXT_PUBLIC_API_BASE_URL=https://tarotvora.com  
NEXT_PUBLIC_FASTAPI_BASE_URL=https://tarotvora.com/rag  
NEXT_PUBLIC_KAKAO_API_KEY=$KAKAO_API_KEY  

**[배포 단계 및 Docker 관련 명령어]**
로컬 빌드:  
docker-compose build <service>  
프런트엔드 (frontend), 백엔드 (backend), 레그 파이프라인 (rag_pipeline) 서비스 중 변경된 서비스만 빌드  

배포:  
docker-compose down || true  
docker-compose up -d  
Docker Compose를 사용하여 컨테이너를 재시작  

오래된 Docker 이미지 정리:  
docker image prune -a --filter "until=168h" -f || true  
최근 7일을 제외한 오래된 Docker 이미지를 정리  

## 배포 시 특이사항 기재
개인 EC2를 파서 작업함   

## DB 접속 정보 등 프로젝트 (ERD)에 활용되는 주요 계정 및 프로퍼티가 정의된 파일 목록
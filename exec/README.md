# 포팅 가이드 (README)

## 목차
1. **프로젝트 개요**
2. **사전 준비사항**
   - 2.1 가입해야 하는 외부 서비스
   - 2.2 AWS 인프라 구성
3. **전체 시스템 구성도**
4. **Jenkins 파이프라인 설정**
5. **Docker Compose 구성**
   - 5.1 `docker-compose.yml` 설명
   - 5.2 Nginx 설정
6. **각 서비스별 Dockerfile**
   - 6.1 Frontend (Next.js)
   - 6.2 Backend (Spring Boot)
   - 6.3 RAG Pipeline (FastAPI)
7. **배포 및 실행 방법**
8. **기타 참고사항**

---

## 1. 프로젝트 개요
이 프로젝트는 **Next.js** 프론트엔드, **Spring Boot** 백엔드, **FastAPI 기반 RAG(Retrieval-Augmented Generation) 파이프라인**으로 구성되어 있습니다.  
**Pinecone**, **Upstage**, **OpenAI** 등의 API 키가 필요하며, **Google OAuth**, **Kakao API** 등을 통한 소셜 로그인이 지원됩니다.  
AWS의 **EC2(m5.xlarge)**를 사용해 서버를 호스팅하고, **Route53**으로 도메인을 관리하며, **Elastic IP**와 **Load Balancer(예: ALB)**를 통해 외부 트래픽을 처리합니다.

---

## 2. 사전 준비사항

### 2.1 가입해야 하는 외부 서비스

1. **[Pinecone](https://www.pinecone.io/)**
   - 프로젝트에서 벡터 DB로 Pinecone을 사용합니다.
   - 가입 후 발급받은 API 키를 `/rag_pipeline/.env` 파일의 `PINECONE_API_KEY`에 설정합니다.
   - DB 서버의 리전에 따라 `PINECONE_ENV=us-east-1` 등으로 지정합니다.

2. **[Upstage](https://www.upstage.ai/)**
   - Upstage API를 사용합니다.
   - 가입 후 발급받은 API 키를 `/rag_pipeline/.env` 파일의 `UPSTAGE_API_KEY`에 설정합니다.

3. **[OpenAI](https://platform.openai.com/)**
   - OpenAI API를 사용합니다.
   - 가입 후 발급받은 API 키를 `/rag_pipeline/.env` 파일의 `OPENAI_API_KEY`에 설정합니다.

4. **Google OAuth**
   - Google API Console에서 OAuth 클라이언트를 등록하고, **Client ID**와 **Client Secret**을 발급받습니다.
   - Jenkins 파이프라인 내 `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` 등으로 설정하거나, 백엔드/프론트엔드 설정에 사용합니다.

5. **Kakao API**
   - Kakao Developers에서 앱을 생성하고 REST API 키를 발급받습니다.
   - `KAKAO_API_KEY` 환경 변수로 설정합니다(프론트엔드에서 공개적으로 사용될 수도 있으므로 주의).

### 2.2 AWS 인프라 구성

1. **EC2 인스턴스**  
   - 사양: `m5.xlarge`  
   - Docker, Docker Compose, Jenkins(선택) 등을 설치해서 사용합니다.

2. **Route53**  
   - 보유 도메인을 Route53에 연결하여 DNS를 관리합니다.
   - 예: `tarotvora.com`을 `EC2` 또는 **AWS ALB**와 연동합니다.

3. **보안 그룹(Security Group)**  
   - HTTP(80), HTTPS(443), SSH(22) 등 필요한 포트를 열어 둡니다.
   - 내부적으로 Docker Compose 컨테이너 간 통신을 위해 EC2 내부 포트는 자유롭게 사용합니다.

4. **Elastic IP**  
   - EC2에 고정 퍼블릭 IP를 할당해 도메인과 연결하거나, ALB를 사용할 경우 ALB가 트래픽을 받아 EC2로 전달하도록 설정합니다.

5. **Load Balancer(ALB or Classic ELB)**  
   - HTTPS(443) 처리 혹은 SSL 인증서를 적용하고, 내부적으로 EC2의 80 포트로 트래픽을 포워딩하도록 설정할 수 있습니다.
   - Nginx에서 SSL을 직접 처리할 수도 있고(ALB 없이 EC2에서 TLS), ALB에서 처리한 뒤 80 포트로 넘기는 방식도 가능합니다.

---

## 3. 전체 시스템 구성도

```
사용자 브라우저
       |
(AWS Route53 - tarotvora.com)
       |
(AWS ALB or EC2의 Elastic IP)
       |
     Nginx (Docker Container)
       |
       +-- Frontend (Next.js) :3000
       |
       +-- Backend (Spring Boot) :8080
       |
       +-- RAG Pipeline (FastAPI) :8000
       |
       +-- MySQL :3306
       |
       +-- Redis :6379
```

- **Nginx**가 80/443 포트를 Listen하며 요청 경로에 따라 프론트엔드, 백엔드, RAG Pipeline으로 트래픽을 라우팅합니다.  
- **Docker Compose**로 여러 컨테이너를 한꺼번에 관리합니다.

---

## 4. Jenkins 파이프라인 설정

`Jenkinsfile`(위에 첨부된 pipeline 코드)에는 다음과 같은 주요 단계가 있습니다:

1. **Checkout**  
   - GitLab (예: `https://lab.ssafy.com/...`) 저장소에서 release2 브랜치를 체크아웃

2. **Create .env files**  
   - Jenkins Credentials를 통해 환경 변수를 불러와 `.env` 파일과 `frontend/.env` 파일 생성
   - 예: `MYSQL_PW`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FASTAPI_URL`, `PINECONE_API_KEY`, `UPSTAGE_API_KEY`, `OPENAI_API_KEY`, `KAKAO_API_KEY` 등

3. **Detect Changes**  
   - `git diff`로 변경된 디렉토리를 추적하여 **frontend**, **backend**, **rag_pipeline** 세 서비스 중 변경된 부분만 다시 빌드

4. **Local Build**  
   - Docker Compose를 사용, 변경된 서비스만 `docker-compose build` 실행

5. **Deploy with Docker Compose**  
   - 구동 중인 컨테이너를 중단(`docker-compose down`) 후 새로 빌드된 이미지를 기반으로 컨테이너 실행(`docker-compose up -d`)

6. **Cleanup old Docker images**  
   - 오래된 도커 이미지 정리(`docker image prune -a --filter "until=168h" -f`)

Jenkins 서버가 EC2와 동일하게 Docker를 구동할 수 있도록 설정되어 있어야 하며, 반드시 Jenkins가 **Docker 권한**(소켓 접근 등)을 가지고 있어야 합니다.

---

## 5. Docker Compose 구성

### 5.1 `docker-compose.yml` 설명

```yaml
services:
  nginx:
    image: nginx:1.25.3
    container_name: nginx
    restart: always
    # HTTP 80, HTTPS 443
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
      - rag_pipeline
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/nginx/ssl:/etc/nginx/ssl:ro  # SSL 인증서가 있다면 마운트

  frontend:
    build: ./frontend
    container_name: frontend
    restart: always
    ports:
      - "3000:3000"
    # Jenkinsfile에서 생성된 frontend/.env 파일을 COPY해서 빌드시 사용

  backend:
    build: ./backend
    container_name: backend
    restart: always
    depends_on:
      - mysql
    ports:
      - "8080:8080"
    env_file:
      - .env

  rag_pipeline:
    build: ./rag_pipeline
    container_name: rag_pipeline
    restart: always
    depends_on:
      - redis
    ports:
      - "8000:8000"
    env_file:
      - .env

  mysql:
    image: mysql:8.0.36
    container_name: mysql
    restart: always
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=ssafy_web_db
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7.2.3
    container_name: redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:
```

- **nginx**: 80/443 포트를 열고, `nginx.conf` 파일을 마운트하여 라우팅 설정을 제공합니다.  
- **frontend**: Next.js 앱을 3000 포트로 구동합니다.  
- **backend**: Spring Boot 앱을 8080 포트로 구동합니다.  
- **rag_pipeline**: FastAPI 앱을 8000 포트로 구동합니다.  
- **mysql**: MySQL 8.0 컨테이너, `mysql_data` 볼륨을 사용합니다.  
- **redis**: Redis 7.2 컨테이너, `redis_data` 볼륨을 사용합니다.

### 5.2 Nginx 설정

아래는 `nginx.conf`의 예시입니다.  
`upstream` 섹션에서 Docker Compose의 컨테이너 이름과 포트를 명시하고, 요청 경로에 따라 `proxy_pass`를 다르게 지정합니다.

```nginx
user  nginx;
worker_processes auto;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log main;
    error_log   /var/log/nginx/error.log warn;

    sendfile        on;
    keepalive_timeout  65;

    # ---------------------------
    # 업스트림 서버 정의
    # ---------------------------
    upstream frontend_upstream {
        server frontend:3000;
    }
    upstream backend_upstream {
        server backend:8080;
    }
    upstream rag_pipeline_upstream {
        server rag_pipeline:8000;
    }

    server {
        listen 80;
        server_name tarotvora.com www.tarotvora.com ec2-xxx-xxx-xxx-xxx.ap-northeast-2.compute.amazonaws.com;

        # CORS 헤더 설정(필요 시)
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Credentials "true" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
        add_header Access-Control-Expose-Headers "ChatTag" always;

        # 1) Next.js 프론트엔드
        location / {
            proxy_pass http://frontend_upstream;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # 2) Spring Boot API
        location /api/v1/ {
            proxy_pass http://backend_upstream;
            ...
        }
        location /api/review/ {
            proxy_pass http://backend_upstream;
            ...
        }
        location /api/ {
            rewrite ^/api/(.*) /api/v1/$1 break;
            proxy_pass http://backend_upstream;
            ...
        }
        location /community/ {
            proxy_pass http://backend_upstream;
            ...
        }

        # 3) RAG 파이프라인 (FastAPI)
        location /rag/ {
            rewrite ^/rag/(.*) /$1 break;
            proxy_pass http://rag_pipeline_upstream;
            ...
        }
        location /socket.io/ {
            proxy_pass http://rag_pipeline_upstream;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            ...
        }

        # 4) OAuth2 (Spring Security)
        location /oauth2/ {
            proxy_pass http://backend_upstream;
            ...
        }
        location /login/ {
            proxy_pass http://backend_upstream;
            ...
        }

        # 5) Spring Boot static 리소스
        location /googleLogin.html {
            proxy_pass http://backend_upstream/googleLogin.html;
            ...
        }
    }
}
```

- HTTPS로 운영할 경우, `listen 443 ssl;` 블록과 SSL 인증서 경로(`ssl_certificate`, `ssl_certificate_key`)를 추가하거나, **AWS ALB**에서 HTTPS를 처리하도록 구성합니다.

---

## 6. 각 서비스별 Dockerfile

### 6.1 Frontend (Next.js)

```dockerfile
# Node.js 18 (Alpine)
FROM node:18-alpine

WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm install

# 전체 소스 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 6.2 Backend (Spring Boot)

```dockerfile
# ---- 1단계: Gradle 빌드 ----
FROM gradle:8.3-jdk17 AS build
WORKDIR /app
COPY . .
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

RUN echo "tasks.withType(JavaCompile) { options.encoding = 'UTF-8' }" >> build.gradle
RUN gradle clean build -x test  # JAR 생성

# ---- 2단계: 실제 런타임 ----
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 6.3 RAG Pipeline (FastAPI)

```dockerfile
# Python 3.12 slim
FROM python:3.12-slim

WORKDIR /app

# 의존성
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 소스 복사
COPY . .

EXPOSE 8000

ENTRYPOINT ["uvicorn", "app.main:socket_app", "--host", "0.0.0.0", "--port", "8000"]
```

---

## 7. 배포 및 실행 방법

1. **AWS EC2 접속**  
   - SSH로 접속, `git`, `docker`, `docker-compose`, `jenkins`(선택) 등을 설치합니다.

2. **소스 코드 받기**  
   - Jenkins를 사용 중이라면, Jenkins 파이프라인에서 자동으로 `git pull` 하도록 구성합니다.  
   - 수동이라면 `git clone <repo>` 또는 `git pull`.

3. **환경 변수 설정**  
   - Pinecone, Upstage, OpenAI, Google OAuth, Kakao, MySQL 등 필요한 값들을 `.env` 또는 Jenkins Credentials로 지정합니다.
   - 예:
     ```
     PINECONE_API_KEY=xxxx
     OPENAI_API_KEY=xxxx
     ...
     ```

4. **Docker 빌드 & 실행**  
   - (Jenkins 자동) 또는 수동으로 `docker-compose build` 후 `docker-compose up -d`

5. **Nginx 및 SSL 설정**  
   - `nginx.conf`를 확인하고, 필요하다면 `/etc/nginx/ssl` 경로에 인증서(기존 인증서) 등을 배치합니다.
   - AWS ALB를 사용한다면 ALB 설정에서 HTTPS 인증서를 설정하고 Target Group으로 EC2:80(HTTP)을 연결합니다.

6. **배포 완료 후 점검**  
   - `http://도메인`(예: `http://tarotvora.com`)으로 접속하여 화면이 정상 출력되는지 확인합니다.

---

## 8. 기타 참고사항

- **보안그룹**: 80, 443 포트는 외부 공개로 설정. SSH(22)는 운영팀 IP만 열어두는 것이 안전합니다.  
- **도메인**: Route53에서 `tarotvora.com` 레코드를 생성할 때, **ALB** 또는 **EC2 Elastic IP**를 할당합니다.  
- **로그 확인**: 
  - Nginx 로그: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`  
  - 각 Docker 컨테이너 로그: `docker logs <container_name>`  
- **프론트엔드 환경 변수**: `frontend/.env`에 `NEXT_PUBLIC_` 접두사가 붙은 변수를 사용하면 클라이언트 사이드에서도 노출되므로 민감 정보는 넣지 않도록 주의합니다.  
- **장기 운영 시**: MySQL, Redis 데이터가 계속 축적되므로 EBS 볼륨(또는 RDS, ElastiCache) 사용을 검토합니다.

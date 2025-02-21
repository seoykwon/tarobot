# 🃏 AI Tarot Chatbot REST API (Spring Boot & Security)

## 📌 프로젝트 개요

이 프로젝트는 **Spring Boot 3 & Spring Security 기반**의 RESTful API로, **AI 챗봇을 통해 타로를 봐주는 서비스**를 제공합니다.
사용자는 채팅을 통해 타로 상담을 받을 수 있으며, 챗봇이 사용자의 질문을 분석하고 AI 모델을 활용하여 타로 카드를 기반으로 응답을 생성합니다.

## 📂 기술 스택

- **Backend**: Java 17, Spring Boot 3.2.12, Spring Security, Gradle 8.3
- **Database**: MySQL, JPA (Hibernate), QueryDSL
- **Security**: JWT, OAuth2, Spring Security
- **API Docs**: Swagger (SpringDoc OpenAPI 2.3)
- **CI/CD**: SonarQube 코드 품질 분석, Gradle 빌드 자동화

---

<!-- 필수 항목 -->

## 🛠️ 개발 환경 구성

Windows 기준 개발 환경 구성 설명

1. OpenJDK 설치
   1. 17 LTS 설치 파일 다운로드 및 실행
      - https://adoptium.net/temurin/releases/?package=jdk&version=17
   2. 설치 후 명령 프롬프트(cmd) 확인
      ```
      > java -version
      ```
      출력 예)
      ```
      openjdk version "17.0.11" 2024-04-16
      OpenJDK Runtime Environment Temurin-17.0.11+9 (build 17.0.11+9)
      OpenJDK 64-Bit Server VM Temurin-17.0.11+9 (build 17.0.11+9, mixed mode, sharing)
      ```

2. 데이터베이스 구성 *(이미 설치되어 있거나 원격 DB를 사용하는 경우 설치 부분 생략)*
   1. MySQL 다운로드 사이트에서 Community 설치 파일 다운로드 및 실행
      - https://dev.mysql.com/downloads/installer/
   2. MySQL Server, MySQL Shell을 포함하여 설치
   3. DB 및 계정 생성
      - MySQL Shell 실행
         ```
         MySQL  JS > \connect root@localhost
         MySQL  localhost:3306  JS > \sql
         ```
      - DB 생성
         ```sql
         create database IF NOT EXISTS `ssafy_web_db` collate utf8mb4_general_ci;
         ```
      - User 생성
         ```sql
         create user '사용자계정'@'localhost' identified by '비밀번호';
         grant all privileges on ssafy_web_db.* to 'ssafy'@'localhost';
         flush privileges;
         ```
   
3. IDE 설치
   1. JetBrains 공식 사이트에서 IntelliJ IDE Community Edition 설치 파일 다운로드 및 실행
      - https://www.jetbrains.com/ko-kr/idea/download
   
4. 코드 다운로드 및 실행

   1. 프로젝트 다운로드
      ```
      git clone <repo URL>
      ```

   2. IntelliJ의 [File] - [Open]에서 backend 폴더 선택 후 [OK]
    
   3. src/main/resources/application.properties 수정
   
      ```properties
      spring.datasource.hikari.username=<사용자 계정>
      ```
   
   4. root 디렉토리에 .env 파일 작성

      ```properties
      MYSQL_PW=<MySQL 비밀번호>
      GOOGLE_CLIENT_ID=<구글 OAuth2 클라이언트 아이디>
      GOOGLE_CLIENT_SECRET=<구글 OAuth2 클라이언트 시크릿 키>
      FASTAPI_URL=<FastAPI 서버 주소>
      ```

   5. [Gradle Tasks] 탭의 [Run Gradle Tasks] 선택하여 실행

---

### 📂 프로젝트 패키지 구조

```plaintext
.
┗━ main
    ┣━ 📦 java.com.ssafy
    ┃   ┣━ 📂 api
    ┃   ┃   ┣━ 📂 controller       # REST API 컨트롤러 (User, Auth, Chat, TarotBot 등)
    ┃   ┃   ┣━ 📂 request       # Request DTO 객체 (UserRegisterReq, DiaryUpdateReq, ChatCloseReq 등)
    ┃   ┃   ┣━ 📂 response       # Response DTO 객체 (UserProfileRes, DiaryRes, ChatSummaryRes 등)  
    ┃   ┃   ┗━ 📂 service          # 비즈니스 로직 (ChatService, TokenService 등)
    ┃   ┣━ 📂 common
    ┃   ┃   ┣━ 📂 auth          # Spring Security 설정 및 JWT 필터 (JwtAuthenticationFilter 등)
    ┃   ┃   ┗━ 📂 util          # 유틸리티 (CookieUtil, SecurityUtil, JwtTokenUtil 등)
    ┃   ┣━ 📂 config            # config 파일 (SecurityConfig, SwaggerConfig, JpaConfig 등)
    ┃   ┃   ┗━ 📂 oauth          # OAuth2 config (UserCustomService, Successhandler 등)
    ┃   ┣━ 📂 db
    ┃   ┃   ┣━ 📂 entity            # JPA 엔티티 정의
    ┃   ┃   ┗━ 📂 repository       # DB 접근 계층
    ┃   ┗━ 📜 GroupCallApplication.java   # Spring Boot 메인 애플리케이션
    ┃
    ┗━ 📦 resources
        ┣━ 📄 README.md
        ┗━ ⚙️ application.properties
```

---

## 🔥 주요 기능

### 🃏 AI 타로 챗봇 기능

- **사용자 질문 분석**: 사용자가 입력한 텍스트를 기반으로 AI 모델이 질문을 분류
- **타로 카드 선택 및 해석**: AI가 적절한 타로 카드를 뽑고, 카드의 의미를 분석하여 사용자에게 해석 제공
- **채팅 세션 관리**: 사용자의 세션을 유지하여 대화 이력을 저장 및 분석 가능
- **요약 기능**: 상담이 종료되면 요약된 상담 결과를 다이어리(Diary)로 저장
- **FastAPI 연동**: WebClient를 활용하여 비동기 API 호출

### 🔐 Spring Security 기반 인증/인가

- **JWT 기반 로그인/인증**: JWT(JSON Web Token)를 이용한 인증 및 액세스 제어
- **OAuth2 로그인 지원**: Google OAuth2를 통한 소셜 로그인
- **리프레시 토큰**: 액세스 토큰 만료 시 리프레시 토큰을 이용하여 자동 재발급
- **사용자 역할(Role) 기반 접근 제어**: 일반 사용자(User)와 관리자(Admin)의 접근 권한을 분리
- **JwtTokenUtil**을 활용한 토큰 검증 및 발급

### 📊 API 문서화

- **Swagger UI 제공** (`/swagger-ui.html`)
- **SpringDoc OpenAPI 3**를 활용한 API 명세 자동 생성

---

## 📌 아키텍처 구조

아래 다이어그램은 **AI 타로 챗봇 API**의 핵심 흐름을 나타냅니다.

```plaintext
[Client (React)] <-> [Spring Boot Backend] <-> [FastAPI AI 모델]

(1) 사용자가 채팅 입력  ---> (2) Spring Boot API 수신
      ⬆                                   ⬇
(5) 챗봇 응답 렌더링  <--- (4) FastAPI AI 응답
```

## ⚙️ **Spring Security & JWT 인증 흐름**

```plaintext
[로그인 요청] → [Spring Security] → [JWT 발급] → [클라이언트 저장]
                            ↓
[API 요청 시] → [JWT 검증] → [UserDetailsService에서 사용자 정보 로드]
                            ↓
[인가 처리] → [권한 체크 후 API 응답]
```

### 🔑 JWT 인증 방식

1. **사용자가 로그인 요청** (`/api/v1/auth/login`)
2. **Spring Security가 비밀번호 검증 후 JWT 발급**
3. **Access Token & Refresh Token을 쿠키에 저장**
4. **모든 API 요청 시 Access Token을 이용한 인증 진행**
5. **토큰이 만료되면 Refresh Token을 사용하여 자동 재발급**
6. **JwtTokenUtil을 사용하여 토큰 검증**

---

## 🔨 Gradle 설정

**`build.gradle` 주요 라이브러리**

```gradle
// Spring Boot & Security
implementation 'org.springframework.boot:spring-boot-starter-security'
implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'

// JWT & OAuth
implementation 'com.auth0:java-jwt:3.19.2'
implementation 'jakarta.persistence:jakarta.persistence-api:3.1.0'
annotationProcessor 'org.projectlombok:lombok:1.18.28'
```

---

## 📄 API 문서 (Swagger)

### 🔗 [Swagger UI 접속](http://localhost:8080/swagger-ui.html)

API 테스트 및 명세 확인을 위해 Swagger UI를 제공합니다.

---

## 🚀 TODO & 추가 개선 사항

✅ Security 설정 파일 추가 (`JwtTokenUtil.java` 포함)
✅ ChatService 관련 상세 로직 문서화
✅ FastAPI 모델 연결 방식 상세 설명 추가
✅ CI/CD 파이프라인 구성 방법 문서화

---

## ✉️ Contact

문의사항이나 피드백이 있다면 언제든지 연락 주세요! 😊

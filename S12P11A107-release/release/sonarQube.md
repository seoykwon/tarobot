### **📌 README.md (SonarQube & GitLab Runner CI/CD 설정)**  

# **SonarQube & GitLab Runner CI/CD 설정**

## **🚀 프로젝트 개요**
이 프로젝트는 **GitLab CI/CD를 활용하여 SonarQube를 이용한 정적 코드 분석을 자동화**하는 설정을 포함합니다.  
SonarQube 서버(`sonarqube.ssafy.com`)를 활용하여 **FastAPI (Python), Next.js (Node.js), Spring Boot (Java)** 세 가지 환경에서 코드 품질을 지속적으로 점검합니다.

## **📌 구현 내용**
### **1️⃣ SonarQube 설정**
- 정적 분석 서비스 및 **SonarQube 토큰**은 **`sonarqube.ssafy.com`**에서 제공됩니다.
- 해당 **SonarQube 환경 변수 및 URL은 GitLab CI/CD의 `Variables`에 등록**해야 합니다.
  - `SONAR_PROJECT_KEY`
  - `SONAR_HOST_URL`
  - `SONAR_TOKEN`
- GitLab CI/CD 파이프라인이 실행될 때 자동으로 SonarQube 분석이 수행됩니다.

---

### **2️⃣ GitLab Runner 구성**
#### **✅ EC2 서버에 GitLab Runner 설치**
- 제공된 EC2 서버에 **Docker 기반 GitLab Runner**를 설치 및 실행했습니다.
- EC2 서버의 쓰기 제한 문제로 인해 **GitLab Runner를 `/home/ubuntu/gitlab-runner` 경로에서 실행**했습니다.
- 내부 소켓(`docker.sock`)을 사용하여 **GitLab Runner를 3개(각각 FastAPI, Next.js, Spring Boot)를 설정**했습니다.
- GitLab에서 **Runner를 생성 후 토큰을 발급받아 3개 모두 등록**했습니다.

#### **✅ 실행 중인 GitLab Runner 목록**
| Runner | 설명 | 태그 |
|--------|------|------|
| `nextjs-runner` | Next.js (Node.js 18) | `nextjs` |
| `fastapi-runner` | FastAPI (Python 3.12) | `fastapi` |
| `springboot-runner` | Spring Boot (Gradle 8.3 + JDK 17) | `springboot` |

**⚠️ 유효기간:**  
- 각 러너의 유효기간은 **2025년 2월 11일부터 30일간**입니다.  
- 만료 후 GitLab에서 **새로운 토큰을 발급받아 다시 등록할 수 있습니다.**

---

### **3️⃣ `.gitlab-ci.yml` 및 CI/CD 설정**
- **루트 디렉토리에 위치한 `.gitlab-ci.yml`을 기반으로 CI/CD 파이프라인을 실행**합니다.
- CI/CD는 **각 서비스(FastAPI, Next.js, Spring Boot)의 코드가 변경될 때만 실행**됩니다.
- **`sonar.qualitygate.wait=true`를 설정하여 SonarQube 품질 기준을 자동으로 검사**합니다.

#### **✅ GitLab CI/CD 주요 설정**
- GitLab CI/CD에서 `GIT_DEPTH: 0`을 설정하여 SonarQube 분석 시 Git blame 정보를 올바르게 가져올 수 있도록 구성.
- `allow_failure: true`를 설정하여 SonarQube 품질 기준을 만족하지 않더라도 Job이 강제 중단되지 않도록 설정.
- `before_script`에서 각 환경에 맞는 SonarQube CLI를 자동으로 설치하도록 구성.

---

## **📌 CI/CD 실행 방법**
### **1️⃣ GitLab CI/CD 환경 변수 등록**
GitLab **`Settings → CI/CD → Variables`** 에서 다음 환경 변수를 등록합니다.

| 변수 이름 | 설명 |
|----------|------|
| `SONAR_PROJECT_KEY` | SonarQube에서 제공하는 프로젝트 키 |
| `SONAR_HOST_URL` | SonarQube 서버 URL (`https://sonarqube.ssafy.com`) |
| `SONAR_TOKEN` | SonarQube에서 제공하는 인증 토큰 |

---

### **2️⃣ GitLab CI/CD 실행**
GitLab 저장소에 `.gitlab-ci.yml`이 추가된 후, 변경 사항을 커밋하여 푸시하면 자동으로 CI/CD 파이프라인이 실행됩니다.

```bash
git add .gitlab-ci.yml
git commit -m "Add GitLab CI/CD configuration"
git push origin main
```

GitLab **`CI/CD > Pipelines`** 에서 실행되는지 확인할 수 있습니다.

---

## **📌 참고 사항**
- GitLab Runner는 EC2 서버에서 실행 중이며, **각 서비스(FastAPI, Next.js, Spring Boot)에 대해 개별적으로 등록**되어 있습니다.
- SonarQube의 **품질 기준(Quality Gate)이 실패하면 GitLab CI/CD에서 경고를 표시**하지만, `allow_failure: true`로 인해 Job이 중단되지는 않습니다.
- **만약 GitLab CI/CD 실행 중 오류가 발생하면** GitLab Runner 로그를 확인하세요.

```bash
docker logs -f gitlab-runner
```

🚀 **CI/CD 파이프라인이 정상적으로 실행되는지 확인 후, 문제 발생 시 GitLab Runner 로그 및 SonarQube 대시보드를 참고하세요!**  

---

## **🎯 최종 정리**
✅ **SonarQube를 GitLab CI/CD와 연동하여 자동 코드 분석 수행**  
✅ **EC2 서버에 Docker 기반 GitLab Runner 3개(FastAPI, Next.js, Spring Boot) 설정**  
✅ **루트 디렉토리의 `.gitlab-ci.yml`을 기반으로 CI/CD 파이프라인 실행**  
✅ **GitLab CI/CD 환경 변수 등록 필수 (`SONAR_PROJECT_KEY`, `SONAR_HOST_URL`, `SONAR_TOKEN`)**  
✅ **각 Runner는 2025년 2월 11일부터 30일간 유효하며, 만료 시 재발급 가능**  

🚀 **이제 SonarQube 품질 분석이 자동으로 수행되며, CI/CD 파이프라인이 정상적으로 동작할 것입니다!**  
**추가적인 설정이 필요하거나 오류가 발생하면 GitLab Runner 로그 및 SonarQube 대시보드를 확인하세요!** 😊

```.gitlab-ci.yml
stages:
  - test

variables:
  GIT_DEPTH: "0"

# 🔵 FastAPI (Python 3.12)
sonarqube_check_fastapi:
  image: 
    name: python:3.12
    entrypoint: [""]
  stage: test
  tags:
    - fastapi
  only:
    - master  # ✅ 이 Job이 `master` 브랜치에서만 실행됨
  before_script:
    - cd rag_pipeline
    - pip install --upgrade pip
    - pip install -r requirements.txt
    - |
      curl -fsSL -o sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
      unzip sonar-scanner.zip
      mv sonar-scanner-5.0.1.3006-linux /usr/local/sonar-scanner
      export PATH="/usr/local/sonar-scanner/bin:$PATH"
  script:
    - sonar-scanner 
        -Dsonar.projectKey="$SONAR_PROJECT_KEY" 
        -Dsonar.host.url="$SONAR_HOST_URL" 
        -Dsonar.login="$SONAR_TOKEN" 
        -Dsonar.sources=. 
        -Dsonar.qualitygate.wait=true
  allow_failure: true

# 🟢 Next.js (Node.js 18)
sonarqube_check_nextjs:
  image: 
    name: node:18
    entrypoint: [""]
  stage: test
  tags:
    - nextjs
  only:
    - master
  before_script:
    - cd frontend
    - npm ci
    - npm install -g sonarqube-scanner
  script:
    - npx sonar-scanner 
        -Dsonar.projectKey="$SONAR_PROJECT_KEY" 
        -Dsonar.host.url="$SONAR_HOST_URL" 
        -Dsonar.login="$SONAR_TOKEN" 
        -Dsonar.sources=. 
        -Dsonar.qualitygate.wait=true
  allow_failure: true

# 🟢 Spring Boot (Gradle 8.3 + JDK 17)
sonarqube_check_springboot:
  stage: test
  image: gradle:8.3-jdk17
  tags:
    - springboot
  only:
    - master
  variables:
    SONAR_USER_HOME: "${CI_PROJECT_DIR}/.sonar"
  cache:
    key: "${CI_JOB_NAME}"
    paths:
      - .sonar/cache
  before_script:
    - cd backend
    - |
      curl -fsSL -o sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip
      unzip sonar-scanner.zip
      mv sonar-scanner-5.0.1.3006-linux /usr/local/sonar-scanner
      export PATH="/usr/local/sonar-scanner/bin:$PATH"
  script:
    - gradle --no-daemon --info build sonar 
        -Dsonar.projectKey="$SONAR_PROJECT_KEY" 
        -Dsonar.host.url="$SONAR_HOST_URL" 
        -Dsonar.login="$SONAR_TOKEN"
        -Dsonar.qualitygate.wait=true
  allow_failure: true
  ```
# 1️⃣ Python 공식 이미지 사용 (Slim 버전으로 변경하여 크기 최적화)
FROM python:3.12-slim

# 2️⃣ 작업 디렉터리 설정
WORKDIR /app

# 3️⃣ 의존성 파일을 먼저 복사한 후 설치 (레이어 캐싱 최적화)
COPY requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt

# 4️⃣ 전체 소스 코드 복사 (이제야 COPY . . 실행)
COPY . .

# 5️⃣ 컨테이너에서 FastAPI 실행 (포트 설정)
EXPOSE 8000

# 6️⃣ 실행 명령을 ENTRYPOINT로 변경 (더 유연한 실행)
ENTRYPOINT ["uvicorn", "app.main:socket_app", "--host", "0.0.0.0", "--port", "8000"]

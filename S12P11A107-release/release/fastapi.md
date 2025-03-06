:fast_forward:**HOW TO RUN FASTAPI AND TROUBLE SHOOTING LOG**:fast_forward:

We use *fastapi==0.115.7* version.   

## Execute
```python -m venv venv```   
```source venv/scripts/activate```   

```uvicorn app.main:app --reload```   
- But, if you run above running line, fastapi does not run in background.   
- Thus, If you use it, Jenkinsfile does not finish.   
- ```nohup uvicorn app.main:app --host 0.0.0.0 --port 8030 --reload > uvicorn.log 2>&1 &```   
- To check if it's running ```ps aux | grep uvicorn```   
- To stop it ```pkill -f "uvicorn app.main:app"```   

## Create Dockerfile
```Dockerfile
FROM python:3.12.8
WORKDIR /test
COPY .env /test/.env
ENV PYTHONUNBUFFERED=1
COPY ./requirements.txt /test/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /test/requirements.txt
COPY ./app /test/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8030"]
```   
Especially, it is very *important* to copy ".env" and "requirements.txt" files.   

## Build Docker image
```docker build -t fastapi-server:{version} .```   

## Run Docker images to create a fastapi container
```docker run -p 8040:8030 fastapi-server:{version}```   

## Error
```+ python3 -m venv venv
Error: Command '['/var/lib/jenkins/workspace/rag-pipeline/rag_pipeline/venv/bin/python3', '-m', 'ensurepip', '--upgrade', '--default-pip']' returned non-zero exit status 1.```   
현재 문제는 Python 3.12 설치가 불완전하여 필수 내장 모듈(math, _posixsubprocess)이 누락된 것입니다. Python이 정상적으로 작동하려면 이러한 기본 모듈들이 필요합니다.

🔥 문제 요약   
- math, _posixsubprocess 등의 Python 기본 모듈 누락   
- venv, pip 생성 불가   
- Jenkins 환경에서 Python 설치가 깨진 상태   

**Solution**   
- remove python and reinstall python version 3.12.8    
- add ```rm -rf venv``` line before making virtual environment.   
- if you try to create virtual environment when venv exists, it will cause conflicts.   

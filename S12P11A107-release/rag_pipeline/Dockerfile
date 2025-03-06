FROM python:3.12.8
WORKDIR /test
COPY .env /test/.env
ENV PYTHONUNBUFFERED=1
COPY ./requirements.txt /test/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /test/requirements.txt
COPY ./app /test/app
CMD ["uvicorn", "app.main:socket_app", "--host", "0.0.0.0", "--port", "8030"]
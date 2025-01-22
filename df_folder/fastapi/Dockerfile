FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8000

# CMD uvicorn main:app --host=0.0.0.0 --reload
# CMD uvicorn main:app
# Run uvicorn with host 0.0.0.0 so it listens to external requests
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
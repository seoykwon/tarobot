from fastapi import FastAPI
from app.routes import chatbot
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드가 호스팅되는 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chatbot routes
app.include_router(chatbot.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Chatbot API"}
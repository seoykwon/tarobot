from fastapi import FastAPI
from app.routes import chatbot

app = FastAPI()

# Include chatbot routes
app.include_router(chatbot.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the Chatbot API"}
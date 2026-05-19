from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini_service import get_chat_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatRequest):
    """
    Process a user message through the Gemini AI service.
    """
    response_text = await get_chat_response(request.message)
    return ChatResponse(response=response_text)

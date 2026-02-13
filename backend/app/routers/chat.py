"""
Chat Router
Endpoints for chat functionality
"""
from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import ChatRequest, ChatResponse, ChatSessionSummary
from app.services.rag_service import RAGService

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
async def send_message(request: ChatRequest):
    """
    Send a message and get an AI response.
    
    - **message**: The user's message/question
    - **session_id**: Optional session ID for conversation continuity
    
    Returns the AI response with source citations.
    """
    try:
        rag_service = RAGService()
        result = rag_service.chat(
            message=request.message,
            session_id=request.session_id,
        )
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"],
            session_id=result["session_id"],
            response_time=result["response_time"],
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing message: {str(e)}",
        )


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str):
    """
    Get chat history for a specific session.
    
    - **session_id**: The session ID to retrieve history for
    
    Returns list of messages in the session.
    """
    rag_service = RAGService()
    history = rag_service.get_session_history(session_id)
    
    if not history:
        raise HTTPException(
            status_code=404,
            detail=f"Session {session_id} not found",
        )
    
    return {"session_id": session_id, "messages": history}


@router.delete("/history/{session_id}")
async def clear_chat_history(session_id: str):
    """
    Clear chat history for a specific session.
    
    - **session_id**: The session ID to clear
    
    Returns success status.
    """
    rag_service = RAGService()
    success = rag_service.clear_session_history(session_id)
    
    if not success:
        raise HTTPException(
            status_code=404,
            detail=f"Session {session_id} not found",
        )
    
    return {"success": True, "message": f"Session {session_id} cleared"}


@router.get("/sessions", response_model=List[ChatSessionSummary])
async def list_chat_sessions():
    """
    List all chat sessions.
    
    Returns summaries of all active chat sessions.
    """
    rag_service = RAGService()
    sessions = rag_service.get_all_sessions()
    
    return sessions

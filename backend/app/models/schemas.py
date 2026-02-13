"""
Pydantic schemas for API request/response models
"""
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


# ============== Chat Schemas ==============

class SourceInfo(BaseModel):
    """Information about a source used in the response"""
    type: str = Field(..., description="Source type: 'document' or 'database'")
    name: str = Field(..., description="Source name (document name or table name)")
    snippet: str = Field(default="", description="Relevant snippet or query")


class ChatRequest(BaseModel):
    """Request body for chat endpoint"""
    message: str = Field(..., min_length=1, description="User message")
    session_id: Optional[str] = Field(default=None, description="Chat session ID")


class ChatResponse(BaseModel):
    """Response body for chat endpoint"""
    answer: str = Field(..., description="AI-generated response")
    sources: List[SourceInfo] = Field(default=[], description="Sources used for the response")
    session_id: str = Field(..., description="Chat session ID")
    response_time: float = Field(..., description="Response time in seconds")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")


class ChatMessage(BaseModel):
    """A single chat message"""
    role: str = Field(..., description="Message role: 'user' or 'assistant'")
    content: str = Field(..., description="Message content")
    sources: List[SourceInfo] = Field(default=[], description="Sources (for assistant messages)")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Message timestamp")


class ChatSession(BaseModel):
    """A chat session with history"""
    session_id: str = Field(..., description="Session ID")
    messages: List[ChatMessage] = Field(default=[], description="Message history")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Session creation time")
    title: Optional[str] = Field(default=None, description="Session title (first message)")


class ChatSessionSummary(BaseModel):
    """Summary of a chat session for listing"""
    session_id: str
    title: str
    message_count: int
    created_at: datetime
    last_message_at: datetime


# ============== Document Schemas ==============

class DocumentInfo(BaseModel):
    """Information about an ingested document"""
    id: str = Field(..., description="Document ID")
    name: str = Field(..., description="Document filename")
    size: int = Field(..., description="File size in bytes")
    chunk_count: int = Field(..., description="Number of chunks")
    upload_date: datetime = Field(..., description="Upload timestamp")


class DocumentStats(BaseModel):
    """Vector store statistics"""
    total_documents: int = Field(..., description="Total number of documents")
    total_chunks: int = Field(..., description="Total number of chunks")
    sources: List[str] = Field(default=[], description="List of document sources")


class DocumentUploadResponse(BaseModel):
    """Response for document upload"""
    success: bool
    message: str
    document: Optional[DocumentInfo] = None


# ============== Admin Schemas ==============

class TableStats(BaseModel):
    """Statistics for a single database table"""
    table_name: str
    row_count: int


class DatabaseStats(BaseModel):
    """SQL database statistics"""
    tables: List[TableStats]
    total_rows: int


class SystemInfo(BaseModel):
    """System information"""
    llm_provider: str
    llm_model: str
    embedding_model: str
    vector_store_documents: int
    vector_store_chunks: int
    database_tables: int
    uptime_seconds: float


# ============== Health Schemas ==============

class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(default="ok", description="Health status")
    version: str = Field(..., description="API version")

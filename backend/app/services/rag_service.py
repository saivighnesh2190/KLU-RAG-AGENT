"""
RAG Service
High-level service for handling chat with conversation memory
"""
import time
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from app.services.agent_router import AgentRouter
from app.models.schemas import ChatMessage, SourceInfo



class RAGService:
    """
    High-level RAG service that:
    - Manages conversation sessions
    - Routes queries through the agent
    - Maintains conversation memory (PERSISTENT)
    """
    
    _instance: Optional["RAGService"] = None
    
    def __new__(cls):
        """Singleton pattern"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        """Initialize the RAG service"""
        if self._initialized:
            return
        
        self.agent_router = AgentRouter()
        
        # No more in-memory session storage
        # self.sessions: Dict[str, Dict[str, Any]] = {}
        
        self._initialized = True
    
    def _get_db(self):
        """Get database session"""
        from app.models.database import SessionLocal
        return SessionLocal()

    def _get_or_create_session(self, db, session_id: Optional[str]) -> str:
        """Get existing session or create new one"""
        from app.models.college_models import ChatSession
        
        if session_id:
            session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
            if session:
                return session_id
        
        # Create new session
        new_session_id = str(uuid.uuid4())
        new_session = ChatSession(
            session_id=new_session_id,
            title="New Chat",
            created_at=datetime.now(timezone.utc).isoformat()
        )
        db.add(new_session)
        db.commit()
        return new_session_id
    
    def chat(self, message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a chat message and return response.
        """
        start_time = time.time()
        db = self._get_db()
        
        try:
            # Get or create session
            session_id = self._get_or_create_session(db, session_id)
            
            # Add user message to history
            from app.models.college_models import ChatMessage as DBChatMessage
            from app.models.college_models import ChatSession
            
            # Update session title if it's the first message and title is "New Chat"
            session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
            if session and session.title == "New Chat":
                # Generate a simple title from the first few words
                new_title = message[:50] + ("..." if len(message) > 50 else "")
                session.title = new_title
                db.add(session)
            
            user_msg_db = DBChatMessage(
                session_id=session_id,
                role="user",
                content=message,
                sources="[]",
                timestamp=datetime.now(timezone.utc).isoformat()
            )
            db.add(user_msg_db)
            db.commit()
            
            # Route query and get response
            result = self.agent_router.route_query(message)
            
            # Calculate response time
            response_time = time.time() - start_time
            
            # Format sources for response
            sources = [
                SourceInfo(
                    type=s.get("type", "unknown"),
                    name=s.get("name", "Unknown"),
                    snippet=s.get("snippet", ""),
                    score=float(s.get("score", 0.0)),
                )
                for s in result.get("sources", [])
            ]
            
            # Add assistant message to history
            import json
            assistant_msg_db = DBChatMessage(
                session_id=session_id,
                role="assistant",
                content=result.get("answer", "I couldn't process your request."),
                sources=json.dumps([s.model_dump() for s in sources]),
                timestamp=datetime.now(timezone.utc).isoformat()
            )
            db.add(assistant_msg_db)
            db.commit()
            
            return {
                "answer": result.get("answer", "I couldn't process your request."),
                "sources": [s.model_dump() for s in sources],
                "session_id": session_id,
                "response_time": round(response_time, 2),
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        finally:
            db.close()
    
    def get_session_history(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Get chat history for a session from DB.
        """
        db = self._get_db()
        try:
            from app.models.college_models import ChatMessage as DBChatMessage
            import json
            
            messages = db.query(DBChatMessage).filter(DBChatMessage.session_id == session_id).order_by(DBChatMessage.id).all()
            
            history = []
            for msg in messages:
                # Parse sources JSON
                try:
                    sources_data = json.loads(msg.sources) if msg.sources else []
                    sources = [SourceInfo(**s) for s in sources_data]
                except:
                    sources = []
                    
                chat_msg = ChatMessage(
                    role=msg.role,
                    content=msg.content,
                    sources=sources,
                    timestamp=datetime.fromisoformat(msg.timestamp) if msg.timestamp else datetime.now(timezone.utc)
                )
                history.append(chat_msg.model_dump())
            
            return history
        finally:
            db.close()
    
    def clear_session_history(self, session_id: str) -> bool:
        """
        Clear chat history for a session (Delete session and messages).
        """
        db = self._get_db()
        try:
            from app.models.college_models import ChatSession
            
            session = db.query(ChatSession).filter(ChatSession.session_id == session_id).first()
            if session:
                db.delete(session) # Updates cascade verify in models
                db.commit()
                return True
            return False
        finally:
            db.close()
    
    def get_all_sessions(self) -> List[Dict[str, Any]]:
        """
        Get summary of all chat sessions from DB.
        """
        db = self._get_db()
        try:
            from app.models.college_models import ChatSession, ChatMessage as DBChatMessage
            from sqlalchemy import func, desc
            
            # We want sessions ordered by the LAST message timestamp
            # This is a bit complex in SQL, so we'll fetch all and sort in python for simplicity
            # unless we have huge data (which we don't yet)
            
            sessions = db.query(ChatSession).all()
            session_summaries = []
            
            for session in sessions:
                # Count messages
                msg_count = len(session.messages)
                
                # Get last message time
                last_msg_time = session.created_at
                if session.messages:
                    # Assuming messages are ordered by ID or we sort them
                    last_msg = session.messages[-1]
                    last_msg_time = last_msg.timestamp
                
                session_summaries.append({
                    "session_id": session.session_id,
                    "title": session.title or "New Chat",
                    "message_count": msg_count,
                    "created_at": session.created_at,
                    "last_message_at": last_msg_time,
                })
            
            # Sort by last message (most recent first)
            session_summaries.sort(key=lambda x: x["last_message_at"], reverse=True)
            
            return session_summaries
        finally:
            db.close()
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a specific session"""
        return self.clear_session_history(session_id)

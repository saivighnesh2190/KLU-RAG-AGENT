"""
RAG Service
High-level service for handling chat with conversation memory
"""
import time
import uuid
from typing import Dict, Any, List, Optional
from datetime import datetime
from app.services.agent_router import AgentRouter
from app.models.schemas import ChatMessage, SourceInfo


class RAGService:
    """
    High-level RAG service that:
    - Manages conversation sessions
    - Routes queries through the agent
    - Maintains conversation memory
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
        
        # Session storage: {session_id: {"messages": [...], "created_at": datetime}}
        self.sessions: Dict[str, Dict[str, Any]] = {}
        
        self._initialized = True
    
    def _get_or_create_session(self, session_id: Optional[str]) -> str:
        """Get existing session or create new one"""
        if session_id and session_id in self.sessions:
            return session_id
        
        # Create new session
        new_session_id = str(uuid.uuid4())
        self.sessions[new_session_id] = {
            "messages": [],
            "created_at": datetime.utcnow(),
        }
        return new_session_id
    
    def chat(self, message: str, session_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a chat message and return response.
        
        Args:
            message: User's message
            session_id: Optional session ID for conversation continuity
            
        Returns:
            Dict with answer, sources, session_id, response_time, timestamp
        """
        start_time = time.time()
        
        # Get or create session
        session_id = self._get_or_create_session(session_id)
        session = self.sessions[session_id]
        
        # Add user message to history
        user_message = ChatMessage(
            role="user",
            content=message,
            sources=[],
            timestamp=datetime.utcnow(),
        )
        session["messages"].append(user_message)
        
        # Route query and get response
        result = self.agent_router.route_query(message)
        
        # Calculate response time
        response_time = time.time() - start_time
        
        # Format sources
        sources = [
            SourceInfo(
                type=s.get("type", "unknown"),
                name=s.get("name", "Unknown"),
                snippet=s.get("snippet", ""),
            )
            for s in result.get("sources", [])
        ]
        
        # Add assistant message to history
        assistant_message = ChatMessage(
            role="assistant",
            content=result.get("answer", "I couldn't process your request."),
            sources=sources,
            timestamp=datetime.utcnow(),
        )
        session["messages"].append(assistant_message)
        
        return {
            "answer": result.get("answer", "I couldn't process your request."),
            "sources": [s.model_dump() for s in sources],
            "session_id": session_id,
            "response_time": round(response_time, 2),
            "timestamp": datetime.utcnow().isoformat(),
        }
    
    def get_session_history(self, session_id: str) -> List[Dict[str, Any]]:
        """
        Get chat history for a session.
        
        Args:
            session_id: Session ID
            
        Returns:
            List of messages
        """
        if session_id not in self.sessions:
            return []
        
        return [msg.model_dump() for msg in self.sessions[session_id]["messages"]]
    
    def clear_session_history(self, session_id: str) -> bool:
        """
        Clear chat history for a session.
        
        Args:
            session_id: Session ID
            
        Returns:
            True if session existed and was cleared
        """
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False
    
    def get_all_sessions(self) -> List[Dict[str, Any]]:
        """
        Get summary of all chat sessions.
        
        Returns:
            List of session summaries
        """
        sessions = []
        for session_id, session_data in self.sessions.items():
            messages = session_data["messages"]
            
            # Get title from first user message
            title = "New Chat"
            for msg in messages:
                if msg.role == "user":
                    title = msg.content[:50] + ("..." if len(msg.content) > 50 else "")
                    break
            
            # Get last message timestamp
            last_message_at = session_data["created_at"]
            if messages:
                last_message_at = messages[-1].timestamp
            
            sessions.append({
                "session_id": session_id,
                "title": title,
                "message_count": len(messages),
                "created_at": session_data["created_at"].isoformat(),
                "last_message_at": last_message_at.isoformat(),
            })
        
        # Sort by last message (most recent first)
        sessions.sort(key=lambda x: x["last_message_at"], reverse=True)
        
        return sessions
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a specific session"""
        return self.clear_session_history(session_id)

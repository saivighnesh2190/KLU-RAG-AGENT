"""
Agent Router Service
Routes queries to appropriate data sources (Vector DB or SQL DB)
Uses a simple LLM-based approach for compatibility
"""
from typing import Dict, Any, List, Optional
from langchain_core.tools import Tool
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents import Document
from langchain_core.output_parsers import StrOutputParser
from app.services.llm_provider import get_llm
from app.services.vector_store import VectorStoreService
from app.services.sql_agent import SQLAgentService


class AgentRouter:
    """
    Core orchestrator that routes queries to:
    - Vector DB (ChromaDB) for document-based questions
    - SQL Database for structured data questions
    - Both for hybrid questions
    """
    
    def __init__(self):
        """Initialize the agent router with tools"""
        self.vector_store = VectorStoreService()
        self.sql_agent = SQLAgentService()
    
    def _search_documents(self, query: str) -> str:
        """Search the document knowledge base for information"""
        results = self.vector_store.query(query, n_results=3)
        
        if not results:
            return "No relevant documents found in the knowledge base."
        
        # Format results
        formatted = []
        for i, result in enumerate(results, 1):
            source = result["metadata"].get("source", "Unknown")
            content = result["content"][:500]
            formatted.append(f"[Source: {source}]\n{content}")
        
        return "\n\n---\n\n".join(formatted)
    
    def _query_database(self, question: str) -> str:
        """Query the college database for structured data"""
        result = self.sql_agent.query(question)
        
        if result["success"]:
            return result["answer"]
        else:
            return f"Database query failed: {result.get('error', 'Unknown error')}"
    
    def _determine_source(self, query: str) -> List[str]:
        """Determine which data source(s) to query based on keywords"""
        query_lower = query.lower()
        sources = []
        
        # Keywords indicating document search
        doc_keywords = [
            "policy", "rule", "procedure", "placement", "about", "history",
            "vision", "mission", "accreditation", "handbook", "guideline",
            "attendance", "grading", "hostel", "library rule", "conduct",
            "what is klu", "tell me about", "percentage", "statistic"
        ]
        
        # Keywords indicating database query  
        db_keywords = [
            "student", "faculty", "course", "event", "department", "admission",
            "fee", "seat", "hod", "timing", "facility", "how many", "list",
            "count", "who teach", "schedule", "cgpa", "contact", "name",
            "professor", "section", "year"
        ]
        
        if any(word in query_lower for word in doc_keywords):
            sources.append("documents")
        
        if any(word in query_lower for word in db_keywords):
            sources.append("database")
        
        # Default to both if no clear match
        if not sources:
            sources = ["documents", "database"]
        
        return sources
    
    def route_query(self, query: str) -> Dict[str, Any]:
        """
        Route a query to appropriate data source(s) and return response.
        
        Args:
            query: User's natural language query
            
        Returns:
            Dict with answer, sources, and metadata
        """
        sources_list = []
        context_parts = []
        
        try:
            # Determine which sources to use
            data_sources = self._determine_source(query)
            
            # Gather context from relevant sources
            if "documents" in data_sources:
                doc_result = self._search_documents(query)
                if "No relevant documents" not in doc_result:
                    context_parts.append(f"📄 From Knowledge Base:\n{doc_result}")
                    sources_list.append({
                        "type": "document",
                        "name": "Knowledge Base",
                        "snippet": query[:100],
                    })
            
            if "database" in data_sources:
                db_result = self._query_database(query)
                if "failed" not in db_result.lower():
                    context_parts.append(f"🗃️ From Database:\n{db_result}")
                    sources_list.append({
                        "type": "database",
                        "name": "College Database",
                        "snippet": query[:100],
                    })
            
            # Generate final answer using LLM
            if context_parts:
                llm = get_llm(temperature=0.3)
                
                prompt = ChatPromptTemplate.from_messages([
                    ("system", """You are KLU Agent, the official AI assistant for KL University.
Your job is to provide helpful, accurate answers based on the context provided.

Guidelines:
- Be polite, professional, and concise
- Use the context information to answer the question
- If the context doesn't contain relevant information, say so
- Use markdown formatting when appropriate (headers, bullet points, tables)
- Don't make up information that isn't in the context"""),
                    ("human", """Context information:
{context}

Question: {query}

Provide a helpful answer based on the context above:""")
                ])
                
                chain = prompt | llm | StrOutputParser()
                answer = chain.invoke({
                    "context": "\n\n".join(context_parts),
                    "query": query
                })
            else:
                answer = "I don't have information about that in my knowledge base. Please contact the administration for assistance."
            
            return {
                "success": True,
                "answer": answer,
                "sources": sources_list,
            }
            
        except Exception as e:
            error_message = str(e)
            
            # Handle API key errors
            if "API key" in error_message or "api_key" in error_message.lower():
                return {
                    "success": False,
                    "answer": "⚠️ The AI service is not configured. Please set up your API key in the .env file.",
                    "sources": [],
                    "error": error_message,
                }
            
            return {
                "success": False,
                "answer": "I encountered an error while processing your question. Please try again.",
                "sources": [],
                "error": error_message,
            }
    
    def simple_query(self, query: str) -> Dict[str, Any]:
        """
        Alias for route_query for backwards compatibility.
        """
        return self.route_query(query)

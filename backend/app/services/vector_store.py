"""
Vector Store Service
In-memory fallback for Python 3.14 compatibility (ChromaDB has issues)
"""
import os
from typing import List, Dict, Any, Optional
from langchain_core.documents import Document
from app.config import settings
import json
import hashlib


class VectorStoreService:
    """
    Simple in-memory vector store fallback.
    ChromaDB has Pydantic compatibility issues with Python 3.14.
    This provides basic similarity search using keyword matching.
    """
    
    _instance: Optional["VectorStoreService"] = None
    _initialized: bool = False
    
    def __new__(cls):
        """Singleton pattern to ensure single instance"""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        """Initialize the in-memory store"""
        if VectorStoreService._initialized:
            return
        
        self.persist_directory = str(settings.chroma_dir)
        self.collection_name = settings.CHROMA_COLLECTION
        self._store_path = os.path.join(self.persist_directory, "simple_store.json")
        
        # Ensure directory exists
        os.makedirs(self.persist_directory, exist_ok=True)
        
        # Load existing documents or initialize empty
        self._documents: Dict[str, Dict[str, Any]] = {}
        self._load_store()
        
        VectorStoreService._initialized = True
    
    def _load_store(self):
        """Load persisted documents from disk"""
        if os.path.exists(self._store_path):
            try:
                with open(self._store_path, 'r') as f:
                    self._documents = json.load(f)
            except Exception:
                self._documents = {}
    
    def _save_store(self):
        """Persist documents to disk"""
        try:
            with open(self._store_path, 'w') as f:
                json.dump(self._documents, f)
        except Exception:
            pass
    
    def _generate_id(self, content: str, index: int) -> str:
        """Generate a unique ID for a document chunk"""
        return hashlib.md5(f"{content[:100]}_{index}".encode()).hexdigest()
    
    def add_documents(
        self,
        documents: List[Document],
        ids: Optional[List[str]] = None,
    ) -> List[str]:
        """
        Add documents to the in-memory store.
        """
        if not documents:
            return []
        
        if ids is None:
            ids = [
                f"{doc.metadata.get('id', 'doc')}_{doc.metadata.get('chunk_index', i)}"
                for i, doc in enumerate(documents)
            ]
        
        for i, doc in enumerate(documents):
            doc_id = ids[i] if i < len(ids) else self._generate_id(doc.page_content, i)
            self._documents[doc_id] = {
                "content": doc.page_content,
                "metadata": doc.metadata
            }
        
        self._save_store()
        return ids
    
    def query(
        self,
        query_text: str,
        n_results: int = 5,
        filter_dict: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, Any]]:
        """
        Query using simple keyword matching.
        """
        if not self._documents:
            return []
        
        query_lower = query_text.lower()
        query_words = set(query_lower.split())
        
        # Score documents based on keyword overlap
        scored_docs = []
        for doc_id, doc_data in self._documents.items():
            content = doc_data["content"]
            metadata = doc_data["metadata"]
            
            # Apply filter if provided
            if filter_dict:
                skip = False
                for key, value in filter_dict.items():
                    if metadata.get(key) != value:
                        skip = True
                        break
                if skip:
                    continue
            
            # Simple keyword matching score
            content_lower = content.lower()
            content_words = set(content_lower.split())
            
            # Count matching words
            matches = len(query_words & content_words)
            
            # Check for phrase match
            if query_lower in content_lower:
                matches += 10
            
            if matches > 0:
                scored_docs.append({
                    "content": content,
                    "metadata": metadata,
                    "similarity_score": matches / max(len(query_words), 1),
                })
        
        # Sort by score and return top n
        scored_docs.sort(key=lambda x: x["similarity_score"], reverse=True)
        return scored_docs[:n_results]
    
    def delete_document(self, source_name: str) -> int:
        """Delete all chunks of a document by source name."""
        to_delete = []
        for doc_id, doc_data in self._documents.items():
            if doc_data["metadata"].get("source") == source_name:
                to_delete.append(doc_id)
        
        for doc_id in to_delete:
            del self._documents[doc_id]
        
        self._save_store()
        return len(to_delete)
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the document store."""
        sources = set()
        for doc_data in self._documents.values():
            source = doc_data["metadata"].get("source")
            if source:
                sources.add(source)
        
        return {
            "total_chunks": len(self._documents),
            "total_documents": len(sources),
            "sources": sorted(list(sources)),
        }
    
    def get_all_documents(self) -> List[Dict[str, Any]]:
        """Get information about all documents in the store."""
        documents = {}
        for doc_data in self._documents.values():
            source = doc_data["metadata"].get("source")
            if source and source not in documents:
                documents[source] = {
                    "id": doc_data["metadata"].get("id", ""),
                    "name": source,
                    "chunk_count": 0,
                    "upload_date": doc_data["metadata"].get("upload_date", ""),
                    "size": 0,
                }
            if source:
                documents[source]["chunk_count"] += 1
        
        return list(documents.values())
    
    def is_empty(self) -> bool:
        """Check if the store is empty"""
        return len(self._documents) == 0
    
    def get_retriever(self, k: int = 5):
        """Get a simple retriever function."""
        def retrieve(query: str) -> List[Document]:
            results = self.query(query, n_results=k)
            return [
                Document(
                    page_content=r["content"],
                    metadata=r["metadata"]
                )
                for r in results
            ]
        return retrieve

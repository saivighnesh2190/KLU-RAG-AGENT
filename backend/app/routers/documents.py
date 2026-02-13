"""
Documents Router
Endpoints for document management
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List
from app.models.schemas import DocumentInfo, DocumentStats, DocumentUploadResponse
from app.services.document_processor import DocumentProcessor
from app.services.vector_store import VectorStoreService

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    Upload a document for ingestion into the knowledge base.
    
    Supported formats: PDF, TXT, MD
    
    The document will be:
    1. Saved to the documents directory
    2. Parsed and chunked
    3. Embedded and stored in the vector database
    """
    # Validate file type
    allowed_extensions = [".pdf", ".txt", ".md"]
    file_ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
    
    if file_ext not in allowed_extensions:
        return DocumentUploadResponse(
            success=False,
            message=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}",
        )
    
    try:
        # Read file content
        content = await file.read()
        
        # Process document
        processor = DocumentProcessor()
        documents, metadata = processor.process_file(
            file_path=file.filename,
            file_content=content,
        )
        
        # Save to documents directory
        saved_path = processor.save_uploaded_file(file.filename, content)
        
        # Add to vector store
        vector_store = VectorStoreService()
        vector_store.add_documents(documents)
        
        return DocumentUploadResponse(
            success=True,
            message=f"Successfully uploaded and processed {file.filename}",
            document=DocumentInfo(
                id=metadata["id"],
                name=metadata["name"],
                size=metadata["size"],
                chunk_count=metadata["chunk_count"],
                upload_date=metadata["upload_date"],
            ),
        )
    
    except Exception as e:
        return DocumentUploadResponse(
            success=False,
            message=f"Error processing document: {str(e)}",
        )


@router.get("", response_model=List[DocumentInfo])
async def list_documents():
    """
    List all ingested documents.
    
    Returns information about each document in the knowledge base.
    """
    try:
        vector_store = VectorStoreService()
        documents = vector_store.get_all_documents()
        
        return [
            DocumentInfo(
                id=doc.get("id", ""),
                name=doc["name"],
                size=doc.get("size", 0),
                chunk_count=doc["chunk_count"],
                upload_date=doc.get("upload_date", ""),
            )
            for doc in documents
        ]
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error listing documents: {str(e)}",
        )


@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    """
    Delete a document from the knowledge base.
    
    - **doc_id**: Document ID or source name to delete
    
    Removes all chunks associated with the document.
    """
    try:
        vector_store = VectorStoreService()
        
        # First try to find document by ID or name
        documents = vector_store.get_all_documents()
        doc_to_delete = None
        
        for doc in documents:
            if doc.get("id") == doc_id or doc.get("name") == doc_id:
                doc_to_delete = doc
                break
        
        if not doc_to_delete:
            raise HTTPException(
                status_code=404,
                detail=f"Document {doc_id} not found",
            )
        
        # Delete by source name
        deleted_count = vector_store.delete_document(doc_to_delete["name"])
        
        return {
            "success": True,
            "message": f"Deleted {deleted_count} chunks from {doc_to_delete['name']}",
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting document: {str(e)}",
        )


@router.get("/stats", response_model=DocumentStats)
async def get_document_stats():
    """
    Get statistics about the document knowledge base.
    
    Returns total documents, chunks, and list of sources.
    """
    try:
        vector_store = VectorStoreService()
        stats = vector_store.get_collection_stats()
        
        return DocumentStats(
            total_documents=stats["total_documents"],
            total_chunks=stats["total_chunks"],
            sources=stats["sources"],
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting stats: {str(e)}",
        )

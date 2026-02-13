"""
Admin Router
Endpoints for admin functionality
"""
import time
from fastapi import APIRouter, HTTPException
from app.models.schemas import DatabaseStats, TableStats, SystemInfo
from app.models.database import SessionLocal
from app.models.college_models import (
    Student, Faculty, Course, Event, Department, Admission, Facility
)
from app.services.vector_store import VectorStoreService
from app.services.llm_provider import get_llm_info
from app.config import settings

router = APIRouter(prefix="/admin", tags=["Admin"])

# Track server start time
_server_start_time = time.time()


@router.get("/db-stats", response_model=DatabaseStats)
async def get_database_stats():
    """
    Get SQL database statistics.
    
    Returns row counts for each table.
    """
    try:
        db = SessionLocal()
        
        tables = [
            ("students", Student),
            ("faculty", Faculty),
            ("courses", Course),
            ("events", Event),
            ("departments", Department),
            ("admissions", Admission),
            ("facilities", Facility),
        ]
        
        table_stats = []
        total_rows = 0
        
        for table_name, model in tables:
            count = db.query(model).count()
            table_stats.append(TableStats(
                table_name=table_name,
                row_count=count,
            ))
            total_rows += count
        
        db.close()
        
        return DatabaseStats(
            tables=table_stats,
            total_rows=total_rows,
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting database stats: {str(e)}",
        )


@router.get("/system-info", response_model=SystemInfo)
async def get_system_info():
    """
    Get system information.
    
    Returns LLM provider, embedding model, and other system details.
    """
    try:
        # Get LLM info
        llm_info = get_llm_info()
        
        # Get vector store stats
        vector_store = VectorStoreService()
        vs_stats = vector_store.get_collection_stats()
        
        # Count database tables
        db = SessionLocal()
        table_count = 7  # We have 7 tables
        db.close()
        
        # Calculate uptime
        uptime = time.time() - _server_start_time
        
        return SystemInfo(
            llm_provider=llm_info["provider"],
            llm_model=llm_info["model"],
            embedding_model=llm_info["embedding_model"],
            vector_store_documents=vs_stats["total_documents"],
            vector_store_chunks=vs_stats["total_chunks"],
            database_tables=table_count,
            uptime_seconds=round(uptime, 2),
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting system info: {str(e)}",
        )


@router.post("/seed-documents")
async def seed_sample_documents():
    """
    Seed the vector store with sample documents.
    
    This ingests the sample KLU documents if not already done.
    """
    from pathlib import Path
    from app.services.document_processor import DocumentProcessor
    
    try:
        sample_docs_dir = Path(__file__).parent.parent / "seed" / "sample_documents"
        
        if not sample_docs_dir.exists():
            return {
                "success": False,
                "message": "Sample documents directory not found",
            }
        
        processor = DocumentProcessor()
        vector_store = VectorStoreService()
        
        ingested = []
        
        for file_path in sample_docs_dir.iterdir():
            if file_path.suffix.lower() in [".txt", ".md", ".pdf"]:
                try:
                    documents, metadata = processor.process_file(str(file_path))
                    vector_store.add_documents(documents)
                    ingested.append(metadata["name"])
                except Exception as e:
                    print(f"Error ingesting {file_path}: {e}")
        
        return {
            "success": True,
            "message": f"Ingested {len(ingested)} documents",
            "documents": ingested,
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error seeding documents: {str(e)}",
        )

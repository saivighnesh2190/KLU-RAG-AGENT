"""
Health Check Router
"""
from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app import __version__

router = APIRouter(prefix="/health", tags=["Health"])


@router.get("", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    Returns the API status and version.
    """
    return HealthResponse(
        status="ok",
        version=__version__,
    )


@router.get("/ready")
async def readiness_check():
    """
    Readiness check endpoint.
    Verifies that all required services are available.
    """
    from app.services.vector_store import VectorStoreService
    from app.services.sql_agent import SQLAgentService
    
    checks = {
        "database": False,
        "vector_store": False,
    }
    
    try:
        # Check database
        sql_agent = SQLAgentService()
        sql_agent.get_table_names()
        checks["database"] = True
    except Exception:
        pass
    
    try:
        # Check vector store
        vector_store = VectorStoreService()
        vector_store.get_collection_stats()
        checks["vector_store"] = True
    except Exception:
        pass
    
    all_ready = all(checks.values())
    
    return {
        "ready": all_ready,
        "checks": checks,
    }

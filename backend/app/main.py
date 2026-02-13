"""
FastAPI Application Entry Point
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.database import init_db
from app.routers import health_router, chat_router, documents_router, admin_router
from app import __version__


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
    # Startup
    print("🚀 Starting KLU Agent Backend...")
    
    # Initialize database
    print("📦 Initializing database...")
    init_db()
    
    # Auto-ingest sample documents if vector store is empty
    try:
        from app.services.vector_store import VectorStoreService
        from app.services.document_processor import DocumentProcessor
        from pathlib import Path
        
        vector_store = VectorStoreService()
        
        if vector_store.is_empty():
            print("📄 Vector store is empty. Ingesting sample documents...")
            sample_docs_dir = Path(__file__).parent / "seed" / "sample_documents"
            
            if sample_docs_dir.exists():
                processor = DocumentProcessor()
                
                for file_path in sample_docs_dir.iterdir():
                    if file_path.suffix.lower() in [".txt", ".md", ".pdf"]:
                        try:
                            documents, metadata = processor.process_file(str(file_path))
                            vector_store.add_documents(documents)
                            print(f"  ✓ Ingested: {file_path.name}")
                        except Exception as e:
                            print(f"  ✗ Error ingesting {file_path.name}: {e}")
            else:
                print("  ⚠ Sample documents directory not found")
        else:
            stats = vector_store.get_collection_stats()
            print(f"📄 Vector store has {stats['total_documents']} documents ({stats['total_chunks']} chunks)")
    
    except Exception as e:
        print(f"⚠ Error during startup: {e}")
    
    print(f"✅ KLU Agent Backend v{__version__} is ready!")
    print(f"📡 Server: http://{settings.HOST}:{settings.PORT}")
    print(f"📚 Docs: http://{settings.HOST}:{settings.PORT}/docs")
    
    yield
    
    # Shutdown
    print("👋 Shutting down KLU Agent Backend...")


# Create FastAPI application
app = FastAPI(
    title="KLU Agent API",
    description="""
## KLU Agent Backend API

A Gen AI-powered chatbot for KL University using RAG (Retrieval-Augmented Generation).

### Features
- **Chat**: Intelligent Q&A about KLU using documents and database
- **Documents**: Upload and manage knowledge base documents
- **Admin**: System monitoring and database statistics

### Data Sources
1. **Document Knowledge Base**: Policies, handbooks, and general information
2. **College Database**: Live data about students, faculty, courses, events, etc.
    """,
    version=__version__,
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(documents_router, prefix="/api")
app.include_router(admin_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint - redirects to docs"""
    return {
        "name": "KLU Agent API",
        "version": __version__,
        "docs": "/docs",
        "health": "/api/health",
    }

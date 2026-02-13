"""
Configuration settings for KLU Agent Backend
"""
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field
import os
from pathlib import Path

# Get the backend directory path
BACKEND_DIR = Path(__file__).parent.parent
DATA_DIR = BACKEND_DIR / "app" / "data"


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # LLM Configuration
    LLM_PROVIDER: str = Field(default="openai", description="LLM provider: 'openai' or 'gemini'")
    OPENAI_API_KEY: str = Field(default="", description="OpenAI API key")
    GOOGLE_API_KEY: str = Field(default="", description="Google API key for Gemini")
    
    # Model Configuration
    OPENAI_MODEL: str = Field(default="gpt-3.5-turbo", description="OpenAI model name")
    GEMINI_MODEL: str = Field(default="gemini-1.5-flash", description="Gemini model name")
    EMBEDDING_MODEL: str = Field(default="all-MiniLM-L6-v2", description="Sentence transformer model")
    
    # Database
    DATABASE_URL: str = Field(
        default=f"sqlite:///{DATA_DIR / 'college.db'}",
        description="SQLAlchemy database URL"
    )
    
    # ChromaDB
    CHROMA_PERSIST_DIR: str = Field(
        default=str(DATA_DIR / "chroma_db"),
        description="ChromaDB persistent storage directory"
    )
    CHROMA_COLLECTION: str = Field(default="klu_documents", description="ChromaDB collection name")
    
    # Server
    HOST: str = Field(default="0.0.0.0", description="Server host")
    PORT: int = Field(default=8000, description="Server port")
    CORS_ORIGINS: str = Field(
        default="http://localhost:5173,http://localhost:3000",
        description="Comma-separated CORS origins"
    )
    
    # App
    DEBUG: bool = Field(default=True, description="Debug mode")
    LOG_LEVEL: str = Field(default="info", description="Logging level")
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins string into a list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    @property
    def data_dir(self) -> Path:
        """Get the data directory path"""
        return DATA_DIR
    
    @property
    def documents_dir(self) -> Path:
        """Get the documents storage directory path"""
        return DATA_DIR / "documents"
    
    @property
    def chroma_dir(self) -> Path:
        """Get the ChromaDB directory path"""
        return Path(self.CHROMA_PERSIST_DIR)
    
    def ensure_directories(self):
        """Create necessary directories if they don't exist"""
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.documents_dir.mkdir(parents=True, exist_ok=True)
        self.chroma_dir.mkdir(parents=True, exist_ok=True)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


# Create settings instance
settings = Settings()

# Ensure directories exist
settings.ensure_directories()

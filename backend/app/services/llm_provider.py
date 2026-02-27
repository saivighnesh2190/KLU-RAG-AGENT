"""
LLM Provider Factory
Supports OpenAI and Google Gemini models
"""
import time
import logging
import functools
from typing import Optional, Any
from langchain_core.language_models.base import BaseLanguageModel
from langchain_core.embeddings import Embeddings
from app.config import settings

logger = logging.getLogger(__name__)

def retry_with_backoff(func):
    """
    Decorator to retry functions with exponential backoff on 429 errors.
    Useful for Gemini API free tier rate limits.
    """
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        max_retries = 3
        base_delay = 2  # seconds
        
        for attempt in range(max_retries + 1):
            try:
                return func(*args, **kwargs)
            except Exception as e:
                error_str = str(e).lower()
                if "429" in error_str or "resource_exhausted" in error_str or "quota" in error_str:
                    if attempt == max_retries:
                        logger.error(f"Max retries reached for LLM API call: {e}")
                        raise e
                    
                    delay = base_delay * (2 ** attempt)  # 2s, 4s, 8s
                    logger.warning(f"Rate limit hit (429). Retrying in {delay}s... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(delay)
                else:
                    raise e
    return wrapper



def get_llm(temperature: float = 0.7) -> BaseLanguageModel:
    """
    Get the configured LLM instance based on LLM_PROVIDER setting.
    
    Args:
        temperature: Model temperature for response randomness
        
    Returns:
        BaseLanguageModel: Configured LLM instance
        
    Raises:
        ValueError: If LLM provider is not configured or API key is missing
    """
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "openai":
        if not settings.OPENAI_API_KEY:
            raise ValueError(
                "OpenAI API key not configured. "
                "Please set OPENAI_API_KEY in your .env file."
            )
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(
            model=settings.OPENAI_MODEL,
            temperature=temperature,
            api_key=settings.OPENAI_API_KEY,
        )
    
    elif provider == "gemini":
        if not settings.GOOGLE_API_KEY:
            raise ValueError(
                "Google API key not configured. "
                "Please set GOOGLE_API_KEY in your .env file."
            )
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            temperature=temperature,
            api_key=settings.GOOGLE_API_KEY,
        )
    
    else:
        raise ValueError(
            f"Unknown LLM provider: {provider}. "
            "Supported providers: 'openai', 'gemini'"
        )


def get_embeddings() -> Embeddings:
    """
    Get the configured embeddings model.
    Uses Google's embedding API for lightweight deployment.
    
    Returns:
        Embeddings: Configured embeddings instance
    """
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "gemini":
        from langchain_google_genai import GoogleGenerativeAIEmbeddings
        return GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            api_key=settings.GOOGLE_API_KEY,
        )
    else:
        from langchain_openai import OpenAIEmbeddings
        return OpenAIEmbeddings(
            api_key=settings.OPENAI_API_KEY,
        )


def get_llm_info() -> dict:
    """
    Get information about the configured LLM.
    
    Returns:
        dict: LLM configuration info
    """
    provider = settings.LLM_PROVIDER.lower()
    
    if provider == "openai":
        model = settings.OPENAI_MODEL
        configured = bool(settings.OPENAI_API_KEY)
    elif provider == "gemini":
        model = settings.GEMINI_MODEL
        configured = bool(settings.GOOGLE_API_KEY)
    else:
        model = "unknown"
        configured = False
    
    return {
        "provider": provider,
        "model": model,
        "configured": configured,
        "embedding_model": settings.EMBEDDING_MODEL,
    }

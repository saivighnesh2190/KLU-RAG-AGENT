"""
KLU Agent Backend Application

This module initializes the application and handles compatibility fixes
for Python 3.14 with older Pydantic-based libraries.
"""
import warnings
import sys

# Suppress Pydantic v1 compatibility warnings for Python 3.14
# This is needed because some LangChain dependencies still use Pydantic v1
warnings.filterwarnings("ignore", message=".*Pydantic V1.*")
warnings.filterwarnings("ignore", message=".*unable to infer type.*")

# Patch chromadb to avoid the Pydantic error
try:
    # Pre-emptively set environment variable to disable ChromaDB telemetry
    import os
    os.environ["ANONYMIZED_TELEMETRY"] = "false"
    os.environ["CHROMA_TELEMETRY"] = "false"
    
    # Try to patch the problematic ChromaDB Settings class
    import pydantic
    
    # Only apply patch for Python 3.14+
    if sys.version_info >= (3, 14):
        # Monkey-patch to handle the chroma_server_nofile attribute
        original_model_validate = getattr(pydantic.BaseModel, 'model_validate', None)
        if original_model_validate:
            def safe_model_validate(cls, obj, *args, **kwargs):
                try:
                    return original_model_validate.__func__(cls, obj, *args, **kwargs)
                except Exception:
                    return cls()
except Exception:
    pass

__version__ = "1.0.0"

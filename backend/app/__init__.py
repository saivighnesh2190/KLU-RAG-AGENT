"""
KLU Agent Backend Application

This module initializes the application and handles compatibility fixes
for older Pydantic-based libraries.
"""
import warnings
import os

# Suppress Pydantic v1 compatibility warnings
# This is needed because some LangChain dependencies still use Pydantic v1
warnings.filterwarnings("ignore", message=".*Pydantic V1.*")
warnings.filterwarnings("ignore", message=".*unable to infer type.*")
warnings.filterwarnings("ignore", category=DeprecationWarning, module="pydantic")

# Disable ChromaDB telemetry
os.environ["ANONYMIZED_TELEMETRY"] = "false"
os.environ["CHROMA_TELEMETRY"] = "false"

__version__ = "1.0.0"

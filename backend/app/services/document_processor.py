"""
Document Processor Service
Handles PDF and text file parsing with chunking for vector storage
"""
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
import PyPDF2
import fitz  # PyMuPDF
from app.config import settings


class DocumentProcessor:
    """Processes documents for ingestion into the vector store"""
    
    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ):
        """
        Initialize the document processor.
        
        Args:
            chunk_size: Size of text chunks
            chunk_overlap: Overlap between chunks
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", " ", ""],
        )
        self.documents_dir = settings.documents_dir
    
    def process_file(
        self,
        file_path: str,
        file_content: Optional[bytes] = None,
    ) -> Tuple[List[Document], Dict[str, Any]]:
        """
        Process a file and return chunked documents with metadata.
        
        Args:
            file_path: Path to the file or filename
            file_content: Optional file content bytes (for uploaded files)
            
        Returns:
            Tuple of (list of Document objects, file metadata dict)
        """
        filename = os.path.basename(file_path)
        file_ext = os.path.splitext(filename)[1].lower()
        
        # Extract text based on file type
        if file_ext == ".pdf":
            text = self._extract_pdf_text(file_path, file_content)
        elif file_ext in [".txt", ".md"]:
            text = self._extract_text_file(file_path, file_content)
        else:
            raise ValueError(f"Unsupported file type: {file_ext}")
        
        # Create metadata
        doc_id = str(uuid.uuid4())
        metadata = {
            "id": doc_id,
            "source": filename,
            "file_type": file_ext,
            "upload_date": datetime.utcnow().isoformat(),
        }
        
        # Split text into chunks
        chunks = self.text_splitter.split_text(text)
        
        # Create Document objects with metadata
        documents = []
        for i, chunk in enumerate(chunks):
            doc_metadata = {
                **metadata,
                "chunk_index": i,
                "total_chunks": len(chunks),
            }
            documents.append(Document(page_content=chunk, metadata=doc_metadata))
        
        file_metadata = {
            "id": doc_id,
            "name": filename,
            "chunk_count": len(chunks),
            "upload_date": metadata["upload_date"],
            "size": len(file_content) if file_content else os.path.getsize(file_path),
        }
        
        return documents, file_metadata
    
    def _extract_pdf_text(
        self,
        file_path: str,
        file_content: Optional[bytes] = None,
    ) -> str:
        """
        Extract text from a PDF file using PyMuPDF (faster) with PyPDF2 fallback.
        
        Args:
            file_path: Path to PDF file
            file_content: Optional PDF bytes
            
        Returns:
            Extracted text
        """
        text_parts = []
        
        try:
            # Try PyMuPDF first (faster and better quality)
            if file_content:
                doc = fitz.open(stream=file_content, filetype="pdf")
            else:
                doc = fitz.open(file_path)
            
            for page_num, page in enumerate(doc, 1):
                page_text = page.get_text()
                if page_text.strip():
                    text_parts.append(f"[Page {page_num}]\n{page_text}")
            
            doc.close()
            
        except Exception:
            # Fallback to PyPDF2
            if file_content:
                import io
                pdf_file = io.BytesIO(file_content)
                reader = PyPDF2.PdfReader(pdf_file)
            else:
                reader = PyPDF2.PdfReader(file_path)
            
            for page_num, page in enumerate(reader.pages, 1):
                page_text = page.extract_text()
                if page_text and page_text.strip():
                    text_parts.append(f"[Page {page_num}]\n{page_text}")
        
        return "\n\n".join(text_parts)
    
    def _extract_text_file(
        self,
        file_path: str,
        file_content: Optional[bytes] = None,
    ) -> str:
        """
        Extract text from a text file.
        
        Args:
            file_path: Path to text file
            file_content: Optional file bytes
            
        Returns:
            File text content
        """
        if file_content:
            return file_content.decode("utf-8")
        
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    
    def save_uploaded_file(
        self,
        filename: str,
        content: bytes,
    ) -> str:
        """
        Save an uploaded file to the documents directory.
        
        Args:
            filename: Original filename
            content: File content bytes
            
        Returns:
            Path to saved file
        """
        # Create unique filename to avoid collisions
        name, ext = os.path.splitext(filename)
        unique_name = f"{name}_{uuid.uuid4().hex[:8]}{ext}"
        file_path = self.documents_dir / unique_name
        
        with open(file_path, "wb") as f:
            f.write(content)
        
        return str(file_path)
    
    def process_directory(
        self,
        directory: str,
    ) -> List[Tuple[List[Document], Dict[str, Any]]]:
        """
        Process all supported files in a directory.
        
        Args:
            directory: Path to directory
            
        Returns:
            List of (documents, metadata) tuples for each file
        """
        results = []
        dir_path = Path(directory)
        
        for file_path in dir_path.iterdir():
            if file_path.suffix.lower() in [".pdf", ".txt", ".md"]:
                try:
                    docs, metadata = self.process_file(str(file_path))
                    results.append((docs, metadata))
                except Exception as e:
                    print(f"Error processing {file_path}: {e}")
        
        return results

import os
import uuid
from fastapi import UploadFile, HTTPException
from pathlib import Path
from typing import Optional

# File upload directory (relative to this file so it works on any host,
# not just the original Emergent container). Override with the
# UPLOAD_DIR env var if you point this at a mounted volume.
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", BASE_DIR / "uploads"))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {
    'image': {'.jpg', '.jpeg', '.png', '.gif', '.webp'},
    'document': {'.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv'},
    'video': {'.mp4', '.mov', '.avi', '.webm'}
}

def get_file_extension(filename: str) -> str:
    return Path(filename).suffix.lower()

def is_allowed_file(filename: str, file_type: str) -> bool:
    ext = get_file_extension(filename)
    return ext in ALLOWED_EXTENSIONS.get(file_type, set())

async def save_upload_file(upload_file: UploadFile, file_type: str = 'document') -> str:
    """
    Save uploaded file and return the file URL
    """
    if not is_allowed_file(upload_file.filename, file_type):
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {ALLOWED_EXTENSIONS[file_type]}"
        )
    
    # Generate unique filename
    file_ext = get_file_extension(upload_file.filename)
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    # Save file
    with open(file_path, "wb") as f:
        content = await upload_file.read()
        f.write(content)
    
    # Return URL path (must match the mount point in server.py)
    return f"/api/uploads/{unique_filename}"

def get_file_size(file_path: str) -> str:
    """
    Get human-readable file size
    """
    size_bytes = os.path.getsize(file_path)
    
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"

def delete_file(file_url: str) -> bool:
    """
    Delete file from storage
    """
    try:
        filename = file_url.split('/')[-1]
        file_path = UPLOAD_DIR / filename
        if file_path.exists():
            file_path.unlink()
            return True
        return False
    except Exception:
        return False

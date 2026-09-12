from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# Admin User Model
class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    user_id: str
    password_hash: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

# Blog Models
class Blog(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str  # Rich text HTML from TipTap
    category: str
    tags: List[str]
    author_name: str
    author_role: str
    author_avatar: Optional[str] = None
    read_time: str
    date: datetime = Field(default_factory=datetime.utcnow)
    featured: bool = False
    image: Optional[str] = None
    published: bool = True

class BlogCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    category: str
    tags: List[str]
    author_name: str
    author_role: str
    read_time: str
    featured: bool = False
    image: Optional[str] = None
    published: bool = True

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    read_time: Optional[str] = None
    featured: Optional[bool] = None
    image: Optional[str] = None
    published: Optional[bool] = None

# Video Models
class Video(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    duration: str
    thumbnail: Optional[str] = None
    video_type: str  # 'youtube' or 'upload'
    video_id: Optional[str] = None  # YouTube ID
    video_url: Optional[str] = None  # Uploaded video URL
    date: datetime = Field(default_factory=datetime.utcnow)
    views: str = "0"

class VideoCreate(BaseModel):
    title: str
    description: str
    category: str
    duration: str
    video_type: str
    video_id: Optional[str] = None
    video_url: Optional[str] = None
    thumbnail: Optional[str] = None

# Resource Models
class Resource(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    category: str
    type: str  # Excel, PDF, Word, Calculator
    file_url: str
    file_size: str
    downloads: int = 0
    date: datetime = Field(default_factory=datetime.utcnow)
    featured: bool = False

class ResourceCreate(BaseModel):
    title: str
    description: str
    category: str
    type: str
    file_url: str
    file_size: str
    featured: bool = False

# Testimonial Models
class Testimonial(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    role: str
    company: str
    content: str
    rating: int
    date: datetime = Field(default_factory=datetime.utcnow)
    avatar: Optional[str] = None

class TestimonialCreate(BaseModel):
    name: str
    role: str
    company: str
    content: str
    rating: int
    avatar: Optional[str] = None

# FAQ Models
class FAQ(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    category: str
    order: int = 0

class FAQCreate(BaseModel):
    question: str
    answer: str
    category: str
    order: int = 0

# Knowledge Base Models
class KBArticle(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    category_id: str

class KBCategory(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    icon: str
    articles: List[KBArticle] = []

class KBCategoryCreate(BaseModel):
    title: str
    description: str
    icon: str

class KBArticleCreate(BaseModel):
    title: str
    slug: str
    category_id: str

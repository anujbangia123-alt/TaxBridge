from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models import Blog, Video, Resource, Testimonial, FAQ, KBCategory
from database import db

router = APIRouter(prefix="/api/public", tags=["Public"])

# ==================== BLOG ROUTES ====================

@router.get("/blogs", response_model=List[Blog])
async def get_published_blogs(category: Optional[str] = None):
    """Get all published blogs"""
    query = {"published": True}
    if category and category != "All":
        query["category"] = category
    
    blogs = await db.blogs.find(query).sort("date", -1).to_list(1000)
    return [Blog(**blog) for blog in blogs]

@router.get("/blogs/{slug}", response_model=Blog)
async def get_blog_by_slug(slug: str):
    """Get single blog by slug"""
    blog = await db.blogs.find_one({"slug": slug, "published": True})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return Blog(**blog)

@router.get("/blog-categories")
async def get_blog_categories():
    """Get all blog categories"""
    categories = await db.blogs.distinct("category")
    return ["All"] + sorted(categories)

# ==================== VIDEO ROUTES ====================

@router.get("/videos", response_model=List[Video])
async def get_videos(category: Optional[str] = None):
    """Get all videos"""
    query = {}
    if category and category != "All":
        query["category"] = category
    
    videos = await db.videos.find(query).sort("date", -1).to_list(1000)
    return [Video(**video) for video in videos]

@router.get("/video-categories")
async def get_video_categories():
    """Get all video categories"""
    categories = await db.videos.distinct("category")
    return ["All"] + sorted(categories)

# ==================== RESOURCE ROUTES ====================

@router.get("/resources", response_model=List[Resource])
async def get_resources(category: Optional[str] = None):
    """Get all resources"""
    query = {}
    if category and category != "All":
        query["category"] = category
    
    resources = await db.resources.find(query).sort("date", -1).to_list(1000)
    return [Resource(**resource) for resource in resources]

@router.post("/resources/{resource_id}/download")
async def track_download(resource_id: str):
    """Track resource download"""
    await db.resources.update_one(
        {"id": resource_id},
        {"$inc": {"downloads": 1}}
    )
    return {"message": "Download tracked"}

@router.get("/resource-categories")
async def get_resource_categories():
    """Get all resource categories"""
    categories = await db.resources.distinct("category")
    return ["All"] + sorted(categories)

# ==================== TESTIMONIAL ROUTES ====================

@router.get("/testimonials", response_model=List[Testimonial])
async def get_testimonials():
    """Get all testimonials"""
    testimonials = await db.testimonials.find().sort("date", -1).to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]

# ==================== FAQ ROUTES ====================

@router.get("/faqs", response_model=List[FAQ])
async def get_faqs(category: Optional[str] = None):
    """Get all FAQs"""
    query = {}
    if category and category != "All":
        query["category"] = category
    
    faqs = await db.faqs.find(query).sort("order", 1).to_list(1000)
    return [FAQ(**faq) for faq in faqs]

@router.get("/faq-categories")
async def get_faq_categories():
    """Get all FAQ categories"""
    categories = await db.faqs.distinct("category")
    return ["All"] + sorted(categories)

# ==================== KNOWLEDGE BASE ROUTES ====================

@router.get("/kb-categories", response_model=List[KBCategory])
async def get_kb_categories():
    """Get all knowledge base categories"""
    categories = await db.kb_categories.find().to_list(1000)
    return [KBCategory(**cat) for cat in categories]

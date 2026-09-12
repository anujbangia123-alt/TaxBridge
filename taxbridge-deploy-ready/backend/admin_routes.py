from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import List, Optional
from models import *
from auth import verify_token, get_password_hash, verify_password, create_access_token
from file_handler import save_upload_file, get_file_size, UPLOAD_DIR
from database import db
from datetime import timedelta

router = APIRouter(prefix="/api/admin", tags=["Admin"])

# ==================== AUTH ROUTES ====================

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_admin(admin: AdminLogin):
    """Register first admin - can be disabled after initial setup"""
    # Check if admin already exists
    existing = await db.admins.find_one({"email": admin.email})
    if existing:
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    admin_user = AdminUser(
        email=admin.email,
        user_id="Admin_Anuj",
        password_hash=get_password_hash(admin.password)
    )
    await db.admins.insert_one(admin_user.dict())
    return {"message": "Admin registered successfully"}

@router.post("/login")
async def login_admin(admin: AdminLogin):
    """Admin login"""
    db_admin = await db.admins.find_one({"email": admin.email})
    if not db_admin or not verify_password(admin.password, db_admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(
        data={"sub": db_admin["email"]},
        expires_delta=timedelta(minutes=60 * 24)
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": db_admin["user_id"],
        "email": db_admin["email"]
    }

# ==================== FILE UPLOAD ROUTES ====================

@router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    email: str = Depends(verify_token)
):
    """Upload image file"""
    file_url = await save_upload_file(file, 'image')
    return {"url": file_url}

@router.post("/upload/document")
async def upload_document(
    file: UploadFile = File(...),
    email: str = Depends(verify_token)
):
    """Upload document (PDF, Excel, Word)"""
    file_url = await save_upload_file(file, 'document')
    file_path = UPLOAD_DIR / file_url.split('/')[-1]
    file_size = get_file_size(str(file_path))
    return {"url": file_url, "size": file_size}

@router.post("/upload/video")
async def upload_video(
    file: UploadFile = File(...),
    email: str = Depends(verify_token)
):
    """Upload video file"""
    file_url = await save_upload_file(file, 'video')
    return {"url": file_url}

# ==================== BLOG ROUTES ====================

@router.post("/blogs", response_model=Blog)
async def create_blog(blog: BlogCreate, email: str = Depends(verify_token)):
    """Create new blog post"""
    # Generate slug
    slug = blog.title.lower().replace(' ', '-').replace('/', '-')
    blog_dict = blog.dict()
    blog_dict['slug'] = slug
    blog_obj = Blog(**blog_dict)
    await db.blogs.insert_one(blog_obj.dict())
    return blog_obj

@router.get("/blogs", response_model=List[Blog])
async def get_all_blogs(email: str = Depends(verify_token)):
    """Get all blogs for admin"""
    blogs = await db.blogs.find().sort("date", -1).to_list(1000)
    return [Blog(**blog) for blog in blogs]

@router.get("/blogs/{blog_id}", response_model=Blog)
async def get_blog(blog_id: str, email: str = Depends(verify_token)):
    """Get single blog"""
    blog = await db.blogs.find_one({"id": blog_id})
    if not blog:
        raise HTTPException(status_code=404, detail="Blog not found")
    return Blog(**blog)

@router.put("/blogs/{blog_id}", response_model=Blog)
async def update_blog(
    blog_id: str,
    blog_update: BlogUpdate,
    email: str = Depends(verify_token)
):
    """Update blog post"""
    update_data = {k: v for k, v in blog_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data to update")
    
    result = await db.blogs.update_one(
        {"id": blog_id},
        {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    
    blog = await db.blogs.find_one({"id": blog_id})
    return Blog(**blog)

@router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, email: str = Depends(verify_token)):
    """Delete blog post"""
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog not found")
    return {"message": "Blog deleted successfully"}

# ==================== VIDEO ROUTES ====================

@router.post("/videos", response_model=Video)
async def create_video(video: VideoCreate, email: str = Depends(verify_token)):
    """Create new video"""
    video_obj = Video(**video.dict())
    await db.videos.insert_one(video_obj.dict())
    return video_obj

@router.get("/videos", response_model=List[Video])
async def get_all_videos(email: str = Depends(verify_token)):
    """Get all videos"""
    videos = await db.videos.find().sort("date", -1).to_list(1000)
    return [Video(**video) for video in videos]

@router.put("/videos/{video_id}", response_model=Video)
async def update_video(
    video_id: str,
    video_update: VideoCreate,
    email: str = Depends(verify_token)
):
    """Update video"""
    result = await db.videos.update_one(
        {"id": video_id},
        {"$set": video_update.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    
    video = await db.videos.find_one({"id": video_id})
    return Video(**video)

@router.delete("/videos/{video_id}")
async def delete_video(video_id: str, email: str = Depends(verify_token)):
    """Delete video"""
    result = await db.videos.delete_one({"id": video_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"message": "Video deleted successfully"}

# ==================== RESOURCE ROUTES ====================

@router.post("/resources", response_model=Resource)
async def create_resource(resource: ResourceCreate, email: str = Depends(verify_token)):
    """Create new resource"""
    resource_obj = Resource(**resource.dict())
    await db.resources.insert_one(resource_obj.dict())
    return resource_obj

@router.get("/resources", response_model=List[Resource])
async def get_all_resources(email: str = Depends(verify_token)):
    """Get all resources"""
    resources = await db.resources.find().sort("date", -1).to_list(1000)
    return [Resource(**resource) for resource in resources]

@router.put("/resources/{resource_id}", response_model=Resource)
async def update_resource(
    resource_id: str,
    resource_update: ResourceCreate,
    email: str = Depends(verify_token)
):
    """Update resource"""
    result = await db.resources.update_one(
        {"id": resource_id},
        {"$set": resource_update.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    resource = await db.resources.find_one({"id": resource_id})
    return Resource(**resource)

@router.delete("/resources/{resource_id}")
async def delete_resource(resource_id: str, email: str = Depends(verify_token)):
    """Delete resource"""
    result = await db.resources.delete_one({"id": resource_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Resource not found")
    return {"message": "Resource deleted successfully"}

# ==================== TESTIMONIAL ROUTES ====================

@router.post("/testimonials", response_model=Testimonial)
async def create_testimonial(testimonial: TestimonialCreate, email: str = Depends(verify_token)):
    """Create new testimonial"""
    testimonial_obj = Testimonial(**testimonial.dict())
    await db.testimonials.insert_one(testimonial_obj.dict())
    return testimonial_obj

@router.get("/testimonials", response_model=List[Testimonial])
async def get_all_testimonials(email: str = Depends(verify_token)):
    """Get all testimonials"""
    testimonials = await db.testimonials.find().sort("date", -1).to_list(1000)
    return [Testimonial(**testimonial) for testimonial in testimonials]

@router.put("/testimonials/{testimonial_id}", response_model=Testimonial)
async def update_testimonial(
    testimonial_id: str,
    testimonial_update: TestimonialCreate,
    email: str = Depends(verify_token)
):
    """Update testimonial"""
    result = await db.testimonials.update_one(
        {"id": testimonial_id},
        {"$set": testimonial_update.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    testimonial = await db.testimonials.find_one({"id": testimonial_id})
    return Testimonial(**testimonial)

@router.delete("/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str, email: str = Depends(verify_token)):
    """Delete testimonial"""
    result = await db.testimonials.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}

# ==================== FAQ ROUTES ====================

@router.post("/faqs", response_model=FAQ)
async def create_faq(faq: FAQCreate, email: str = Depends(verify_token)):
    """Create new FAQ"""
    faq_obj = FAQ(**faq.dict())
    await db.faqs.insert_one(faq_obj.dict())
    return faq_obj

@router.get("/faqs", response_model=List[FAQ])
async def get_all_faqs(email: str = Depends(verify_token)):
    """Get all FAQs"""
    faqs = await db.faqs.find().sort("order", 1).to_list(1000)
    return [FAQ(**faq) for faq in faqs]

@router.put("/faqs/{faq_id}", response_model=FAQ)
async def update_faq(
    faq_id: str,
    faq_update: FAQCreate,
    email: str = Depends(verify_token)
):
    """Update FAQ"""
    result = await db.faqs.update_one(
        {"id": faq_id},
        {"$set": faq_update.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    faq = await db.faqs.find_one({"id": faq_id})
    return FAQ(**faq)

@router.delete("/faqs/{faq_id}")
async def delete_faq(faq_id: str, email: str = Depends(verify_token)):
    """Delete FAQ"""
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted successfully"}

# ==================== KNOWLEDGE BASE ROUTES ====================

@router.post("/kb-categories", response_model=KBCategory)
async def create_kb_category(category: KBCategoryCreate, email: str = Depends(verify_token)):
    """Create knowledge base category"""
    category_obj = KBCategory(**category.dict())
    await db.kb_categories.insert_one(category_obj.dict())
    return category_obj

@router.get("/kb-categories", response_model=List[KBCategory])
async def get_kb_categories(email: str = Depends(verify_token)):
    """Get all KB categories"""
    categories = await db.kb_categories.find().to_list(1000)
    return [KBCategory(**cat) for cat in categories]

@router.post("/kb-articles", response_model=KBArticle)
async def create_kb_article(article: KBArticleCreate, email: str = Depends(verify_token)):
    """Create knowledge base article"""
    article_obj = KBArticle(**article.dict())
    # Add article to category
    await db.kb_categories.update_one(
        {"id": article.category_id},
        {"$push": {"articles": article_obj.dict()}}
    )
    return article_obj

@router.delete("/kb-categories/{category_id}")
async def delete_kb_category(category_id: str, email: str = Depends(verify_token)):
    """Delete KB category"""
    result = await db.kb_categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted successfully"}

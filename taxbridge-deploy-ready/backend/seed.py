import asyncio
from database import db
from models import *
from datetime import datetime

async def seed_database():
    """Seed database with initial mock data"""
    
    print("Seeding database...")
    
    # Clear existing data
    await db.blogs.delete_many({})
    await db.videos.delete_many({})
    await db.resources.delete_many({})
    await db.testimonials.delete_many({})
    await db.faqs.delete_many({})
    await db.kb_categories.delete_many({})
    
    # Seed Blogs
    blogs_data = [
        {
            "title": "Understanding Transfer Pricing in 2025: A Complete Guide",
            "slug": "understanding-transfer-pricing-2025",
            "excerpt": "Navigate the latest changes in transfer pricing regulations and learn how they impact your international transactions.",
            "content": "<p>Full blog content here...</p>",
            "category": "Transfer Pricing",
            "tags": ["Transfer Pricing", "Compliance", "2025 Updates"],
            "author_name": "Anuj Bangia",
            "author_role": "Transfer Pricing Specialist",
            "author_avatar": "https://api.dicebear.com/7.x/initials/svg?seed=AB",
            "read_time": "8 min read",
            "featured": True,
            "image": "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop",
            "published": True
        },
        {
            "title": "Form 3CEB Filing: Common Mistakes and How to Avoid Them",
            "slug": "form-3ceb-filing-mistakes",
            "excerpt": "Learn about the most frequent errors in Form 3CEB submissions and best practices to ensure compliance.",
            "content": "<p>Full blog content here...</p>",
            "category": "Tax Updates",
            "tags": ["Form 3CEB", "Filing", "Best Practices"],
            "author_name": "Anuj Bangia",
            "author_role": "Transfer Pricing Specialist",
            "author_avatar": "https://api.dicebear.com/7.x/initials/svg?seed=AB",
            "read_time": "6 min read",
            "featured": False,
            "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
            "published": True
        }
    ]
    
    for blog_data in blogs_data:
        blog = Blog(**blog_data)
        await db.blogs.insert_one(blog.dict())
    
    print(f"✓ Seeded {len(blogs_data)} blogs")
    
    # Seed Videos
    videos_data = [
        {
            "title": "Transfer Pricing Study: Complete Walkthrough",
            "description": "A detailed explanation of how transfer pricing studies are conducted, from functional analysis to final report.",
            "category": "TP Study",
            "duration": "15:42",
            "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            "video_type": "youtube",
            "video_id": "dQw4w9WgXcQ",
            "views": "2.3K"
        },
        {
            "title": "Form 3CEB Filing: Step-by-Step Guide",
            "description": "Learn how to prepare and e-file Form 3CEB accurately with practical examples and common pitfalls to avoid.",
            "category": "Form 3CEB",
            "duration": "12:18",
            "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
            "video_type": "youtube",
            "video_id": "dQw4w9WgXcQ",
            "views": "1.8K"
        }
    ]
    
    for video_data in videos_data:
        video = Video(**video_data)
        await db.videos.insert_one(video.dict())
    
    print(f"✓ Seeded {len(videos_data)} videos")
    
    # Seed Resources
    resources_data = [
        {
            "title": "Excel Practice Workbook: Transfer Pricing Calculations",
            "description": "A comprehensive Excel workbook with formulas and examples for common transfer pricing calculations.",
            "category": "Templates",
            "type": "Excel",
            "file_url": "/uploads/sample.xlsx",
            "file_size": "2.5 MB",
            "featured": True,
            "downloads": 458
        },
        {
            "title": "Form 3CEB Checklist PDF",
            "description": "Complete checklist of documents and information required for Form 3CEB filing.",
            "category": "PDFs",
            "type": "PDF",
            "file_url": "/uploads/sample.pdf",
            "file_size": "850 KB",
            "featured": False,
            "downloads": 623
        }
    ]
    
    for resource_data in resources_data:
        resource = Resource(**resource_data)
        await db.resources.insert_one(resource.dict())
    
    print(f"✓ Seeded {len(resources_data)} resources")
    
    # Seed Testimonials
    testimonials_data = [
        {
            "name": "Rajesh Kumar",
            "role": "CFO, Tech Solutions Pvt Ltd",
            "company": "Tech Solutions Pvt Ltd",
            "content": "Working with TaxBridge Advisory transformed our transfer pricing compliance. Their attention to detail and clear explanations made a complex process straightforward.",
            "rating": 5,
            "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=RK"
        },
        {
            "name": "Priya Sharma",
            "role": "Director, Global Enterprises",
            "company": "Global Enterprises",
            "content": "The transfer pricing study prepared by Anuj was comprehensive and defensible. We felt confident during our tax audit.",
            "rating": 5,
            "avatar": "https://api.dicebear.com/7.x/initials/svg?seed=PS"
        }
    ]
    
    for testimonial_data in testimonials_data:
        testimonial = Testimonial(**testimonial_data)
        await db.testimonials.insert_one(testimonial.dict())
    
    print(f"✓ Seeded {len(testimonials_data)} testimonials")
    
    # Seed FAQs
    faqs_data = [
        {
            "question": "What is transfer pricing and who needs it?",
            "answer": "Transfer pricing refers to the pricing of transactions between related parties (associated enterprises). If your company has cross-border transactions with related entities, or specified domestic transactions exceeding prescribed thresholds, you need transfer pricing documentation.",
            "category": "General",
            "order": 1
        },
        {
            "question": "When is Form 3CEB filing required?",
            "answer": "Form 3CEB is required when your entity has international transactions or specified domestic transactions exceeding Rs. 1 crore during the financial year.",
            "category": "Compliance",
            "order": 2
        }
    ]
    
    for faq_data in faqs_data:
        faq = FAQ(**faq_data)
        await db.faqs.insert_one(faq.dict())
    
    print(f"✓ Seeded {len(faqs_data)} FAQs")
    
    # Seed Knowledge Base
    kb_categories = [
        {
            "title": "Transfer Pricing Fundamentals",
            "description": "Core concepts, principles, and methodologies",
            "icon": "BookOpen",
            "articles": [
                {"title": "What is Transfer Pricing?", "slug": "what-is-transfer-pricing"},
                {"title": "Arm's Length Principle Explained", "slug": "arms-length-principle"}
            ]
        },
        {
            "title": "Form Filing Guides",
            "description": "Step-by-step instructions for tax forms",
            "icon": "FileText",
            "articles": [
                {"title": "Form 3CEB Filing Guide", "slug": "form-3ceb-guide"},
                {"title": "Form 41 Requirements", "slug": "form-41-requirements"}
            ]
        }
    ]
    
    for kb_data in kb_categories:
        # Add IDs to articles
        articles_with_ids = []
        for article in kb_data["articles"]:
            article_obj = KBArticle(
                title=article["title"],
                slug=article["slug"],
                category_id=kb_data.get("id", "")
            )
            articles_with_ids.append(article_obj.dict())
        
        kb_data["articles"] = articles_with_ids
        kb_category = KBCategory(**kb_data)
        await db.kb_categories.insert_one(kb_category.dict())
    
    print(f"✓ Seeded {len(kb_categories)} KB categories")
    
    print("\n✅ Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())

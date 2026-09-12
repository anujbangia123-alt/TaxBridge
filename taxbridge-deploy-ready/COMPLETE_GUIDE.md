# TaxBridge Advisory - Complete Guide

## 📍 1. HOW TO ACCESS THE SITE

### **Public Website:**
```
https://vertex-lab.preview.emergentagent.com
```

### **Admin Login Page:**
```
https://vertex-lab.preview.emergentagent.com/admin/login
```

**Admin Credentials:**
- Email: `anujbangia123@gmail.com`
- Password: `Admin@a123`

### **API Documentation (Swagger):**
```
https://vertex-lab.preview.emergentagent.com/docs
```

---

## ✏️ 2. HOW TO EDIT CONTENT

### **Option A: Admin Dashboard UI (Built!)**

1. Go to: `https://vertex-lab.preview.emergentagent.com/admin/login`
2. Login with your credentials
3. You'll see a sidebar with:
   - Dashboard (overview)
   - Blogs
   - Videos
   - Resources
   - Testimonials
   - FAQs
   - Knowledge Base

**Current Status:**
- ✅ Login system working
- ✅ Dashboard with statistics
- ⏳ Individual managers (Blog, Video, etc.) - Placeholder (can build full CRUD)

### **Option B: Using API Documentation**

**Step-by-Step Guide:**

1. **Login to get token:**
   - Go to: `https://vertex-lab.preview.emergentagent.com/docs`
   - Find `/api/admin/login`
   - Click "Try it out"
   - Enter:
     ```json
     {
       "email": "anujbangia123@gmail.com",
       "password": "Admin@a123"
     }
     ```
   - Click "Execute"
   - **Copy the `access_token`** from response

2. **Authorize all requests:**
   - Click the green "Authorize" button at top right
   - Paste your token in the format: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize"

3. **Now you can:**

   **Add a Blog:**
   - Find `/api/admin/blogs` POST endpoint
   - Click "Try it out"
   - Enter blog data:
     ```json
     {
       "title": "My New Blog Post",
       "excerpt": "Short description",
       "content": "<p>Full HTML content here</p>",
       "category": "Transfer Pricing",
       "tags": ["tag1", "tag2"],
       "author_name": "Anuj Bangia",
       "author_role": "Transfer Pricing Specialist",
       "read_time": "5 min read",
       "featured": false,
       "published": true
     }
     ```
   - Click "Execute"

   **Upload a file (PDF, Excel, etc):**
   - Find `/api/admin/upload/document` POST endpoint
   - Click "Try it out"
   - Click "Choose File" and select your PDF/Excel
   - Click "Execute"
   - **Copy the `url`** from response (e.g., `/uploads/abc123.pdf`)

   **Add a Resource:**
   - Find `/api/admin/resources` POST endpoint
   - Use the file URL from previous step:
     ```json
     {
       "title": "Excel Practice Workbook",
       "description": "Practice workbook for transfer pricing",
       "category": "Templates",
       "type": "Excel",
       "file_url": "/uploads/abc123.xlsx",
       "file_size": "2.5 MB",
       "featured": true
     }
     ```

   **Similar process for:**
   - Videos: `/api/admin/videos`
   - Testimonials: `/api/admin/testimonials`
   - FAQs: `/api/admin/faqs`

---

## 📁 3. WHERE IS THE CODE

### **Project Structure:**

```
/app/
├── backend/                          # Python FastAPI Backend
│   ├── server.py                     # Main API server
│   ├── admin_routes.py               # Admin CRUD endpoints
│   ├── public_routes.py              # Public frontend APIs
│   ├── models.py                     # Data models (Blog, Video, etc.)
│   ├── auth.py                       # JWT authentication
│   ├── file_handler.py               # File upload handling
│   ├── database.py                   # MongoDB connection
│   ├── seed.py                       # Database seeding
│   └── uploads/                      # Uploaded files storage
│
└── frontend/                         # React Frontend
    ├── src/
    │   ├── App.js                    # Main app with routing
    │   ├── contexts/
    │   │   └── AuthContext.jsx       # Admin auth state
    │   ├── pages/
    │   │   ├── HomePage.jsx          # Public website
    │   │   ├── AdminLogin.jsx        # Admin login page
    │   │   ├── AdminDashboard.jsx    # Admin dashboard layout
    │   │   └── admin/
    │   │       ├── DashboardHome.jsx # Dashboard overview
    │   │       ├── BlogManager.jsx   # Blog CRUD (placeholder)
    │   │       ├── VideoManager.jsx  # Video CRUD (placeholder)
    │   │       └── ... (other managers)
    │   └── components/
    │       ├── Header.jsx            # Site header
    │       ├── Hero.jsx              # Hero section
    │       ├── BlogSection.jsx       # Blog display
    │       ├── VideoSection.jsx      # Video library
    │       ├── ResourceSection.jsx   # Resources with form
    │       ├── FAQSection.jsx        # FAQ accordion
    │       ├── Testimonials.jsx      # Client reviews
    │       └── KnowledgeBase.jsx     # Documentation
    └── public/
        └── index.html                # HTML template
```

### **Download Full Source Code:**

```bash
# SSH into your server or use terminal
cd /app
tar -czf taxbridge-complete.tar.gz frontend/ backend/

# Download link will be:
# /app/taxbridge-complete.tar.gz
```

---

## 💾 4. WHERE IS THE STORAGE

### **Database (MongoDB):**
```
Location: MongoDB running in Docker
Database Name: taxbridge_db (or from your .env)
Host: localhost:27017

Collections:
- admins          # Admin users
- blogs           # Blog posts
- videos          # Video library
- resources       # Resource metadata
- testimonials    # Client testimonials
- faqs            # FAQ items
- kb_categories   # Knowledge base categories
```

**View Database:**
```bash
# Connect to MongoDB
docker exec -it mongodb mongosh

# Use database
use taxbridge_db

# View collections
show collections

# View blogs
db.blogs.find()

# Count items
db.blogs.countDocuments()
```

### **File Storage (Current):**
```
Location: /app/backend/uploads/
```

**Uploaded files are accessible at:**
```
https://vertex-lab.preview.emergentagent.com/uploads/filename.pdf
```

### **File Storage (Migrate to Cloud - Option C):**

**Emergent Storage Setup (Coming):**
- Automatically managed
- No configuration needed
- Scalable and secure

**Or migrate to:**
- AWS S3
- Google Cloud Storage
- Azure Blob Storage

---

## 🔄 5. UPDATE FRONTEND TO USE REAL DATA (Guide for Option D)

**Current State:**
- Frontend components still using mock data from `/app/frontend/src/mock/mockData.js`
- Backend APIs are ready with real data

**What You Need to Do:**

### **Step 1: Update BlogSection.jsx**

Find this line:
```javascript
import { blogs, blogCategories } from '../mock/mockData';
```

Replace with:
```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
```

Then fetch real data:
```javascript
const [blogs, setBlogs] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchBlogs();
}, [selectedCategory]);

const fetchBlogs = async () => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/public/blogs?category=${selectedCategory}`
    );
    setBlogs(response.data);
  } catch (error) {
    console.error('Error fetching blogs:', error);
  } finally {
    setLoading(false);
  }
};
```

### **Step 2: Similar Updates for:**
- `VideoSection.jsx` → `/api/public/videos`
- `ResourceSection.jsx` → `/api/public/resources`
- `Testimonials.jsx` → `/api/public/testimonials`
- `FAQSection.jsx` → `/api/public/faqs`
- `KnowledgeBase.jsx` → `/api/public/kb-categories`

### **Step 3: Test Each Component**

After updating, verify:
```bash
# Check if data is loading
# Open browser console (F12)
# Should see API requests in Network tab
```

---

## 🔧 COMMON TASKS

### **Add a New Blog Post:**
1. Login to admin panel
2. OR use API docs `/api/admin/blogs` POST
3. Upload images first using `/api/admin/upload/image`
4. Use returned URL in blog content

### **Upload Resources:**
1. Upload file: `/api/admin/upload/document`
2. Copy returned URL
3. Create resource: `/api/admin/resources` with file URL

### **Backup Database:**
```bash
# Export all data
mongodump --db=taxbridge_db --out=/tmp/backup

# Restore
mongorestore --db=taxbridge_db /tmp/backup/taxbridge_db
```

### **View Logs:**
```bash
# Backend logs
tail -f /var/log/supervisor/backend.*.log

# Frontend logs
tail -f /var/log/supervisor/frontend.*.log
```

---

## 📊 NEXT STEPS

**Immediate (Option A - Complete):**
- [ ] Build full Blog Manager with TipTap editor
- [ ] Build Video Manager with YouTube/upload support
- [ ] Build Resource Manager with file upload
- [ ] Build Testimonial Manager
- [ ] Build FAQ Manager
- [ ] Build KB Manager

**Infrastructure (Option C):**
- [ ] Migrate file storage to Emergent Storage
- [ ] Add image optimization
- [ ] Add video processing

**Frontend Integration (Option D):**
- [ ] Update all components to use real APIs
- [ ] Add loading states
- [ ] Add error handling
- [ ] Remove mock data file

---

**Questions? Need help with any step? Just ask! 🚀**

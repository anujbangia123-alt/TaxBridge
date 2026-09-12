# HOW TO GET FULL HTML CODE

## Option 1: View Built HTML (Production-Ready)

The website is a **React app** that compiles to HTML. To get the full production HTML:

### Step 1: Build the production version
```bash
cd /app/frontend
yarn build
```

### Step 2: The built files will be in `/app/frontend/build/`
```bash
ls -la /app/frontend/build/
# You'll see:
# - index.html (main HTML file)
# - static/js/ (compiled JavaScript)
# - static/css/ (compiled CSS)
```

### Step 3: View the HTML
```bash
cat /app/frontend/build/index.html
```

---

## Option 2: View Live HTML (What Browser Sees)

```bash
curl https://vertex-lab.preview.emergentagent.com/ > website.html
cat website.html
```

---

## Option 3: Get All Source Code (React Components)

### Download entire project:
```bash
cd /app
tar -czf taxbridge-complete.tar.gz frontend/ backend/
```

This creates `taxbridge-complete.tar.gz` with:
- All React components (.jsx files)
- All CSS files
- All backend Python files
- Database models
- Everything!

### Or view individual files:
```bash
# View main page
cat /app/frontend/src/pages/HomePage.jsx

# View blog component  
cat /app/frontend/src/components/BlogSection.jsx

# View admin dashboard
cat /app/frontend/src/pages/AdminDashboard.jsx
```

---

## Key Files Structure:

```
/app/frontend/src/
├── App.js                    # Main router
├── App.css                   # Global styles
├── index.css                 # Tailwind + theme
├── pages/
│   ├── HomePage.jsx          # Main website (2,800+ lines)
│   ├── AdminLogin.jsx        # Admin login
│   ├── AdminDashboard.jsx    # Admin layout
│   └── admin/
│       ├── DashboardHome.jsx
│       ├── BlogManager.jsx
│       ├── VideoManager.jsx
│       ├── ResourceManager.jsx
│       ├── FAQManager.jsx
│       └── TestimonialManager.jsx
└── components/
    ├── Header.jsx
    ├── Hero.jsx
    ├── BlogSection.jsx
    ├── VideoSection.jsx
    ├── ResourceSection.jsx
    ├── FAQSection.jsx
    ├── Testimonials.jsx
    └── KnowledgeBase.jsx
```

---

## Understanding React vs HTML

**React Components** = Modern way (what you have)
- Reusable, dynamic, interactive
- Compiles to HTML + JavaScript
- Better for maintenance

**Pure HTML** = Old way
- Static, hard to maintain
- No database integration
- Would be 10,000+ lines in one file

Your website uses **React components** that:
1. Fetch data from backend APIs
2. Render dynamic HTML
3. Handle user interactions
4. Update in real-time

---

## To Learn the Code:

Start with these files in order:
1. `/app/frontend/src/App.js` - See routing
2. `/app/frontend/src/pages/HomePage.jsx` - Main page structure
3. `/app/frontend/src/components/BlogSection.jsx` - Component example
4. `/app/frontend/src/pages/admin/BlogManager.jsx` - Admin example
5. `/app/backend/server.py` - Backend structure
6. `/app/backend/admin_routes.py` - API endpoints

---

## Get Help Understanding Code:

```bash
# See file with line numbers
cat -n /app/frontend/src/pages/HomePage.jsx | less

# Count lines in a file
wc -l /app/frontend/src/pages/HomePage.jsx

# Search for specific code
grep -n "BlogSection" /app/frontend/src/pages/HomePage.jsx
```

---

**Your website is NOT pure HTML - it's a modern React application. This is BETTER because:**
- Easy to add/edit content via admin panel
- Database-driven (changes reflect instantly)
- Reusable components
- Fast and optimized
- Mobile responsive
- Professional code structure

**The compiled HTML is generated automatically from React code!**

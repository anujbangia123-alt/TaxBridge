# 🚀 QUICK REFERENCE - Most Common Edits

## 📍 Where to Find What

| What You Want to Change | File to Edit | Line Number |
|------------------------|--------------|-------------|
| **Colors & Theme** | `/frontend/src/index.css` | Lines 26-48 |
| **Fonts** | `/frontend/public/index.html` | Lines 10-12 |
| **Company Name** | `/frontend/src/components/Header.jsx` | Line 24 |
| **Logo (TB mark)** | `/frontend/src/components/Header.jsx` | Line 23 |
| **Hero Heading** | `/frontend/src/pages/HomePage.jsx` | Line 196 |
| **Hero Description** | `/frontend/src/pages/HomePage.jsx` | Lines 197-201 |
| **About Section** | `/frontend/src/pages/HomePage.jsx` | Lines 217-242 |
| **Services** | `/frontend/src/pages/HomePage.jsx` | Lines 250-320 |
| **Contact Email** | `/frontend/src/pages/HomePage.jsx` | Line 433 |
| **Contact Phone** | `/frontend/src/pages/HomePage.jsx` | Line 437 |
| **Footer Text** | `/frontend/src/pages/HomePage.jsx` | Line 480 |
| **Navigation Menu** | `/frontend/src/components/Header.jsx` | Lines 14-20 |
| **Blog Categories** | `/frontend/src/pages/admin/BlogManager.jsx` | Lines 157-160 |
| **Video Categories** | `/frontend/src/pages/admin/VideoManager.jsx` | Lines 244-248 |
| **FAQ Categories** | `/frontend/src/pages/admin/FAQManager.jsx` | Lines 144-148 |

---

## 🎨 Color Codes (Current Theme)

```css
--paper: #F2EFE6;          /* Cream background */
--paper-dark: #E7E2D2;     /* Darker cream */
--ink: #1E2A38;            /* Dark blue text */
--ink-soft: #4A5568;       /* Gray text */
--seal: #9E2B25;           /* Red accent */
--seal-dark: #7A211C;      /* Dark red */
--gold: #A8823C;           /* Gold accent */
--line: #C9C2AE;           /* Border color */
```

**Change these in:** `/frontend/src/index.css`

---

## 📱 Contact Information

**File:** `/frontend/src/pages/HomePage.jsx`

```jsx
// Email (line 433)
<span>anujbangia@123gmail.com</span>

// Phone (line 437)
<span>+91 70825 47822</span>

// LinkedIn (line 441-445)
<a href="https://www.linkedin.com/in/anujbangia">
  linkedin.com/in/anujbangia
</a>

// Location (line 449)
<span>India — filings handled remotely</span>

// Hours (line 453)
<span>Mon–Sat, 10:00–19:00 IST</span>
```

---

## 🏷️ Branding

**Company Name:** (line 24)
```jsx
<div className="brand-name">TaxBridge Advisory</div>
```

**Tagline:** (line 25)
```jsx
<div className="brand-byline">Transfer Pricing & International Tax</div>
```

**Logo Mark:** (line 23)
```jsx
<div className="brand-mark">TB</div>
```

**File:** `/frontend/src/components/Header.jsx`

---

## 🎯 Most Edited Files

### Public Website:
1. `HomePage.jsx` - Main content
2. `Header.jsx` - Navigation
3. `Hero.jsx` - Hero section
4. `index.css` - Colors/theme
5. `BlogSection.jsx` - Blog display

### Admin Panel:
1. `BlogManager.jsx` - Blog editor
2. `VideoManager.jsx` - Video editor
3. `ResourceManager.jsx` - File uploader
4. `FAQManager.jsx` - FAQ editor

### Styling:
1. `index.css` - Global styles
2. `App.css` - App-wide styles
3. `Header.css` - Navigation styles
4. `BlogSection.css` - Blog styles

---

## 🔧 Common Tasks

### Add Your Logo
```jsx
// Replace line 23 in Header.jsx with:
<img src="/logo.png" alt="Logo" width="40" />
// Then put logo.png in /frontend/public/
```

### Change Button Text
```jsx
// File: Hero.jsx, line 20
<a href="#contact" className="btn btn-primary">
  Get Started →  {/* Change this text */}
</a>
```

### Add Social Links
```jsx
// File: HomePage.jsx, after line 445
<li>
  <span>Twitter</span>
  <span><a href="YOUR_URL">@yourhandle</a></span>
</li>
```

### Change Hero Background
```css
/* File: Hero.css, line 1 */
.hero {
  background: linear-gradient(to bottom, #F2EFE6, #E7E2D2);
  /* Or: background-image: url('/bg.jpg'); */
}
```

---

## 📦 Bundle Contents

```
taxbridge-complete-editable.tar.gz (288KB)
│
├── frontend/
│   ├── src/
│   │   ├── pages/          (All pages)
│   │   ├── components/     (UI components)
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── server.py
│   ├── admin_routes.py
│   ├── models.py
│   └── ...
│
└── Documentation/
    ├── COMPLETE_GUIDE.md
    ├── EDITING_GUIDE.md
    └── ...
```

---

## ⚡ Quick Start

### Extract Bundle:
```bash
cd /app
tar -xzf /tmp/taxbridge-complete-editable.tar.gz
```

### Edit a File:
```bash
nano frontend/src/pages/HomePage.jsx
# Or use any editor
```

### Changes Apply Automatically:
- Frontend: Hot reload enabled (instant)
- Backend: Auto-restart on save

---

## 🆘 Emergency Reset

### If you break something:
```bash
# Restore from bundle
cd /app
rm -rf frontend backend
tar -xzf /tmp/taxbridge-complete-editable.tar.gz
sudo supervisorctl restart all
```

---

## 📖 Full Guides Available

1. **EDITING_GUIDE.md** - Complete editing instructions
2. **COMPLETE_GUIDE.md** - Usage and access
3. **HOW_TO_GET_HTML.md** - Code structure
4. **HOW_TO_UPLOAD_IMAGES.md** - File uploads

**Location:** `/app/*.md` or in the bundle

---

## 💡 Pro Tips

1. **Always backup before editing:**
   ```bash
   cp file.jsx file.jsx.backup
   ```

2. **Search for text to find where to edit:**
   ```bash
   grep -r "Text you want to change" frontend/src/
   ```

3. **Check logs if something breaks:**
   ```bash
   tail -f /var/log/supervisor/frontend.err.log
   ```

4. **Use VS Code for best experience:**
   - Syntax highlighting
   - Auto-completion
   - Error detection

---

## 🎓 Learning Resources

**React (Frontend):**
- reactjs.org/docs
- Components are like building blocks
- .jsx files = HTML + JavaScript

**CSS (Styling):**
- w3schools.com/css
- Change colors, fonts, spacing
- .css files = styles

**Python (Backend):**
- fastapi.tiangolo.com
- .py files = backend logic
- Models, routes, functions

---

**DOWNLOAD:** `/tmp/taxbridge-complete-editable.tar.gz`
**SIZE:** 288KB
**READY TO EDIT:** ✅

**Start editing now! Most changes are instant.** 🚀

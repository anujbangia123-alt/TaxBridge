# Deploying TaxBridge Advisory (Vercel + Render + MongoDB Atlas)

Your stack: **React (CRA)** frontend, **FastAPI** backend, **MongoDB** database.
It was built on Emergent's platform, so a few things were hardcoded to that
environment. I've already fixed those in this package:

- `auth.py` — JWT `SECRET_KEY` now comes from an environment variable instead
  of being hardcoded in the code.
- `file_handler.py` / `server.py` — the file-upload folder is no longer
  hardcoded to `/app/backend/uploads`; it now lives next to the backend code
  (or wherever you point `UPLOAD_DIR`).
- `requirements.txt` — trimmed to only the packages the code actually uses.
  The original file included Emergent-internal packages (`emergentintegrations`,
  a private `litellm` wheel) that aren't on public PyPI and aren't imported
  anywhere in the code — they would have made `pip install` fail on Render.
- Added `.env.example` files and `.gitignore`s so secrets don't get committed.

**One real limitation to know about:** Render's free-tier disk is ephemeral —
anything uploaded through the admin panel (images, PDFs) will disappear on
redeploy or restart. Fine for getting live now; if that matters long-term,
swap `file_handler.py` to upload to S3/Cloudinary instead of local disk. Ask
me if you want that wired in.

---

## 0. Push the code to GitHub

Render and Vercel both deploy from a Git repo.

```bash
cd taxbridge
git init
git add .
git commit -m "Initial commit"
```

Create a new repo on GitHub, then:

```bash
git remote add origin https://github.com/<you>/taxbridge.git
git branch -M main
git push -u origin main
```

---

## 1. Database — MongoDB Atlas (free)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a **free M0 cluster**.
3. Under **Database Access**, create a database user with a password.
4. Under **Network Access**, add `0.0.0.0/0` (allow from anywhere) — Render's
   IPs aren't fixed on the free tier, so this is the simplest option.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<user>`/`<password>` with your actual credentials. This is your
   `MONGO_URL`.

---

## 2. Backend — Render

1. Go to https://render.com, sign up, click **New → Web Service**, connect
   your GitHub repo.
2. Configure:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
3. Under **Environment**, add these variables:
   | Key | Value |
   |---|---|
   | `MONGO_URL` | your Atlas connection string from step 1 |
   | `DB_NAME` | `taxbridge` |
   | `CORS_ORIGINS` | `http://localhost:3000` for now — you'll update this in step 4 |
   | `SECRET_KEY` | a long random string — generate one with `python -c "import secrets; print(secrets.token_hex(32))"` |
4. Deploy. Once live, note your backend URL, e.g.
   `https://taxbridge-backend.onrender.com`.
5. Test it: open `https://taxbridge-backend.onrender.com/api/` — you should
   see `{"message": "Hello World"}`.

Render's free tier spins the service down after inactivity, so the first
request after idle time takes ~30–50s to wake up. Normal for free tier.

---

## 3. Seed initial data (optional but recommended)

The repo includes `backend/seed.py` with sample blog posts, videos, etc.
Run it once against your Atlas database from your own machine:

```bash
cd backend
pip install -r requirements.txt
export MONGO_URL="<your atlas connection string>"
export DB_NAME="taxbridge"
python seed.py
```

Then create your admin login by calling the register endpoint once
(disable/remove this route afterwards so no one else can register):

```bash
curl -X POST https://taxbridge-backend.onrender.com/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "choose-a-strong-password"}'
```

---

## 4. Frontend — Vercel

1. Go to https://vercel.com, sign up, click **Add New → Project**, import the
   same GitHub repo.
2. Configure:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `yarn build` (auto-detected)
   - **Output Directory:** `build`
3. Under **Environment Variables**, add:
   | Key | Value |
   |---|---|
   | `REACT_APP_BACKEND_URL` | `https://taxbridge-backend.onrender.com` (your Render URL, no trailing slash) |
4. Deploy. Vercel gives you a URL like `https://taxbridge.vercel.app`.

---

## 5. Link them together — update CORS

Go back to Render → your backend service → **Environment**, and update:

```
CORS_ORIGINS=https://taxbridge.vercel.app
```

(If you add a custom domain later, add it here too, comma-separated:
`https://taxbridge.vercel.app,https://www.yourdomain.com`.)

Redeploy the backend for the change to take effect.

---

## 6. Custom domain (optional)

- **Vercel:** Project → Settings → Domains → add your domain, follow the
  DNS instructions (usually a CNAME to `cname.vercel-dns.com`).
- **Render:** Service → Settings → Custom Domains, if you want the API on
  its own subdomain like `api.yourdomain.com`.
- Remember to add whichever domain the frontend ends up on to
  `CORS_ORIGINS` on the backend.

---

## Quick checklist

- [ ] Atlas cluster created, connection string in hand
- [ ] Backend deployed on Render, `/api/` returns Hello World
- [ ] `seed.py` run once against Atlas
- [ ] Admin account registered via `/api/admin/register`, then that route
      disabled/removed
- [ ] Frontend deployed on Vercel with `REACT_APP_BACKEND_URL` set
- [ ] `CORS_ORIGINS` on Render updated to the live Vercel URL
- [ ] Site loads, admin login works, blog/video/resource sections load data

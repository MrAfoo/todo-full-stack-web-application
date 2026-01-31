# 🚀 Render Deployment Guide for FastAPI Backend

## Prerequisites
- [ ] GitHub/GitLab account with your code pushed
- [ ] Render account (free tier works)
- [ ] Neon PostgreSQL database URL
- [ ] BETTER_AUTH_SECRET (same as in Vercel)

---

## 📋 Step-by-Step Deployment

### 1. **Prepare Your Repository**
Ensure these files exist in your `backend/` directory:
- ✅ `requirements.txt` (created)
- ✅ `render.yaml` (created)
- ✅ All application code

### 2. **Create Web Service on Render**

#### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub/GitLab repository
4. Render will auto-detect `render.yaml`
5. Click **"Apply"**

#### Option B: Manual Setup
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `todo-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` (or your default) |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && alembic upgrade head` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | `Free` |

---

### 3. **Configure Environment Variables** ⚠️

In Render dashboard, add these environment variables:

| Key | Value | Example |
|-----|-------|---------|
| `DATABASE_URL` | Your Neon PostgreSQL URL | `postgresql://user:pass@host.neon.tech/dbname?sslmode=require` |
| `BETTER_AUTH_SECRET` | **Same as Vercel frontend** | `your-32-char-secret-here` |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL | `https://your-app.vercel.app` |
| `DEBUG` | `False` | Production setting |
| `ALGORITHM` | `HS256` | Default |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `30` | Or your preference |

**CRITICAL**: 
- `BETTER_AUTH_SECRET` **MUST** match your Vercel frontend secret
- `ALLOWED_ORIGINS` should be your Vercel deployment URL (you'll update this after deploying frontend)

---

### 4. **Deploy**
1. Click **"Create Web Service"** or **"Apply"**
2. Render will:
   - Install dependencies
   - Run database migrations
   - Start the server
3. Wait 5-10 minutes for first deployment

---

### 5. **Get Your Backend URL**
After deployment, you'll get a URL like:
```
https://todo-backend-xxxx.onrender.com
```

**Save this URL!** You'll need it for Vercel frontend environment variable.

---

### 6. **Update Vercel Frontend**
Go to your Vercel project settings:
1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_URL` to your Render URL:
   ```
   https://todo-backend-xxxx.onrender.com
   ```
3. Redeploy your frontend

---

### 7. **Update CORS Origins in Render**
After deploying frontend, update `ALLOWED_ORIGINS` in Render:
1. Go to Render dashboard → Your service
2. Go to **Environment** tab
3. Update `ALLOWED_ORIGINS` to include both:
   ```
   https://your-app.vercel.app,http://localhost:3000
   ```
   (comma-separated, no spaces)
4. Save and redeploy

---

## 🔍 Testing Your Deployment

### Test Health Endpoint
```bash
curl https://todo-backend-xxxx.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

### Test API Documentation
Visit: `https://todo-backend-xxxx.onrender.com/docs`

---

## ⚠️ Important Notes

### Database Migrations
The build command includes `alembic upgrade head` which runs migrations automatically on each deploy.

### Cold Starts (Free Tier)
Render free tier spins down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.

### Logs
View logs in Render dashboard: **Your Service** → **Logs** tab

### SSL/HTTPS
Render provides free SSL certificates automatically.

---

## 🐛 Troubleshooting

### Build Fails
- Check Python version compatibility
- Verify `requirements.txt` has all dependencies
- Check logs in Render dashboard

### Database Connection Issues
- Ensure `DATABASE_URL` includes `?sslmode=require` for Neon
- Verify database URL is correct
- Check if database allows connections from Render IPs

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes your Vercel URL
- Ensure no trailing slashes in URLs
- Check browser console for exact CORS error

### Authentication Issues
- Verify `BETTER_AUTH_SECRET` matches frontend
- Check if secret is at least 32 characters
- Ensure environment variables are saved

---

## 📊 Monitoring

### Health Checks
Render automatically monitors `/health` endpoint (configured in render.yaml)

### Manual Checks
```bash
# Check service status
curl https://todo-backend-xxxx.onrender.com/

# Check database connection (register a user)
curl -X POST https://todo-backend-xxxx.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

---

## 🔄 Future Deployments

Render auto-deploys on every push to your main branch. To disable:
1. Go to **Settings** → **Build & Deploy**
2. Toggle **"Auto-Deploy"** off

---

## 💰 Cost

Free tier includes:
- 750 hours/month (enough for 1 service)
- Automatic SSL
- Auto-deploy from Git
- 100 GB bandwidth/month

**Upgrade to paid tier to avoid cold starts ($7/month)**

---

## ✅ Deployment Checklist

- [ ] Create `requirements.txt` in backend folder
- [ ] Push code to GitHub/GitLab
- [ ] Create Render web service
- [ ] Add all environment variables
- [ ] Deploy and wait for build
- [ ] Test health endpoint
- [ ] Copy backend URL
- [ ] Update Vercel `NEXT_PUBLIC_API_URL`
- [ ] Update Render `ALLOWED_ORIGINS` with Vercel URL
- [ ] Test full authentication flow

---

## 🔗 Quick Links

- [Render Dashboard](https://dashboard.render.com/)
- [Render Docs](https://render.com/docs)
- [Neon Console](https://console.neon.tech/)
- [Vercel Dashboard](https://vercel.com/dashboard)

---

Need help? Check logs in Render dashboard or test endpoints using `/docs` interface!

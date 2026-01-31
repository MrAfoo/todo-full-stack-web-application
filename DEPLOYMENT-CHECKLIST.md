# 🚀 Complete Deployment Checklist

## Overview
This guide walks you through deploying your full-stack Todo app:
- **Frontend**: Next.js on Vercel
- **Backend**: FastAPI on Render
- **Database**: PostgreSQL on Neon

---

## 📦 Pre-Deployment Preparation

### ✅ Files Created
- [x] `backend/requirements.txt` - Python dependencies
- [x] `backend/render.yaml` - Render configuration
- [x] Updated `backend/app/config.py` - CORS documentation

### ✅ What You Have
- [x] Neon PostgreSQL database URL
- [x] BETTER_AUTH_SECRET (32+ characters)

### ⏳ What You Need
- [ ] GitHub/GitLab repository with code pushed
- [ ] Render account (free)
- [ ] Vercel account (free)

---

## 🎯 Deployment Order

**IMPORTANT**: Deploy in this order to avoid configuration issues!

1. ✅ Database (Neon) - Already done
2. → Backend (Render)
3. → Frontend (Vercel)
4. → Update CORS settings

---

## 📝 Step 1: Deploy Backend to Render

### A. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### B. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### C. Configure Service

| Setting | Value |
|---------|-------|
| **Name** | `todo-backend` (or your choice) |
| **Region** | Choose closest region |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt && alembic upgrade head` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Plan** | `Free` |

### D. Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**:

| Key | Value | Where to Get |
|-----|-------|--------------|
| `DATABASE_URL` | `postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require` | Neon dashboard |
| `BETTER_AUTH_SECRET` | Your 32+ char secret | Same as Vercel |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Update after Vercel deploy |
| `DEBUG` | `False` | Production setting |

### E. Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for build
3. **Save your backend URL**: `https://todo-backend-xxxx.onrender.com`

### F. Verify Backend

Test these endpoints:
```bash
# Health check
curl https://your-backend.onrender.com/health

# Should return: {"status": "healthy"}

# API docs
# Open in browser: https://your-backend.onrender.com/docs
```

**Status**: [ ] Backend deployed successfully

---

## 🌐 Step 2: Deploy Frontend to Vercel

### A. Configure Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Next.js` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (auto-detected) |
| **Output Directory** | `.next` (auto-detected) |

### B. Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.onrender.com` | Your Render URL from Step 1 |
| `BETTER_AUTH_SECRET` | Your 32+ char secret | **MUST match backend** |
| `DATABASE_URL` | `postgresql://...` | Same as backend |

### C. Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes
3. **Save your frontend URLs**:
   - Production: `https://your-app.vercel.app`
   - Preview: `https://your-app-git-main-username.vercel.app`

**Status**: [ ] Frontend deployed successfully

---

## 🔄 Step 3: Update CORS Configuration

Now that frontend is deployed, update backend CORS settings.

### A. Update Render Environment Variables

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click your `todo-backend` service
3. Go to **"Environment"** tab
4. Edit `ALLOWED_ORIGINS`:

```
https://your-app.vercel.app,http://localhost:3000
```

**Replace** `your-app.vercel.app` with your **actual Vercel URL**

5. Click **"Save Changes"**
6. Service will auto-redeploy (~2 minutes)

### B. Optional: Add Preview Domains

If you want preview deployments to work:

```
https://your-app.vercel.app,https://your-app-git-main-username.vercel.app,http://localhost:3000
```

**Status**: [ ] CORS configured

---

## 🧪 Step 4: Test Your Deployment

### Test 1: Open Frontend
Visit: `https://your-app.vercel.app`

**Expected**: Page loads without errors

### Test 2: Register User
1. Click "Register" or navigate to `/register`
2. Enter email and password
3. Submit form

**Expected**: User created, redirected to login or dashboard

### Test 3: Login
1. Enter credentials
2. Submit

**Expected**: Logged in, redirected to dashboard

### Test 4: Create Todo
1. Create a new todo item
2. Verify it appears in list

**Expected**: Todo saved and displayed

### Test 5: Check Browser Console
Press F12 → Console tab

**Expected**: No CORS errors, no authentication errors

**Status**: [ ] All tests passed

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch" or CORS errors

**Solution**:
1. Verify `NEXT_PUBLIC_API_URL` in Vercel matches Render URL exactly
2. Verify `ALLOWED_ORIGINS` in Render includes your Vercel URL
3. No trailing slashes in URLs
4. Wait 2 minutes after changes (both services need to redeploy)

### Issue: "Authentication failed"

**Solution**:
1. Verify `BETTER_AUTH_SECRET` is **identical** in both Vercel and Render
2. Must be 32+ characters
3. Redeploy both services after changing

### Issue: Database connection errors

**Solution**:
1. Verify `DATABASE_URL` includes `?sslmode=require`
2. Check Neon dashboard - database should be running
3. Test connection from Render logs

### Issue: Render build fails

**Solution**:
1. Check if `backend/requirements.txt` exists
2. Verify build command is correct
3. Check Render logs for specific error

### Issue: Vercel build fails

**Solution**:
1. Verify root directory is set to `frontend`
2. Check if `package.json` exists in frontend folder
3. Verify all environment variables are set

---

## 📊 Environment Variables Summary

### Backend (Render)
```env
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
BETTER_AUTH_SECRET=your-32-char-secret-here
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
DEBUG=False
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
BETTER_AUTH_SECRET=your-32-char-secret-here
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require
```

**Critical**: `BETTER_AUTH_SECRET` must be **identical** in both!

---

## 🔗 Quick Links

- [Render Dashboard](https://dashboard.render.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [Neon Console](https://console.neon.tech/)
- Your Backend: `https://your-backend.onrender.com/docs`
- Your Frontend: `https://your-app.vercel.app`

---

## 📖 Additional Documentation

- **Detailed Render Guide**: See `RENDER-DEPLOYMENT-GUIDE.md`
- **CORS Configuration**: See `CORS-SETUP-GUIDE.md`
- **Better Auth Setup**: See `BETTER-AUTH-SETUP.md`

---

## ✅ Final Checklist

- [ ] Code pushed to GitHub/GitLab
- [ ] Backend deployed to Render
- [ ] Backend URL saved
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL saved
- [ ] All environment variables set correctly
- [ ] CORS origins updated with Vercel URL
- [ ] Can register new user
- [ ] Can login
- [ ] Can create todos
- [ ] No console errors
- [ ] Both services auto-deploy on git push

---

## 🎉 Success!

If all tests pass, your app is live! 

**Free Tier Limits:**
- Render: 750 hours/month, 15-min cold start
- Vercel: 100 GB bandwidth, unlimited deployments
- Neon: 3 GB storage, 512 MB RAM

**Next Steps:**
- Add custom domain in Vercel
- Set up monitoring/alerts
- Consider upgrading for better performance
- Add CI/CD for automated testing

---

## 💡 Tips

1. **Cold Starts**: First request to Render (free tier) takes 30-60 seconds
2. **Auto-Deploy**: Both Render and Vercel auto-deploy on git push
3. **Preview Deployments**: Vercel creates preview for each PR
4. **Logs**: Check Render and Vercel dashboards for debugging
5. **Database**: Neon free tier is generous for small apps

---

Need help? Check the detailed guides or refer to service documentation!

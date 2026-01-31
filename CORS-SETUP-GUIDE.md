# 🌐 CORS Configuration Guide for Vercel + Render

## What is CORS?

CORS (Cross-Origin Resource Sharing) allows your frontend (Vercel) to make requests to your backend (Render). Without proper CORS setup, browsers will block API requests.

---

## ✅ Your Current CORS Setup

Your backend already has CORS middleware configured in `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,  # ← Controlled by env var
    allow_credentials=True,                        # ← Allows cookies/auth
    allow_methods=["*"],                           # ← All HTTP methods
    allow_headers=["*"],                           # ← All headers
)
```

---

## 🔧 Configuration Steps

### Step 1: Development (Local)
**Already configured!** Your `backend/.env.example` has:
```env
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

This allows your local Next.js dev server to connect.

---

### Step 2: Production on Render

When deploying to Render, set the `ALLOWED_ORIGINS` environment variable to include your Vercel domains.

#### Vercel gives you multiple preview URLs:

1. **Production URL**: `https://your-app.vercel.app`
2. **Git branch URLs**: `https://your-app-git-main-yourteam.vercel.app`
3. **Deployment URLs**: `https://your-app-xxxxx.vercel.app`

#### Recommended ALLOWED_ORIGINS for Render:

```env
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://*.vercel.app,http://localhost:3000
```

**Important Notes:**
- ❌ Render's standard CORS middleware **doesn't support wildcards** like `https://*.vercel.app`
- ✅ You need to list each domain explicitly
- ✅ Separate multiple domains with commas (no spaces)
- ✅ Include `http://localhost:3000` for local development testing

---

### Step 3: Alternative - Allow All Vercel Domains (Advanced)

If you want to allow all Vercel preview deployments, you'll need to modify the CORS logic.

**Option A: Update `backend/app/main.py`** (for dynamic Vercel domain matching):

```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import re

app = FastAPI(...)

# Custom CORS handler for Vercel domains
async def custom_cors_handler(request: Request, call_next):
    origin = request.headers.get("origin")
    response = await call_next(request)
    
    # Allow localhost and all Vercel domains
    if origin and (
        origin.startswith("http://localhost:") or
        origin.endswith(".vercel.app")
    ):
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

app.middleware("http")(custom_cors_handler)

# Keep existing CORS middleware for explicit domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Option B: Simple - Just list your specific Vercel URLs** (Recommended for beginners)

---

## 📝 Step-by-Step Setup

### 1. Deploy Frontend to Vercel First
This gives you the production URL.

### 2. Get Your Vercel URLs
After deploying, you'll have URLs like:
```
Production: https://my-todo-app.vercel.app
Preview:    https://my-todo-app-git-main-username.vercel.app
```

### 3. Configure Render Environment Variable

In Render dashboard:

1. Go to your service → **Environment** tab
2. Add/Edit `ALLOWED_ORIGINS`:
   ```
   https://my-todo-app.vercel.app,https://my-todo-app-git-main-username.vercel.app,http://localhost:3000
   ```
3. Click **Save Changes**
4. Service will auto-redeploy

### 4. Configure Vercel Environment Variable

In Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_API_URL`:
   ```
   https://your-backend.onrender.com
   ```
3. Redeploy frontend

---

## 🧪 Testing CORS

### Test 1: Browser Console
1. Open your Vercel app in browser
2. Open Developer Tools (F12)
3. Try to login/register
4. Check Console tab for CORS errors

**Success**: No CORS errors
**Failure**: See "CORS policy" error messages

### Test 2: Manual Request
```bash
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.onrender.com/auth/login \
     -v
```

Look for these headers in response:
```
Access-Control-Allow-Origin: https://your-app.vercel.app
Access-Control-Allow-Credentials: true
```

### Test 3: Full Authentication Flow
1. Register a new user from Vercel frontend
2. Login with that user
3. Create a todo
4. Verify no CORS errors in browser console

---

## ❌ Common CORS Issues & Solutions

### Issue 1: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Cause**: Your Vercel URL is not in `ALLOWED_ORIGINS`

**Solution**:
1. Check exact Vercel URL (copy from browser)
2. Add it to Render `ALLOWED_ORIGINS` env var
3. Redeploy Render service

### Issue 2: "CORS policy: Credentials flag is true"
**Cause**: Mismatch in credentials handling

**Solution**: Already handled! Your config has:
```python
allow_credentials=True
```

### Issue 3: Works locally but not in production
**Cause**: Production URLs not in `ALLOWED_ORIGINS`

**Solution**: 
1. Verify Render env vars include Vercel URL
2. Check for typos (https vs http, trailing slashes)
3. Restart Render service

### Issue 4: Preflight request fails
**Cause**: OPTIONS request blocked

**Solution**: Already handled! Your config allows all methods:
```python
allow_methods=["*"]
```

---

## 🔒 Security Best Practices

### ✅ DO:
- List specific domains you control
- Use HTTPS in production
- Include only necessary origins
- Keep `allow_credentials=True` for auth

### ❌ DON'T:
- Use `allow_origins=["*"]` with credentials
- Include untrusted domains
- Use HTTP in production (except localhost)
- Forget to update after domain changes

---

## 📋 Quick Reference

### Environment Variables Summary

**Render (Backend)**:
```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-here
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:3000
DEBUG=False
```

**Vercel (Frontend)**:
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
BETTER_AUTH_SECRET=your-secret-here (same as backend)
DATABASE_URL=postgresql://... (same as backend)
```

---

## 🔄 Update Process

When you get a new Vercel domain (new branch, etc.):

1. **Copy the new Vercel URL**
2. **Update Render**: Add URL to `ALLOWED_ORIGINS` (comma-separated)
3. **Save**: Render auto-redeploys
4. **Test**: Verify in browser

Takes ~2 minutes total.

---

## 💡 Tips

- **Vercel Auto-Deploys**: Every git push creates a new preview URL
- **Custom Domains**: If you add a custom domain to Vercel, add it to CORS too
- **Logs**: Check Render logs if CORS still fails after configuration
- **Cache**: Clear browser cache if changes don't take effect

---

## ✅ Checklist

- [ ] Frontend deployed to Vercel
- [ ] Copy production Vercel URL
- [ ] Add Vercel URL to Render `ALLOWED_ORIGINS`
- [ ] Add Render URL to Vercel `NEXT_PUBLIC_API_URL`
- [ ] Redeploy both services
- [ ] Test authentication flow
- [ ] Check browser console for errors
- [ ] Verify API calls succeed

---

Done! Your CORS should now be properly configured for Vercel + Render deployment. 🎉

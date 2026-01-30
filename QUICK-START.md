# Quick Start - JWT Authentication Setup

## 🚀 Get Started in 5 Minutes

### Step 1: Set Environment Variables

Create `.env` files with the **SAME SECRET KEY**:

**backend/.env**
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
BETTER_AUTH_SECRET=my-super-secret-key-at-least-32-characters-long-123456
```

**frontend/.env.local**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=my-super-secret-key-at-least-32-characters-long-123456
DATABASE_URL=postgresql://postgres:password@localhost:5432/todo_db
```

### Step 2: Run Database Migrations

```bash
# Better Auth tables
cd frontend
npx better-auth migrate

# FastAPI tables
cd ../backend
alembic upgrade head
```

### Step 3: Start Services

```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 4: Test

1. Open `http://localhost:3000/register`
2. Create an account
3. Create some tasks
4. Check DevTools Network tab to see JWT tokens in action!

## 🔍 What Changed?

### Frontend
- ✅ Better Auth handles login/register/sessions
- ✅ JWT tokens automatically attached to API requests
- ✅ Sessions managed with cookies

### Backend
- ✅ Verifies JWT tokens from Better Auth
- ✅ Uses shared secret for validation
- ✅ Filters all data by authenticated user

## 🔐 Security

- JWT tokens expire after 7 days
- Each user can only access their own tasks
- Tokens verified with cryptographic signatures
- No passwords stored in frontend

## 📝 Key Files Modified

### Frontend
- `lib/auth-server.ts` - Better Auth config with JWT plugin
- `lib/auth-client.ts` - Client-side auth helpers
- `lib/api.ts` - Auto-attach JWT tokens
- `app/(auth)/login/page.tsx` - Better Auth login
- `app/(auth)/register/page.tsx` - Better Auth register
- `app/dashboard/page.tsx` - Session management

### Backend
- `app/config.py` - Added `better_auth_secret` support
- `app/services/auth.py` - JWT verification with shared secret
- `app/routers/tasks.py` - Already secured with JWT middleware

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| 401 Unauthorized | Check that `BETTER_AUTH_SECRET` matches in both .env files |
| Token not found | Clear cookies/localStorage and login again |
| CORS errors | Verify `ALLOWED_ORIGINS` in backend config |
| Better Auth migration fails | Ensure DATABASE_URL is correct in frontend .env.local |

## 🎯 Next Steps

- Generate a cryptographically secure secret for production
- Set up proper HTTPS in production
- Configure token refresh for longer sessions
- Add rate limiting to prevent abuse

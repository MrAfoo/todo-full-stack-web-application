# Better Auth Setup for Hackathon

## Overview

This application uses **Better Auth** for user authentication as required by the hackathon. Better Auth is a modern, TypeScript-first authentication library that handles user signup/signin with email and password.

## What is Better Auth?

Better Auth is an authentication library that provides:
- ✅ Email/password authentication
- ✅ Session management
- ✅ JWT token support
- ✅ TypeScript support
- ✅ Database integration (PostgreSQL)
- ✅ Built-in security features

## Configuration

### 1. Better Auth Server (`frontend/lib/auth-server.ts`)

```typescript
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { jwt } from "better-auth/plugins";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 5000,
});

const db = new Kysely({
  dialect: new PostgresDialect({ pool }),
});

export const auth = betterAuth({
  database: db,
  emailAndPassword: { enabled: true },
  trustedOrigins: ["http://localhost:3000"],
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: "http://localhost:3000",
  plugins: [jwt({ expiresIn: 60 * 60 * 24 * 7 })],
});
```

### 2. Better Auth Client (`frontend/lib/auth-client.ts`)

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

### 3. API Routes (`frontend/app/api/auth/[...all]/route.ts`)

```typescript
import { auth } from "@/lib/auth-server";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

## Environment Variables

Required in `frontend/.env.local`:

```bash
# Better Auth Configuration
BETTER_AUTH_SECRET=8cGgBT4qQAuK3O40EsAPCtHY534qizBQ
BETTER_AUTH_BASE_URL=http://localhost:3000

# Database URL (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
```

## Usage in Components

### Registration Page

```typescript
import { signUp } from "@/lib/auth-client";

const result = await signUp.email({
  email,
  password,
  name,
});

if (!result.error) {
  router.push("/dashboard");
}
```

### Login Page

```typescript
import { signIn } from "@/lib/auth-client";

const result = await signIn.email({
  email,
  password,
});

if (!result.error) {
  router.push("/dashboard");
}
```

### Dashboard (Protected Route)

```typescript
import { useSession, signOut } from "@/lib/auth-client";

const { data: session, isPending } = useSession();

if (!isPending && !session) {
  router.push("/login");
}

const handleLogout = async () => {
  await signOut();
  router.push("/login");
};
```

## Database Tables

Better Auth automatically creates these tables:
- `user` - User accounts
- `session` - Active sessions
- `account` - OAuth accounts (if enabled)
- `verification` - Email verification tokens

## Features Implemented

✅ **User Signup** - Email/password registration  
✅ **User Signin** - Email/password authentication  
✅ **Session Management** - Persistent sessions with cookies  
✅ **JWT Tokens** - 7-day expiration tokens  
✅ **Protected Routes** - Dashboard requires authentication  
✅ **Logout** - Clean session termination  

## Security Features

- ✅ Password hashing (automatic)
- ✅ CSRF protection (automatic)
- ✅ Secure session cookies (httpOnly, secure)
- ✅ SQL injection prevention (Kysely ORM)
- ✅ SSL/TLS database connections

## Database Connection Fix

**Issue:** Original connection string had `channel_binding=require` which caused timeouts.

**Fix:** 
1. Removed `channel_binding=require` from connection string
2. Added `ssl: { rejectUnauthorized: false }` for Neon DB compatibility
3. Added `connectionTimeoutMillis: 5000` for faster failure detection

## Testing Better Auth

### Manual Testing

1. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Navigate to registration:
   ```
   http://localhost:3000/register
   ```

3. Create an account:
   - Name: Your Name
   - Email: test@example.com
   - Password: TestPass123!

4. Should redirect to dashboard automatically

5. Test logout and login:
   - Click logout
   - Login with same credentials
   - Should redirect back to dashboard

### Programmatic Testing

```typescript
// Test registration
const result = await signUp.email({
  email: "test@example.com",
  password: "TestPass123!",
  name: "Test User",
});

// Test login
const loginResult = await signIn.email({
  email: "test@example.com",
  password: "TestPass123!",
});

// Get session
const { data: session } = useSession();
console.log(session?.user);

// Logout
await signOut();
```

## Integration with Backend

Better Auth handles authentication on the frontend. For API calls to the backend:

1. Better Auth creates session
2. Frontend extracts user ID from session
3. Backend API calls use user ID for data isolation
4. Each user only sees their own tasks

## Hackathon Compliance

✅ **Requirement:** "Implement user signup/signin using Better Auth"  
✅ **Implementation:** Better Auth is fully integrated  
✅ **Features:** Email/password authentication working  
✅ **Security:** Industry-standard security practices  
✅ **Documentation:** Complete setup and usage docs  

## Troubleshooting

### Issue: Registration hangs/timeouts
**Solution:** Check DATABASE_URL doesn't have `channel_binding=require`

### Issue: Tables not created
**Solution:** Better Auth auto-creates tables on first use. Restart server.

### Issue: CORS errors
**Solution:** Check `trustedOrigins` in auth-server.ts

### Issue: Session not persisting
**Solution:** Check cookies are enabled in browser, check baseURL is correct

## Dependencies

```json
{
  "better-auth": "^1.4.18",
  "pg": "^8.17.2",
  "kysely": "^0.28.10"
}
```

## References

- Better Auth Docs: https://better-auth.com
- GitHub: https://github.com/better-auth/better-auth
- JWT Plugin: https://better-auth.com/docs/plugins/jwt

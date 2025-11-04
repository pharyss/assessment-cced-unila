# 🔧 Quick CORS Fix Guide

## 🔴 Problem

You're seeing **OPTIONS** requests instead of **GET** requests. This is a CORS (Cross-Origin Resource Sharing) issue.

**Why?** Your frontend (`http://localhost:3001`) and backend (`http://localhost:3000`) are on different origins (different ports), so the browser blocks requests for security.

## 📊 What's Happening

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (http://localhost:3001)                            │
│                                                              │
│  Your Frontend sends GET request to:                        │
│  http://localhost:3000/tests/1                              │
│                                                              │
│  ❌ BLOCKED! Different origin (3001 ≠ 3000)                │
│                                                              │
│  Browser sends OPTIONS first (preflight check):             │
│  "Is http://localhost:3001 allowed to access this?"        │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ OPTIONS /tests/1
                           │ Origin: http://localhost:3001
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend (http://localhost:3000)                            │
│                                                              │
│  ❌ NO CORS configured:                                     │
│     Returns 200 OK but missing headers:                     │
│     - Access-Control-Allow-Origin                           │
│     - Access-Control-Allow-Methods                          │
│                                                              │
│  ✅ WITH CORS configured:                                   │
│     Returns headers:                                        │
│     - Access-Control-Allow-Origin: http://localhost:3001   │
│     - Access-Control-Allow-Methods: GET, POST, etc.        │
│                                                              │
│  Then actual GET request proceeds ✓                         │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Solution Options

Choose **ONE** of these solutions:

### Option 1: Configure Backend CORS (Recommended)

**This is the proper solution.** Ask your backend team to add CORS headers.

#### For Express.js Backend:

```bash
# Install CORS package
npm install cors
# or
pnpm add cors
```

```javascript
// In your backend server.js or app.js
const express = require('express');
const cors = require('cors');

const app = express();

// Add this BEFORE your routes
app.use(cors({
  origin: 'http://localhost:3001',  // Your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Your routes here...
app.get('/tests/:id', (req, res) => {
  res.json({ status: 'success', data: { id: req.params.id } });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

#### For Bun + Elysia Backend:

```typescript
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const app = new Elysia()
  .use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  .get('/tests/:id', ({ params }) => {
    return { status: 'success', data: { id: params.id } };
  })
  .listen(3000);
```

**Restart your backend** after making these changes!

---

### Option 2: Use Next.js Proxy (Quick Dev Fix)

**This bypasses CORS during development** by routing API calls through Next.js.

#### Step 1: Update `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_USE_PROXY=true
```

#### Step 2: Restart Frontend

```bash
# Stop the dev server (Ctrl+C)
pnpm dev
```

**How it works:**
- Requests go to `/api/tests/1` (same origin)
- Next.js forwards them to `http://localhost:3000/tests/1`
- No CORS issues! ✅

**Note:** This only works in development. You'll need proper CORS for production.

---

## 🧪 Testing

After applying the fix:

1. **Open DevTools** → Network tab
2. **Refresh the page**
3. **Look for the request** to `/tests/1`
4. **You should see:**
   - `GET` method (not OPTIONS)
   - Status: `200 OK`
   - Response with test data

---

## 🐛 Still Not Working?

### Check 1: Backend is Running

```bash
curl http://localhost:3000/tests/1
```

Should return JSON data. If "connection refused", your backend isn't running.

### Check 2: Check Response Headers

In DevTools → Network → Click request → Headers tab

**Look for:**
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE
```

If missing, backend CORS is not configured.

### Check 3: Clear Cache

```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Check 4: Restart Everything

```bash
# Stop both servers
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
pnpm dev
```

---

## 📋 Quick Reference

| Solution | Pros | Cons | Use When |
|----------|------|------|----------|
| **Backend CORS** | Proper fix, works in production | Requires backend changes | Production ready |
| **Next.js Proxy** | Quick fix, no backend changes | Development only | Quick testing |

---

## 🎯 Recommended Approach

1. **For Development:** Use Next.js proxy (`NEXT_PUBLIC_USE_PROXY=true`)
2. **For Production:** Configure proper CORS on backend
3. **Best Practice:** Do both!

---

## 📞 Need Help?

1. Share this guide with your backend team
2. Check full documentation: `docs/CORS_SETUP.md`
3. Verify backend is on port 3000: `http://localhost:3000/docs`

---

**TL;DR:**

```bash
# Quick Fix (Development)
# Add to .env.local:
NEXT_PUBLIC_USE_PROXY=true

# Then restart:
pnpm dev
```

**Proper Fix (Backend - Express):**

```javascript
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3001' }));
```

That's it! 🎉
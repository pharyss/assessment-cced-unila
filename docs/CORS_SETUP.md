# CORS Setup Guide

## 🔴 Problem: OPTIONS Request Instead of GET

If you're seeing **OPTIONS** requests instead of **GET** requests, this is a **CORS preflight** issue. The browser is checking if the backend allows cross-origin requests before sending the actual request.

## 📖 What is CORS?

**CORS** (Cross-Origin Resource Sharing) is a security mechanism that restricts web pages from making requests to a different domain than the one serving the web page.

In your case:
- **Frontend**: `http://localhost:3001` (Next.js)
- **Backend**: `http://localhost:3000` (API)

These are **different origins** (different ports), so CORS must be configured.

---

## 🛠️ Solution: Configure Backend CORS

Your **backend** needs to allow requests from your frontend origin. Here are configurations for common frameworks:

### 1. Express.js (Node.js)

Install the CORS package:

```bash
npm install cors
# or
pnpm add cors
```

**Basic Setup:**

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Allow all origins (development only!)
app.use(cors());

// OR: Allow specific origin (recommended)
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400 // 24 hours
}));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

**Production Setup:**

```javascript
const allowedOrigins = [
  'http://localhost:3001',
  'https://yourdomain.com',
  'https://www.yourdomain.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### 2. Bun + Elysia

```typescript
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';

const app = new Elysia()
  .use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
  }))
  .get('/tests/:id', ({ params }) => {
    return { status: 'success', data: { id: params.id } };
  })
  .listen(3000);

console.log('🦊 Elysia is running at http://localhost:3000');
```

---

### 3. Hono (Edge Runtime)

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('/*', cors({
  origin: 'http://localhost:3001',
  allowMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400
}));

app.get('/tests/:id', (c) => {
  return c.json({ status: 'success', data: { id: c.req.param('id') } });
});

export default app;
```

---

### 4. Fastify

```javascript
const fastify = require('fastify')({ logger: true });

fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
});

fastify.get('/tests/:id', async (request, reply) => {
  return { status: 'success', data: { id: request.params.id } };
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
});
```

---

### 5. Next.js API Routes

If your backend is also Next.js:

```typescript
// app/api/tests/[id]/route.ts
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const response = NextResponse.json({
    status: 'success',
    data: { id: params.id }
  });

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
```

---

## 🔍 Debugging CORS Issues

### Check Browser Console

Open DevTools → Console, you might see errors like:

```
Access to fetch at 'http://localhost:3000/tests/1' from origin 
'http://localhost:3001' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

### Check Network Tab

1. Open DevTools → Network
2. Look for the request to `/tests/1`
3. Click on it
4. Check the **Headers** tab

**You should see:**

**Response Headers:**
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**If missing**, your backend CORS is not configured correctly.

---

## ✅ Testing CORS Configuration

### Method 1: Using curl

```bash
# Test OPTIONS (preflight)
curl -X OPTIONS http://localhost:3000/tests/1 \
  -H "Origin: http://localhost:3001" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Test GET
curl -X GET http://localhost:3000/tests/1 \
  -H "Origin: http://localhost:3001" \
  -v
```

**Expected response headers:**
```
Access-Control-Allow-Origin: http://localhost:3001
Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE
```

### Method 2: Using Postman

1. Open Postman
2. Create a GET request to `http://localhost:3000/tests/1`
3. Go to **Headers** tab
4. Add: `Origin: http://localhost:3001`
5. Send request
6. Check response headers for `Access-Control-Allow-Origin`

### Method 3: Browser Console

```javascript
fetch('http://localhost:3000/tests/1', {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => res.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('CORS Error:', err));
```

---

## 🚨 Common CORS Mistakes

### ❌ Mistake 1: Not Handling OPTIONS

Backend must respond to OPTIONS requests:

```javascript
// Express example
app.options('*', cors()); // Enable preflight for all routes
```

### ❌ Mistake 2: Wrong Origin Format

```javascript
// ❌ Wrong
origin: 'localhost:3001'

// ✅ Correct
origin: 'http://localhost:3001'
```

### ❌ Mistake 3: Using Wildcard with Credentials

```javascript
// ❌ Wrong
app.use(cors({
  origin: '*',
  credentials: true  // Can't use wildcard with credentials
}));

// ✅ Correct
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: false
}));
```

### ❌ Mistake 4: Missing Content-Type in Allowed Headers

```javascript
// ❌ Wrong
allowedHeaders: ['Authorization']

// ✅ Correct
allowedHeaders: ['Content-Type', 'Authorization']
```

---

## 🏭 Production Considerations

### Use Environment Variables

```javascript
// Backend
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3001'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: false
}));
```

**Backend `.env`:**
```env
ALLOWED_ORIGINS=http://localhost:3001,https://yourdomain.com
```

### Don't Use Wildcard in Production

```javascript
// ❌ Bad for production
app.use(cors({ origin: '*' }));

// ✅ Good for production
app.use(cors({ 
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com']
}));
```

---

## 🔧 Quick Fix for Development

If you need a **quick temporary fix** for development:

### Backend: Allow All Origins (Development Only!)

```javascript
// Express
app.use(cors());

// Elysia
app.use(cors({ origin: true }));

// Hono
app.use('/*', cors());
```

⚠️ **Warning**: Never use this in production!

---

## 📋 Checklist

- [ ] Backend CORS middleware installed and configured
- [ ] Frontend origin (`http://localhost:3001`) added to allowed origins
- [ ] All required methods (GET, POST, etc.) are allowed
- [ ] `Content-Type` header is in allowed headers
- [ ] OPTIONS requests are handled (preflight)
- [ ] Response headers include `Access-Control-Allow-Origin`
- [ ] No CORS errors in browser console
- [ ] Actual GET/POST requests work after OPTIONS

---

## 🆘 Still Having Issues?

### Check Backend is Running

```bash
curl http://localhost:3000/system/health
```

Should return a response (not connection refused).

### Check Backend Logs

Look for OPTIONS requests in your backend logs:

```
OPTIONS /tests/1 200 - 5ms
GET /tests/1 200 - 10ms
```

You should see **both** OPTIONS (preflight) and GET (actual request).

### Restart Both Servers

1. Stop backend (Ctrl+C)
2. Stop frontend (Ctrl+C)
3. Start backend: `cd backend && npm run dev`
4. Start frontend: `cd frontend && pnpm dev`
5. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

---

## 📚 Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Express CORS Package](https://www.npmjs.com/package/cors)
- [Understanding CORS](https://web.dev/cross-origin-resource-sharing/)

---

## 💡 TL;DR

**The backend needs to:**

1. Install CORS middleware
2. Allow origin: `http://localhost:3001`
3. Allow methods: `GET, POST, PATCH, PUT, DELETE, OPTIONS`
4. Allow headers: `Content-Type, Authorization`
5. Handle OPTIONS requests (preflight)

**Example for Express:**

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

That's it! 🎉

---

**Last Updated**: January 4, 2025  
**Contact**: Backend Team for CORS configuration assistance
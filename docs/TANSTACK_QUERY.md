# TanStack Query Implementation Guide

## 📚 Overview

This document explains how **TanStack Query** (formerly React Query) is implemented in this project for efficient data fetching, caching, and state management when interacting with the CCED Backend API.

## 🎯 Why TanStack Query?

TanStack Query provides several benefits over traditional data fetching:

- ✅ **Automatic Caching** - Data is cached and reused across components
- ✅ **Background Refetching** - Keeps data fresh automatically
- ✅ **Loading & Error States** - Built-in state management
- ✅ **Request Deduplication** - Prevents duplicate API calls
- ✅ **Optimistic Updates** - Better UX with instant feedback
- ✅ **DevTools** - Excellent debugging experience

## 📦 Installation

The package is already installed in this project:

```bash
pnpm add @tanstack/react-query
```

## 🏗️ Project Structure

```
assessment-cced-unila/
├── lib/
│   ├── api-client.ts          # API client with fetch wrapper
│   └── hooks/
│       └── useTests.ts         # React Query hooks for tests
├── types/
│   └── api.ts                  # TypeScript types for API responses
└── app/
    └── providers.tsx           # QueryClientProvider setup
```

## ⚙️ Configuration

### 1. QueryClient Setup (`app/providers.tsx`)

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 minute
      retry: 1,                        // Retry failed requests once
      refetchOnWindowFocus: false,     // Don't refetch on window focus
    },
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### 2. Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🔧 API Client (`lib/api-client.ts`)

The API client provides a consistent interface for making HTTP requests:

```typescript
import { apiClient, testsApi } from "@/lib/api-client";

// Generic methods
await apiClient.get("/endpoint");
await apiClient.post("/endpoint", data);
await apiClient.patch("/endpoint", data);
await apiClient.put("/endpoint", data);
await apiClient.delete("/endpoint");

// Specific API functions
await testsApi.getTest(1);
await testsApi.getTests({ page: 1, pageSize: 10 });
```

### Error Handling

The API client automatically handles errors and throws `ApiError`:

```typescript
try {
  const data = await testsApi.getTest(1);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message);
    console.error(error.status);
    console.error(error.errors); // Validation errors
  }
}
```

## 🪝 React Query Hooks (`lib/hooks/useTests.ts`)

### `useTest(testId, enabled?)`

Fetches a single test by ID.

**Parameters:**
- `testId` (number) - The ID of the test to fetch
- `enabled` (boolean, optional) - Whether to enable automatic fetching (default: true)

**Returns:**
- `data` - The API response with test data
- `isLoading` - Loading state
- `isError` - Error state
- `error` - Error object if failed
- `refetch` - Function to manually refetch

**Example:**

```typescript
"use client";

import { useTest } from "@/lib/hooks/useTests";

export default function TestPage() {
  const { data, isLoading, isError, error } = useTest(1);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data?.data?.name}</h1>
      <p>{data?.data?.description}</p>
    </div>
  );
}
```

### `useTests(params?)`

Fetches multiple tests with optional filtering.

**Parameters:**
- `params` (object, optional)
  - `page` (number) - Page number for pagination
  - `pageSize` (number) - Number of items per page
  - `search` (string) - Search query

**Example:**

```typescript
"use client";

import { useTests } from "@/lib/hooks/useTests";
import { useState } from "react";

export default function TestsListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTests({ page, pageSize: 10 });

  if (isLoading) return <div>Loading tests...</div>;

  return (
    <div>
      {data?.data?.map((test) => (
        <div key={test.id}>{test.name}</div>
      ))}
      
      <button onClick={() => setPage(page + 1)}>Next Page</button>
    </div>
  );
}
```

## 🎨 TypeScript Types (`types/api.ts`)

All API response types are defined for type safety:

```typescript
import type { Test, ApiResponse } from "@/types/api";

// Type-safe API responses
const response: ApiResponse<Test> = await testsApi.getTest(1);
const test: Test = response.data;
```

### Available Types

- `ApiResponse<T>` - Generic API response wrapper
- `Test` - Test object with instructions, notes, and questions
- `TestInstruction` - Test instruction item
- `TestNote` - Test note item
- `TestQuestion` - Test question with options
- `TestQuestionOption` - Question option/answer
- `Student` - Student information
- `TestSubmission` - Test submission record
- `TestSubmissionAnswer` - Answer to a question
- `TestResult` - Test result data

## 📝 Usage Examples

### Example 1: Conditional Fetching

```typescript
const [shouldFetch, setShouldFetch] = useState(false);
const { data } = useTest(1, shouldFetch);

return (
  <button onClick={() => setShouldFetch(true)}>
    Load Test
  </button>
);
```

### Example 2: Manual Refetch

```typescript
const { data, refetch } = useTest(1);

return (
  <button onClick={() => refetch()}>
    Refresh Data
  </button>
);
```

### Example 3: Dependent Queries

```typescript
const { data: test } = useTest(1);
const { data: subTest } = useTest(
  test?.data?.parentId ?? 0,
  !!test?.data?.parentId // Only fetch if parentId exists
);
```

### Example 4: With Loading States

```typescript
const { data, isLoading, isFetching, isError, error } = useTest(1);

if (isLoading) return <Spinner />;
if (isError) return <ErrorAlert message={error.message} />;
if (!data?.data) return <EmptyState />;

return <TestContent test={data.data} />;
```

## 🔄 Query Keys

Query keys are used for caching and invalidation:

```typescript
// Single test
["test", testId]

// Multiple tests with filters
["tests", { page: 1, pageSize: 10, search: "query" }]
```

## 🛠️ Advanced Usage

### Invalidate Cache

```typescript
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    // Update data...
    
    // Invalidate cache to trigger refetch
    await queryClient.invalidateQueries({ queryKey: ["test", 1] });
  };
}
```

### Prefetch Data

```typescript
const queryClient = useQueryClient();

await queryClient.prefetchQuery({
  queryKey: ["test", 1],
  queryFn: () => testsApi.getTest(1),
});
```

### Set Query Data Manually

```typescript
queryClient.setQueryData(["test", 1], newData);
```

## 🐛 Debugging

### Enable DevTools (Development Only)

```bash
pnpm add @tanstack/react-query-devtools
```

Add to `app/providers.tsx`:

```typescript
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Check Network Tab

All API requests go through `http://localhost:3000` (or your configured API URL). Check browser DevTools → Network tab to see requests.

## ⚠️ Common Issues

### Issue 1: "Cannot find module" Error

**Solution:** Ensure all imports use the `@/` alias:

```typescript
import { useTest } from "@/lib/hooks/useTests"; // ✅ Correct
import { useTest } from "../../../lib/hooks/useTests"; // ❌ Avoid
```

### Issue 2: Data Not Updating

**Solution:** Check `staleTime` configuration. Lower values = more frequent updates.

```typescript
const { data } = useTest(1, {
  staleTime: 0, // Always consider data stale
});
```

### Issue 3: CORS Errors

**Solution:** Ensure backend allows your frontend origin. Check backend CORS configuration.

### Issue 4: 404 Errors

**Solution:** Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches your backend URL.

## 📚 Best Practices

1. **Use Descriptive Query Keys** - Make cache invalidation easier
2. **Enable Queries Conditionally** - Use the `enabled` option to prevent unnecessary requests
3. **Handle Loading & Error States** - Always provide feedback to users
4. **Keep staleTime Reasonable** - Balance freshness with performance
5. **Use TypeScript** - Leverage type safety for API responses
6. **Centralize API Calls** - Keep all API functions in `lib/api-client.ts`
7. **Avoid Fetching in Loops** - Use batch endpoints when available

## 🔗 Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [API Schema](http://localhost:3000/docs/json)
- [API UI Documentation](http://localhost:3000/docs)

## 📞 Support

For questions about TanStack Query implementation in this project, contact the development team or refer to the official TanStack Query documentation.

---

**Last Updated:** 2025-01-04  
**Version:** 1.0.0
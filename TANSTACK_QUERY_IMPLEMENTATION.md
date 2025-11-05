# TanStack Query Implementation Summary

## 🎯 What Was Implemented

TanStack Query (React Query) has been successfully integrated into the project to fetch data from the CCED Backend API at `http://localhost:3000/tests/1`.

## 📦 Packages Installed

```bash
@tanstack/react-query  # Already installed in the project
```

## 📁 Files Created/Modified

### ✅ New Files Created

1. **`lib/api-client.ts`**
   - API client with fetch wrapper
   - Error handling for API responses
   - Specific API functions for tests endpoint
   - Base URL configuration from environment variables

2. **`lib/hooks/useTests.ts`**
   - `useTest(testId, enabled?)` - Fetch single test by ID
   - `useTests(params?)` - Fetch multiple tests with pagination
   - Type-safe React Query hooks

3. **`types/api.ts`**
   - TypeScript types for all API responses
   - `ApiResponse<T>` generic type
   - `Test`, `TestInstruction`, `TestNote`, `TestQuestion` interfaces
   - Error response types

4. **`.env.example`**
   - Template for environment variables
   - API URL configuration
   - SSO configuration placeholders

5. **`docs/TANSTACK_QUERY.md`**
   - Complete documentation
   - Usage examples
   - Troubleshooting guide
   - Best practices

### ✏️ Modified Files

1. **`app/providers.tsx`**
   - Added `QueryClientProvider` wrapper
   - Configured default query options
   - Setup caching and retry logic

2. **`app/assessment/talenta-mahasiswa/page.tsx`**
   - Changed from server component to client component
   - Implemented `useTest(1)` hook to fetch test data
   - Added loading, error, and success states
   - Displays test information, instructions, notes, and questions
   - Shows JSON preview of API response

## 🚀 How to Use

### 1. Set Up Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Run the Project

```bash
pnpm dev
```

### 3. Visit the Assessment Page

Navigate to: `http://localhost:3001/assessment/talenta-mahasiswa`

You'll see:
- ✅ Assessment introduction section
- ✅ Test data fetched from API
- ✅ Loading spinner while fetching
- ✅ Error message if fetch fails
- ✅ Complete test information displayed

## 📊 What's Displayed on the Page

The assessment page now shows:

1. **Test Metadata**
   - Test ID, Name, Description
   - Active status
   - Parent ID

2. **Instructions**
   - Ordered list of test instructions
   - Sorted by order field

3. **Notes**
   - Important notes for test takers
   - Highlighted in yellow boxes

4. **Questions Preview**
   - First 3 questions displayed
   - Question text, type, and options
   - Total question count

5. **Raw JSON Response**
   - Collapsible section showing full API response
   - Useful for debugging

## 🔧 API Endpoint Used

```
GET http://localhost:3000/tests/1
```

**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Test Name",
    "description": "Test Description",
    "active": true,
    "parentId": null,
    "createdAt": "2025-01-04T10:00:00.000Z",
    "instructions": [...],
    "notes": [...],
    "questions": [...]
  }
}
```

## 📖 Usage Examples

### Fetch Test Data

```typescript
"use client";

import { useTest } from "@/lib/hooks/useTests";

export default function MyComponent() {
  const { data, isLoading, isError, error } = useTest(1);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return <div>{data?.data?.name}</div>;
}
```

### Fetch Multiple Tests

```typescript
import { useTests } from "@/lib/hooks/useTests";

const { data } = useTests({ 
  page: 1, 
  pageSize: 10 
});
```

### Conditional Fetching

```typescript
const [enabled, setEnabled] = useState(false);
const { data } = useTest(1, enabled);
```

## ✨ Features

- ✅ **Automatic Caching** - Data cached for 5 minutes
- ✅ **Background Refetching** - Keeps data fresh
- ✅ **Error Handling** - Displays user-friendly error messages
- ✅ **Loading States** - Shows spinner during fetch
- ✅ **Type Safety** - Full TypeScript support
- ✅ **Reusable Hooks** - Easy to use across components
- ✅ **Environment Config** - API URL configurable via .env

## 🎨 UI States

### Loading State
```
┌─────────────────────────┐
│   🔄 Loading spinner    │
│  "Memuat data tes..."   │
└─────────────────────────┘
```

### Error State
```
┌─────────────────────────┐
│   ⚠️ Error icon         │
│  "Gagal memuat data"    │
│   Error message         │
└─────────────────────────┘
```

### Success State
```
┌─────────────────────────┐
│   ✅ Success banner     │
│   Test Information      │
│   Instructions          │
│   Notes                 │
│   Questions Preview     │
│   JSON Response         │
└─────────────────────────┘
```

## 🧪 Testing

### Test the Implementation

1. **Start Backend API** (on port 3000)
2. **Start Frontend** (on port 3001)
3. **Navigate to** `/assessment/talenta-mahasiswa`
4. **Verify**:
   - Data loads successfully
   - Instructions are displayed in order
   - Questions show with options
   - Loading state appears briefly
   - Error handling works (stop backend to test)

### Test Different Scenarios

```typescript
// Test with different test IDs
const { data } = useTest(2); // Test ID 2
const { data } = useTest(3); // Test ID 3

// Test with disabled query
const { data } = useTest(1, false); // Won't fetch

// Test manual refetch
const { refetch } = useTest(1);
refetch(); // Manual fetch
```

## 🛠️ Extending the Implementation

### Add New API Endpoints

1. Add function to `lib/api-client.ts`:

```typescript
export const studentsApi = {
  getStudent: (npm: string) => apiClient.get(`/students/${npm}`),
  getStudents: (params) => apiClient.get(`/students?${params}`),
};
```

2. Create hook in `lib/hooks/`:

```typescript
export function useStudent(npm: string) {
  return useQuery({
    queryKey: ["student", npm],
    queryFn: () => studentsApi.getStudent(npm),
  });
}
```

3. Use in component:

```typescript
const { data } = useStudent("2215061066");
```

## 📝 Environment Variables

Required in `.env.local`:

```env
# Backend API URL (required)
NEXT_PUBLIC_API_URL=http://localhost:3000

# Frontend URL (optional, for SSO)
NEXT_PUBLIC_BASE_URL=http://localhost:3001

# SSO App Key (optional)
NEXT_PUBLIC_APP_KEY=your_app_key_here
```

## 🚨 Important Notes

1. **Port Configuration**: The dev server now runs on port 3001 (configured in package.json)
2. **Client Components**: Pages using TanStack Query must be client components (`"use client"`)
3. **Metadata**: Metadata export doesn't work in client components - move to layout.tsx if needed
4. **CORS**: Backend must allow requests from frontend origin
5. **API Base URL**: Must be set in environment variables

## 📚 Documentation

Full documentation available in:
- **`docs/TANSTACK_QUERY.md`** - Complete guide with examples
- **API Schema**: `http://localhost:3000/docs/json`
- **API UI Docs**: `http://localhost:3000/docs`

## ✅ Next Steps

To continue development:

1. Add more API endpoints as needed
2. Create hooks for students, submissions, results
3. Implement mutations for POST/PATCH requests
4. Add optimistic updates for better UX
5. Consider adding React Query DevTools for debugging

## 🎓 Learning Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Project Documentation](./docs/TANSTACK_QUERY.md)
- [OpenAPI Schema](http://localhost:3000/docs/json)

---

**Implementation Date**: January 4, 2025  
**Developer**: AI Assistant  
**Status**: ✅ Complete and Working
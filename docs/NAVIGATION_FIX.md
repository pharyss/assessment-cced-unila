# Navigation Fix: Start Page → Career Path Page

## Problem Summary

Navigation from the start assessment page to the career path page was failing due to a **localStorage key mismatch** between the two components.

### Root Cause

- **StartAssessmentForm** was using: `"assessment:talenta-mahasiswa"`
- **CareerPathClient** was using: `"assessment-cced-unila-submission"`

When users submitted the start form, data was saved to localStorage with one key, but the career-path page was looking for data with a different key. This caused the career-path page to immediately redirect users back to the start page with an error message.

## Solution Implemented

### 1. Created Centralized Constants File

**File:** `lib/constants.ts`

Created a new constants file to centralize all shared keys and prevent future mismatches:

```typescript
export const ASSESSMENT_STORAGE_KEY = "assessment-cced-unila-submission";

export const TEST_IDS = {
  TALENTA_MAHASISWA: 1,
  CAREER_PATH_TEST_4: 4,
  CAREER_PATH_TEST_5: 5,
} as const;

export const ASSESSMENT_ROUTES = {
  START: "/assessment/talenta-mahasiswa/start",
  CAREER_PATH: "/assessment/talenta-mahasiswa/career-path",
} as const;
```

### 2. Updated StartAssessmentForm Component

**File:** `components/Assessment/StartAssessmentForm.tsx`

Changes made:
- Imported constants from `@/lib/constants`
- Replaced hardcoded storage key with `ASSESSMENT_STORAGE_KEY`
- Replaced hardcoded test ID with `TEST_IDS.TALENTA_MAHASISWA`
- Replaced hardcoded route with `ASSESSMENT_ROUTES.CAREER_PATH`
- Added verification step before navigation to ensure data is saved

```typescript
// Before
const storageKey = "assessment:talenta-mahasiswa";
const TALENTA_MAHASISWA_TEST_ID = 1;
router.push("/assessment/talenta-mahasiswa/career-path");

// After
import { ASSESSMENT_STORAGE_KEY, TEST_IDS, ASSESSMENT_ROUTES } from "@/lib/constants";
localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(submissionInfo));
const savedData = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
if (savedData) {
  router.push(ASSESSMENT_ROUTES.CAREER_PATH);
}
```

### 3. Updated CareerPathClient Component

**File:** `app/assessment/talenta-mahasiswa/career-path/client.tsx`

Changes made:
- Imported constants from `@/lib/constants`
- Replaced local `STORAGE_KEY` constant with imported `ASSESSMENT_STORAGE_KEY`
- Replaced hardcoded routes with `ASSESSMENT_ROUTES.START`
- Added enhanced console logging for debugging

```typescript
// Before
const STORAGE_KEY = "assessment-cced-unila-submission";
const storedData = localStorage.getItem(STORAGE_KEY);
router.push("/assessment/talenta-mahasiswa/start");

// After
import { ASSESSMENT_STORAGE_KEY, ASSESSMENT_ROUTES } from "@/lib/constants";
const storedData = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
console.log("✓ Checking localStorage for key:", ASSESSMENT_STORAGE_KEY);
router.push(ASSESSMENT_ROUTES.START);
```

## Benefits

1. **Fixed Navigation Issue**: Users can now successfully navigate from start page to career-path page
2. **Single Source of Truth**: All storage keys and routes are centralized
3. **Type Safety**: Constants are properly typed with TypeScript
4. **Maintainability**: Future changes only need to be made in one place
5. **Better Debugging**: Enhanced console logging helps identify issues quickly
6. **Prevents Future Issues**: Impossible to have key mismatches when using shared constants

## Testing Checklist

- [x] User can fill out start form and submit
- [x] Data is saved to localStorage with correct key
- [x] Navigation to career-path page succeeds
- [x] Career-path page can read data from localStorage
- [x] No TypeScript errors or warnings
- [x] Console logs show proper flow of data

## Files Modified

1. `lib/constants.ts` (new file)
2. `components/Assessment/StartAssessmentForm.tsx`
3. `app/assessment/talenta-mahasiswa/career-path/client.tsx`

## Next.js Best Practices Used

- ✅ Used `router.push()` from `next/navigation` (App Router)
- ✅ Proper "use client" directives in client components
- ✅ Async/await pattern for API calls
- ✅ Error handling with try/catch blocks
- ✅ Type-safe constants with `as const`
- ✅ Centralized configuration
- ✅ Console logging for debugging

## Notes

- The localStorage key `"assessment-cced-unila-submission"` was kept as the standard since it's more descriptive
- All navigation now uses the centralized route constants
- The solution is backward compatible - existing localStorage data with the new key will continue to work
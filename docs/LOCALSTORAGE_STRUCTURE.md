# localStorage Structure Documentation

## Overview

This document describes the localStorage structure used in the CCED UNILA Assessment application. We use three separate keys to store different types of data.

---

## 1. Student Identity (`cced-student-identity`)

### Purpose
Stores student demographic information.

### Structure
```json
{
  "studentId": "string",
  "nama": "string",
  "npm": "string (10 digits)",
  "email": "string",
  "angkatan": "string (4 digits)",
  "fakultas": "string",
  "prodi": "string",
  "jenjang": "string"
}
```

### When Set
- Created in `StartAssessmentForm.tsx` after successful student verification/creation

### When Read
- Not currently read (reserved for future use, e.g., displaying student info)

### Example
```json
{
  "studentId": "abc123",
  "nama": "John Doe",
  "npm": "1234567890",
  "email": "john@example.com",
  "angkatan": "2020",
  "fakultas": "Teknik",
  "prodi": "Informatika",
  "jenjang": "S1"
}
```

---

## 2. Test Answers (`cced-test-answer`)

### Purpose
Stores test submission ID, answer data, and completion flags.

### Structure
```json
{
  "testSubmissionId": "string",
  "answers": {},
  "careerPathComplete": boolean,
  "behaviorPatternComplete": boolean
}
```

### Answer Key Format

#### Career Path Test (Test 4 & 5)
- **Format**: `A-{order+1}` for Test 4, `B-{order+1}` for Test 5
- **Range**: `A-1` to `A-12` (12 questions), `B-1` to `B-28` (28 questions)
- **Value**: Selected option ID (string)

Example:
```json
{
  "A-1": "option-id-123",
  "A-2": "option-id-456",
  "B-1": "option-id-789"
}
```

#### Behavior Pattern Test (Test 6)
- **Format**: `{order+1}` (1-based index)
- **Range**: `1` to `36` (36 questions total, 6 dimensions × 6 questions)
- **Value**: Selected option ID (string)

Example:
```json
{
  "1": "option-id-abc",
  "2": "option-id-def",
  "3": "option-id-ghi"
}
```

### When Set
- **Initial**: Created in `StartAssessmentForm.tsx` with empty answers
- **Updated**: 
  - Career path: As user selects answers in `career-path/client.tsx`
  - Behavior pattern: As user selects answers in `behavior-pattern/client.tsx`
- **Completion flags**: Set when user completes each test section

### When Read
- Career path page: Loads existing answers to pre-select options
- Behavior pattern page: Loads existing answers to pre-select options
- Result page: Reads answers for calculation (via `useAssessmentFlow`)

### Full Example
```json
{
  "testSubmissionId": "submission-uuid-123",
  "answers": {},
  "careerPathComplete": true,
  "behaviorPatternComplete": true
}
```

---

## 3. Test Results (`cced-test-result`)

### Purpose
Stores calculated results and tracks whether results have been saved to the backend.

### Structure
```json
{
  "testSubmissionId": "string",
  "results": {
    "nama": "string",
    "npm": "string",
    "email": "string",
    "mbtiType": "string (4 letters)",
    "kesesuaian": "string",
    "thinkingStyle": "string",
    "communicationStyle": "string",
    "workingStyle": "string",
    "behaviorDimensions": {},
    "karirDominanMBTI": "string",
    "karirSekunderMBTI": "string",
    "karirMinat": "string"
  },
  "resultsSaved": boolean
}
```

### When Set
- Created in `result/page.tsx` after calculating all results
- Updated with `resultsSaved: true` after successful backend save

### When Read
- Result page: Checks `resultsSaved` flag to prevent duplicate saves

### Example
```json
{
  "testSubmissionId": "submission-uuid-123",
  "results": {
    "nama": "John Doe",
    "npm": "1234567890",
    "email": "john@example.com",
    "mbtiType": "INTJ",
    "kesesuaian": "Sangat Sesuai",
    "thinkingStyle": "Analytical",
    "communicationStyle": "Direct",
    "workingStyle": "StructuredSolo",
    "behaviorDimensions": {
      "Responsibility": { "percentage": 75, "level": "Tinggi" },
      "Courage": { "percentage": 60, "level": "Sedang" }
    },
    "karirDominanMBTI": "Akademisi",
    "karirSekunderMBTI": "Wirausaha",
    "karirMinat": "Akademisi"
  },
  "resultsSaved": true
}
```

---

## Order vs ID Mapping

### Backend Data
Questions from the backend API have:
- `id`: Database primary key (used for API calls)
- `order`: 0-based sequential order (0, 1, 2, ...)

### Frontend Storage
We convert to 1-based order for storage:
- **Storage key**: `order + 1` (1-based)
- **API calls**: Use `id` (database key)

### Conversion Points

#### Saving to Backend
```javascript
// Frontend: answers["1"] = "option-id"
// Convert to: { testQuestionId: question.id, selectedOptionId: "option-id" }
```

#### Loading from Backend
```javascript
// Backend: { testQuestionId: "db-id-123", selectedOptionId: "option-id" }
// Convert to: answers[String(question.order + 1)] = "option-id"
```

---

## Calculation Logic

### Career Path (useAssessmentLogic.ts)

#### Minat Karir (A-1 to A-12)
```javascript
for (let i = 1; i <= 12; i++) {
  const key = `A-${i}`;
  const value = answers[key]; // Gets selected option label (A, B, C, D)
  // Match against JSON data to get category
  // Accumulate scores for each category
}
```

#### MBTI (B-1 to B-28)
```javascript
for (let i = 1; i <= 28; i++) {
  const key = `B-${i}`;
  const value = answers[key]; // Gets selected option label
  // Match against JSON data to get dimension (E/I, S/N, T/F, J/P)
  // Accumulate scores for each dimension
}
```

### Behavior Pattern (1 to 36)

```javascript
// 6 dimensions, 6 questions each
// Dimension 0: orders 1-6
// Dimension 1: orders 7-12
// ... etc.

dimensions.forEach(([dimKey, dimValue], dimIndex) => {
  const baseOrder = dimIndex * 6 + 1; // 1-based
  
  dimValue.questions.forEach((q, idx) => {
    const order = baseOrder + idx; // 1, 2, 3... or 7, 8, 9... etc.
    const value = answers[String(order)]; // Gets numeric value 1-5
    
    // Adjust for unfavorable questions
    const adjusted = q.type === "unfavorable" ? 6 - value : value;
    
    // Calculate average and percentage
  });
});
```

---

## Migration Notes

### Deprecated Keys
- `assessment:talenta-mahasiswa` - Old useAssessmentFlow storage (still used internally by the hook)
- `assessment-cced-unila-submission` - Old unified storage (replaced by three separate keys)

### Migration Strategy
The new keys are set on fresh form submission. Old keys are not automatically migrated. Users with incomplete assessments will need to restart.

---

## File Locations

### Set/Update
- `components/Assessment/StartAssessmentForm.tsx` - Sets STUDENT_IDENTITY_KEY and TEST_ANSWER_KEY
- `app/assessment/talenta-mahasiswa/career-path/client.tsx` - Updates TEST_ANSWER_KEY (answers + completion flag)
- `app/assessment/talenta-mahasiswa/behavior-pattern/client.tsx` - Updates TEST_ANSWER_KEY (answers + completion flag)
- `app/assessment/talenta-mahasiswa/result/page.tsx` - Sets TEST_RESULT_KEY

### Read
- `app/assessment/talenta-mahasiswa/career-path/client.tsx` - Reads TEST_ANSWER_KEY
- `app/assessment/talenta-mahasiswa/behavior-pattern/client.tsx` - Reads TEST_ANSWER_KEY
- `app/assessment/talenta-mahasiswa/result/page.tsx` - Reads TEST_ANSWER_KEY and TEST_RESULT_KEY

### Constants
- `lib/constants.ts` - Defines all localStorage keys

---

## Best Practices

1. **Always use constants**: Import from `lib/constants.ts`, never hardcode keys
2. **Validate before use**: Check if data exists before parsing
3. **Handle errors**: Wrap JSON.parse in try-catch
4. **Sync with backend**: Backend uses question IDs, frontend uses order-based keys
5. **Type safety**: Parse with proper TypeScript types
6. **Clear on logout**: Consider clearing localStorage when user logs out or starts new assessment

---

## Example Usage

### Saving Student Identity
```typescript
import { STUDENT_IDENTITY_KEY } from "@/lib/constants";

const studentData = { studentId, nama, npm, email, angkatan, fakultas, prodi, jenjang };
localStorage.setItem(STUDENT_IDENTITY_KEY, JSON.stringify(studentData));
```

### Reading Test Answers
```typescript
import { TEST_ANSWER_KEY } from "@/lib/constants";

const storedData = localStorage.getItem(TEST_ANSWER_KEY);
if (storedData) {
  const answerData = JSON.parse(storedData);
  const submissionId = answerData.testSubmissionId;
  const answers = answerData.answers;
}
```

### Checking Result Save Status
```typescript
import { TEST_RESULT_KEY } from "@/lib/constants";

const storedResults = localStorage.getItem(TEST_RESULT_KEY);
if (storedResults) {
  const resultData = JSON.parse(storedResults);
  if (resultData.resultsSaved) {
    console.log("Results already saved");
  }
}
```

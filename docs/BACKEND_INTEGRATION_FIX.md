# Backend Integration Fix for Behavior Pattern Assessment

## Problem Statement

The behavior pattern assessment was using hardcoded questions and options from `BehaviorPattern.json` instead of fetching authoritative data from the backend API. This caused:

1. **Value mismatch**: Frontend computed option values (1-5) based on array index instead of using backend `option.value` field
2. **Data inconsistency**: Selected options stored as UUIDs couldn't be properly converted to numeric values for calculation
3. **Invalid results**: Calculation returned only 1 dimension with invalid percentages (e.g., -350%)

## Root Cause Analysis

### Before Fix

```typescript
// ❌ OLD CODE - Computing value from index
const sortedOptions = [...question.options].sort((a, b) => a.order - b.order);
const optionIndex = sortedOptions.findIndex(opt => opt.id === selectedOptionId);
const numericValue = optionIndex + 1; // Computed from index!

// When saving answer
handleSelect(question.order, option.id, i + 1) // Using computed index!
```

**Issues:**
- Option value computed from array index position, not from backend `option.value` field
- If backend option order changed or data didn't match local assumptions, conversion failed
- `optionIndex` returned `-1` when option not found → resulted in value `0` or `NaN`

### Backend API Contract

According to OpenAPI schema (`GET /tests/{testId}/questions`):

```json
{
  "id": "uuid",
  "text": "Question text",
  "type": "likert",
  "order": 0,
  "options": [
    {
      "id": "uuid",
      "text": "Sangat Tidak Setuju",
      "value": "1",  // ✅ AUTHORITATIVE VALUE FROM BACKEND
      "order": 0,
      "testQuestionId": "uuid"
    },
    {
      "id": "uuid",
      "text": "Tidak Setuju",
      "value": "2",
      "order": 1,
      "testQuestionId": "uuid"
    }
    // ... more options
  ]
}
```

**Key insight**: Backend provides `option.value` field which is authoritative and should be used directly!

## Solution Implementation

### 1. Update Option Selection (UI)

**File**: `app/assessment/talenta-mahasiswa/behavior-pattern/client.tsx`

```typescript
// ✅ NEW CODE - Use backend option.value
{sortedOptions.map((option, i) => {
  const displayValue = i + 1; // Only for UI display
  return (
    <label key={option.id}>
      <input
        type="radio"
        onChange={() =>
          handleSelect(
            question.order,
            option.id,
            option.value  // ✅ Pass backend value directly!
          )
        }
      />
      <span>{displayValue}</span>
    </label>
  );
})}
```

### 2. Update handleSelect Function

```typescript
const handleSelect = (
  questionOrder: number,
  optionId: string,
  optionValue: string,  // ✅ Receive backend value as string
) => {
  const orderKey = String(questionOrder + 1);
  
  // Store optionId for backend submission
  setAnswers((prev) => ({
    ...prev,
    [orderKey]: optionId,
  }));

  // Parse and save numeric value for calculation
  const numericValue = parseInt(optionValue, 10);
  if (!isNaN(numericValue)) {
    saveAnswer(orderKey, String(numericValue));
    console.log(`✓ Saved: key="${orderKey}", value=${numericValue}`);
  } else {
    console.error(`❌ Invalid value: "${optionValue}"`);
  }
};
```

### 3. Update Answer Loading from Backend

**When loading previously saved answers:**

```typescript
// ✅ NEW CODE - Extract value from backend option data
const question = test.questions.find(q => q.id === answer.testQuestionId);
if (question) {
  const selectedOption = question.options.find(
    opt => opt.id === answer.selectedOptionId
  );
  
  if (selectedOption) {
    const numericValue = parseInt(selectedOption.value, 10);
    if (!isNaN(numericValue)) {
      existingAnswers[String(order)] = answer.selectedOptionId; // For UI
      saveAnswer(String(order), String(numericValue)); // For calculation
    }
  }
}
```

### 4. Calculation Logic (No Changes Needed!)

**File**: `components/Assessment/useAssessmentLogic.ts`

The calculation logic already expects numeric string values:

```typescript
dimValue.questions.forEach((q, idx) => {
  const order = baseOrder + idx;
  const value = answers[String(order)]; // Expects numeric string "1"-"5"
  
  const numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    const adjusted = q.type === "unfavorable" ? 6 - numericValue : numericValue;
    scores.push(adjusted);
  }
});
```

**Note**: The calculation still uses `BehaviorPattern.json` for:
- Dimension structure and grouping
- Question type (favorable/unfavorable) for score adjustment
- Dimension titles and metadata

This is acceptable since backend doesn't provide dimension grouping metadata (yet).

## Data Flow (After Fix)

```
1. Backend API (GET /tests/6/questions)
   ↓
   Returns questions with options containing value="1" to "5"
   
2. UI Rendering
   ↓
   Display sorted options, pass option.value to handleSelect()
   
3. User Selection
   ↓
   handleSelect() receives option.value from backend
   
4. Storage (Two Formats)
   ↓
   answers[order] = optionId (UUID) → For backend submission
   flowAnswers[order] = numericValue (1-5) → For calculation
   
5. Backend Submission (PUT)
   ↓
   Send array of {testQuestionId, selectedOptionId}
   
6. Loading Saved Answers (GET)
   ↓
   Map selectedOptionId → find option in test.questions → extract option.value
   
7. Calculation (useAssessmentLogic)
   ↓
   Read flowAnswers[order] → parse to int → apply favorable/unfavorable logic
```

## Testing Checklist

- [ ] **Fresh Start**: Clear localStorage, start assessment, select answers
  - Verify `option.value` is used (check console logs)
  - Verify numeric values saved to flow answers
  
- [ ] **Navigation**: Move between dimensions
  - Verify answers persist during navigation
  - Verify PUT request sends correct optionIds
  
- [ ] **Resume**: Complete partial assessment, refresh page
  - Verify GET loads saved answers correctly
  - Verify conversion from optionId → numeric value works
  - Verify UI shows correct selections
  
- [ ] **Completion**: Finish all 36 questions
  - Verify no missing dimensions in result
  - Verify percentages are 0-100 range (not negative/NaN)
  - Verify all 6 dimensions calculated correctly

## Expected Results

### Before Fix
```javascript
behaviorDimensions: {
  self_acceptance: { percentage: -350, level: "Rendah" }
  // Only 1 dimension, invalid percentage
}
```

### After Fix
```javascript
behaviorDimensions: {
  self_acceptance: { percentage: 75, level: "Tinggi" },
  positive_relations: { percentage: 60, level: "Sedang" },
  autonomy: { percentage: 80, level: "Tinggi" },
  environmental_mastery: { percentage: 55, level: "Sedang" },
  purpose_in_life: { percentage: 70, level: "Tinggi" },
  personal_growth: { percentage: 65, level: "Sedang" }
}
```

## Backend API Endpoints Used

1. **GET /tests/{testId}/questions** (testId = 6 for behavior pattern)
   - Returns authoritative questions with options
   - Each option has `value` field containing numeric string
   
2. **GET /results/test-submission/{submissionId}**
   - Returns saved answers with selectedOptionId
   - Used to resume incomplete assessments
   
3. **PUT /results/test-submission/{submissionId}/answer**
   - Batch update all answers for submission
   - Sends array of {id?, testQuestionId, selectedOptionId}

## Key Principles

1. **Backend is Source of Truth**: Always use backend `option.value` field
2. **Never Compute Values**: Don't derive values from array indices
3. **Dual Storage**: Keep optionId (UUID) for backend, numeric value for calculation
4. **Robust Conversion**: Always validate numeric parsing with `isNaN()` checks
5. **Detailed Logging**: Log all conversions for debugging

## Future Improvements

Consider enhancing the backend to return:
- Dimension metadata (grouping of questions)
- Question type (favorable/unfavorable) as part of question object
- Pre-calculated scores (to reduce client-side calculation complexity)

This would allow complete removal of `BehaviorPattern.json` dependency.
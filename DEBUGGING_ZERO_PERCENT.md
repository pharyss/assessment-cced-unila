# Debugging Guide: 0% Percentage Issue in Result Page

## Issues Identified

### Issue 1: Style Descriptions Not Showing ✅ FIXED
**Problem:** Thinking Style, Communication Style, and Working Style showed raw values (e.g., "practical", "direct", "structured_team") instead of descriptions.

**Root Cause:** Mismatch between calculation output format and ReportText.json keys:
- Calculation returns: `"analytical"`, `"direct"`, `"structured_solo"` (lowercase with underscores)
- ReportText.json expects: `"Analytical"`, `"Direct"`, `"StructuredSolo"` (PascalCase)

**Solution Applied:** Added styleMap to convert formats:
```typescript
const styleMap: Record<string, string> = {
  analytical: "Analytical",
  practical: "Practical",
  creative: "Creative",
  empathetic: "Empathetic",
  direct: "Direct",
  harmonious: "Harmonious",
  innovative: "Innovative",
  pragmatic: "Pragmatic",
  structured_solo: "StructuredSolo",
  structured_team: "StructuredTeam",
  flexible_solo: "FlexibleSolo",
  flexible_team: "FlexibleTeam",
};
```

---

### Issue 2: All PWB Dimensions Show 0% 🔍 INVESTIGATING

**Symptoms:**
- All 6 psychological well-being dimensions display "Rendah (0%)"
- No scores are being calculated

**Possible Causes:**

#### 1. Question ID Mismatch
The question IDs in localStorage might not match the answer testQuestionIds from backend.

**Check:**
```javascript
// In browser console after navigating to result page
const test6Questions = JSON.parse(localStorage.getItem("test6_questions"));
console.log("Question IDs:", test6Questions.map(q => q.id));

// Compare with backend response (check Network tab)
// GET http://localhost:3000/results/test-submission/{submissionId}
// Look at answers array and check testQuestionId values
```

#### 2. Missing Answers
The user might not have saved answers for Test 6 (behavior-pattern).

**Check:**
```javascript
// In browser console
const testAnswer = JSON.parse(localStorage.getItem("cced-test-answer"));
console.log("Submission ID:", testAnswer.testSubmissionId);

// Then check backend response for this submission ID
// Should return answers array with Test 6 answers
```

#### 3. Incorrect Question Structure
Questions saved in localStorage might be missing required fields (id, order, options).

**Check:**
```javascript
const test6Questions = JSON.parse(localStorage.getItem("test6_questions"));
console.log("First question:", test6Questions[0]);
// Should have: { id: string, order: number, options: [{id: string, value: string}] }
```

#### 4. Option Values Not Numeric
Test 6 options should have numeric values (1-5 for Likert scale), but might have string values.

**Check:**
```javascript
const test6Questions = JSON.parse(localStorage.getItem("test6_questions"));
console.log("First question options:", test6Questions[0].options);
// Values should be: "1", "2", "3", "4", "5" (strings that can be parsed to int)
```

---

## Debugging Steps Added to Code

Enhanced logging has been added to `result/page.tsx` to help identify the issue:

```typescript
// 1. Check answer counts
console.log("📊 Total answers from backend:", answers.length);
console.log("📊 Test 6 questions count:", test6Questions.length);

// 2. Check ID formats
console.log("📊 Sample Test 6 question IDs:", test6Questions.slice(0, 3).map(q => q.id));
console.log("📊 Sample answers:", answers.slice(0, 5).map(a => ({
  questionId: a.testQuestionId,
  optionId: a.selectedOptionId
})));

// 3. Check answer mapping
console.log("✓ Mapped Test 6 answer:", questionId, "->", optionId);
console.log("📊 Test 6 answers mapped:", Object.keys(test6AnswersMap).length);
console.log("📊 Test 6 answers map sample:", Object.entries(test6AnswersMap).slice(0, 3));

// 4. Check question structure
console.log("📊 First Test 6 question structure:", {
  id: test6Questions[0]?.id,
  order: test6Questions[0]?.order,
  optionsCount: test6Questions[0]?.options?.length,
  firstOption: test6Questions[0]?.options?.[0]
});

// 5. Check calculated results
console.log("✓ Test 6 results:", JSON.stringify(test6Results, null, 2));
```

---

## How to Debug

### Step 1: Open Browser Console
Navigate to result page and open Developer Tools (F12) → Console tab

### Step 2: Look for the Log Messages
Check for these patterns:

**Good scenario:**
```
📊 Total answers from backend: 76
📊 Test 6 questions count: 36
📊 Test 6 answers mapped: 36
✓ Test 6 results: [
  { dimension: "self_acceptance", percentage: 75, level: "Tinggi" },
  ...
]
```

**Bad scenario (current issue):**
```
📊 Total answers from backend: 76
📊 Test 6 questions count: 36
📊 Test 6 answers mapped: 0  // ❌ NO ANSWERS MAPPED!
✓ Test 6 results: [
  { dimension: "self_acceptance", percentage: 0, level: "Rendah" },
  ...
]
```

### Step 3: Identify the Issue

#### If "Test 6 answers mapped: 0"
→ **Question IDs don't match between localStorage and backend**

**Solution:**
1. Check if question IDs are UUIDs vs integers
2. Check if there's a type conversion issue (string vs number)
3. Verify that behavior-pattern is saving the correct question structure

#### If "Test 6 answers mapped: 36" but still 0%
→ **Option values are not numeric or not found**

**Solution:**
1. Check option.value format in localStorage
2. Verify that selectedOptionId matches actual option IDs
3. Check if parseInt() is failing due to non-numeric values

---

## Quick Manual Test

To verify the calculation logic works, run this in console:

```javascript
// Test the calculation manually
const test6Questions = JSON.parse(localStorage.getItem("test6_questions"));
const testAnswerData = JSON.parse(localStorage.getItem("cced-test-answer"));

// Create a fake answer map for testing
const fakeAnswers = {};
test6Questions.forEach(q => {
  // Pick the middle option (usually "3" for neutral)
  const middleOption = q.options[Math.floor(q.options.length / 2)];
  fakeAnswers[q.id] = middleOption.id;
});

console.log("Fake answers created:", Object.keys(fakeAnswers).length);

// Now manually call the calculation (you'll need to import the function)
// This will show if the calculation logic itself is working
```

---

## Expected Calculation Flow

1. **Load questions from localStorage**
   - `test6_questions`: Array of 36 questions with order and options

2. **Fetch answers from backend**
   - GET `/results/test-submission/{submissionId}`
   - Returns: `{ answers: [{testQuestionId, selectedOptionId}] }`

3. **Build answer map**
   - Match `testQuestionId` with question IDs from localStorage
   - Create map: `{ questionId: selectedOptionId }`

4. **Calculate dimensions**
   - Sort questions by order
   - Group into 6 dimensions (6 questions each)
   - For each question:
     - Find selected option by ID
     - Parse option.value as integer
     - Sum values per dimension
   - Calculate percentage: `(sum / 30) * 100`

5. **Determine level**
   - >66.66% = Tinggi
   - >33.33% = Sedang
   - else = Rendah

---

## Next Steps

1. **Check console logs** in the result page
2. **Copy the log output** and analyze:
   - Are question IDs matching?
   - Are answers being mapped?
   - What's in the calculated results?

3. **Report findings**:
   - Screenshot of console logs
   - Sample question ID from localStorage
   - Sample answer from backend response

This will help identify exactly where the mapping is failing.
# Testing Guide - Talenta Mahasiswa Result Calculation

## Quick Start Testing

### Prerequisites
1. Backend server running at `http://localhost:3000`
2. Frontend dev server running (`npm run dev`)
3. Database seeded with test data

### Step-by-Step Testing

#### 1. Start Assessment
```bash
# Navigate to
http://localhost:3000/assessment/talenta-mahasiswa
```

1. Enter student information (Nama, NPM, Email)
2. Click "Mulai Asesmen"

#### 2. Complete Career Path
```bash
# You will be at
/assessment/talenta-mahasiswa/career-path
```

**Expected Behavior:**
- See 40 questions total (12 for Test 4 + 28 for Test 5)
- 4 questions per page, multiple pages
- Each question has 2-4 options
- Answers saved to backend on each "Lanjut" click
- Questions saved to localStorage: `test4_questions`, `test5_questions`

**Validation:**
```javascript
// Open browser console and check:
localStorage.getItem('test4_questions') // Should return JSON with 12 questions
localStorage.getItem('test5_questions') // Should return JSON with 28 questions
```

#### 3. Complete Behavior Pattern
```bash
# After career-path, auto-navigate to
/assessment/talenta-mahasiswa/behavior-pattern
```

**Expected Behavior:**
- See 36 questions (6 dimensions × 6 questions)
- Questions grouped by dimension (6 questions per page)
- Likert scale options (1-5)
- Answers saved to backend on each "Lanjut" click
- Questions saved to localStorage: `test6_questions`

**Validation:**
```javascript
// Open browser console and check:
localStorage.getItem('test6_questions') // Should return JSON with 36 questions
```

#### 4. View Results
```bash
# After behavior-pattern, auto-navigate to
/assessment/talenta-mahasiswa/result
```

**Expected Display:**
1. ✅ **Overall Classification** - One of 9 categories (e.g., "High Fit Champions")
2. ✅ **MBTI Type** - 4-letter type (e.g., "ENTJ")
3. ✅ **Career Fields**:
   - Your Interest (from Test 4)
   - Primary Career (from MBTI)
   - Secondary Career (from MBTI)
4. ✅ **Psychological Well-being** - 6 dimensions with percentages and levels
5. ✅ **Styles**:
   - Thinking Style
   - Communication Style
   - Working Style

**Console Validation:**
```javascript
// Check console logs:
// ✓ Found testSubmissionId: ...
// ✓ Loaded questions from localStorage: { test4: 12, test5: 28, test6: 36 }
// ✓ Fetched answers from backend: XX answers
// ✓ Test 6 Results: [...]
// ✓ Test 5 Results: { mbti_type: '...', ... }
// ✓ Test 4 Results: { career_preference: '...' }
// ✓ Test 3 Results: { readiness: '...' }
// ✓ Test 2 Results: { compatibility: '...' }
// ✓ Test 1 Results: { classification: '...' }
// ✓ All results saved to backend successfully
```

### Backend Verification

#### Check Saved Answers
```bash
curl http://localhost:3000/results/test-submission/{submissionId}
```

**Expected:**
- `answers` array with all selected options
- `results` array (should be empty before result page, 14 entries after)

#### Check Saved Results
After visiting result page, the GET endpoint should return:

```json
{
  "status": "success",
  "data": {
    "id": "...",
    "answers": [...],
    "results": [
      // Test 1: 1 result
      { "testId": 1, "result": "high_fit_champions" },
      
      // Test 2: 1 result
      { "testId": 2, "result": "sangat_sesuai" },
      
      // Test 3: 1 result
      { "testId": 3, "result": "sangat_siap" },
      
      // Test 4: 1 result
      { "testId": 4, "result": "praktisi" },
      
      // Test 5: 6 results
      { "testId": 5, "result": "mbti_type:entj" },
      { "testId": 5, "result": "primary:wirausaha" },
      { "testId": 5, "result": "secondary:akademisi" },
      { "testId": 5, "result": "thinking_style:analytical" },
      { "testId": 5, "result": "communication_style:direct" },
      { "testId": 5, "result": "working_style:structured_team" },
      
      // Test 6: 6 results
      { "testId": 6, "result": "self_acceptance:75:tinggi" },
      { "testId": 6, "result": "autonomy:80:tinggi" },
      { "testId": 6, "result": "purpose_in_life:70:tinggi" },
      { "testId": 6, "result": "positive_relationships:65:sedang" },
      { "testId": 6, "result": "environmental_mastery:85:tinggi" },
      { "testId": 6, "result": "personal_growth:90:tinggi" }
    ]
  }
}
```

### LocalStorage Inspection

Open browser DevTools → Application → Local Storage:

**Expected Keys:**
```
student-identity          // Student info (nama, npm, email)
test-answer-data          // Contains testSubmissionId
test4_questions           // 12 questions with options
test5_questions           // 28 questions with options  
test6_questions           // 36 questions with options
test-result-data          // { resultsSaved: true, timestamp: ... }
assessment-flow           // Question answers for calculations
```

### Test Scenarios

#### Scenario 1: Happy Path (All High)
- Complete all questions
- Answer with highest values
- **Expected Result:** Classification = "high_fit_champions"

#### Scenario 2: Misaligned Career
- Test 4: Select mostly "akademisi"
- Test 5: Answer to get "ESTP" (primary: wirausaha)
- **Expected Result:** Compatibility = "tidak_sesuai"

#### Scenario 3: Low Readiness
- Test 6: Select mostly "1" (lowest) for all questions
- **Expected Result:** Readiness = "tidak_siap"

#### Scenario 4: Resume Assessment
1. Complete career-path, close browser
2. Reopen and navigate to behavior-pattern
3. **Expected:** Previous answers pre-selected

### Common Issues & Solutions

#### Issue: "Data submission tidak ditemukan"
**Solution:** Clear localStorage and restart from beginning

#### Issue: Results not calculating
**Solution:** Check console for errors, verify all questions saved to localStorage

#### Issue: Duplicate results in backend
**Solution:** Results should only save once (check TEST_RESULT_KEY flag)

#### Issue: Wrong MBTI type
**Solution:** Verify Test 5 questions have correct option values (E, I, S, N, T, F, J, P)

### Debugging Commands

```javascript
// Check localStorage data
console.log('Test 4 Questions:', JSON.parse(localStorage.getItem('test4_questions')));
console.log('Test 5 Questions:', JSON.parse(localStorage.getItem('test5_questions')));
console.log('Test 6 Questions:', JSON.parse(localStorage.getItem('test6_questions')));

// Check testSubmissionId
const answerData = JSON.parse(localStorage.getItem('test-answer-data'));
console.log('Submission ID:', answerData?.testSubmissionId);

// Clear all data (restart assessment)
localStorage.clear();
```

### Performance Metrics

**Target Timings:**
- Career Path: ~5-10 minutes (40 questions)
- Behavior Pattern: ~5-10 minutes (36 questions)
- Result Calculation: <2 seconds
- Backend Save: <3 seconds

### Success Criteria

✅ All 40 career-path questions answerable  
✅ All 36 behavior-pattern questions answerable  
✅ Result page displays within 2 seconds  
✅ 6 psychological dimensions shown with correct percentages  
✅ MBTI type matches answer patterns  
✅ Career fields align with MBTI mapping  
✅ 14 results saved to backend  
✅ No console errors  
✅ Can refresh result page without losing data  

### Support

For issues or questions:
1. Check console logs first
2. Verify localStorage data
3. Check backend API responses
4. Review `RESULT_CALCULATION_IMPLEMENTATION.md` for details
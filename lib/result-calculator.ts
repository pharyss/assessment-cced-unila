// Result Calculator for Talenta Mahasiswa Assessment
// Handles all test result calculations (Test 1-6)

export interface Test6Result {
  dimension: string;
  percentage: number;
  level: "Tinggi" | "Sedang" | "Rendah";
}

export interface Test5Result {
  mbti_type: string;
  primary: string;
  secondary: string;
  thinking_style: string;
  communication_style: string;
  working_style: string;
}

export interface Test4Result {
  career_preference: string;
}

export interface Test3Result {
  readiness: "sangat_siap" | "cukup_siap" | "tidak_siap";
}

export interface Test2Result {
  compatibility: "sangat_sesuai" | "kurang_sesuai" | "tidak_sesuai";
}

export interface Test1Result {
  classification:
    | "high_fit_champions"
    | "aligned_developers"
    | "latent_talent_zone"
    | "positive_explorers"
    | "growth_zone"
    | "underdeveloped_potential"
    | "happy_but_misaligned"
    | "inconsistent_fit_zone"
    | "critical_mismatch";
}

// MBTI Career Mapping Table
const MBTI_CAREER_MAP: Record<
  string,
  {
    primary: string;
    secondary: string;
    thinking_style: string;
    communication_style: string;
    working_style: string;
  }
> = {
  ISTJ: {
    primary: "praktisi",
    secondary: "akademisi",
    thinking_style: "analytical",
    communication_style: "direct",
    working_style: "structured_solo",
  },
  ISFJ: {
    primary: "praktisi",
    secondary: "pekerja_kreatif",
    thinking_style: "practical",
    communication_style: "harmonious",
    working_style: "structured_team",
  },
  INFJ: {
    primary: "akademisi",
    secondary: "pekerja_kreatif",
    thinking_style: "creative",
    communication_style: "innovative",
    working_style: "structured_solo",
  },
  INTJ: {
    primary: "akademisi",
    secondary: "wirausaha",
    thinking_style: "analytical",
    communication_style: "direct",
    working_style: "structured_solo",
  },
  ISTP: {
    primary: "praktisi",
    secondary: "wirausaha",
    thinking_style: "practical",
    communication_style: "pragmatic",
    working_style: "structured_solo",
  },
  ISFP: {
    primary: "pekerja_kreatif",
    secondary: "praktisi",
    thinking_style: "empathetic",
    communication_style: "pragmatic",
    working_style: "flexible_solo",
  },
  INFP: {
    primary: "pekerja_kreatif",
    secondary: "akademisi",
    thinking_style: "creative",
    communication_style: "harmonious",
    working_style: "flexible_solo",
  },
  INTP: {
    primary: "akademisi",
    secondary: "pekerja_kreatif",
    thinking_style: "analytical",
    communication_style: "harmonious",
    working_style: "flexible_solo",
  },
  ESTP: {
    primary: "wirausaha",
    secondary: "praktisi",
    thinking_style: "practical",
    communication_style: "pragmatic",
    working_style: "flexible_team",
  },
  ESFP: {
    primary: "pekerja_kreatif",
    secondary: "wirausaha",
    thinking_style: "empathetic",
    communication_style: "pragmatic",
    working_style: "flexible_team",
  },
  ENFP: {
    primary: "pekerja_kreatif",
    secondary: "wirausaha",
    thinking_style: "creative",
    communication_style: "innovative",
    working_style: "flexible_team",
  },
  ENTP: {
    primary: "wirausaha",
    secondary: "pekerja_kreatif",
    thinking_style: "creative",
    communication_style: "innovative",
    working_style: "flexible_team",
  },
  ESTJ: {
    primary: "praktisi",
    secondary: "wirausaha",
    thinking_style: "practical",
    communication_style: "direct",
    working_style: "structured_team",
  },
  ESFJ: {
    primary: "praktisi",
    secondary: "pekerja_kreatif",
    thinking_style: "practical",
    communication_style: "harmonious",
    working_style: "structured_team",
  },
  ENFJ: {
    primary: "wirausaha",
    secondary: "akademisi",
    thinking_style: "empathetic",
    communication_style: "harmonious",
    working_style: "structured_team",
  },
  ENTJ: {
    primary: "wirausaha",
    secondary: "akademisi",
    thinking_style: "analytical",
    communication_style: "direct",
    working_style: "structured_team",
  },
};

// Test 6 Dimension Names (in order)
const TEST6_DIMENSIONS = [
  "self_acceptance",
  "autonomy",
  "purpose_in_life",
  "positive_relationships",
  "environmental_mastery",
  "personal_growth",
];

/**
 * Calculate Test 6 Results: Psychological Well-being (36 questions, 6 dimensions)
 * Each dimension has 6 questions (questions 1-6, 7-12, 13-18, 19-24, 25-30, 31-36)
 * Each question value is 1-5 (Likert scale)
 * Max score per dimension = 30, Min = 6
 *
 * @param questionsWithOptions - Array of {questionId, options: [{id, value}]} from localStorage
 * @param selectedAnswers - Record of questionId -> selectedOptionId from localStorage
 * @returns Array of 6 dimension results with percentage and level
 */
export function calculateTest6Results(
  questionsWithOptions: Array<{
    id: string;
    order: number;
    options: Array<{ id: string; value: string }>;
  }>,
  selectedAnswers: Record<string, string>
): Test6Result[] {
  // Sort questions by order
  const sortedQuestions = [...questionsWithOptions].sort(
    (a, b) => a.order - b.order
  );

  const results: Test6Result[] = [];
  const questionsPerDimension = 6;

  for (let dimIndex = 0; dimIndex < 6; dimIndex++) {
    const dimensionName = TEST6_DIMENSIONS[dimIndex];
    const startIdx = dimIndex * questionsPerDimension;
    const endIdx = startIdx + questionsPerDimension;
    const dimensionQuestions = sortedQuestions.slice(startIdx, endIdx);

    let totalScore = 0;

    for (const question of dimensionQuestions) {
      const selectedOptionId = selectedAnswers[question.id];
      if (!selectedOptionId) continue;

      const selectedOption = question.options.find(
        (opt) => opt.id === selectedOptionId
      );
      if (!selectedOption) continue;

      const numericValue = parseInt(selectedOption.value, 10);
      if (!isNaN(numericValue)) {
        totalScore += numericValue;
      }
    }

    // Calculate percentage: (totalScore / maxScore) * 100
    const maxScore = questionsPerDimension * 5; // 6 questions * 5 max value
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Determine level based on percentage
    let level: "Tinggi" | "Sedang" | "Rendah";
    if (percentage > 66.66) {
      level = "Tinggi";
    } else if (percentage > 33.33) {
      level = "Sedang";
    } else {
      level = "Rendah";
    }

    results.push({
      dimension: dimensionName,
      percentage,
      level,
    });
  }

  return results;
}

/**
 * Calculate Test 5 Results: MBTI-based Career Preference (28 questions, 2 options each)
 * Questions 1-7: First letter (E/I)
 * Questions 8-14: Second letter (S/N)
 * Questions 15-21: Third letter (T/F)
 * Questions 22-28: Fourth letter (J/P)
 * Each option has a value like "E", "I", "S", "N", etc.
 *
 * @param questionsWithOptions - Array of {questionId, order, options: [{id, value}]}
 * @param selectedAnswers - Record of questionId -> selectedOptionId
 * @returns Test5Result with MBTI type and career attributes
 */
export function calculateTest5Results(
  questionsWithOptions: Array<{
    id: string;
    order: number;
    options: Array<{ id: string; value: string }>;
  }>,
  selectedAnswers: Record<string, string>
): Test5Result {
  // Sort questions by order
  const sortedQuestions = [...questionsWithOptions].sort(
    (a, b) => a.order - b.order
  );

  const letterCounts: Record<string, number> = {};

  // Count occurrences of each letter
  for (const question of sortedQuestions) {
    const selectedOptionId = selectedAnswers[question.id];
    if (!selectedOptionId) continue;

    const selectedOption = question.options.find(
      (opt) => opt.id === selectedOptionId
    );
    if (!selectedOption) continue;

    const letter = selectedOption.value.toUpperCase();
    letterCounts[letter] = (letterCounts[letter] || 0) + 1;
  }

  // Determine each MBTI letter by majority in each group
  // Questions 0-6 (7 questions): E vs I
  const firstLetterQuestions = sortedQuestions.slice(0, 7);
  let eCount = 0;
  let iCount = 0;
  for (const q of firstLetterQuestions) {
    const selectedOptionId = selectedAnswers[q.id];
    if (!selectedOptionId) continue;
    const selectedOption = q.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) continue;
    const letter = selectedOption.value.toUpperCase();
    if (letter === "E") eCount++;
    if (letter === "I") iCount++;
  }
  const firstLetter = eCount >= iCount ? "E" : "I";

  // Questions 7-13 (7 questions): S vs N
  const secondLetterQuestions = sortedQuestions.slice(7, 14);
  let sCount = 0;
  let nCount = 0;
  for (const q of secondLetterQuestions) {
    const selectedOptionId = selectedAnswers[q.id];
    if (!selectedOptionId) continue;
    const selectedOption = q.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) continue;
    const letter = selectedOption.value.toUpperCase();
    if (letter === "S") sCount++;
    if (letter === "N") nCount++;
  }
  const secondLetter = sCount >= nCount ? "S" : "N";

  // Questions 14-20 (7 questions): T vs F
  const thirdLetterQuestions = sortedQuestions.slice(14, 21);
  let tCount = 0;
  let fCount = 0;
  for (const q of thirdLetterQuestions) {
    const selectedOptionId = selectedAnswers[q.id];
    if (!selectedOptionId) continue;
    const selectedOption = q.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) continue;
    const letter = selectedOption.value.toUpperCase();
    if (letter === "T") tCount++;
    if (letter === "F") fCount++;
  }
  const thirdLetter = tCount >= fCount ? "T" : "F";

  // Questions 21-27 (7 questions): J vs P
  const fourthLetterQuestions = sortedQuestions.slice(21, 28);
  let jCount = 0;
  let pCount = 0;
  for (const q of fourthLetterQuestions) {
    const selectedOptionId = selectedAnswers[q.id];
    if (!selectedOptionId) continue;
    const selectedOption = q.options.find((opt) => opt.id === selectedOptionId);
    if (!selectedOption) continue;
    const letter = selectedOption.value.toUpperCase();
    if (letter === "J") jCount++;
    if (letter === "P") pCount++;
  }
  const fourthLetter = jCount >= pCount ? "J" : "P";

  const mbtiType = `${firstLetter}${secondLetter}${thirdLetter}${fourthLetter}`;

  // Look up career attributes from MBTI table
  const careerData = MBTI_CAREER_MAP[mbtiType] || {
    primary: "praktisi",
    secondary: "akademisi",
    thinking_style: "analytical",
    communication_style: "direct",
    working_style: "structured_solo",
  };

  return {
    mbti_type: mbtiType.toLowerCase(),
    primary: careerData.primary,
    secondary: careerData.secondary,
    thinking_style: careerData.thinking_style,
    communication_style: careerData.communication_style,
    working_style: careerData.working_style,
  };
}

/**
 * Calculate Test 4 Results: Career Preference (12 questions, 4 options each)
 * Each option has value: praktisi, akademisi, pekerja_kreatif, or wirausaha
 * Result is the most frequently selected value
 *
 * @param questionsWithOptions - Array of {questionId, options: [{id, value}]}
 * @param selectedAnswers - Record of questionId -> selectedOptionId
 * @returns Career preference
 */
export function calculateTest4Results(
  questionsWithOptions: Array<{
    id: string;
    options: Array<{ id: string; value: string }>;
  }>,
  selectedAnswers: Record<string, string>
): Test4Result {
  const valueCounts: Record<string, number> = {
    praktisi: 0,
    akademisi: 0,
    pekerja_kreatif: 0,
    wirausaha: 0,
  };

  for (const question of questionsWithOptions) {
    const selectedOptionId = selectedAnswers[question.id];
    if (!selectedOptionId) continue;

    const selectedOption = question.options.find(
      (opt) => opt.id === selectedOptionId
    );
    if (!selectedOption) continue;

    const value = selectedOption.value;
    if (valueCounts[value] !== undefined) {
      valueCounts[value]++;
    }
  }

  // Find the highest count
  let maxCount = 0;
  let result = "praktisi";

  for (const [key, count] of Object.entries(valueCounts)) {
    if (count > maxCount) {
      maxCount = count;
      result = key;
    }
  }

  return { career_preference: result };
}

/**
 * Calculate Test 3 Results: Behavioral Readiness
 * Uses Test 6 raw scores (sum of all 36 question values 1-5)
 * Max score = 36 * 5 = 180
 * Min score = 36 * 1 = 36
 *
 * @param test6TotalScore - Sum of all 36 question values from test 6
 * @returns Readiness level
 */
export function calculateTest3Results(test6TotalScore: number): Test3Result {
  let readiness: "sangat_siap" | "cukup_siap" | "tidak_siap";

  if (test6TotalScore >= 120) {
    readiness = "sangat_siap";
  } else if (test6TotalScore >= 60) {
    readiness = "cukup_siap";
  } else {
    readiness = "tidak_siap";
  }

  return { readiness };
}

/**
 * Calculate Test 2 Results: Career Compatibility
 * Compares Test 4 result with Test 5 MBTI primary/secondary
 *
 * @param test4Result - Career preference from test 4
 * @param test5Result - MBTI results from test 5 (contains primary and secondary)
 * @returns Compatibility level
 */
export function calculateTest2Results(
  test4Result: Test4Result,
  test5Result: Test5Result
): Test2Result {
  const test4Career = test4Result.career_preference;
  const test5Primary = test5Result.primary;
  const test5Secondary = test5Result.secondary;

  let compatibility: "sangat_sesuai" | "kurang_sesuai" | "tidak_sesuai";

  if (test4Career === test5Primary) {
    compatibility = "sangat_sesuai";
  } else if (test4Career === test5Secondary) {
    compatibility = "kurang_sesuai";
  } else {
    compatibility = "tidak_sesuai";
  }

  return { compatibility };
}

/**
 * Calculate Test 1 Results: Overall Classification
 * Based on Test 3 readiness and Test 2 compatibility
 *
 * @param test3Result - Readiness from test 3
 * @param test2Result - Compatibility from test 2
 * @returns Overall classification
 */
export function calculateTest1Results(
  test3Result: Test3Result,
  test2Result: Test2Result
): Test1Result {
  const readiness = test3Result.readiness;
  const compatibility = test2Result.compatibility;

  let classification: Test1Result["classification"];

  // Map based on the requirements
  if (readiness === "tidak_siap" && compatibility === "tidak_sesuai") {
    classification = "critical_mismatch";
  } else if (readiness === "cukup_siap" && compatibility === "tidak_sesuai") {
    classification = "inconsistent_fit_zone";
  } else if (readiness === "sangat_siap" && compatibility === "tidak_sesuai") {
    classification = "happy_but_misaligned";
  } else if (readiness === "tidak_siap" && compatibility === "kurang_sesuai") {
    classification = "underdeveloped_potential";
  } else if (readiness === "cukup_siap" && compatibility === "kurang_sesuai") {
    classification = "growth_zone";
  } else if (readiness === "sangat_siap" && compatibility === "kurang_sesuai") {
    classification = "positive_explorers";
  } else if (readiness === "tidak_siap" && compatibility === "sangat_sesuai") {
    classification = "latent_talent_zone";
  } else if (readiness === "cukup_siap" && compatibility === "sangat_sesuai") {
    classification = "aligned_developers";
  } else if (readiness === "sangat_siap" && compatibility === "sangat_sesuai") {
    classification = "high_fit_champions";
  } else {
    // Default fallback
    classification = "growth_zone";
  }

  return { classification };
}

/**
 * Helper: Get Test 6 total raw score from questions and answers
 * Used for Test 3 calculation
 */
export function getTest6TotalScore(
  questionsWithOptions: Array<{
    id: string;
    options: Array<{ id: string; value: string }>;
  }>,
  selectedAnswers: Record<string, string>
): number {
  let total = 0;

  for (const question of questionsWithOptions) {
    const selectedOptionId = selectedAnswers[question.id];
    if (!selectedOptionId) continue;

    const selectedOption = question.options.find(
      (opt) => opt.id === selectedOptionId
    );
    if (!selectedOption) continue;

    const numericValue = parseInt(selectedOption.value, 10);
    if (!isNaN(numericValue)) {
      total += numericValue;
    }
  }

  return total;
}

/**
 * Format Test 6 results for backend submission
 * Format: "dimension:percentage:level"
 */
export function formatTest6ResultsForBackend(results: Test6Result[]): string[] {
  return results.map(
    (r) => `${r.dimension}:${r.percentage}:${r.level.toLowerCase()}`
  );
}

/**
 * Format Test 5 results for backend submission
 * Format: "param:value"
 */
export function formatTest5ResultsForBackend(result: Test5Result): string[] {
  return [
    `mbti_type:${result.mbti_type}`,
    `primary:${result.primary}`,
    `secondary:${result.secondary}`,
    `thinking_style:${result.thinking_style}`,
    `communication_style:${result.communication_style}`,
    `working_style:${result.working_style}`,
  ];
}

/**
 * Format Test 4 result for backend submission
 * Format: string value
 */
export function formatTest4ResultForBackend(result: Test4Result): string {
  return result.career_preference;
}

/**
 * Format Test 3 result for backend submission
 * Format: string value
 */
export function formatTest3ResultForBackend(result: Test3Result): string {
  return result.readiness;
}

/**
 * Format Test 2 result for backend submission
 * Format: string value
 */
export function formatTest2ResultForBackend(result: Test2Result): string {
  return result.compatibility;
}

/**
 * Format Test 1 result for backend submission
 * Format: string value
 */
export function formatTest1ResultForBackend(result: Test1Result): string {
  return result.classification;
}

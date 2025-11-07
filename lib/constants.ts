/**
 * Shared constants for the CCED UNILA Assessment application
 *
 * This file contains centralized constants used across multiple components
 * to prevent key mismatches and improve maintainability.
 */

/**
 * Storage key for student identity data in localStorage
 *
 * Used to store:
 * - studentId: string
 * - nama: string
 * - npm: string
 * - email: string
 * - angkatan: string
 * - fakultas: string
 * - prodi: string
 * - jenjang: string
 */
export const STUDENT_IDENTITY_KEY = "cced-student-identity";

/**
 * Storage key for test submission and answers in localStorage
 *
 * Used to store:
 * - testSubmissionId: string
 * - answers: Record<string, string> (questionId -> optionId)
 * - careerPathComplete: boolean
 * - behaviorPatternComplete: boolean
 */
export const TEST_ANSWER_KEY = "cced-test-answer";

/**
 * Storage key for test results in localStorage
 *
 * Used to store:
 * - testSubmissionId: string
 * - results: object (calculated results)
 * - resultsSaved: boolean
 */
export const TEST_RESULT_KEY = "cced-test-result";

/**
 * Legacy storage key - DEPRECATED
 * @deprecated Use STUDENT_IDENTITY_KEY, TEST_ANSWER_KEY, or TEST_RESULT_KEY instead
 */
export const ASSESSMENT_STORAGE_KEY = "assessment-cced-unila-submission";

/**
 * Test IDs for different assessment types
 */
export const TEST_IDS = {
  TALENTA_MAHASISWA: 1,
  CAREER_PATH_TEST_4: 4,
  CAREER_PATH_TEST_5: 5,
} as const;

/**
 * Assessment routes
 */
export const ASSESSMENT_ROUTES = {
  START: "/assessment/talenta-mahasiswa/start",
  CAREER_PATH: "/assessment/talenta-mahasiswa/career-path",
} as const;

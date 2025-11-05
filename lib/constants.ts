/**
 * Shared constants for the CCED UNILA Assessment application
 *
 * This file contains centralized constants used across multiple components
 * to prevent key mismatches and improve maintainability.
 */

/**
 * Storage key for assessment submission data in localStorage
 *
 * Used to store:
 * - studentId: string
 * - testSubmissionId: string
 * - nama: string
 * - npm: string
 * - email: string
 * - angkatan: string
 * - fakultas: string
 * - prodi: string
 * - jenjang: string
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

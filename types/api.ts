// API Response Types based on OpenAPI schema

export interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  data?: T;
  message?: string;
  pagination?: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface Test {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
  parentId: number | null;
  createdAt: string;
  instructions: TestInstruction[];
  notes: TestNote[];
  questions: TestQuestion[];
}

export interface TestInstruction {
  id: string;
  text: string;
  order: number;
  testId: number;
}

export interface TestNote {
  id: string;
  text: string;
  order: number;
  testId: number;
}

export interface TestQuestion {
  id: string;
  text: string;
  type: "multiple_choice" | "single_choice" | "likert";
  order: number;
  testId: number;
  options: TestQuestionOption[];
}

export interface TestQuestionOption {
  id: string;
  text: string;
  value: string;
  order: number;
  testQuestionId: string;
}

export interface Student {
  id: string;
  npm: string;
  name: string;
  email: string | null;
  enrollmentYearId: number;
  majorId: number;
  facultyId: number;
  degreeId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TestSubmission {
  id: string;
  studentId: string;
  testId: number;
  status: "in_progress" | "completed";
  createdAt: string;
  completedAt: string | null;
}

export interface TestSubmissionAnswer {
  id: string;
  testSubmissionId: string;
  testQuestionId: string;
  selectedOptionId: string;
  createdAt: string;
}

export interface TestResult {
  id: string;
  testSubmissionId: string | null;
  testId: number | null;
  result: string;
  createdAt: string;
}

// Error Response
export interface ApiError {
  field: string;
  message: string;
}

export interface ApiFailResponse {
  status: "fail";
  data: ApiError[];
}

export interface ApiErrorResponse {
  status: "error";
  message: string;
}

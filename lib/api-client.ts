// API Client for fetching data from the backend

import { ApiResponse, ApiFailResponse, ApiErrorResponse } from "@/types/api";

// Use Next.js proxy (/api) to bypass CORS in development, or direct API URL
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === "true";
const API_BASE_URL = USE_PROXY
  ? "/api" // Use Next.js proxy (bypasses CORS)
  : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Array<{ field: string; message: string }>,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    if (contentType?.includes("application/json")) {
      const errorData = await response.json();

      if (errorData.status === "fail") {
        const failResponse = errorData as ApiFailResponse;
        throw new ApiError(
          failResponse.data[0]?.message || "Validation failed",
          response.status,
          failResponse.data,
        );
      }

      if (errorData.status === "error") {
        const errorResponse = errorData as ApiErrorResponse;
        throw new ApiError(
          errorResponse.message || "Server error",
          response.status,
        );
      }
    }

    throw new ApiError(`HTTP Error: ${response.statusText}`, response.status);
  }

  if (contentType?.includes("application/json")) {
    const data = await response.json();
    return data;
  }

  return (await response.text()) as T;
}

export const apiClient = {
  get: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  post: async <T, D = unknown>(
    endpoint: string,
    data?: D,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  patch: async <T, D = unknown>(
    endpoint: string,
    data: D,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  put: async <T, D = unknown>(
    endpoint: string,
    data: D,
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse<ApiResponse<T>>(response);
  },

  delete: async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      mode: "cors",
      credentials: "omit",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return handleResponse<ApiResponse<T>>(response);
  },
};

// Specific API functions
export const testsApi = {
  getTest: (testId: number) => apiClient.get(`/tests/${testId}`),
  getTests: (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return apiClient.get(`/tests${queryString ? `?${queryString}` : ""}`);
  },
  getTestInstructions: (testId: number) =>
    apiClient.get(`/tests/${testId}/instructions`),
  getTestNotes: (testId: number) => apiClient.get(`/tests/${testId}/notes`),
  getTestQuestions: (testId: number) =>
    apiClient.get(`/tests/${testId}/questions`),
};

// Students API
export const studentsApi = {
  getFilters: () => apiClient.get(`/filters/students`),
};

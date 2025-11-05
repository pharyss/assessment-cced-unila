// Server-side API Client for Server Components
// This should only be used in Server Components, not Client Components

import { ApiResponse, Test } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
        throw new ApiError(
          errorData.data[0]?.message || "Validation failed",
          response.status,
          errorData.data,
        );
      }

      if (errorData.status === "error") {
        throw new ApiError(
          errorData.message || "Server error",
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

// Server-side API functions
export const serverApi = {
  getTest: async (testId: number): Promise<ApiResponse<Test>> => {
    const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // ISR with 60-second revalidation
      next: { revalidate: 60 },
    });

    return handleResponse<ApiResponse<Test>>(response);
  },

  getTests: async (params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<ApiResponse<Test[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/tests${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // ISR with 60-second revalidation
      next: { revalidate: 60 },
    });

    return handleResponse<ApiResponse<Test[]>>(response);
  },

  getStudentFilters: async () => {
    const response = await fetch(`${API_BASE_URL}/filters/students`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // ISR with 60-second revalidation - filters don't change often
      next: { revalidate: 60 },
    });

    return handleResponse(response);
  },
};

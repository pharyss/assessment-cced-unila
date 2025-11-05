"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { testsApi } from "@/lib/api-client";
import { ApiResponse, Test } from "@/types/api";

/**
 * Hook to fetch a single test by ID
 * @param testId - The ID of the test to fetch
 * @param enabled - Whether the query should automatically run (default: true)
 */
export function useTest(
  testId: number,
  enabled: boolean = true,
): UseQueryResult<ApiResponse<Test>, Error> {
  return useQuery({
    queryKey: ["test", testId],
    queryFn: async () => {
      const response = await testsApi.getTest(testId);
      return response as ApiResponse<Test>;
    },
    enabled: enabled && !!testId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
}

/**
 * Hook to fetch multiple tests
 * @param params - Query parameters for filtering and pagination
 */
export function useTests(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
}): UseQueryResult<ApiResponse<Test[]>, Error> {
  return useQuery({
    queryKey: ["tests", params],
    queryFn: async () => {
      const response = await testsApi.getTests(params);
      return response as ApiResponse<Test[]>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

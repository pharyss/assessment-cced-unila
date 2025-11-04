"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { studentsApi } from "@/lib/api-client";
import { ApiResponse, StudentFilters } from "@/types/api";

/**
 * Hook to fetch student filters (enrollment years, majors, faculties, degrees)
 * Used for populating dropdown filters in student-related forms
 */
export function useStudentFilters(): UseQueryResult<
  ApiResponse<StudentFilters>,
  Error
> {
  return useQuery({
    queryKey: ["studentFilters"],
    queryFn: async () => {
      const response = await studentsApi.getFilters();
      return response as ApiResponse<StudentFilters>;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - filters don't change often
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    refetchOnWindowFocus: false, // Don't refetch on window focus for static data
  });
}

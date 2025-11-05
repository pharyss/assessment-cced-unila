import { serverApi } from "@/lib/api-server";
import StartAssessmentForm from "@/components/Assessment/StartAssessmentForm";
import StartPageError from "@/components/Assessment/StartPageError";
import { Metadata } from "next";
import { ApiResponse, StudentFilters } from "@/types/api";

export const metadata: Metadata = {
  title: "Mulai Assessment | CCED UNILA",
  description: "Mulai asesmen talenta mahasiswa Universitas Lampung",
};

export const revalidate = 60;

export default async function StartPage() {
  try {
    const filtersResponse =
      (await serverApi.getStudentFilters()) as ApiResponse<StudentFilters>;

    const filters = filtersResponse.data;

    if (!filters) {
      throw new Error("Failed to load student filters");
    }

    return <StartAssessmentForm filters={filters} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal memuat data";

    return <StartPageError errorMessage={errorMessage} />;
  }
}

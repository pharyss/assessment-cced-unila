import { serverApi } from "@/lib/api-server";
import StartAssessmentForm from "@/components/Assessment/StartAssessmentForm";
import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { ApiResponse, StudentFilters } from "@/types/api";

export const metadata: Metadata = {
  title: "Mulai Assessment | CCED UNILA",
  description: "Mulai asesmen talenta mahasiswa Universitas Lampung",
};

// ISR (Incremental Static Regeneration) with 60-second revalidation
// Student filters don't change often, so caching is beneficial
export const revalidate = 60;

export default async function StartPage() {
  try {
    // Fetch student filters on the server before rendering
    const filtersResponse =
      (await serverApi.getStudentFilters()) as ApiResponse<StudentFilters>;

    // Extract filters from response
    const filters = filtersResponse.data;

    if (!filters) {
      throw new Error("Failed to load student filters");
    }

    return <StartAssessmentForm filters={filters} />;
  } catch (error) {
    // Handle error state
    const errorMessage =
      error instanceof Error ? error.message : "Gagal memuat data";

    return (
      <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
        <div className="container mx-auto w-full max-w-[720px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-10 md:p-12">
          <h3 className="mb-4 text-center text-2xl font-bold text-black dark:text-white md:text-3xl">
            Mulai Asesmen Talenta
          </h3>

          <div className="mb-10 flex items-center justify-center">
            <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
            <p className="w-full text-center text-base font-medium text-gray-700 dark:text-gray-300 sm:px-6">
              Lengkapi identitasmu sebelum memulai asesmen
            </p>
            <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
          </div>

          {/* Error State */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
            <p className="mt-4 text-center font-semibold text-red-700 dark:text-red-400">
              Gagal memuat data formulir
            </p>
            <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
              {errorMessage}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-myunila px-6 py-2 text-sm font-semibold text-white transition hover:bg-myunila-700"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      </section>
    );
  }
}

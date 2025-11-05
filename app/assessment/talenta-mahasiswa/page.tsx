import { serverApi } from "@/lib/api-server";
import AssessmentIntro from "@/components/Assessment/AssessmentIntro";
import AssessmentTestData from "@/components/Assessment/AssessmentTestData";
import { Metadata } from "next";
import { AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Assessment Talenta Mahasiswa | CCED UNILA",
  description: "Tes penilaian talenta mahasiswa Universitas Lampung",
};

// ISR (Incremental Static Regeneration) with 60-second revalidation
// Page is cached and revalidated every 60 seconds for better performance
// Note: ISR keeps serving stale data if revalidation fails (resilient behavior)
export const revalidate = 60;

export default async function AssessmentPage() {
  // Fetch test data on the server before rendering
  try {
    const data = await serverApi.getTest(1);

    console.log("Server-side data:", data);

    return (
      <>
        <AssessmentIntro />
        <AssessmentTestData data={data} />
      </>
    );
  } catch (error) {
    // Handle error state
    const errorMessage =
      error instanceof Error ? error.message : "Terjadi kesalahan";

    return (
      <>
        <AssessmentIntro />

        <section className="pb-20 pt-10 sm:pb-24 sm:pt-14 md:pb-[120px] md:pt-[80px]">
          <div className="container mx-auto px-8 md:px-16 lg:px-32">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                Data Tes dari API
              </h2>

              {/* Error State */}
              <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
                <p className="mt-4 text-center font-semibold text-red-700 dark:text-red-400">
                  Gagal memuat data tes
                </p>
                <p className="mt-2 text-center text-sm text-red-600 dark:text-red-400">
                  {errorMessage}
                </p>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}

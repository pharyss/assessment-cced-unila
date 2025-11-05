import { serverApi } from "@/lib/api-server";
import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import BehaviorPatternClient from "./client";

export const metadata: Metadata = {
  title: "Pola Perilaku | CCED UNILA",
  description: "Asesmen pola perilaku talenta mahasiswa Universitas Lampung",
};

export default async function BehaviorPatternPage() {
  try {
    // REQUIREMENT 1: Server-side fetch test 6 questions
    const testResponse = await serverApi.getTest(6);

    if (!testResponse || testResponse.status !== "success") {
      throw new Error("Gagal memuat data tes");
    }

    const testData = testResponse.data;

    // Validate test data structure
    if (!testData || !testData.questions || testData.questions.length === 0) {
      throw new Error("Data pertanyaan tidak valid");
    }

    return <BehaviorPatternClient test={testData} />;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Gagal memuat data tes";

    return (
      <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
        <div className="container mx-auto w-full max-w-[720px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-10 md:p-12">
          <h3 className="mb-4 text-center text-2xl font-bold text-black dark:text-white md:text-3xl">
            Pola Perilaku
          </h3>

          <div className="mb-10 flex items-center justify-center">
            <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
            <p className="w-full text-center text-base font-medium text-gray-700 dark:text-gray-300 sm:px-6">
              Asesmen untuk mengenali pola perilaku Anda
            </p>
            <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
          </div>

          {/* Error State */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />
            <p className="mt-4 text-center font-semibold text-red-700 dark:text-red-400">
              Gagal memuat data asesmen
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

"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import toast from "react-hot-toast";
import { useEffect, useMemo } from "react";

export default function BehaviorPatternPage() {
  const router = useRouter();
  const { goTo, resetToStep, currentStep, answers } = useAssessmentFlow();

  // ✅ Gunakan useMemo agar tidak trigger re-render terus menerus
  const isBehaviorComplete = useMemo(() => {
    const behaviorAnswers = Object.keys(answers).filter(
      (key) => !isNaN(Number(key)) && Number(key) >= 41 && Number(key) <= 76
    );
    return behaviorAnswers.length >= 36;
  }, [answers]);

  // ✅ Pastikan efek hanya berjalan saat currentStep atau isBehaviorComplete berubah
  useEffect(() => {
    if (currentStep === "behavior-pattern/fill") {
      router.replace("/assessment/talenta-mahasiswa/behavior-pattern/fill");
    } else if (currentStep === "result") {
      router.replace("/assessment/talenta-mahasiswa/result");
    } else if (isBehaviorComplete) {
      toast.success("Bagian pola perilaku sudah lengkap. Lihat hasil asesmen.");
      router.replace("/assessment/talenta-mahasiswa/result");
    }
  }, [currentStep, isBehaviorComplete, router]);

  // ✅ Fungsi mulai asesmen
  const handleStart = () => {
    try {
      resetToStep("behavior-pattern/fill");
    } catch (error) {
      console.error("Start error:", error);
      toast.error("Gagal memulai asesmen. Coba lagi.");
      router.push("/assessment/talenta-mahasiswa/behavior-pattern/fill");
    }
  };

  // ✅ Fungsi lanjut ke hasil
  const handleContinue = () => {
    if (isBehaviorComplete) {
      resetToStep("result");
    } else {
      handleStart();
    }
  };

  return (
    <section
      className="relative z-10 overflow-hidden pb-12 pt-24 md:pb-16 md:pt-32 
      lg:pb-20 lg:pt-40 bg-gradient-to-b from-blue-50 to-blue-100 
      dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container px-4 md:px-6 lg:px-8">
        <div
          className="mx-auto max-w-[800px] rounded-md bg-white dark:bg-gray-800 
          shadow-xl border border-gray-200 dark:border-gray-700 
          p-6 sm:p-8 md:p-12 text-gray-700 dark:text-gray-200"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-6">
            Pola Perilaku
          </h1>

          <p className="mb-4 text-justify">
            Asesmen ini membantumu mengenali{" "}
            <strong>pola perilaku sehari-hari</strong> dan sejauh mana kebiasaan
            tersebut mendukung{" "}
            <strong>pengembangan talentamu</strong>. Terdapat{" "}
            <strong>36 pernyataan</strong> untuk membantu refleksi diri.
          </p>

          <div className="mb-6">
            <h2 className="font-semibold mb-2 text-base sm:text-lg">
              Misi kamu:
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base">
              <li>
                Cermati setiap pernyataan dan renungkan seberapa cocok dengan
                dirimu saat ini.
              </li>
              <li>
                Jika pernyataan <strong>sangat sesuai</strong>, pilih angka{" "}
                <strong>5 (iya banget)</strong>.
              </li>
              <li>
                Jika <strong>tidak sesuai</strong>, pilih angka{" "}
                <strong>1 (nggak juga)</strong>.
              </li>
              <li>
                Pilih angka di antara <strong>1–5</strong> sesuai tingkat
                kesesuaianmu.
              </li>
            </ul>
          </div>

          <p className="italic text-center mb-8 dark:text-gray-300">
            Semakin jujur kamu menjawab, semakin akurat hasil yang kamu peroleh.
          </p>

          <div className="flex justify-center">
            <button
              onClick={isBehaviorComplete ? handleContinue : handleStart}
              className="flex items-center gap-2 rounded-full bg-primary text-white 
              px-6 py-3 md:px-8 md:py-4 text-sm sm:text-base font-semibold 
              hover:bg-primary/90 transition focus:outline-none 
              focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 
              disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={
                isBehaviorComplete
                  ? "Lanjut ke hasil asesmen"
                  : "Mulai mengisi pernyataan pola perilaku"
              }
            >
              {isBehaviorComplete ? (
                <>
                  Lihat Hasil Asesmen
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              ) : (
                <>
                  Mulai Asesmen
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

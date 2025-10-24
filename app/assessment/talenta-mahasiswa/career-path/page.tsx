"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import toast from "react-hot-toast";
import { useEffect, useState, useMemo, useCallback } from "react";

interface AssessmentFlow {
  next: () => void;
  resetToStep: (step: string) => void;
  currentStep: string;
  answers: Record<string, any>;
}

// Helper toast info
const toastInfo = (message: string, duration = 3000) => {
  toast(message, {
    duration,
    style: {
      background: "#3b82f6",
      color: "#fff",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    icon: "ℹ️",
    className: "!dark:bg-gray-800 !dark:text-white",
  });
};

export default function CareerPathPage() {
  const router = useRouter();
  const assessmentFlow = useAssessmentFlow() as AssessmentFlow;

  const { resetToStep, currentStep, answers } = assessmentFlow || {
    resetToStep: () => {},
    currentStep: "career-path",
    answers: {},
  };

  const [isLoading, setIsLoading] = useState(false);

  // Hitung progres hanya untuk 40 soal awal
  const isCareerComplete = useMemo(() => {
    const answered = Object.keys(answers).filter(
      (key) => !isNaN(Number(key)) && Number(key) <= 40,
    ).length;
    return answered >= 40;
  }, [answers]);

  // Redirect otomatis jika perlu
  useEffect(() => {
    if (isLoading) return;

    if (currentStep === "career-path/fill") {
      router.replace("/assessment/talenta-mahasiswa/career-path/fill");
    } else if (currentStep === "behavior-pattern") {
      router.replace("/assessment/talenta-mahasiswa/behavior-pattern");
    } else if (isCareerComplete && currentStep === "career-path") {
      toastInfo("Bagian karir sudah lengkap. Lanjut ke pola perilaku.");
      router.replace("/assessment/talenta-mahasiswa/behavior-pattern");
    }
  }, [currentStep, router, isCareerComplete, isLoading]);

  const handleStart = useCallback(async () => {
    setIsLoading(true);
    try {
      resetToStep("career-path/fill");
    } catch (error) {
      toast.error("Gagal memulai. Coba lagi.");
      console.error(error);
      router.push("/assessment/talenta-mahasiswa/career-path/fill");
    } finally {
      setIsLoading(false);
    }
  }, [resetToStep, router]);

  const handleContinue = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isCareerComplete) {
        resetToStep("behavior-pattern");
      } else {
        handleStart();
      }
    } catch (error) {
      toast.error("Gagal melanjutkan. Coba lagi.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [isCareerComplete, resetToStep, handleStart]);

  return (
    <main
      role="main"
      className="relative z-10 overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100 pb-12 pt-24 dark:from-gray-900 
      dark:to-gray-800 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40"
    >
      <div className="container px-4 md:px-6 lg:px-8">
        <div
          className="mx-auto max-w-[800px] rounded-md border border-gray-200 
          bg-white p-6 text-gray-700 shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:p-8 md:p-12"
        >
          <h1
            id="career-title"
            className="mb-6 text-center text-2xl font-bold text-primary sm:text-3xl md:text-4xl"
          >
            Bidang Karir Ideal
          </h1>

          <p className="mb-4 text-justify" aria-describedby="career-title">
            Bagian ini membantumu memahami{" "}
            <strong>kecenderungan bidang karir yang paling ideal</strong>{" "}
            berdasarkan <strong>minat dan karakteristik dirimu</strong>.
            Terdapat <strong>40 soal</strong> yang terbagi menjadi dua
            subbagian.
          </p>

          <ul className="mb-6 list-disc space-y-3 pl-6 text-sm sm:text-base">
            <li>
              <strong>Minat Karir (12 situasi)</strong> — Pilih satu respon yang
              paling kamu sukai atau paling mungkin kamu lakukan dari empat
              pilihan yang tersedia. Pilihlah yang paling{" "}
              <em>&quot;aku banget&quot;</em> agar hasilnya akurat.
            </li>

            <li>
              <strong>Karakteristik Diri (28 situasi)</strong> — Pilih satu dari
              dua opsi yang paling sesuai dengan karaktermu. Tidak ada jawaban
              benar atau salah.
            </li>
          </ul>

          <p className="mb-8 text-center italic dark:text-gray-300">
            Semakin jujur kamu menjawab, semakin akurat hasil yang kamu peroleh.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={isLoading}
              aria-label={
                isCareerComplete
                  ? "Lanjut ke pola perilaku"
                  : "Mulai mengisi pertanyaan karir"
              }
              aria-describedby="career-title"
              className="flex items-center gap-2 rounded-full bg-primary px-6 
                py-3 text-sm font-semibold text-white transition hover:bg-primary/90 focus:outline-none 
                focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed 
                disabled:opacity-50 sm:text-base md:px-8 
                md:py-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                  {isCareerComplete ? "Memproses..." : "Memulai..."}
                </>
              ) : (
                <>
                  {isCareerComplete
                    ? "Lanjut ke Pola Perilaku"
                    : "Mulai Asesmen"}
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

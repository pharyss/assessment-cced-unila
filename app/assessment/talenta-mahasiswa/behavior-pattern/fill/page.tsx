"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/BehaviorPattern.json";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function BehaviorPatternFill() {
  const router = useRouter();
  const { answers, saveAnswer, next, prev, currentStep } = useAssessmentFlow();

  const part2 = questionsData.part2;
  const dimensions = Object.entries(part2.dimensions);
  const totalDimensions = dimensions.length;
  const questionsPerDim = 6;
  const totalQuestions = totalDimensions * questionsPerDim;

  const [currentDimIndex, setCurrentDimIndex] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem("behavior-pattern-dim") || "0", 10);
    } catch {
      return 0;
    }
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const scale = part2.scale;

  const getRenumberedQuestions = useMemo(
    () => (dimIndex: number, dimQuestions: any[]) => {
      const baseId = 41 + dimIndex * questionsPerDim;
      return dimQuestions.map((q, idx) => ({ ...q, id: baseId + idx }));
    },
    [questionsPerDim]
  );

  const [dimKey, dimValue] = dimensions[currentDimIndex];
  const currentDimension = useMemo(() => {
    return {
      ...dimValue,
      questions: getRenumberedQuestions(currentDimIndex, dimValue.questions),
    };
  }, [currentDimIndex, dimValue, getRenumberedQuestions]);

  const totalAnswered = Object.keys(answers).filter(
    (key) => Number(key) >= 41 && Number(key) <= 76
  ).length;
  const isAllComplete = totalAnswered >= totalQuestions;

  const handleSelect = (qid: number, value: number) => {
    saveAnswer(qid.toString(), value);
  };

  const handleNext = () => {
    const allAnswered = currentDimension.questions.every(
      (q: any) => answers[q.id] !== undefined  // Perbaikan: Lengkapi baris ini
    );

    if (!allAnswered) {
      toast.error("Isi semua pernyataan di dimensi ini dulu!");
      return;
    }

    if (currentDimIndex < totalDimensions - 1) {
      const nextIndex = currentDimIndex + 1;
      setCurrentDimIndex(nextIndex);
      localStorage.setItem("behavior-pattern-dim", nextIndex.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (isAllComplete) {
      setShowConfirmModal(true);
    } else {
      toast.error(`Lengkapi semua ${totalQuestions} pernyataan terlebih dahulu.`);
    }
  };

  const handlePrev = () => {
    if (currentDimIndex > 0) {
      const prevIndex = currentDimIndex - 1;
      setCurrentDimIndex(prevIndex);
      localStorage.setItem("behavior-pattern-dim", prevIndex.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      prev();
      router.push("/assessment/talenta-mahasiswa/career-path");
    }
  };

  const handleConfirmProceed = () => {
    setShowConfirmModal(false);
    localStorage.removeItem("behavior-pattern-dim");
    next();
    toast.success("Asesmen selesai! Lihat hasil Anda.");
    router.push("/assessment/talenta-mahasiswa/result");
  };

  // Perubahan: Hanya tampilkan toast tanpa redirect
  useEffect(() => {
    if (currentStep === "behavior-pattern/fill" && isAllComplete) {
      toast.success("Asesmen pola perilaku sudah lengkap. Silakan klik 'Selesai' untuk lanjut.");
    }
  }, [currentStep, isAllComplete, router]);

  const progressPercent = ((currentDimIndex + 1) / totalDimensions) * 100;
  const currentDimAnswered = currentDimension.questions.every(
    (q: any) => answers[q.id] !== undefined
  );

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-12 pt-28 md:pt-32 lg:pt-40 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[900px] rounded-md bg-white dark:bg-gray-800 shadow-lg p-6 md:p-8 lg:p-12 border border-gray-200 dark:border-gray-700">
            <h2 className="mb-2 text-center text-2xl md:text-3xl font-bold text-black dark:text-white">
              {part2.title}
            </h2>
            <p className="mb-6 text-center text-sm md:text-base text-gray-600 dark:text-gray-300">
              {part2.instruction}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div
                className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                Halaman {currentDimIndex + 1} dari {totalDimensions}
              </p>
            </div>

            <h3 className="mb-4 text-center text-lg font-semibold text-gray-800 dark:text-gray-200">
              {currentDimension.title || dimKey.replace("_", " ").toUpperCase()}
            </h3>

            <div className="space-y-6">
              {currentDimension.questions.map((q: any, idx: number) => (
                <div key={q.id} className="border-b pb-5 last:border-0">
                  <p className="mb-3 text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-red-500 font-medium">{scale.labels[scale.min]}</span>
                    <div className="flex flex-1 justify-center gap-4">
                      {[...Array(scale.max)].map((_, i) => {
                        const val = i + 1;
                        const isSelected = answers[q.id] === val;
                        return (
                          <label key={val} htmlFor={`opt-${q.id}-${val}`} className="cursor-pointer">
                            <input
                              type="radio"
                              id={`opt-${q.id}-${val}`}
                              name={`q-${q.id}`}
                              value={val}
                              checked={isSelected}
                              onChange={() => handleSelect(q.id, val)}
                              className="hidden"
                            />
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                                isSelected
                                  ? "bg-primary text-white border-primary scale-110 shadow-md"
                                  : "border-gray-400 bg-white dark:bg-gray-800 dark:border-gray-600 hover:scale-105"
                              }`}
                            >
                              {val}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <span className="text-xs text-green-500 font-medium">{scale.labels[scale.max]}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentDimIndex === 0}
                className="flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>
              <button
                onClick={handleNext}
                disabled={!currentDimAnswered}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                  currentDimAnswered
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {currentDimIndex === totalDimensions - 1 ? "Selesai Asesmen" : "Lanjut"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Konfirmasi */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Konfirmasi Selesai
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
              Apakah Anda yakin ingin menyelesaikan asesmen? Hasil akan langsung tersedia.
              ({totalAnswered}/{totalQuestions} dijawab)
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmProceed}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:bg-gray-400"
                disabled={!isAllComplete}
              >
                Ya, Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

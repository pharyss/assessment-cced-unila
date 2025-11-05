"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/BehaviorPattern.json";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ClipboardCheck,
  ListOrdered,
  Smile,
} from "lucide-react";
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

  const [showIntroModal, setShowIntroModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const scale = part2.scale;

  const getRenumberedQuestions = useMemo(
    () => (dimIndex: number, dimQuestions: any[]) => {
      const baseId = 40 + dimIndex * questionsPerDim;
      return dimQuestions.map((q, idx) => ({ ...q, id: baseId + idx }));
    },
    [questionsPerDim],
  );

  const [dimKey, dimValue] = dimensions[currentDimIndex];
  const currentDimension = useMemo(() => {
    return {
      ...dimValue,
      questions: getRenumberedQuestions(currentDimIndex, dimValue.questions),
    };
  }, [currentDimIndex, dimValue, getRenumberedQuestions]);

const allQuestionIds = dimensions.flatMap(([_, d], dimIndex) =>
  getRenumberedQuestions(dimIndex, d.questions).map((q) => q.id)
);

const totalAnsweredAll = allQuestionIds.filter(id => answers[id] != null && answers[id] !== undefined).length;
const totalAnsweredCurrent = currentDimension.questions.filter(
  (q) => answers[q.id] != null && answers[q.id] !== undefined
).length;

const isCurrentDimComplete =
  totalAnsweredCurrent === currentDimension.questions.length;
const isAllComplete = totalAnsweredAll === totalQuestions;

  const handleSelect = (qid: number, value: number) => {
    saveAnswer(qid.toString(), value);
  };

  useEffect(() => {
    document.body.style.overflow =
      showIntroModal || showConfirmModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntroModal, showConfirmModal]);

  const handleNext = () => {
    if (!isCurrentDimComplete) {
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
      toast.error(
        `Lengkapi semua ${totalQuestions} pernyataan terlebih dahulu.`,
      );
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
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    localStorage.removeItem("behavior-pattern-dim");
    next();

    window.scrollTo({ top: 0 });
  };

  const handleStartAssessment = () => setShowIntroModal(false);

  const progressPercent = ((currentDimIndex + 1) / totalDimensions) * 100;

  return (
    <>
      {/* ===== MODAL INSTRUKSI ===== */}
      {showIntroModal && (
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="animate-scaleIn mx-4 max-w-2xl scale-95 transform rounded-lg border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <h1 className="mb-4 text-center text-2xl font-bold text-myunila md:text-3xl">
              Pola Perilaku
            </h1>
            <p className="mb-6 text-center text-base text-gray-700 dark:text-gray-300">
              Asesmen ini membantumu mengenali pola perilaku sehari-hari dan
              sejauh mana kebiasaan tersebut mendukung pengembangan talentamu.
              Terdapat <strong className="text-myunila">36 pernyataan</strong>{" "}
              untuk membantu refleksi diri.
            </p>

            <div className="mb-6 space-y-3 text-base text-myunila dark:text-gray-300">
              <div className="flex items-center gap-3 rounded-lg border border-myunila bg-myunila-50 p-3 dark:border-myunila-400 dark:bg-myunila-700/40">
                <ClipboardCheck className="h-5 w-5 text-gray-900 dark:text-white" />
                <p>Cermati setiap pernyataan dan renungkan seberapa cocok dengan dirimu saat ini.</p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-myunila bg-myunila-50 p-3 dark:border-myunila-400 dark:bg-myunila-700/40">
                <ListOrdered className="h-5 w-5 text-gray-900 dark:text-white" />
                <p>Pilih angka <strong>1–5</strong> sesuai tingkat kesesuaianmu.</p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-myunila bg-myunila-50 p-3 dark:border-myunila-400 dark:bg-myunila-700/40">
                <Smile className="h-5 w-5 text-gray-900 dark:text-white" />
                <p>
                  <strong>1</strong> berarti <strong className="text-danger">“nggak juga”</strong>,{" "}
                  <strong>5</strong> berarti <strong className="text-success">“iya banget”</strong>.
                </p>
              </div>
            </div>

            <p className="mb-6 text-center font-semibold text-gray-900 dark:text-gray-300">
              Semakin jujur kamu menjawab, semakin akurat hasilnya!
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleStartAssessment}
                className="flex items-center gap-2 rounded-full bg-myunila px-6 py-3 text-sm font-semibold text-white transition hover:bg-myunila-700"
              >
                Mulai Asesmen <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HALAMAN ASESMEN ===== */}
      <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
        <div className="container mx-auto px-4 md:px-16 lg:px-32">
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-10">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-bold text-myunila dark:text-white sm:text-3xl">
                {part2.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {part2.instruction}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-gradient-blue-modern transition-all duration-700 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Halaman <strong>{currentDimIndex + 1}</strong> dari <strong>{totalDimensions}</strong>
              </p>
            </div>

            {/* Pertanyaan */}
            <div className="space-y-8">
              {currentDimension.questions.map((q, idx) => (
                <div key={q.id} className="border-b pb-5 last:border-0">
                  <p className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100 md:text-lg">
                    {idx + 1}. {q.text}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs md:text-base font-medium text-danger">
                      {scale.labels[scale.min]}
                    </span>
                    <div className="flex flex-1 justify-center gap-4 md:gap-16">
                      {[...Array(scale.max)].map((_, i) => {
                        const val = i + 1;
                        const isSelected = answers[q.id] === val;
                        return (
                          <label key={val} className="cursor-pointer">
                            <input
                              type="radio"
                              name={`q-${q.id}`}
                              value={val}
                              checked={isSelected}
                              onChange={() => handleSelect(q.id, val)}
                              className="hidden"
                            />
                            <span
                              className={`flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full border transition-all ${
                                isSelected
                                  ? "scale-110 border-myunila bg-myunila-100/50 text-myunila dark:border-myunila-400 dark:bg-myunila-700/40 dark:text-white font-bold shadow-md dark:shadow-myunila/20"
                                  : "border-gray-400 bg-white text-gray-700 hover:scale-105 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 hover:dark:bg-gray-700"
                              }`}
                            >
                              {val}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                    <span className="text-xs md:text-base font-medium text-success">
                      {scale.labels[scale.max]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row">
              <button
                onClick={handlePrev}
                disabled={currentDimIndex === 0}
                className="flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentDimComplete}
className={`flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
  isCurrentDimComplete
    ? "bg-myunila text-white hover:bg-myunila-700"
    : "bg-gray-300 text-gray-500 cursor-not-allowed"
}`}

              >
                {currentDimIndex === totalDimensions - 1
                  ? "Selesai Asesmen"
                  : "Lanjut"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MODAL KONFIRMASI SELESAI ===== */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800 animate-scaleIn">
            <div className="mb-2 flex flex-col items-center text-center">
              <AlertCircle className="text-warning h-16 w-16 mb-3" />
              <h3 className="text-warning text-2xl font-bold dark:text-white">
                Konfirmasi Selesai
              </h3>
            </div>
            <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
              Apakah Anda yakin ingin menyelesaikan asesmen? Hasil akan langsung
              tersedia.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rounded-full border border-gray-200 px-10 py-2.5 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="rounded-full bg-myunila px-8 py-2.5 font-medium text-white hover:bg-myunila-700 disabled:opacity-50"
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

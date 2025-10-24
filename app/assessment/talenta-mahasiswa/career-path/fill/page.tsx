"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/CareerPath.json";

export default function CareerPathFill() {
  const router = useRouter();
  const { answers, saveAnswer, next, currentStep } = useAssessmentFlow();

  const questions = useMemo(() => {
    const subA = questionsData.part1.subPartA.questions;
    const subB = questionsData.part1.subPartB.questions.map((q) => ({
      ...q,
      id: q.id + 12,
    }));
    return [...subA, ...subB];
  }, []);

  const [pageIndex, setPageIndex] = useState(() => {
    try {
      return parseInt(localStorage.getItem("career-path-page") || "0", 10);
    } catch {
      return 0;
    }
  });
  const [showConfirm, setShowConfirm] = useState(false);

  const pageSize = 4;
  const totalPages = Math.ceil(questions.length / pageSize);
  const totalQuestions = questions.length;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const currentQuestions = questions.slice(start, end);

  const totalAnswered = Object.keys(answers).filter(
    (key) => !isNaN(Number(key)) && Number(key) <= totalQuestions
  ).length;
  const isAllComplete = totalAnswered >= totalQuestions;
  const currentPageAnswered = currentQuestions.every((q) => answers[q.id]);

  const handleSelect = (qid: string | number, value: string) => {
    saveAnswer(qid.toString(), value);
  };

  const handleNext = () => {
    if (!currentPageAnswered) {
      toast.error("Isi semua pertanyaan di halaman ini dulu!");
      return;
    }

    if (pageIndex < totalPages - 1) {
      setPageIndex((prev) => {
        const nextPage = prev + 1;
        localStorage.setItem("career-path-page", nextPage.toString());
        return nextPage;
      });
    } else if (isAllComplete) {
      setShowConfirm(true);
    } else {
      toast.error(`Lengkapi semua ${totalQuestions} pertanyaan terlebih dahulu!`);
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => {
        const prevPage = prev - 1;
        localStorage.setItem("career-path-page", prevPage.toString());
        return prevPage;
      });
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    next();
    router.push("/assessment/talenta-mahasiswa/behavior-pattern");
    localStorage.removeItem("career-path-page");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageIndex]);

  useEffect(() => {
    if (
      currentStep === "behavior-pattern" ||
      (currentStep === "career-path/fill" && isAllComplete)
    ) {
      toast("Bagian karir sudah lengkap. Lanjut ke pola perilaku.");
      router.replace("/assessment/talenta-mahasiswa/behavior-pattern");
    }
  }, [currentStep, isAllComplete, router]);

  const progressPercent = ((pageIndex + 1) / totalPages) * 100;

  return (
    <>
      <section className="relative z-10 overflow-hidden pb-12 pt-24 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[900px] rounded-md bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 lg:p-12">
            <h2 className="mb-4 text-center text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
              {questionsData.part1.title}
            </h2>
            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
              {questionsData.part1.instruction}
            </p>

            {/* Progress Bar */}
            <div className="mb-6">
              <div
                className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Progres ${progressPercent.toFixed(0)}% selesai`}
              >
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                Halaman {pageIndex + 1} dari {totalPages}
              </p>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {currentQuestions.map((q) => (
                <div key={q.id} className="border-b pb-4 last:border-0">
                  <h3 className="mb-3 text-sm sm:text-base lg:text-lg font-medium text-gray-800 dark:text-gray-200">
                    {q.id}. {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt.label}
                        htmlFor={`opt-${q.id}-${opt.label}`}
                        className={`flex cursor-pointer items-center rounded-md border p-3 transition ${
                          answers[q.id] === opt.label
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
                        }`}
                      >
                        <input
                          type="radio"
                          id={`opt-${q.id}-${opt.label}`}
                          name={`q-${q.id}`}
                          value={opt.label}
                          checked={answers[q.id] === opt.label}
                          onChange={() => handleSelect(q.id, opt.label)}
                          className="hidden"
                        />
                        <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                          {opt.label}. {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={pageIndex === 0}
                className="flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!currentPageAnswered}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  currentPageAnswered
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } focus:outline-none focus:ring-2 focus:ring-primary/50`}
              >
                {pageIndex === totalPages - 1 ? "Selesai Part 1" : "Lanjut"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
          <div className="mx-4 max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Konfirmasi</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
              Apakah Anda yakin ingin melanjutkan ke tes berikutnya? Bagian ini tidak dapat diubah lagi. ({totalAnswered}/{totalQuestions} dijawab)
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isAllComplete}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
              >
                Ya, Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

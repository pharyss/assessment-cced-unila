"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ClipboardList,
  User,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { resultsApi, ApiError } from "@/lib/api-client";
import { TestQuestion } from "@/types/api";
import { ASSESSMENT_STORAGE_KEY, ASSESSMENT_ROUTES } from "@/lib/constants";

interface ProcessedQuestion {
  id: string;
  question: string;
  key: string;
  testId: number;
  options: Array<{
    id: string;
    label: string;
    text: string;
    value: string;
  }>;
}

interface CareerPathClientProps {
  test4Questions: TestQuestion[];
  test5Questions: TestQuestion[];
}

export default function CareerPathClient({
  test4Questions,
  test5Questions,
}: CareerPathClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<ProcessedQuestion[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [testSubmissionId, setTestSubmissionId] = useState<string | null>(null);

  const hasInitializedRef = useRef(false);

  const pageSize = 4;
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / pageSize);
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const currentQuestions = questions.slice(start, end);

  const isQuestionAnswered = (q: { key: string }) => {
    const answer = answers[q.key];
    return answer !== undefined && answer !== "";
  };

  const totalAnswered = questions.filter(isQuestionAnswered).length;
  const isAllComplete = totalAnswered === totalQuestions;
  const currentPageAnswered = currentQuestions.every((q) =>
    isQuestionAnswered(q),
  );
  const progressPercent =
    totalPages > 0 ? ((pageIndex + 1) / totalPages) * 100 : 0;

  // Initialize: process questions and fetch saved answers from backend
  // NOTE: No answers are stored in localStorage - all answers fetched fresh from backend
  useEffect(() => {
    const initCareerPath = async () => {
      if (hasInitializedRef.current) return;
      hasInitializedRef.current = true;

      try {
        // 1. Process questions from server-side fetched data
        const processedTest4 = test4Questions
          .sort((a, b) => a.order - b.order)
          .map((q) => ({
            id: q.id,
            question: q.text,
            key: `4-${q.id}`,
            testId: 4,
            options: q.options
              .sort((a, b) => a.order - b.order)
              .map((opt, idx) => ({
                id: opt.id,
                label: String.fromCharCode(65 + idx),
                text: opt.text,
                value: opt.value,
              })),
          }));

        const processedTest5 = test5Questions
          .sort((a, b) => a.order - b.order)
          .map((q) => ({
            id: q.id,
            question: q.text,
            key: `5-${q.id}`,
            testId: 5,
            options: q.options
              .sort((a, b) => a.order - b.order)
              .map((opt, idx) => ({
                id: opt.id,
                label: String.fromCharCode(65 + idx),
                text: opt.text,
                value: opt.value,
              })),
          }));

        const allQuestions = [...processedTest4, ...processedTest5];
        setQuestions(allQuestions);

        // 2. Get testSubmissionId from localStorage
        const storedData = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
        console.log("✓ Checking localStorage for key:", ASSESSMENT_STORAGE_KEY);

        if (!storedData) {
          console.error("❌ No data found in localStorage");
          toast.error("Data submission tidak ditemukan. Mulai ulang asesmen.");
          router.push(ASSESSMENT_ROUTES.START);
          return;
        }

        console.log("✓ Found localStorage data");
        const submissionData = JSON.parse(storedData);
        const submissionId = submissionData.testSubmissionId;

        if (!submissionId) {
          console.error(
            "❌ No testSubmissionId in stored data:",
            submissionData,
          );
          toast.error("ID submission tidak ditemukan. Mulai ulang asesmen.");
          router.push(ASSESSMENT_ROUTES.START);
          return;
        }

        console.log("✓ Found testSubmissionId:", submissionId);

        setTestSubmissionId(submissionId);

        // 3. Fetch existing answers from backend to pre-select them (GET method)
        try {
          const response = await resultsApi.getSubmissionAnswers(submissionId);

          if (
            response.status === "success" &&
            (response.data as any)?.answers
          ) {
            const submittedAnswers = (response.data as any).answers;
            const loadedAnswers: Record<string, string> = {};

            submittedAnswers.forEach((answer: any) => {
              const question = allQuestions.find(
                (q) => q.id === answer.testQuestionId,
              );
              if (question) {
                loadedAnswers[question.key] = answer.selectedOptionId;
              }
            });

            if (Object.keys(loadedAnswers).length > 0) {
              setAnswers(loadedAnswers);
              toast.success(
                `${Object.keys(loadedAnswers).length} jawaban dimuat`,
              );
            }
          }
        } catch (error) {
          console.warn("Could not load saved answers:", error);
          // Continue without pre-loaded answers
        }
      } catch (error) {
        console.error("Error initializing career path:", error);
        toast.error("Gagal menginisialisasi. Coba refresh halaman.");
      }
    };

    initCareerPath();
  }, [test4Questions, test5Questions, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageIndex]);

  useEffect(() => {
    if (showInstruction || showConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showInstruction, showConfirm]);

  const handleSelect = (q: { key: string }, selectedOptionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [q.key]: selectedOptionId,
    }));
  };

  // Save current page answers using PUT method
  const saveCurrentPageAnswers = async () => {
    if (!testSubmissionId) {
      toast.error("Submission ID tidak ditemukan.");
      return false;
    }

    const answersToSave: Array<{
      testQuestionId: string;
      selectedOptionId: string;
    }> = [];

    currentQuestions.forEach((q) => {
      if (answers[q.key]) {
        answersToSave.push({
          testQuestionId: q.id,
          selectedOptionId: answers[q.key],
        });
      }
    });

    if (answersToSave.length === 0) {
      return true;
    }

    setIsSaving(true);
    try {
      // Save answers using PUT endpoint to batch update
      const response = await resultsApi.batchUpdateTestSubmissionAnswers(
        testSubmissionId,
        answersToSave,
      );

      if (response.status === "success") {
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error saving answers:", error);
      if (error instanceof ApiError) {
        toast.error(`Gagal: ${error.message}`);
      } else {
        toast.error("Gagal menyimpan jawaban.");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (!currentPageAnswered) {
      toast.error("Jawab semua pertanyaan di halaman ini dulu!");
      return;
    }

    // Save answers to backend using PUT before navigating (requirement: save on every "Lanjut" click)
    const success = await saveCurrentPageAnswers();
    if (!success) {
      return;
    }

    if (pageIndex < totalPages - 1) {
      setPageIndex((prev) => prev + 1);
    } else if (isAllComplete) {
      setShowConfirm(true);
    }
  };

  const handlePrev = async () => {
    if (pageIndex > 0) {
      // Save current page answers before going back
      await saveCurrentPageAnswers();
      setPageIndex((prev) => prev - 1);
    }
  };

  const handleConfirm = async () => {
    if (!testSubmissionId) {
      toast.error("Submission ID tidak ditemukan.");
      return;
    }

    setIsSaving(true);
    try {
      // Save all remaining answers
      const allAnswersToSave: Array<{
        testQuestionId: string;
        selectedOptionId: string;
      }> = [];

      questions.forEach((q) => {
        if (answers[q.key]) {
          allAnswersToSave.push({
            testQuestionId: q.id,
            selectedOptionId: answers[q.key],
          });
        }
      });

      if (allAnswersToSave.length > 0) {
        await resultsApi.batchUpdateTestSubmissionAnswers(
          testSubmissionId,
          allAnswersToSave,
        );
      }

      setShowConfirm(false);
      toast.success("Career Path berhasil diselesaikan!");
      // Navigate to next route: behavior-pattern
      router.push("/assessment/talenta-mahasiswa/behavior-pattern");
    } catch (error) {
      console.error("Error completing:", error);
      toast.error("Gagal menyelesaikan test.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {showInstruction && (
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="animate-scaleIn relative mx-4 max-w-2xl scale-95 transform rounded-lg border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 ease-out dark:border-gray-700 dark:bg-gray-800">
            <h1 className="mb-4 text-center text-2xl font-bold text-myunila md:text-3xl">
              Bidang Karir Ideal
            </h1>
            <p className="mb-6 text-center text-base text-gray-700 dark:text-gray-300">
              Bagian ini membantumu memahami kecenderungan bidang karir yang
              paling ideal berdasarkan minat dan karakteristik dirimu. Terdapat
              40 soal yang terbagi menjadi dua subbagian.
            </p>

            <div className="mb-6 flex flex-col gap-4 text-base text-gray-700 dark:text-gray-300 sm:flex-row">
              {[
                {
                  icon: <ClipboardList className="h-6 w-6" />,
                  title: "Minat Karir (12 situasi)",
                  desc: "Pilih satu respon paling kamu sukai atau paling mungkin kamu lakukan dari empat pilihan.",
                },
                {
                  icon: <User className="h-6 w-6" />,
                  title: "Karakteristik Karir (28 pernyataan)",
                  desc: "Pilih satu respon paling mencerminkan dirimu saat ini dari empat pilihan.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-3 rounded-lg border border-myunila bg-myunila-50 p-4 text-center dark:border-myunila-800 dark:bg-myunila-900"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-myunila text-white">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-myunila dark:text-myunila-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-lg border border-warning bg-warning/10 p-4 dark:border-warning/50 dark:bg-warning/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="mb-2 font-semibold text-warning">
                    Penting untuk Diperhatikan:
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>
                      Tidak ada jawaban benar atau salah, pilih yang paling
                      sesuai dengan dirimu.
                    </li>
                    <li>
                      Jawab dengan jujur untuk hasil yang lebih akurat dan
                      bermanfaat.
                    </li>
                    <li>Kamu bisa kembali mengubah jawaban sebelum selesai.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setShowInstruction(false)}
                className="flex items-center gap-2 rounded-full bg-myunila px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-myunila-700 hover:shadow-xl"
              >
                Mulai Asesmen <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="relative z-10 min-h-screen bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
        <div className="container mx-auto w-full max-w-[900px] px-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-10 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-bold text-myunila dark:text-white md:text-3xl">
                Bidang Karir Ideal
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 md:text-base">
                Pilih satu jawaban yang paling sesuai dengan dirimu untuk setiap
                pertanyaan
              </p>
            </div>

            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Halaman {pageIndex + 1} dari {totalPages}
                </span>
                <span>
                  {totalAnswered} dari {totalQuestions} terjawab
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full bg-gradient-to-r from-myunila to-myunila-600 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-8">
              {currentQuestions.map((q, idx) => {
                const questionNumber = start + idx + 1;
                return (
                  <div
                    key={q.key}
                    className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800"
                  >
                    <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100 md:text-lg">
                      {questionNumber}. {q.question}
                    </h3>
                    <div className="space-y-3">
                      {q.options.map((opt) => {
                        const isSelected = answers[q.key] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
                              isSelected
                                ? "border-myunila bg-myunila-50 dark:border-myunila-600 dark:bg-myunila-900/30"
                                : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.key}
                              value={opt.id}
                              checked={isSelected}
                              onChange={() => handleSelect(q, opt.id)}
                              className="mt-1 h-5 w-5 flex-shrink-0 accent-myunila"
                            />
                            <div className="flex-1">
                              <span
                                className={`font-semibold ${
                                  isSelected
                                    ? "text-myunila dark:text-myunila-300"
                                    : "text-gray-700 dark:text-gray-300"
                                }`}
                              >
                                {opt.label}.{" "}
                              </span>
                              <span
                                className={
                                  isSelected
                                    ? "text-gray-800 dark:text-gray-200"
                                    : "text-gray-700 dark:text-gray-300"
                                }
                              >
                                {opt.text}
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={pageIndex === 0 || isSaving}
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
                Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={!currentPageAnswered || isSaving}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                  currentPageAnswered && !isSaving
                    ? "bg-myunila text-white hover:bg-myunila-700"
                    : "cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-500"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : pageIndex === totalPages - 1 ? (
                  <>
                    Selesai <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Lanjut <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {showConfirm && (
        <div className="animate-fadeIn fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="animate-scaleIn mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-4 flex flex-col items-center text-center">
              <AlertCircle className="mb-3 h-16 w-16 text-warning" />
              <h3 className="text-2xl font-bold text-warning dark:text-white">
                Konfirmasi Selesai
              </h3>
            </div>
            <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
              Apakah Anda yakin ingin menyelesaikan bagian Career Path ini? Anda
              akan melanjutkan ke bagian berikutnya.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isSaving}
                className="rounded-full border border-gray-300 px-8 py-2.5 text-gray-700 transition hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isAllComplete || isSaving}
                className="flex items-center gap-2 rounded-full bg-myunila px-8 py-2.5 font-semibold text-white transition hover:bg-myunila-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Ya, Lanjutkan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

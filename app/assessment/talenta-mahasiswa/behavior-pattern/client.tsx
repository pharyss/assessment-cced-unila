"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { resultsApi } from "@/lib/api-client";
import { Test } from "@/types/api";
import { ASSESSMENT_STORAGE_KEY } from "@/lib/constants";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ClipboardCheck,
  ListOrdered,
  Smile,
} from "lucide-react";
import toast from "react-hot-toast";
const QUESTIONS_PER_DIM = 6;

interface BehaviorPatternClientProps {
  test: Test;
}

export default function BehaviorPatternClient({
  test,
}: BehaviorPatternClientProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentDimIndex, setCurrentDimIndex] = useState(0);
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [testSubmissionId, setTestSubmissionId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const hasInitializedRef = useRef(false);

  const totalDimensions = Math.ceil(test.questions.length / QUESTIONS_PER_DIM);
  const startIdx = currentDimIndex * QUESTIONS_PER_DIM;
  const endIdx = startIdx + QUESTIONS_PER_DIM;
  const currentQuestions = test.questions.slice(startIdx, endIdx);

  // Get scale from first question options (assuming likert scale 1-5)
  const scaleMax = test.questions[0]?.options?.length || 5;
  const scaleMin = 1;

  // REQUIREMENT 2 & 2.1 & 3: Clear old localStorage, fetch submission, pre-select answers
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    const initializeAnswers = async () => {
      try {
        // REQUIREMENT 2: Delete any saved answers for this test to avoid stale data
        const oldAnswersKey = `behavior-pattern-answers`;
        const oldDimKey = `behavior-pattern-dim`;
        localStorage.removeItem(oldAnswersKey);
        localStorage.removeItem(oldDimKey);
        console.log("✓ Cleared old localStorage answers");

        // REQUIREMENT 2.1: Get testSubmissionId from localStorage
        const storedData = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
        if (!storedData) {
          console.error("❌ No submission data in localStorage");
          toast.error("Data submission tidak ditemukan. Silakan mulai ulang.");
          return;
        }

        const submissionData = JSON.parse(storedData);
        const submissionId = submissionData.testSubmissionId;

        if (!submissionId) {
          console.error("❌ No testSubmissionId in stored data");
          toast.error("ID submission tidak valid. Silakan mulai ulang.");
          return;
        }

        console.log("✓ Found testSubmissionId:", submissionId);
        setTestSubmissionId(submissionId);

        // REQUIREMENT 3: Fetch existing answers and pre-select them
        const response = await resultsApi.getSubmissionAnswers(submissionId);

        if (response.status === "success") {
          const submissionData = response.data as any;
          const existingAnswers: Record<string, string> = {};

          if (submissionData.answers && Array.isArray(submissionData.answers)) {
            const validQuestionIds = new Set(test.questions.map((q) => q.id));
            submissionData.answers.forEach((answer: any) => {
              if (validQuestionIds.has(answer.testQuestionId)) {
                existingAnswers[answer.testQuestionId] =
                  answer.selectedOptionId;
              }
            });
          }

          console.log("📊 Answer loading debug:");
          console.log("  Total questions in test:", test.questions.length);
          console.log(
            "  Answers loaded from API:",
            Object.keys(existingAnswers).length,
          );
          console.log("  Loaded question IDs:", Object.keys(existingAnswers));
          console.log(
            "  Expected question IDs:",
            test.questions.map((q) => q.id),
          );

          if (Object.keys(existingAnswers).length > 0) {
            setAnswers(existingAnswers);
            console.log(
              "✓ Pre-selected answers:",
              Object.keys(existingAnswers).length,
            );
            toast.success("Jawaban sebelumnya berhasil dimuat");
          }
        }
      } catch (error) {
        console.error("❌ Error initializing answers:", error);
        toast.error("Gagal memuat jawaban sebelumnya");
      }
    };

    initializeAnswers();
  }, []);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // REQUIREMENT 4: Save answers on "Lanjut" button using PUT method
  // First GET existing answers, merge with current page selections, then PUT all
  const saveCurrentPageAnswers = async () => {
    if (!testSubmissionId) {
      toast.error("Submission ID tidak ditemukan.");
      return false;
    }

    const currentPageAnswers: Array<{
      testQuestionId: string;
      selectedOptionId: string;
    }> = [];

    currentQuestions.forEach((question) => {
      const selectedOptionId = answers[question.id];
      if (selectedOptionId) {
        currentPageAnswers.push({
          testQuestionId: question.id,
          selectedOptionId,
        });
      }
    });

    if (currentPageAnswers.length === 0) {
      return true;
    }

    try {
      console.log("💾 Saving answers for current dimension:");
      console.log("  Dimension:", currentDimIndex + 1);
      console.log("  Answers to save:", currentPageAnswers.length);
      console.log(
        "  Question IDs being saved:",
        currentPageAnswers.map((a) => a.testQuestionId),
      );

      // Step 1: GET existing answers from backend
      const existingResponse =
        await resultsApi.getSubmissionAnswers(testSubmissionId);

      let existingAnswers: Array<{
        id?: string;
        testQuestionId: string;
        selectedOptionId: string;
      }> = [];

      if (
        existingResponse.status === "success" &&
        (existingResponse.data as any)?.answers
      ) {
        const validQuestionIds = new Set(test.questions.map((q) => q.id));

        existingAnswers = (existingResponse.data as any).answers
          .map((answer: any) => ({
            id: answer.id,

            testQuestionId: answer.testQuestionId,

            selectedOptionId: answer.selectedOptionId,
          }))
          .filter((answer: any) => validQuestionIds.has(answer.testQuestionId));
      }

      // Step 2: Merge existing answers with current page answers
      const mergedAnswersMap = new Map<
        string,
        {
          id?: string;
          testQuestionId: string;
          selectedOptionId: string;
        }
      >();

      // Add existing answers to map
      existingAnswers.forEach((answer) => {
        mergedAnswersMap.set(answer.testQuestionId, answer);
      });

      // Overwrite/add current page answers
      currentPageAnswers.forEach((answer) => {
        const existing = mergedAnswersMap.get(answer.testQuestionId);
        mergedAnswersMap.set(answer.testQuestionId, {
          id: existing?.id, // Keep existing ID if available
          testQuestionId: answer.testQuestionId,
          selectedOptionId: answer.selectedOptionId,
        });
      });

      // Convert map to array
      const answersToSave = Array.from(mergedAnswersMap.values());

      console.log("  Total merged answers:", answersToSave.length);

      // Step 3: PUT all merged answers using batch update
      const response = await resultsApi.batchUpdateTestSubmissionAnswers(
        testSubmissionId,
        answersToSave,
      );

      if (response.status === "success") {
        console.log("✓ Answers saved successfully");
        return true;
      }

      toast.error("Gagal menyimpan jawaban");
      return false;
    } catch (error) {
      console.error("❌ Error saving answers:", error);
      toast.error("Gagal menyimpan jawaban");
      return false;
    }
  };

  const totalAnsweredAll = Object.keys(answers).length;
  const totalAnsweredCurrent = currentQuestions.filter(
    (q) => answers[q.id] !== undefined,
  ).length;

  const isCurrentDimComplete = totalAnsweredCurrent === currentQuestions.length;

  const isAllComplete = test.questions.every(
    (q) => answers[q.id] !== undefined,
  );

  const handleNext = async () => {
    if (!isCurrentDimComplete) {
      toast.error("Isi semua pernyataan di dimensi ini dulu!");
      return;
    }

    setIsSaving(true);
    const saved = await saveCurrentPageAnswers();
    setIsSaving(false);

    if (!saved) {
      return;
    }

    if (currentDimIndex < totalDimensions - 1) {
      const nextIndex = currentDimIndex + 1;
      setCurrentDimIndex(nextIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Validate using per-question check scoped to this test
      const allQuestionIds = test.questions.map((q) => q.id);

      const answeredIds = test.questions
        .filter((q) => answers[q.id] !== undefined)
        .map((q) => q.id);

      const currentAnsweredCount = answeredIds.length;
      const isNowComplete = currentAnsweredCount === test.questions.length;

      if (isNowComplete) {
        setShowConfirmModal(true);
      } else {
        const missingIds = allQuestionIds.filter(
          (id) => !answeredIds.includes(id),
        );
        // For debugging: any extra keys in answers not part of this test
        const extraIds = Object.keys(answers).filter(
          (id) => !allQuestionIds.includes(id),
        );

        console.log("❌ Validation failed:");

        console.log("  Total answered (relevant):", currentAnsweredCount);

        console.log("  Total questions:", test.questions.length);

        console.log("  Missing question IDs:", missingIds);

        console.log("  Extra/Invalid question IDs:", extraIds);

        toast.error(
          `Lengkapi semua ${test.questions.length} pernyataan terlebih dahulu. (Terjawab: ${currentAnsweredCount}, Kurang: ${missingIds.length})`,
        );
      }
    }
  };

  const handlePrev = () => {
    if (currentDimIndex > 0) {
      const prevIndex = currentDimIndex - 1;
      setCurrentDimIndex(prevIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // REQUIREMENT 5: Navigate to result page when done
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

      test.questions.forEach((question) => {
        const selectedOptionId = answers[question.id];
        if (selectedOptionId) {
          allAnswersToSave.push({
            testQuestionId: question.id,
            selectedOptionId,
          });
        }
      });

      if (allAnswersToSave.length > 0) {
        await resultsApi.batchUpdateTestSubmissionAnswers(
          testSubmissionId,
          allAnswersToSave,
        );
      }

      console.log("✓ All answers saved successfully");
      toast.success("Jawaban berhasil disimpan!");

      // REQUIREMENT 5: Navigate to result page
      setShowConfirmModal(false);
      router.push("/assessment/talenta-mahasiswa/result");
    } catch (error) {
      console.error("❌ Error saving final answers:", error);
      toast.error("Gagal menyimpan jawaban");
      setIsSaving(false);
    }
  };

  const handleStartAssessment = () => setShowIntroModal(false);

  const progressPercent = ((currentDimIndex + 1) / totalDimensions) * 100;

  useEffect(() => {
    document.body.style.overflow =
      showIntroModal || showConfirmModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showIntroModal, showConfirmModal]);

  return (
    <>
      {/* ===== MODAL INSTRUKSI ===== */}
      {showIntroModal && (
        <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-300">
          <div className="animate-scaleIn mx-4 max-w-2xl scale-95 transform rounded-lg border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
            <h1 className="mb-4 text-center text-2xl font-bold text-myunila md:text-3xl">
              {test.name}
            </h1>
            <p className="mb-6 text-center text-base text-gray-700 dark:text-gray-300">
              {test.description ||
                "Asesmen ini membantumu mengenali pola perilaku sehari-hari dan sejauh mana kebiasaan tersebut mendukung pengembangan talentamu."}{" "}
              Terdapat{" "}
              <strong className="text-myunila">
                {test.questions.length} pernyataan
              </strong>{" "}
              untuk membantu refleksi diri.
            </p>

            <div className="mb-6 space-y-3 text-base text-myunila dark:text-gray-300">
              <div className="flex items-center gap-3 rounded-lg border border-myunila bg-myunila-50 p-3 dark:border-myunila-800 dark:bg-myunila-300">
                <ClipboardCheck className="h-5 w-5 text-gray-900 dark:text-gray-300" />
                <p>
                  Cermati setiap pernyataan dan renungkan seberapa cocok dengan
                  dirimu saat ini.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-myunila bg-myunila-50 p-3 dark:border-myunila-800 dark:bg-myunila-300">
                <ListOrdered className="h-5 w-5 text-gray-900 dark:text-gray-300" />
                <p>
                  Pilih angka <strong>1–{scaleMax}</strong> sesuai tingkat
                  kesesuaianmu.
                </p>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-myunila bg-myunila-50 p-3 dark:border-myunila-800 dark:bg-myunila-300">
                <Smile className="h-5 w-5 text-gray-900 dark:text-gray-300" />
                <p>Semakin jujur kamu menjawab, semakin akurat hasilnya!</p>
              </div>
            </div>

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
                {test.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {test.description ||
                  "Jawab setiap pernyataan dengan jujur sesuai kondisimu"}
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
                Halaman <strong>{currentDimIndex + 1}</strong> dari{" "}
                <strong>{totalDimensions}</strong>
              </p>
            </div>

            {/* Pertanyaan */}
            <div className="space-y-8">
              {currentQuestions.map((question, idx) => {
                const questionNumber = startIdx + idx + 1;
                const selectedOptionId = answers[question.id];

                // Sort options by order to ensure 1-5 order
                const sortedOptions = [...question.options].sort(
                  (a, b) => a.order - b.order,
                );

                return (
                  <div
                    key={question.id}
                    className="border-b pb-5 last:border-0"
                  >
                    <p className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100 md:text-lg">
                      {questionNumber}. {question.text}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-danger md:text-base">
                        {sortedOptions[0]?.text || "Sangat Tidak Setuju"}
                      </span>
                      <div className="flex flex-1 justify-center gap-4 md:gap-16">
                        {sortedOptions.map((option, i) => {
                          const val = i + 1;
                          const isSelected = selectedOptionId === option.id;
                          return (
                            <label key={option.id} className="cursor-pointer">
                              <input
                                type="radio"
                                name={`q-${question.id}`}
                                value={option.id}
                                checked={isSelected}
                                onChange={() =>
                                  handleSelect(question.id, option.id)
                                }
                                className="hidden"
                              />
                              <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all md:h-12 md:w-12 ${
                                  isSelected
                                    ? "scale-110 border-myunila bg-myunila-100/50 font-bold text-myunila shadow-md dark:border-myunila-400 dark:bg-myunila-700/40 dark:text-white dark:shadow-myunila/20"
                                    : "border-gray-400 bg-white text-gray-700 hover:scale-105 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 hover:dark:bg-gray-700"
                                }`}
                              >
                                {val}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                      <span className="text-xs font-medium text-success md:text-base">
                        {sortedOptions[sortedOptions.length - 1]?.text ||
                          "Sangat Setuju"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row">
              <button
                onClick={handlePrev}
                disabled={currentDimIndex === 0 || isSaving}
                className="flex items-center justify-center gap-2 rounded-full border px-6 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>

              <button
                onClick={handleNext}
                disabled={!isCurrentDimComplete || isSaving}
                className={`flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  isCurrentDimComplete && !isSaving
                    ? "bg-myunila text-white hover:bg-myunila-700"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                {isSaving
                  ? "Menyimpan..."
                  : currentDimIndex === totalDimensions - 1
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
        <div className="animate-fadeIn fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="animate-scaleIn mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex flex-col items-center text-center">
              <AlertCircle className="mb-3 h-16 w-16 text-warning" />
              <h3 className="text-2xl font-bold text-warning dark:text-white">
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
                disabled={isSaving}
                className="rounded-full border border-gray-200 px-10 py-2.5 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="rounded-full bg-myunila px-8 py-2.5 font-medium text-white hover:bg-myunila-700 disabled:opacity-50"
                disabled={!isAllComplete || isSaving}
              >
                {isSaving ? "Menyimpan..." : "Ya, Selesaikan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

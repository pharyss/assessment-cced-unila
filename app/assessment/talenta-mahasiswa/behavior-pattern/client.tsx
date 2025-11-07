"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { resultsApi } from "@/lib/api-client";
import { Test } from "@/types/api";
import { TEST_ANSWER_KEY } from "@/lib/constants";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
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
  const { saveAnswer, answers: flowAnswers } = useAssessmentFlow();
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

        // Save test 6 questions+options to localStorage for result calculation
        const test6ForStorage = test.questions
          .sort((a, b) => a.order - b.order)
          .map((q) => ({
            id: q.id,
            order: q.order,
            options: q.options.map((opt) => ({
              id: opt.id,
              value: opt.value,
            })),
          }));

        localStorage.setItem(
          "test6_questions",
          JSON.stringify(test6ForStorage),
        );
        console.log("✓ Saved test 6 questions to localStorage");

        // Load existing answers from useAssessmentFlow (localStorage)
        // Note: flowAnswers contains numeric values, but we need optionIds for UI
        // So we skip loading from flow here - we'll load from backend instead

        // REQUIREMENT 2.1: Get testSubmissionId from localStorage
        const storedData = localStorage.getItem(TEST_ANSWER_KEY);
        if (!storedData) {
          console.error("❌ No test answer data in localStorage");
          toast.error("Data submission tidak ditemukan. Silakan mulai ulang.");
          return;
        }

        const answerData = JSON.parse(storedData);
        const submissionId = answerData.testSubmissionId;

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
            // Map question ID to order for conversion
            const questionIdToOrder = new Map(
              test.questions.map((q) => [q.id, q.order + 1]), // Convert to 1-based
            );

            submissionData.answers.forEach((answer: any) => {
              const order = questionIdToOrder.get(answer.testQuestionId);
              console.log(
                `🔍 Processing answer: testQuestionId=${answer.testQuestionId}, selectedOptionId=${answer.selectedOptionId}, order=${order}`,
              );
              if (order !== undefined) {
                // Find the question to get option's numeric value from backend
                const question = test.questions.find(
                  (q) => q.id === answer.testQuestionId,
                );
                console.log(`  Found question:`, question ? "YES" : "NO");
                if (question) {
                  // Find the selected option to get its value field
                  const selectedOption = question.options.find(
                    (opt) => opt.id === answer.selectedOptionId,
                  );
                  console.log(
                    `  Selected option:`,
                    selectedOption
                      ? { id: selectedOption.id, value: selectedOption.value }
                      : "NOT FOUND",
                  );

                  if (selectedOption) {
                    // Parse the value field from backend (should be "1", "2", "3", "4", or "5")
                    const numericValue = parseInt(selectedOption.value, 10);
                    console.log(
                      `  ✓ Converted from backend: value="${selectedOption.value}", numericValue=${numericValue}`,
                    );

                    if (!isNaN(numericValue)) {
                      // Store optionId for UI selection
                      existingAnswers[String(order)] = answer.selectedOptionId;
                      // Store numeric value for calculation
                      saveAnswer(String(order), String(numericValue));
                      console.log(
                        `  ✓ Saved to flow: key="${order}", value="${numericValue}"`,
                      );
                    } else {
                      console.error(
                        `  ❌ Invalid numeric value from backend: "${selectedOption.value}"`,
                      );
                    }
                  } else {
                    console.error(
                      `  ❌ Selected option not found with id: ${answer.selectedOptionId}`,
                    );
                  }
                }
              }
            });
          }

          console.log("📊 Answer loading debug:");
          console.log("  Total questions in test:", test.questions.length);
          console.log(
            "  Answers loaded from API:",
            Object.keys(existingAnswers).length,
          );
          console.log(
            "  Loaded question orders:",
            Object.keys(existingAnswers),
          );
          console.log(
            "  Expected question orders (1-based):",
            test.questions.map((q) => q.order + 1),
          );

          if (Object.keys(existingAnswers).length > 0) {
            setAnswers((prev) => ({ ...prev, ...existingAnswers }));
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

  const handleSelect = (
    questionOrder: number,
    optionId: string,
    optionValue: string,
  ) => {
    const orderKey = String(questionOrder + 1); // Convert 0-based to 1-based
    setAnswers((prev) => ({
      ...prev,
      [orderKey]: optionId, // Store optionId for backend
    }));

    // Parse numeric value from backend option.value field
    const numericValue = parseInt(optionValue, 10);
    if (!isNaN(numericValue)) {
      // Save numeric value to useAssessmentFlow for Result page calculation
      saveAnswer(orderKey, String(numericValue));
      console.log(
        `✓ handleSelect: key="${orderKey}", optionId="${optionId}", value="${optionValue}", numeric=${numericValue}`,
      );
    } else {
      console.error(
        `❌ handleSelect: Invalid numeric value from option.value: "${optionValue}"`,
      );
    }
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
      const selectedOptionId = answers[String(question.order + 1)]; // Use 1-based
      if (selectedOptionId) {
        currentPageAnswers.push({
          testQuestionId: question.id, // Backend expects question ID
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
        "  Question IDs being saved to backend:",
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
        // DO NOT filter by validQuestionIds - we need to preserve answers from other tests (e.g., career-path)
        existingAnswers = (existingResponse.data as any).answers.map(
          (answer: any) => ({
            id: answer.id,
            testQuestionId: answer.testQuestionId,
            selectedOptionId: answer.selectedOptionId,
          }),
        );
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
    (q) => answers[String(q.order + 1)] !== undefined,
  ).length;

  const isCurrentDimComplete = totalAnsweredCurrent === currentQuestions.length;

  const isAllComplete = test.questions.every(
    (q) => answers[String(q.order + 1)] !== undefined,
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
      const allQuestionOrders = test.questions.map((q) => q.order + 1); // 1-based

      const answeredOrders = test.questions
        .filter((q) => answers[String(q.order + 1)] !== undefined)
        .map((q) => q.order + 1); // 1-based

      const currentAnsweredCount = answeredOrders.length;
      const isNowComplete = currentAnsweredCount === test.questions.length;

      if (isNowComplete) {
        // Update TEST_ANSWER_KEY with behaviorPatternComplete flag
        const storedAnswerData = localStorage.getItem(TEST_ANSWER_KEY);
        if (storedAnswerData) {
          const answerData = JSON.parse(storedAnswerData);
          answerData.behaviorPatternComplete = true;
          localStorage.setItem(TEST_ANSWER_KEY, JSON.stringify(answerData));
          console.log("✓ Marked behaviorPatternComplete in TEST_ANSWER_KEY");
        }

        setShowConfirmModal(true);
      } else {
        const missingOrders = allQuestionOrders.filter(
          (order) => !answeredOrders.includes(order),
        );
        console.log(
          "❌ Not all questions answered. Missing orders:",
          missingOrders,
        );
        // For debugging: any extra keys in answers not part of this test
        const extraIds = Object.keys(answers).filter(
          (id) => !allQuestionOrders.includes(Number(id)),
        );

        console.log("❌ Validation failed:");

        console.log("  Total answered (relevant):", currentAnsweredCount);

        console.log("  Total questions:", test.questions.length);

        console.log("  Missing question orders:", missingOrders);

        console.log("  Extra/Invalid question IDs:", extraIds);

        toast.error(
          `Lengkapi semua ${test.questions.length} pernyataan terlebih dahulu. (Terjawab: ${currentAnsweredCount}, Kurang: ${missingOrders.length})`,
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
      // Step 1: GET existing answers from backend to ensure we don't lose any saved data from other tests
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
        // DO NOT filter - preserve ALL answers including from career-path test
        existingAnswers = (existingResponse.data as any).answers.map(
          (answer: any) => ({
            id: answer.id,
            testQuestionId: answer.testQuestionId,
            selectedOptionId: answer.selectedOptionId,
          }),
        );
      }

      // Step 2: Merge existing answers with current test answers
      const mergedAnswersMap = new Map<
        string,
        {
          id?: string;
          testQuestionId: string;
          selectedOptionId: string;
        }
      >();

      // Add existing answers to map (including from other tests)
      existingAnswers.forEach((answer) => {
        mergedAnswersMap.set(answer.testQuestionId, answer);
      });

      // Overwrite/add current test answers
      test.questions.forEach((question) => {
        const selectedOptionId = answers[String(question.order + 1)]; // Use 1-based
        if (selectedOptionId) {
          const existing = mergedAnswersMap.get(question.id);
          mergedAnswersMap.set(question.id, {
            id: existing?.id,
            testQuestionId: question.id,
            selectedOptionId,
          });
        }
      });

      // Convert map to array
      const allAnswersToSave = Array.from(mergedAnswersMap.values());

      // Step 3: PUT all merged answers
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
                const selectedOptionId = answers[String(question.order + 1)]; // Use 1-based

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
                          const displayValue = i + 1; // For display only
                          const isSelected = selectedOptionId === option.id;
                          return (
                            <label key={option.id} className="cursor-pointer">
                              <input
                                type="radio"
                                name={`q-${question.id}`}
                                value={option.id}
                                checked={isSelected}
                                onChange={() =>
                                  handleSelect(
                                    question.order,
                                    option.id,
                                    option.value,
                                  )
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
                                {displayValue}
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

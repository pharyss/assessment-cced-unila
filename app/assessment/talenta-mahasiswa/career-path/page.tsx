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
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import { testsApi, resultsApi, studentsApi, ApiError } from "@/lib/api-client";
import { TestQuestion, TestSubmissionAnswer } from "@/types/api";

// Interface for processed questions
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

export default function CareerPathFill() {
  const router = useRouter();
  const { answers: globalAnswers, next, saveAnswer } = useAssessmentFlow();

  // Use local state for answers (no localStorage)
  const [localAnswers, setLocalAnswers] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<ProcessedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingAnswers, setPendingAnswers] = useState<
    Map<string, { questionId: string; optionId: string; answerId?: string }>
  >(new Map());
  const [hasLoadedAnswers, setHasLoadedAnswers] = useState(false);
  const [test4SubmissionId, setTest4SubmissionId] = useState<string | null>(
    null,
  );
  const [test5SubmissionId, setTest5SubmissionId] = useState<string | null>(
    null,
  );

  // Ref to prevent multiple initialization calls
  const isInitializingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  const pageSize = 4;
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / pageSize);
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const currentQuestions = questions.slice(start, end);

  const isQuestionAnswered = (q: { key: string }) => {
    const answer = localAnswers[q.key];
    return answer !== undefined && answer !== "";
  };

  const totalAnswered = questions.filter(isQuestionAnswered).length;
  const isAllComplete = totalAnswered === totalQuestions;
  const currentPageAnswered = currentQuestions.every((q) =>
    isQuestionAnswered(q),
  );
  const progressPercent =
    totalPages > 0 ? ((pageIndex + 1) / totalPages) * 100 : 0;

  // Fetch questions from test 4 and 5
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);

        // Fetch test 4 and test 5 questions
        const [test4Response, test5Response] = await Promise.all([
          testsApi.getTestQuestions(4),
          testsApi.getTestQuestions(5),
        ]);

        const test4Questions = test4Response.data as TestQuestion[];
        const test5Questions = test5Response.data as TestQuestion[];

        // Process test 4 questions (prefix with "4-")
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
                label: String.fromCharCode(65 + idx), // A, B, C, D...
                text: opt.text,
                value: opt.value,
              })),
          }));

        // Process test 5 questions (prefix with "5-")
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
                label: String.fromCharCode(65 + idx), // A, B, C, D...
                text: opt.text,
                value: opt.value,
              })),
          }));

        // Combine: test 4 first, then test 5
        setQuestions([...processedTest4, ...processedTest5]);
      } catch (error) {
        console.error("Error fetching questions:", error);
        toast.error("Gagal memuat pertanyaan. Silakan refresh halaman.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Create or load test submissions
  useEffect(() => {
    const initializeSubmissions = async () => {
      // Prevent multiple simultaneous calls
      if (
        hasInitializedRef.current ||
        isInitializingRef.current ||
        questions.length === 0
      ) {
        return;
      }

      const studentId = globalAnswers.studentId as string | undefined;

      if (!studentId) {
        toast.error("Student ID tidak ditemukan. Silakan mulai ulang asesmen.");
        return;
      }

      isInitializingRef.current = true;

      try {
        console.log("Initializing test submissions for student:", studentId);

        // First, fetch student data to check existing submissions
        const studentResponse = await studentsApi.getStudentByNpm(
          globalAnswers.npm as string,
        );

        let submission4Id: string | undefined;
        let submission5Id: string | undefined;

        if (studentResponse.status === "success" && studentResponse.data) {
          const studentData = studentResponse.data as any;
          const submissions = studentData.submissions || [];

          // Find existing in_progress submissions for test 4 and 5
          const existingTest4 = submissions.find(
            (sub: any) => sub.testId === 4 && sub.status === "in_progress",
          );
          const existingTest5 = submissions.find(
            (sub: any) => sub.testId === 5 && sub.status === "in_progress",
          );

          submission4Id = existingTest4?.id;
          submission5Id = existingTest5?.id;

          console.log("Existing submissions:", {
            test4: submission4Id,
            test5: submission5Id,
          });
        }

        // Create test 4 submission only if it doesn't exist
        if (!submission4Id) {
          console.log("Creating new test 4 submission");
          const response4 = await resultsApi.createTestSubmission({
            studentId,
            testId: 4,
            status: "in_progress",
          });

          if (response4.status === "success" && response4.data) {
            submission4Id = (response4.data as any).id;
            console.log("Created test 4 submission:", submission4Id);
          }
        }

        // Create test 5 submission only if it doesn't exist
        if (!submission5Id) {
          console.log("Creating new test 5 submission");
          const response5 = await resultsApi.createTestSubmission({
            studentId,
            testId: 5,
            status: "in_progress",
          });

          if (response5.status === "success" && response5.data) {
            submission5Id = (response5.data as any).id;
            console.log("Created test 5 submission:", submission5Id);
          }
        }

        // Save to global answers
        if (submission4Id) {
          saveAnswer("test4SubmissionId", submission4Id);
        }
        if (submission5Id) {
          saveAnswer("test5SubmissionId", submission5Id);
        }

        setTest4SubmissionId(submission4Id || null);
        setTest5SubmissionId(submission5Id || null);

        // Load existing answers if submissions exist
        if (submission4Id || submission5Id) {
          const loadedAnswers: Record<string, string> = {};
          const loadedPendingAnswers = new Map<
            string,
            { questionId: string; optionId: string; answerId?: string }
          >();

          // Load test 4 answers
          if (submission4Id) {
            try {
              const submissionResponse =
                await resultsApi.getSubmissionAnswers(submission4Id);

              if (
                submissionResponse.status === "success" &&
                submissionResponse.data
              ) {
                const submissionData = submissionResponse.data as any;
                const existingAnswers =
                  submissionData.answers as TestSubmissionAnswer[];

                if (existingAnswers && existingAnswers.length > 0) {
                  existingAnswers.forEach((answer) => {
                    const question = questions.find(
                      (q) => q.id === answer.testQuestionId && q.testId === 4,
                    );

                    if (question) {
                      const key = question.key;
                      loadedAnswers[key] = answer.selectedOptionId;

                      loadedPendingAnswers.set(key, {
                        questionId: answer.testQuestionId,
                        optionId: answer.selectedOptionId,
                        answerId: answer.id,
                      });
                    }
                  });
                }
              }
            } catch (error) {
              console.error("Error loading test 4 answers:", error);
            }
          }

          // Load test 5 answers
          if (submission5Id) {
            try {
              const submissionResponse =
                await resultsApi.getSubmissionAnswers(submission5Id);

              if (
                submissionResponse.status === "success" &&
                submissionResponse.data
              ) {
                const submissionData = submissionResponse.data as any;
                const existingAnswers =
                  submissionData.answers as TestSubmissionAnswer[];

                if (existingAnswers && existingAnswers.length > 0) {
                  existingAnswers.forEach((answer) => {
                    const question = questions.find(
                      (q) => q.id === answer.testQuestionId && q.testId === 5,
                    );

                    if (question) {
                      const key = question.key;
                      loadedAnswers[key] = answer.selectedOptionId;

                      loadedPendingAnswers.set(key, {
                        questionId: answer.testQuestionId,
                        optionId: answer.selectedOptionId,
                        answerId: answer.id,
                      });
                    }
                  });
                }
              }
            } catch (error) {
              console.error("Error loading test 5 answers:", error);
            }
          }

          const totalLoaded = Object.keys(loadedAnswers).length;
          if (totalLoaded > 0) {
            setLocalAnswers(loadedAnswers);
            setPendingAnswers(loadedPendingAnswers);
            toast.success(`${totalLoaded} jawaban sebelumnya telah dimuat`);
          }
        }
      } catch (error) {
        console.error("Error initializing submissions:", error);
        toast.error("Gagal menginisialisasi test submission.");
      } finally {
        hasInitializedRef.current = true;
        isInitializingRef.current = false;
        setHasLoadedAnswers(true);
      }
    };

    initializeSubmissions();
  }, [questions.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageIndex]);

  useEffect(() => {
    const isModalOpen = showInstruction || showConfirm;

    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showInstruction, showConfirm]);

  const handleSelect = (
    q: { id: string; key: string; testId: number },
    selectedOptionId: string,
  ) => {
    // Save answer in local state (memory only)
    setLocalAnswers((prev) => ({
      ...prev,
      [q.key]: selectedOptionId,
    }));

    // Track the pending answer for batch submission
    setPendingAnswers((prev) => {
      const next = new Map(prev);
      next.set(q.key, {
        questionId: q.id,
        optionId: selectedOptionId,
        // Keep existing answerId if updating an answer
        answerId: prev.get(q.key)?.answerId,
      });
      return next;
    });
  };

  const savePendingAnswers = async () => {
    if (pendingAnswers.size === 0) {
      return true;
    }

    setIsSaving(true);

    try {
      // Separate answers by test
      const test4Answers: Array<{
        id?: string;
        testQuestionId: string;
        selectedOptionId: string;
      }> = [];
      const test5Answers: Array<{
        id?: string;
        testQuestionId: string;
        selectedOptionId: string;
      }> = [];

      pendingAnswers.forEach((answer, key) => {
        const question = questions.find((q) => q.key === key);
        if (question) {
          const answerData = {
            ...(answer.answerId ? { id: answer.answerId } : {}),
            testQuestionId: answer.questionId,
            selectedOptionId: answer.optionId,
          };

          if (question.testId === 4) {
            test4Answers.push(answerData);
          } else if (question.testId === 5) {
            test5Answers.push(answerData);
          }
        }
      });

      // Save test 4 answers
      if (test4Answers.length > 0 && test4SubmissionId) {
        const response = await resultsApi.batchUpdateTestSubmissionAnswers(
          test4SubmissionId,
          test4Answers,
        );

        if (response.data && Array.isArray(response.data)) {
          // Update answerId for saved answers
          setPendingAnswers((prev) => {
            const next = new Map(prev);
            (response.data as any[]).forEach((savedAnswer: any) => {
              const question = questions.find(
                (q) => q.id === savedAnswer.testQuestionId && q.testId === 4,
              );
              if (question) {
                const key = question.key;
                const existing = prev.get(key);
                if (existing) {
                  next.set(key, {
                    ...existing,
                    answerId: savedAnswer.id,
                  });
                }
              }
            });
            return next;
          });
        }

        console.log(`✓ Saved ${test4Answers.length} test 4 answers`);
      }

      // Save test 5 answers
      if (test5Answers.length > 0 && test5SubmissionId) {
        const response = await resultsApi.batchUpdateTestSubmissionAnswers(
          test5SubmissionId,
          test5Answers,
        );

        if (response.data && Array.isArray(response.data)) {
          // Update answerId for saved answers
          setPendingAnswers((prev) => {
            const next = new Map(prev);
            (response.data as any[]).forEach((savedAnswer: any) => {
              const question = questions.find(
                (q) => q.id === savedAnswer.testQuestionId && q.testId === 5,
              );
              if (question) {
                const key = question.key;
                const existing = prev.get(key);
                if (existing) {
                  next.set(key, {
                    ...existing,
                    answerId: savedAnswer.id,
                  });
                }
              }
            });
            return next;
          });
        }

        console.log(`✓ Saved ${test5Answers.length} test 5 answers`);
      }

      const totalSaved = test4Answers.length + test5Answers.length;
      if (totalSaved > 0) {
        toast.success(`${totalSaved} jawaban berhasil disimpan`);
      }

      // Clear pending answers after successful save
      setPendingAnswers(new Map());
      return true;
    } catch (error) {
      console.error("Error saving answers:", error);

      if (error instanceof ApiError) {
        toast.error(`Gagal menyimpan jawaban: ${error.message}`);
      } else {
        toast.error("Gagal menyimpan jawaban. Coba lagi.");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    // Save pending answers before changing page
    const success = await savePendingAnswers();

    if (success) {
      setPageIndex(newPage);
    }
  };

  const handleConfirm = async () => {
    // Save any remaining pending answers before completing
    const success = await savePendingAnswers();

    if (!success) {
      toast.error("Gagal menyimpan jawaban. Silakan coba lagi.");
      return;
    }

    // Mark both submissions as completed
    try {
      setIsSaving(true);

      if (test4SubmissionId) {
        await resultsApi.updateTestSubmission(test4SubmissionId, {
          status: "completed",
          completedAt: new Date().toISOString(),
        });
        console.log("✓ Test 4 marked as completed");
      }

      if (test5SubmissionId) {
        await resultsApi.updateTestSubmission(test5SubmissionId, {
          status: "completed",
          completedAt: new Date().toISOString(),
        });
        console.log("✓ Test 5 marked as completed");
      }

      // Mark career-path as complete in global answers
      saveAnswer("careerPathComplete", true);

      setShowConfirm(false);
      toast.success("Career Path berhasil diselesaikan!");

      // Navigate to next step
      next();
    } catch (error) {
      console.error("Error completing submissions:", error);
      toast.error("Gagal menyelesaikan test. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* ===== MODAL INSTRUKSI ===== */}
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
                  desc: `Pilih satu respon yang paling kamu sukai atau paling mungkin kamu lakukan dari empat pilihan yang tersedia. Pilihlah yang paling "aku banget" agar hasilnya akurat.`,
                },
                {
                  icon: <User className="h-6 w-6" />,
                  title: "Karakteristik Diri (28 situasi)",
                  desc: "Pilih satu dari dua opsi yang paling sesuai dengan karaktermu. Tidak ada jawaban benar atau salah.",
                },
              ].map(({ icon, title, desc }, i) => (
                <div
                  key={i}
                  className="flex w-full items-start gap-3 rounded-xl border border-myunila bg-myunila-50 p-4 shadow-sm transition-shadow hover:shadow-lg dark:bg-gray-800"
                >
                  <div className="rounded-lg bg-myunila p-2 text-white">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-myunila dark:text-gray-100 sm:text-base">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mb-6 text-center font-semibold text-gray-700 dark:text-gray-300">
              Semakin jujur kamu menjawab, semakin akurat hasilnya!
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setShowInstruction(false)}
                className="flex items-center gap-2 rounded-full bg-myunila px-6 py-3 text-sm font-semibold text-white transition hover:bg-myunila-700"
              >
                Mulai Asesmen
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== HALAMAN ASESMEN ===== */}
      <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-28 sm:pt-32 md:pb-[120px] md:pt-[150px]">
        <div className="container mx-auto px-4 md:px-16 lg:px-32">
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 sm:p-10">
            {isLoading ? (
              <div className="flex min-h-[400px] flex-col items-center justify-center">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-myunila" />
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Memuat pertanyaan...
                </p>
              </div>
            ) : (
              <>
                <div className="mb-10 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-myunila dark:text-white sm:text-3xl">
                    Bidang Karir Ideal
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                    Pilih jawaban yang paling sesuai dengan dirimu untuk setiap
                    pertanyaan.
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div
                    className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
                    role="progressbar"
                    aria-valuenow={progressPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className="h-full bg-gradient-blue-modern transition-all duration-700 ease-in-out"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                    Halaman <strong>{pageIndex + 1}</strong> dari{" "}
                    <strong>{totalPages}</strong>
                  </p>
                </div>

                {/* Pertanyaan */}
                <div className="space-y-8">
                  {currentQuestions.map((q, index) => {
                    const questionNumber = start + index + 1;
                    return (
                      <div
                        key={q.key}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
                      >
                        <p className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100 md:text-lg">
                          {questionNumber}. {q.question}
                        </p>

                        <div className="grid gap-3">
                          {q.options.map((opt) => {
                            return (
                              <label
                                key={opt.id}
                                htmlFor={`opt-${q.key}-${opt.id}`}
                                className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all duration-200 ${
                                  localAnswers[String(q.key)] === opt.id
                                    ? "border-myunila bg-myunila-100/50 font-medium text-myunila dark:border-myunila-600"
                                    : "border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
                                } ${isSaving ? "opacity-60" : ""}`}
                              >
                                <input
                                  type="radio"
                                  id={`opt-${q.key}-${opt.id}`}
                                  name={`q-${q.key}`}
                                  value={opt.id}
                                  checked={localAnswers[q.key] === opt.id}
                                  onChange={() => handleSelect(q, opt.id)}
                                  disabled={isSaving}
                                  className="hidden"
                                />
                                <span className="flex items-center gap-2">
                                  <strong>{opt.label}.</strong> {opt.text}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigasi */}
                <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handlePageChange(pageIndex - 1)}
                    disabled={pageIndex === 0}
                    className="flex items-center justify-center gap-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-40 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Sebelumnya
                  </button>

                  <button
                    type="button"
                    onClick={
                      pageIndex === totalPages - 1
                        ? async () => {
                            const allAnswered = questions.every(
                              (q) =>
                                localAnswers[q.key] !== undefined &&
                                localAnswers[q.key] !== "",
                            );
                            if (allAnswered) {
                              // Save pending answers before showing confirmation
                              const success = await savePendingAnswers();
                              if (success) {
                                setShowConfirm(true);
                              }
                            } else {
                              toast.error(
                                "Lengkapi semua soal terlebih dahulu sebelum menyelesaikan.",
                              );
                            }
                          }
                        : () => handlePageChange(pageIndex + 1)
                    }
                    disabled={!currentPageAnswered || isSaving}
                    className={`flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                      currentPageAnswered && !isSaving
                        ? "bg-myunila text-white hover:bg-myunila-700"
                        : "cursor-not-allowed bg-gray-300 text-gray-500"
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        {pageIndex === totalPages - 1
                          ? "Selesai Part 1"
                          : "Lanjut"}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== MODAL KONFIRMASI ===== */}
      {showConfirm && (
        <div className="animate-fadeIn fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="animate-scaleIn mx-4 w-full max-w-md scale-95 transform rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-300 ease-out dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex flex-col items-center text-center">
              <AlertCircle className="mb-3 h-16 w-16 text-warning" />
              <h3 className="text-2xl font-bold text-warning dark:text-white">
                Konfirmasi
              </h3>
            </div>
            <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
              Apakah Anda yakin ingin melanjutkan ke tes berikutnya? Bagian ini
              tidak dapat diubah lagi.
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isSaving}
                className="rounded-full border border-gray-200 px-10 py-2.5 text-gray-700 transition-all hover:bg-gray-100 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isAllComplete || isSaving}
                className="rounded-full bg-myunila px-8 py-2.5 font-medium text-white shadow-lg transition-all hover:bg-myunila-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-myunila-400"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Ya, Lanjut"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

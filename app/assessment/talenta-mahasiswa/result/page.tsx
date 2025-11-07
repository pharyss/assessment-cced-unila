"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Brain,
  CheckCircle,
  MessageSquare,
  Briefcase,
  BookOpen,
  TrendingUp,
  Loader2,
  Target,
  Download,
  AlertCircle,
} from "lucide-react";

import { resultsApi } from "@/lib/api-client";
import {
  STUDENT_IDENTITY_KEY,
  TEST_ANSWER_KEY,
  TEST_RESULT_KEY,
} from "@/lib/constants";
import {
  calculateTest6Results,
  calculateTest5Results,
  calculateTest4Results,
  calculateTest3Results,
  calculateTest2Results,
  calculateTest1Results,
  getTest6TotalScore,
  formatTest6ResultsForBackend,
  formatTest5ResultsForBackend,
  formatTest4ResultForBackend,
  formatTest3ResultForBackend,
  formatTest2ResultForBackend,
  formatTest1ResultForBackend,
  Test6Result,
  Test5Result,
  Test4Result,
  Test3Result,
  Test2Result,
  Test1Result,
} from "@/lib/result-calculator";
import reportTextData from "@/data/ReportText.json";

type ReportTextData = typeof reportTextData;

interface AssessmentResult {
  nama?: string;
  npm?: string;
  email?: string;
  mbtiType: string;
  kesesuaian: string;
  thinkingStyle: string;
  communicationStyle: string;
  workingStyle: string;
  behaviorDimensions: Test6Result[];
  karirDominanMBTI: string;
  karirSekunderMBTI: string;
  karirMinat: string;
  readiness: string;
  classification: string;
}

const PWB_TITLES: Record<string, string> = {
  self_acceptance: "Penerimaan Diri",
  autonomy: "Kemandirian",
  purpose_in_life: "Tujuan Hidup",
  positive_relationships: "Hubungan Positif",
  environmental_mastery: "Pengelolaan Lingkungan",
  personal_growth: "Pertumbuhan Pribadi",
};

const WORKING_STYLE_TITLES: Record<string, string> = {
  structured_solo: "Structured Solo",
  structured_team: "Structured Team",
  flexible_solo: "Flexible Solo",
  flexible_team: "Flexible Team",
};

export default function TalentResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);
  const hasSavedRef = useRef(false);
  const [studentIdentity, setStudentIdentity] = useState<{
    nama?: string;
    npm?: string;
    email?: string;
  }>({});

  // Load and calculate results from localStorage + backend
  useEffect(() => {
    const loadAndCalculateResults = async () => {
      try {
        setIsLoading(true);
        console.log("🔄 Starting result calculation...");

        // 1. Get testSubmissionId from localStorage
        const storedAnswers = localStorage.getItem(TEST_ANSWER_KEY);
        if (!storedAnswers) {
          throw new Error("Data submission tidak ditemukan di localStorage");
        }

        const answerData = JSON.parse(storedAnswers);
        const submissionId: string | undefined = answerData?.testSubmissionId;
        if (!submissionId) {
          throw new Error("ID submission tidak ditemukan");
        }

        console.log("✓ Found testSubmissionId:", submissionId);

        // 2. Get student identity from localStorage
        const storedIdentity = localStorage.getItem(STUDENT_IDENTITY_KEY);
        let identityData = {};
        if (storedIdentity) {
          identityData = JSON.parse(storedIdentity);
          setStudentIdentity(identityData);
        }

        // 3. Load test questions from localStorage
        const test4QuestionsRaw = localStorage.getItem("test4_questions");
        const test5QuestionsRaw = localStorage.getItem("test5_questions");
        const test6QuestionsRaw = localStorage.getItem("test6_questions");

        if (!test4QuestionsRaw || !test5QuestionsRaw || !test6QuestionsRaw) {
          throw new Error(
            "Data pertanyaan test tidak ditemukan di localStorage",
          );
        }

        const test4Questions = JSON.parse(test4QuestionsRaw);
        const test5Questions = JSON.parse(test5QuestionsRaw);
        const test6Questions = JSON.parse(test6QuestionsRaw);

        console.log("✓ Loaded questions from localStorage:", {
          test4: test4Questions.length,
          test5: test5Questions.length,
          test6: test6Questions.length,
        });

        // 4. Fetch answers from backend
        const response = await resultsApi.getSubmissionAnswers(submissionId);

        if (response.status !== "success") {
          throw new Error("Gagal mengambil jawaban dari server");
        }

        const submissionData = response.data as any;
        const backendAnswers = submissionData.answers || [];

        console.log("✓ Fetched answers from backend:", backendAnswers.length);

        // 5. Map backend answers to question IDs
        const answersMap: Record<string, string> = {};
        backendAnswers.forEach((answer: any) => {
          answersMap[answer.testQuestionId] = answer.selectedOptionId;
        });

        // 6. Calculate Test 6 Results (Psychological Well-being)
        const test6Results = calculateTest6Results(test6Questions, answersMap);
        console.log("✓ Test 6 Results:", test6Results);

        // 7. Calculate Test 5 Results (MBTI)
        const test5Results = calculateTest5Results(test5Questions, answersMap);
        console.log("✓ Test 5 Results:", test5Results);

        // 8. Calculate Test 4 Results (Career Preference)
        const test4Results = calculateTest4Results(test4Questions, answersMap);
        console.log("✓ Test 4 Results:", test4Results);

        // 9. Calculate Test 3 Results (Behavioral Readiness)
        const test6TotalScore = getTest6TotalScore(test6Questions, answersMap);
        const test3Results = calculateTest3Results(test6TotalScore);
        console.log(
          "✓ Test 3 Results:",
          test3Results,
          "Total Score:",
          test6TotalScore,
        );

        // 10. Calculate Test 2 Results (Career Compatibility)
        const test2Results = calculateTest2Results(test4Results, test5Results);
        console.log("✓ Test 2 Results:", test2Results);

        // 11. Calculate Test 1 Results (Overall Classification)
        const test1Results = calculateTest1Results(test3Results, test2Results);
        console.log("✓ Test 1 Results:", test1Results);

        // 12. Set result state for UI display
        setResult({
          ...identityData,
          mbtiType: test5Results.mbti_type,
          kesesuaian: test2Results.compatibility,
          thinkingStyle: test5Results.thinking_style,
          communicationStyle: test5Results.communication_style,
          workingStyle: test5Results.working_style,
          behaviorDimensions: test6Results,
          karirDominanMBTI: test5Results.primary,
          karirSekunderMBTI: test5Results.secondary,
          karirMinat: test4Results.career_preference,
          readiness: test3Results.readiness,
          classification: test1Results.classification,
        } as AssessmentResult);

        // 13. Save all results to backend (only once)
        if (!hasSavedRef.current) {
          hasSavedRef.current = true;
          await saveAllResultsToBackend(
            submissionId,
            test1Results,
            test2Results,
            test3Results,
            test4Results,
            test5Results,
            test6Results,
          );
        }

        setError(null);
      } catch (err) {
        console.error("❌ Error calculating results:", err);
        setError(
          err instanceof Error ? err.message : "Gagal memuat hasil asesmen",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAndCalculateResults();
  }, []);

  // Save all results to backend using POST endpoint
  const saveAllResultsToBackend = async (
    submissionId: string,
    test1: Test1Result,
    test2: Test2Result,
    test3: Test3Result,
    test4: Test4Result,
    test5: Test5Result,
    test6: Test6Result[],
  ) => {
    try {
      setIsSaving(true);
      console.log("💾 Saving all results to backend...");

      // Check if already saved
      const storedResults = localStorage.getItem(TEST_RESULT_KEY);
      if (storedResults) {
        const resultData = JSON.parse(storedResults);
        if (resultData.resultsSaved) {
          console.log("✓ Results already saved, skipping");
          return;
        }
      }

      const resultsToSave: Array<{ testId: number; result: string }> = [];

      // Test 1: Overall Classification (1 result)
      resultsToSave.push({
        testId: 1,
        result: formatTest1ResultForBackend(test1),
      });

      // Test 2: Career Compatibility (1 result)
      resultsToSave.push({
        testId: 2,
        result: formatTest2ResultForBackend(test2),
      });

      // Test 3: Behavioral Readiness (1 result)
      resultsToSave.push({
        testId: 3,
        result: formatTest3ResultForBackend(test3),
      });

      // Test 4: Career Preference (1 result)
      resultsToSave.push({
        testId: 4,
        result: formatTest4ResultForBackend(test4),
      });

      // Test 5: MBTI (6 results in "param:value" format)
      const test5Formatted = formatTest5ResultsForBackend(test5);
      test5Formatted.forEach((resultString) => {
        resultsToSave.push({
          testId: 5,
          result: resultString,
        });
      });

      // Test 6: Psychological Well-being (6 results in "dimension:percentage:level" format)
      const test6Formatted = formatTest6ResultsForBackend(test6);
      test6Formatted.forEach((resultString) => {
        resultsToSave.push({
          testId: 6,
          result: resultString,
        });
      });

      console.log("📊 Total results to save:", resultsToSave.length);
      console.log("Results breakdown:", {
        test1: 1,
        test2: 1,
        test3: 1,
        test4: 1,
        test5: test5Formatted.length,
        test6: test6Formatted.length,
      });

      // POST each result to backend
      const savePromises = resultsToSave.map(async (resultData) => {
        return resultsApi.createTestResult({
          testSubmissionId: submissionId,
          testId: resultData.testId,
          result: resultData.result,
        });
      });

      await Promise.all(savePromises);

      console.log("✓ All results saved to backend successfully");

      // Mark as saved in localStorage
      localStorage.setItem(
        TEST_RESULT_KEY,
        JSON.stringify({
          resultsSaved: true,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (err) {
      console.error("❌ Error saving results to backend:", err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    // TODO: Implement PDF download
    console.log("PDF download not yet implemented");
  };

  const handleBackToDashboard = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <section className="relative z-10 flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-myunila-50 to-myunila-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <Loader2 className="mx-auto h-16 w-16 animate-spin text-myunila" />
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Menghitung hasil asesmen...
          </p>
        </div>
      </section>
    );
  }

  if (error || !result) {
    return (
      <section className="relative z-10 flex min-h-screen items-center justify-center bg-gradient-to-b from-white via-myunila-50 to-myunila-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="mx-4 max-w-md rounded-lg border border-red-200 bg-white p-8 text-center shadow-lg dark:border-red-800 dark:bg-gray-900">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            Gagal Memuat Hasil
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {error || "Terjadi kesalahan saat memuat hasil asesmen"}
          </p>
          <button
            onClick={handleBackToDashboard}
            className="mt-6 rounded-full bg-myunila px-6 py-2.5 text-white hover:bg-myunila-700"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 min-h-screen bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
      <div className="container mx-auto w-full max-w-[1200px] px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-myunila dark:text-white md:text-4xl">
            Hasil Asesmen Talenta Mahasiswa
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Berikut adalah hasil lengkap dari asesmen yang telah Anda selesaikan
          </p>
          {isSaving && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-myunila">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Menyimpan hasil ke server...</span>
            </div>
          )}
        </div>

        {/* Student Identity */}
        {(result.nama || result.npm) && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              Informasi Peserta
            </h2>
            <div className="grid gap-3 text-sm md:grid-cols-3">
              {result.nama && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Nama:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {result.nama}
                  </span>
                </div>
              )}
              {result.npm && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    NPM:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {result.npm}
                  </span>
                </div>
              )}
              {result.email && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Email:
                  </span>{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {result.email}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overall Classification */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-3">
            <Target className="h-6 w-6 text-myunila" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Klasifikasi Keseluruhan
            </h2>
          </div>
          <div className="rounded-lg bg-myunila-50 p-4 dark:bg-myunila-900/30">
            <p className="text-lg font-semibold text-myunila dark:text-myunila-300">
              {result.classification
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Kesiapan:{" "}
              <span className="font-semibold">{result.readiness}</span> |
              Kesesuaian Karir:{" "}
              <span className="font-semibold">{result.kesesuaian}</span>
            </p>
          </div>
        </div>

        {/* MBTI & Career */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* MBTI Type */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-3">
              <Brain className="h-6 w-6 text-myunila" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Tipe Kepribadian MBTI
              </h2>
            </div>
            <div className="mb-4 rounded-lg bg-myunila-50 p-4 text-center dark:bg-myunila-900/30">
              <p className="text-3xl font-bold text-myunila dark:text-myunila-300">
                {result.mbtiType.toUpperCase()}
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Thinking Style:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {result.thinkingStyle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Communication:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {result.communicationStyle}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Working Style:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {WORKING_STYLE_TITLES[result.workingStyle] ||
                    result.workingStyle}
                </span>
              </div>
            </div>
          </div>

          {/* Career Fields */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center gap-3">
              <Briefcase className="h-6 w-6 text-myunila" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Bidang Karir
              </h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/30">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Minat Karir Anda
                </p>
                <p className="font-semibold text-green-700 dark:text-green-300">
                  {result.karirMinat}
                </p>
              </div>
              <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/30">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Karir Dominan (MBTI)
                </p>
                <p className="font-semibold text-blue-700 dark:text-blue-300">
                  {result.karirDominanMBTI}
                </p>
              </div>
              <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-900/30">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Karir Sekunder (MBTI)
                </p>
                <p className="font-semibold text-purple-700 dark:text-purple-300">
                  {result.karirSekunderMBTI}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Psychological Well-being Dimensions */}
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-myunila" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Dimensi Kesejahteraan Psikologis
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {result.behaviorDimensions.map((dim) => (
              <div
                key={dim.dimension}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {PWB_TITLES[dim.dimension] || dim.dimension}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      dim.level === "Tinggi"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : dim.level === "Sedang"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {dim.level}
                  </span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full transition-all ${
                      dim.level === "Tinggi"
                        ? "bg-green-500"
                        : dim.level === "Sedang"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${dim.percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-sm text-gray-600 dark:text-gray-400">
                  {dim.percentage}%
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
            Kembali ke Dashboard
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled
            className="flex items-center gap-2 rounded-full bg-myunila px-6 py-3 font-semibold text-white transition hover:bg-myunila-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-5 w-5" />
            Download PDF (Coming Soon)
          </button>
        </div>
      </div>
    </section>
  );
}

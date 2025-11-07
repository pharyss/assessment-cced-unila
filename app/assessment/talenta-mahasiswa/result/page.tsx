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
} from "lucide-react";

import reportTextData from "@/data/ReportText.json";
import {
  calculateTest6Results,
  calculateTest5Results,
  calculateTest4Results,
  calculateTest3Results,
  calculateTest2Results,
  calculateTest1Results,
  formatTest6ResultsForBackend,
  formatTest5ResultsForBackend,
  formatTest4ResultForBackend,
  formatTest3ResultForBackend,
  formatTest2ResultForBackend,
  formatTest1ResultForBackend,
  getTest6TotalScore,
} from "@/lib/result-calculator";
import {
  STUDENT_IDENTITY_KEY,
  TEST_ANSWER_KEY,
  TEST_RESULT_KEY,
} from "@/lib/constants";
import { resultsApi } from "@/lib/api-client";

type ReportTextData = typeof reportTextData;

interface AssessmentResult {
  nama?: string;
  npm?: string;
  email?: string;
  mbtiType: keyof ReportTextData["learningStrategy"];
  kesesuaian: string;
  thinkingStyle: keyof ReportTextData["thinkingStyle"];
  communicationStyle: keyof ReportTextData["communicationStyle"];
  workingStyle: keyof ReportTextData["workingStyle"];
  behaviorDimensions: Record<string, { percentage: number; level: string }>;
  karirDominanMBTI: keyof ReportTextData["careerField"];
  karirSekunderMBTI: keyof ReportTextData["careerField"];
  karirMinat: keyof ReportTextData["careerField"];
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
  StructuredSolo: "Structured Solo",
  StructuredTeam: "Structured Team",
  FlexibleSolo: "Flexible Solo",
  FlexibleTeam: "Flexible Team",
};

export default function TalentResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function computeResults() {
      try {
        // Get submission ID from localStorage (stored in TEST_ANSWER_KEY)
        const testAnswerStr = localStorage.getItem(TEST_ANSWER_KEY);
        if (!testAnswerStr) {
          console.error("No test answer data found in localStorage");
          setIsLoading(false);
          return;
        }

        const testAnswerData = JSON.parse(testAnswerStr);
        const submissionId = testAnswerData.testSubmissionId;

        if (!submissionId) {
          console.error("No submission ID found in test answer data");
          setIsLoading(false);
          return;
        }

        console.log("✓ Found submission ID:", submissionId);

        // Check if results already computed
        const alreadySaved = localStorage.getItem(TEST_RESULT_KEY);
        if (alreadySaved === "true") {
          console.log(
            "Results already computed and saved, loading from backend...",
          );
        }

        // Load questions from localStorage
        const test4QuestionsStr = localStorage.getItem("test4_questions");
        const test5QuestionsStr = localStorage.getItem("test5_questions");
        const test6QuestionsStr = localStorage.getItem("test6_questions");

        if (!test4QuestionsStr || !test5QuestionsStr || !test6QuestionsStr) {
          console.error("Missing test questions in localStorage");
          setIsLoading(false);
          return;
        }

        const test4Questions = JSON.parse(test4QuestionsStr);
        const test5Questions = JSON.parse(test5QuestionsStr);
        const test6Questions = JSON.parse(test6QuestionsStr);

        // Fetch answers from backend using API client
        const response = await resultsApi.getSubmissionAnswers(submissionId);

        console.log(
          "📊 Full backend response:",
          JSON.stringify(response, null, 2),
        );

        if (response.status !== "success") {
          throw new Error("Failed to fetch submission data");
        }

        const submissionData = response.data as any;
        console.log(
          "📊 submissionData.answers type:",
          typeof submissionData.answers,
        );
        console.log(
          "📊 submissionData.answers length:",
          submissionData.answers?.length,
        );

        const answers = submissionData.answers || [];

        // Check if answers exist
        if (answers.length === 0) {
          console.error(
            "❌ No answers found in backend response. User may not have completed the assessment yet.",
          );
          console.log(
            "💡 Make sure to complete both Career Path and Behavior Pattern tests before viewing results.",
          );
          setIsLoading(false);
          return;
        }

        // Get user info from localStorage (stored in STUDENT_IDENTITY_KEY)
        const studentIdentityStr = localStorage.getItem(STUDENT_IDENTITY_KEY);
        let nama = "";
        let npm = "";
        let email = "";

        if (studentIdentityStr) {
          const studentIdentity = JSON.parse(studentIdentityStr);
          nama = studentIdentity.nama || "";
          npm = studentIdentity.npm || "";
          email = studentIdentity.email || "";
        }

        console.log("✓ Loaded student identity:", { nama, npm, email });

        // Build answer maps
        const test4AnswersMap: Record<string, string> = {};
        const test5AnswersMap: Record<string, string> = {};
        const test6AnswersMap: Record<string, string> = {};

        console.log("📊 Total answers from backend:", answers.length);
        console.log("📊 Test 4 questions count:", test4Questions.length);
        console.log("📊 Test 5 questions count:", test5Questions.length);
        console.log("📊 Test 6 questions count:", test6Questions.length);

        // Debug: log first few question IDs and answers
        console.log(
          "📊 Sample Test 6 question IDs:",
          test6Questions.slice(0, 3).map((q: any) => q.id),
        );
        console.log(
          "📊 Sample answers:",
          answers.slice(0, 5).map((a: any) => ({
            questionId: a.testQuestionId,
            optionId: a.selectedOptionId,
          })),
        );

        answers.forEach((a: any) => {
          if (test4Questions.some((q: any) => q.id === a.testQuestionId)) {
            test4AnswersMap[a.testQuestionId] = a.selectedOptionId;
          }
          if (test5Questions.some((q: any) => q.id === a.testQuestionId)) {
            test5AnswersMap[a.testQuestionId] = a.selectedOptionId;
          }
          if (test6Questions.some((q: any) => q.id === a.testQuestionId)) {
            test6AnswersMap[a.testQuestionId] = a.selectedOptionId;
            console.log(
              "✓ Mapped Test 6 answer:",
              a.testQuestionId,
              "->",
              a.selectedOptionId,
            );
          }
        });

        console.log(
          "📊 Test 4 answers mapped:",
          Object.keys(test4AnswersMap).length,
        );
        console.log(
          "📊 Test 5 answers mapped:",
          Object.keys(test5AnswersMap).length,
        );
        console.log(
          "📊 Test 6 answers mapped:",
          Object.keys(test6AnswersMap).length,
        );
        console.log(
          "📊 Test 6 answers map sample:",
          Object.entries(test6AnswersMap).slice(0, 3),
        );

        // Calculate results
        console.log("Computing Test 6 results...");
        const test6Results = calculateTest6Results(
          test6Questions,
          test6AnswersMap,
        );
        console.log("✓ Test 6 results:", JSON.stringify(test6Results, null, 2));

        // Debug: Check if questions have the required structure
        console.log("📊 First Test 6 question structure:", {
          id: test6Questions[0]?.id,
          order: test6Questions[0]?.order,
          optionsCount: test6Questions[0]?.options?.length,
          firstOption: test6Questions[0]?.options?.[0],
        });

        console.log("Computing Test 5 results...");
        const test5Results = calculateTest5Results(
          test5Questions,
          test5AnswersMap,
        );
        console.log("✓ Test 5 results:", test5Results);

        console.log("Computing Test 4 result...");
        const test4Result = calculateTest4Results(
          test4Questions,
          test4AnswersMap,
        );

        console.log("Computing Test 3 result...");
        const test6TotalScore = getTest6TotalScore(
          test6Questions,
          test6AnswersMap,
        );
        const test3Result = calculateTest3Results(test6TotalScore);

        console.log("Computing Test 2 result...");
        const test2Result = calculateTest2Results(test4Result, test5Results);

        console.log("Computing Test 1 result...");
        const test1Result = calculateTest1Results(test3Result, test2Result);

        // Save results to backend if not already saved
        if (alreadySaved !== "true") {
          console.log("Saving results to backend...");

          // Save Test 6 results (6 dimensions)
          const test6BackendResults =
            formatTest6ResultsForBackend(test6Results);
          for (const resultStr of test6BackendResults) {
            await resultsApi.createTestResult({
              testSubmissionId: submissionId,
              testId: 6,
              result: resultStr,
            });
          }

          // Save Test 5 results (6 MBTI attributes)
          const test5BackendResults =
            formatTest5ResultsForBackend(test5Results);
          for (const resultStr of test5BackendResults) {
            await resultsApi.createTestResult({
              testSubmissionId: submissionId,
              testId: 5,
              result: resultStr,
            });
          }

          // Save Test 4 result
          await resultsApi.createTestResult({
            testSubmissionId: submissionId,
            testId: 4,
            result: formatTest4ResultForBackend(test4Result),
          });

          // Save Test 3 result
          await resultsApi.createTestResult({
            testSubmissionId: submissionId,
            testId: 3,
            result: formatTest3ResultForBackend(test3Result),
          });

          // Save Test 2 result
          await resultsApi.createTestResult({
            testSubmissionId: submissionId,
            testId: 2,
            result: formatTest2ResultForBackend(test2Result),
          });

          // Save Test 1 result
          await resultsApi.createTestResult({
            testSubmissionId: submissionId,
            testId: 1,
            result: formatTest1ResultForBackend(test1Result),
          });

          localStorage.setItem(TEST_RESULT_KEY, "true");
          console.log("All results saved successfully!");
        }

        // Format results for UI - test6Results is already an array of dimensions
        const behaviorDimensions: Record<
          string,
          { percentage: number; level: string }
        > = {};

        test6Results.forEach((dimension) => {
          behaviorDimensions[dimension.dimension] = {
            percentage: dimension.percentage,
            level: dimension.level,
          };
        });

        // Format kesesuaian for display
        let kesesuaianDisplay = "";
        if (test2Result.compatibility === "sangat_sesuai") {
          kesesuaianDisplay = "Sangat Sesuai";
        } else if (test2Result.compatibility === "kurang_sesuai") {
          kesesuaianDisplay = "Cukup Sesuai";
        } else {
          kesesuaianDisplay = "Tidak Sesuai";
        }

        const assessmentResult: AssessmentResult = {
          nama,
          npm,
          email,
          mbtiType:
            test5Results.mbti_type as keyof ReportTextData["learningStrategy"],
          kesesuaian: kesesuaianDisplay,
          thinkingStyle:
            test5Results.thinking_style as keyof ReportTextData["thinkingStyle"],
          communicationStyle:
            test5Results.communication_style as keyof ReportTextData["communicationStyle"],
          workingStyle:
            test5Results.working_style as keyof ReportTextData["workingStyle"],
          behaviorDimensions,
          karirDominanMBTI:
            test5Results.primary as keyof ReportTextData["careerField"],
          karirSekunderMBTI:
            test5Results.secondary as keyof ReportTextData["careerField"],
          karirMinat:
            test4Result.career_preference as keyof ReportTextData["careerField"],
        };

        setResult(assessmentResult);
      } catch (error) {
        console.error("Error computing results:", error);
      } finally {
        setIsLoading(false);
      }
    }

    computeResults();
  }, []);

  const handleBackAndClear = () => {
    // Clear all localStorage
    localStorage.removeItem(STUDENT_IDENTITY_KEY);
    localStorage.removeItem(TEST_ANSWER_KEY);
    localStorage.removeItem(TEST_RESULT_KEY);
    localStorage.removeItem("test4_questions");
    localStorage.removeItem("test5_questions");
    localStorage.removeItem("test6_questions");
    router.push("/assessment/talenta-mahasiswa");
  };

  const handlePrint = () => {
    if (!result) {
      console.error("Hasil belum dimuat, tidak bisa mencetak.");
      return;
    }

    const originalTitle = document.title;
    const studentName = result.nama || "Mahasiswa";

    document.title = `Profil Talenta Mahasiswa - ${studentName}`;
    window.print();
    document.title = originalTitle;
  };

  if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <Loader2 className="mb-3 h-12 w-12 animate-spin text-myunila" />
        <p className="text-lg">Memuat hasil asesmen kamu...</p>
      </div>
    );

  if (!result)
    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <p className="mb-2 text-lg font-semibold">
          Belum ada hasil asesmen ditemukan.
        </p>
        <p className="mb-4 text-sm text-gray-500">
          Pastikan Anda sudah menyelesaikan tes Career Path dan Behavior Pattern
          sebelum melihat hasil.
        </p>
        <button
          onClick={() => router.push("/assessment/talenta-mahasiswa")}
          className="mt-4 rounded-full bg-myunila px-6 py-2 text-sm font-medium text-white hover:bg-myunila/90"
        >
          Kembali ke Awal
        </button>
      </div>
    );

  const {
    nama,
    npm,
    email,
    mbtiType,
    kesesuaian,
    thinkingStyle,
    communicationStyle,
    workingStyle,
    behaviorDimensions,
    karirDominanMBTI,
    karirSekunderMBTI,
    karirMinat,
  } = result;

  // Map lowercase underscore format to PascalCase for ReportText.json
  const styleMap: Record<string, string> = {
    analytical: "Analytical",
    practical: "Practical",
    creative: "Creative",
    empathetic: "Empathetic",
    direct: "Direct",
    harmonious: "Harmonious",
    innovative: "Innovative",
    pragmatic: "Pragmatic",
    structured_solo: "StructuredSolo",
    structured_team: "StructuredTeam",
    flexible_solo: "FlexibleSolo",
    flexible_team: "FlexibleTeam",
  };

  const thinkingStyleKey = styleMap[thinkingStyle] || thinkingStyle;
  const communicationStyleKey =
    styleMap[communicationStyle] || communicationStyle;
  const workingStyleKey = styleMap[workingStyle] || workingStyle;

  const thinkingStyleDesc =
    reportTextData.thinkingStyle[
      thinkingStyleKey as keyof typeof reportTextData.thinkingStyle
    ] || `Deskripsi untuk ${thinkingStyle} tidak tersedia`;
  const communicationStyleDesc =
    reportTextData.communicationStyle[
      communicationStyleKey as keyof typeof reportTextData.communicationStyle
    ] || `Deskripsi untuk ${communicationStyle} tidak tersedia`;
  const workingStyleDesc =
    reportTextData.workingStyle[
      workingStyleKey as keyof typeof reportTextData.workingStyle
    ] || `Deskripsi untuk ${workingStyle} tidak tersedia`;

  console.log("🎨 UI Data:", {
    thinkingStyle,
    thinkingStyleKey,
    communicationStyle,
    communicationStyleKey,
    workingStyle,
    workingStyleKey,
    hasThinkingDesc: !!thinkingStyleDesc,
    hasCommDesc: !!communicationStyleDesc,
    hasWorkDesc: !!workingStyleDesc,
  });

  // Map career fields: lowercase -> PascalCase (for Indonesian)
  const careerFieldMap: Record<string, string> = {
    praktisi: "Praktisi",
    akademisi: "Akademisi",
    pekerja_kreatif: "Pekerja Kreatif",
    wirausaha: "Wirausaha",
  };

  const karirDominanKey = careerFieldMap[karirDominanMBTI] || karirDominanMBTI;
  const karirSekunderKey =
    careerFieldMap[karirSekunderMBTI] || karirSekunderMBTI;
  const karirMinatKey = careerFieldMap[karirMinat] || karirMinat;

  // Map MBTI: lowercase -> UPPERCASE
  const mbtiTypeKey = mbtiType.toUpperCase();

  console.log("📚 Career & Learning Data:", {
    karirDominanMBTI,
    karirDominanKey,
    karirSekunderMBTI,
    karirSekunderKey,
    karirMinat,
    karirMinatKey,
    mbtiType,
    mbtiTypeKey,
  });

  const dominantCareerDesc =
    reportTextData.careerField[
      karirDominanKey as keyof typeof reportTextData.careerField
    ] || `Deskripsi untuk ${karirDominanMBTI} tidak tersedia`;
  const secondaryCareerDesc =
    reportTextData.careerField[
      karirSekunderKey as keyof typeof reportTextData.careerField
    ] || `Deskripsi untuk ${karirSekunderMBTI} tidak tersedia`;
  const kesesuaianDesc =
    kesesuaian === "Sangat Sesuai"
      ? reportTextData.suitability["Sesuai"]
      : reportTextData.suitability["Tidak Sesuai"];
  const learningStrategyDesc =
    reportTextData.learningStrategy[
      mbtiTypeKey as keyof typeof reportTextData.learningStrategy
    ] || `Deskripsi untuk ${mbtiType} tidak tersedia`;

  console.log("📚 Description availability:", {
    hasDominantCareerDesc: !!dominantCareerDesc,
    hasSecondaryCareerDesc: !!secondaryCareerDesc,
    hasLearningStrategyDesc: !!learningStrategyDesc,
  });

  const pwbDimensions = Object.entries(behaviorDimensions);

  const dominantColorClass =
    kesesuaian === "Sangat Sesuai"
      ? "text-myunila-600 dark:text-myunila-400"
      : "text-gray-500 dark:text-gray-400";

  const secondaryColorClass =
    kesesuaian === "Cukup Sesuai"
      ? "text-myunila-600 dark:text-myunila-400"
      : "text-gray-500 dark:text-gray-400";

  return (
    <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
      <div className="container mx-auto px-4 md:px-16 lg:px-32">
        <div
          ref={reportRef}
          className="printable-area mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-10"
        >
          <div
            data-id="button-container"
            className="no-print mb-6 flex flex-wrap items-center justify-between gap-4"
          >
            <button
              onClick={handleBackAndClear}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>

            <button
              onClick={handlePrint}
              disabled={isDownloading}
              className="btn-gradient-primary flex items-center gap-2 rounded-full px-4 py-2 disabled:cursor-not-allowed disabled:bg-myunila/50"
            >
              {isDownloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {isDownloading ? "Mengunduh..." : "Unduh PDF"}
            </button>
          </div>

          <h1 className="mb-8 text-xl font-bold text-myunila dark:text-gray-100 md:text-2xl lg:text-3xl">
            Profil Talenta Mahasiswa
          </h1>

          {(nama || npm || email) && (
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Data Identitas
              </h2>
              <div className="space-y-1 text-base text-gray-700 dark:text-gray-300">
                {nama && (
                  <p>
                    <span className="font-medium">Nama :</span> {nama}
                  </p>
                )}
                {npm && (
                  <p>
                    <span className="font-medium">NPM :</span> {npm}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-medium">Email :</span> {email}
                  </p>
                )}
              </div>
            </div>
          )}

          {nama && (
            <div className="mb-8 rounded-2xl border border-gray-200 p-6 shadow-sm dark:border-myunila-900/50 dark:bg-gray-800">
              <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                Halo <span className="font-semibold">{nama}</span>!, Terima
                kasih sudah mengisi instrumen ini dengan baik dan seksama. Jadi
                gini, di bawah ini merupakan penjelasan talenta yang kamu miliki
                berdasarkan asesmen talenta yang telah dikerjakan. Kami sudah
                rangkum menjadi satu rangkaian. Silakan kamu cermati, soalnya
                profil ini bisa digunakan sebagai sarana untuk pengembangan diri
                kamu. Baca pelan-pelan saja ya, semoga relate!
              </p>
            </div>
          )}

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Tipe Kepribadian
              </h2>
              <p className="text-2xl font-semibold text-myunila dark:text-myunila-400">
                {mbtiType.toLocaleUpperCase()}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Bidang Karir Dominan
              </h2>
              <p className="text-2xl font-semibold text-myunila dark:text-myunila-400">
                {karirDominanKey}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Bidang Karir Sekunder
              </h2>
              <p className="text-2xl font-semibold text-myunila dark:text-myunila-400">
                {karirSekunderKey}
              </p>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Brain size={20} /> Gaya Berpikir, Komunikasi, dan Kerja
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gaya Berpikir
                </h3>
                <p className="text-lg font-semibold text-danger dark:text-danger">
                  {thinkingStyleKey}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gaya Komunikasi
                </h3>
                <p className="text-lg font-semibold text-warning dark:text-warning">
                  {communicationStyleKey}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pola Kerja
                </h3>
                <p className="text-lg font-semibold text-success dark:text-success">
                  {workingStyleKey}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <CheckCircle size={20} /> Overview Keterampilan Psikologis
            </h2>

            <div className="space-y-4">
              {pwbDimensions.map(([key, data]) => {
                const { percentage, level } = data;

                const levelColor =
                  level === "Tinggi"
                    ? "text-success"
                    : level === "Rendah"
                      ? "text-danger"
                      : "text-warning";

                const barColor =
                  level === "Tinggi"
                    ? "bg-success"
                    : level === "Rendah"
                      ? "bg-danger"
                      : "bg-warning";

                return (
                  <div key={key}>
                    <div className="mb-1 flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {PWB_TITLES[key] || key}
                      </span>
                      <span className={`text-sm font-semibold ${levelColor}`}>
                        {level} ({percentage}%)
                      </span>
                    </div>

                    <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Briefcase size={20} /> Bakat Bidang Karir
            </h2>

            <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Bidang Karir Ideal
            </h2>
            <p className="text-2xl font-bold text-myunila-600 dark:text-myunila-400">
              {karirDominanKey}
            </p>
            <p className="mt-4 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {dominantCareerDesc}
            </p>

            <h2 className="mb-2 mt-6 text-sm font-medium text-gray-500 dark:text-gray-400">
              Alternatif Bidang Karir Sekunder
            </h2>
            <p className="text-xl font-bold text-myunila-600/80 dark:text-myunila-400/80">
              {karirSekunderKey}
            </p>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {secondaryCareerDesc}
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Target size={20} /> Kesesuaian Bakat & Minat
            </h2>

            <p className="mb-2 text-base text-gray-600 dark:text-gray-300">
              Status Kesesuaian:{" "}
              <span
                className={`font-semibold ${
                  kesesuaian === "Sangat Sesuai"
                    ? "text-success"
                    : kesesuaian === "Cukup Sesuai"
                      ? "text-warning"
                      : "text-danger"
                }`}
              >
                {kesesuaian}
              </span>
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Minat Kamu
                </h3>
                <p className="text-lg font-bold text-myunila-600 dark:text-myunila-400">
                  {karirMinatKey}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bakat Dominan
                </h3>
                <p className={`text-lg font-bold ${dominantColorClass}`}>
                  {karirDominanKey}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bakat Sekunder
                </h3>
                <p className={`text-lg font-bold ${secondaryColorClass}`}>
                  {karirSekunderKey}
                </p>
              </div>
            </div>

            <p className="mt-4 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {kesesuaianDesc}
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Brain size={20} /> Kecenderungan Gaya Berpikir
            </h2>
            <h3 className="text-xl font-bold text-myunila-600 dark:text-myunila-400">
              {thinkingStyleKey}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {thinkingStyleDesc}
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <MessageSquare size={20} /> Kecenderungan Gaya Komunikasi
            </h2>
            <h3 className="text-xl font-bold text-myunila-600 dark:text-myunila-400">
              {communicationStyleKey}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {communicationStyleDesc}
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Briefcase size={20} /> Kecenderungan Pola Kerja
            </h2>
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {workingStyleKey}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {workingStyleDesc}
            </p>
          </div>

          <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <CheckCircle size={20} /> Keterampilan Psikologis - Rincian
            </h2>

            <div className="space-y-6">
              {pwbDimensions.map(([key, data]) => {
                const { level } = data;
                const pwbInfo = (
                  reportTextData.pwb.descriptions as Record<string, string>
                )[key];
                const pwbLevelDesc = (
                  reportTextData.pwb.levels as Record<
                    string,
                    Record<string, string>
                  >
                )[key]?.[level];

                const levelColor =
                  level === "Tinggi"
                    ? "text-success"
                    : level === "Sedang"
                      ? "text-warning"
                      : "text-danger";

                return (
                  <div
                    key={key}
                    className="border-b border-gray-100 pb-6 last:border-b-0 dark:border-gray-800"
                  >
                    <h3 className="text-base font-bold text-gray-800 dark:text-gray-100">
                      {PWB_TITLES[key] || key}
                    </h3>
                    <p className="mt-1 text-base text-gray-600 dark:text-gray-400">
                      {pwbInfo}
                    </p>

                    <div className="mt-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                      <p className="text-base font-medium text-gray-500 dark:text-gray-300">
                        Tingkat Kamu:{" "}
                        <span className={`font-semibold ${levelColor}`}>
                          {level}
                        </span>
                      </p>
                      <p className="mt-1 text-base text-gray-700 dark:text-gray-200">
                        {pwbLevelDesc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              Saran Pengembangan Talenta
            </h2>

            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                <BookOpen size={20} /> Strategi Belajar
              </h3>
              <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
                {learningStrategyDesc}
              </p>
            </div>

            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                <TrendingUp size={20} /> Peningkatan Keterampilan Psikologis
              </h3>

              <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Berikut beberapa saran pengembangan yang dapat kamu lakukan
                untuk meningkatkan keterampilan psikologis mu.
              </p>

              <div className="space-y-4">
                {pwbDimensions
                  .filter(([_, data]) => data.level !== "Tinggi")
                  .slice(0, 3)
                  .map(([key, data]) => {
                    const { level } = data;
                    const pwbDevDesc = (
                      reportTextData.pwb.development as Record<
                        string,
                        Record<string, string>
                      >
                    )[key]?.[level];

                    if (!pwbDevDesc) return null;

                    return (
                      <div
                        key={key}
                        className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800"
                      >
                        <h4 className="text-base font-bold text-gray-800 dark:text-gray-100">
                          {PWB_TITLES[key] || key}
                        </h4>
                        <p className="mt-1 text-base text-gray-700 dark:text-gray-200">
                          {pwbDevDesc}
                        </p>
                      </div>
                    );
                  })}

                {pwbDimensions.every(([, data]) => data.level === "Tinggi") && (
                  <p className="text-sm font-medium text-success">
                    Selamat! Semua keterampilan psikologismu berada di level
                    tinggi. Terus pertahankan!
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hasil ini memberikan gambaran umum mengenai kecenderungan karir
              dan kepribadian kamu. Gunakan hasil ini sebagai bahan refleksi
              diri dan pengembangan karir ke depan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

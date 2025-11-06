"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
} from "lucide-react";

import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import { useAssessmentLogic } from "@/components/Assessment/useAssessmentLogic";
import reportTextData from "@/data/ReportText.json";

import { resultsApi } from "@/lib/api-client";
import { ASSESSMENT_STORAGE_KEY } from "@/lib/constants";

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
  karirMinat?: keyof ReportTextData["careerField"];
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

// Calculate total behavior score for test 3
function calculateBehaviorReadiness(
  behaviorDimensions: Record<string, { percentage: number; level: string }>,
): string {
  // Sum all raw scores from 6 dimensions
  // Each dimension has 6 questions, scale 1-5
  // Max total = 36 questions * 5 = 180
  // We need to reconstruct total from percentages
  let totalScore = 0;
  const dimensionCount = Object.keys(behaviorDimensions).length;

  if (dimensionCount === 0) return "tidak_siap";

  // Each dimension percentage represents avg score for 6 questions
  // percentage = ((avg - 1) / 4) * 100
  // So avg = (percentage / 100) * 4 + 1
  // Total for dimension = avg * 6
  Object.values(behaviorDimensions).forEach((dim) => {
    const avg = (dim.percentage / 100) * 4 + 1;
    totalScore += avg * 6;
  });

  // Test 3 logic: based on total score
  if (totalScore >= 120) return "sangat_siap";
  if (totalScore >= 60) return "kurang_siap";
  return "tidak_siap";
}

// Calculate career compatibility (test 2)
function calculateCareerCompatibility(
  karirMinat: string,
  karirDominan: string,
  karirSekunder: string,
): string {
  if (karirMinat === karirDominan) return "sangat_sesuai";
  if (karirMinat === karirSekunder) return "cukup_sesuai";
  return "tidak_sesuai";
}

// Calculate overall classification (test 1)
function calculateOverallClassification(
  readiness: string,
  compatibility: string,
): string {
  // Test 1 matrix logic from user requirements
  if (readiness === "tidak_siap" && compatibility === "tidak_sesuai")
    return "critical_mismatch";
  if (readiness === "kurang_siap" && compatibility === "tidak_sesuai")
    return "inconsistent_fit_zone";
  if (readiness === "sangat_siap" && compatibility === "tidak_sesuai")
    return "happy_but_misaligned";
  if (readiness === "tidak_siap" && compatibility === "cukup_sesuai")
    return "underdeveloped_potential";
  if (readiness === "kurang_siap" && compatibility === "cukup_sesuai")
    return "growth_zone";
  if (readiness === "sangat_siap" && compatibility === "cukup_sesuai")
    return "positive_explorers";
  if (readiness === "tidak_siap" && compatibility === "sangat_sesuai")
    return "latent_talent_zone";
  if (readiness === "kurang_siap" && compatibility === "sangat_sesuai")
    return "aligned_developers";
  if (readiness === "sangat_siap" && compatibility === "sangat_sesuai")
    return "high_fit_champions";

  return "unknown";
}

// Format test 5 MBTI results (6 entries)
function formatMBTIResults(result: AssessmentResult) {
  return [
    { param: "mbti_type", value: result.mbtiType },
    { param: "primary", value: result.karirDominanMBTI },
    { param: "secondary", value: result.karirSekunderMBTI },
    { param: "thinking_style", value: result.thinkingStyle },
    { param: "communication_style", value: result.communicationStyle },
    { param: "working_style", value: result.workingStyle },
  ];
}

// Format test 6 behavior results (6 entries)
function formatBehaviorResults(
  behaviorDimensions: Record<string, { percentage: number; level: string }>,
) {
  return Object.entries(behaviorDimensions).map(([dimension, data]) => ({
    dimension,
    level: data.level,
    percentage: data.percentage,
  }));
}

export default function TalentResultPage() {
  const router = useRouter();
  const { answers, goTo } = useAssessmentFlow();
  const { getFinalResult } = useAssessmentLogic(answers);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Mutation for saving results
  const saveResultMutation = useMutation({
    mutationFn: async (data: {
      testSubmissionId: string;
      testId: number;
      result: string;
    }) => {
      return resultsApi.createTestResult(data);
    },
  });

  // Load and calculate results
  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const final = getFinalResult as any;
      setResult({
        ...final,
        nama: answers.nama,
        npm: answers.npm,
        email: answers.email,
      });
    } catch (err) {
      console.error("Gagal memuat hasil asesmen:", err);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [answers, getFinalResult]);

  // Save all results on mount
  useEffect(() => {
    if (!result || isSaving) return;

    const saveResults = async () => {
      try {
        setIsSaving(true);

        // Get submissionId from localStorage
        const stored = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
        if (!stored) {
          console.warn("No submission found in localStorage");
          return;
        }

        const parsed = JSON.parse(stored);
        const submissionId: string | undefined = parsed?.testSubmissionId;
        if (!submissionId) {
          console.warn("No testSubmissionId found");
          return;
        }

        // Clear old result localStorage data
        const oldResultKeys = Object.keys(localStorage).filter(
          (key) => key.includes("result") || key.includes("posted"),
        );
        oldResultKeys.forEach((key) => localStorage.removeItem(key));

        // Calculate all test results
        const readiness = calculateBehaviorReadiness(result.behaviorDimensions);
        const compatibility = calculateCareerCompatibility(
          result.karirMinat || "",
          result.karirDominanMBTI,
          result.karirSekunderMBTI,
        );
        const overall = calculateOverallClassification(
          readiness,
          compatibility,
        );

        // Prepare all results
        const allResults: Array<{ testId: number; result: string }> = [];

        // Test 1: Overall classification
        allResults.push({ testId: 1, result: overall });

        // Test 2: Career compatibility
        allResults.push({ testId: 2, result: compatibility });

        // Test 3: Behavioral readiness
        allResults.push({ testId: 3, result: readiness });

        // Test 4: Career field (karirMinat)
        if (result.karirMinat) {
          allResults.push({
            testId: 4,
            result: result.karirMinat,
          });
        }

        // Test 5: MBTI details (6 results in "param:value" format)
        const mbtiResults = formatMBTIResults(result);
        mbtiResults.forEach((mbtiData) => {
          allResults.push({
            testId: 5,
            result: `${mbtiData.param}:${mbtiData.value}`,
          });
        });

        // Test 6: Behavior dimensions (6 results in "dimension:level:percentage" format)
        const behaviorResults = formatBehaviorResults(
          result.behaviorDimensions,
        );
        behaviorResults.forEach((behaviorData) => {
          allResults.push({
            testId: 6,
            result: `${behaviorData.dimension}:${behaviorData.level}:${behaviorData.percentage}`,
          });
        });

        // Save all to database
        const savePromises = allResults.map((testResult) =>
          saveResultMutation.mutateAsync({
            testSubmissionId: submissionId,
            testId: testResult.testId,
            result: testResult.result,
          }),
        );

        await Promise.allSettled(savePromises);

        // Save consolidated result to localStorage
        const resultData = {
          submissionId,
          timestamp: new Date().toISOString(),
          results: {
            test1_overall: overall,
            test2_compatibility: compatibility,
            test3_readiness: readiness,
            test4_career: result.karirMinat,
            test5_mbti: result.mbtiType,
            test6_behavior: result.behaviorDimensions,
          },
          studentInfo: {
            nama: result.nama,
            npm: result.npm,
            email: result.email,
          },
        };

        localStorage.setItem(
          `${ASSESSMENT_STORAGE_KEY}:results`,
          JSON.stringify(resultData),
        );

        console.log("✅ All results saved successfully");
      } catch (error) {
        console.error("❌ Error saving results:", error);
      } finally {
        setIsSaving(false);
      }
    };

    saveResults();
  }, [result, isSaving, saveResultMutation]);

  if (isLoading || isSaving) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <Loader2 className="mb-3 h-6 w-6 animate-spin text-myunila" />
        <p>
          {isSaving
            ? "Menyimpan hasil asesmen..."
            : "Memuat hasil asesmen kamu..."}
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <p>Belum ada hasil asesmen ditemukan.</p>
        <button
          onClick={() => goTo("start")}
          className="mt-4 rounded-full bg-myunila px-6 py-2 text-sm font-medium text-white hover:bg-myunila/90"
        >
          Mulai Asesmen
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-5xl bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center">
          <CheckCircle className="mr-3 h-12 w-12 text-green-500" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
          Hasil Asesmen Talenta
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Berikut adalah rangkuman profil talenta dan pengembangan dirimu
        </p>
        {result.nama && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            {result.nama} ({result.npm})
          </p>
        )}
      </div>

      {/* MBTI Type */}
      <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-3">
          <Brain className="h-6 w-6 text-myunila" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Tipe Kepribadian (MBTI)
          </h2>
        </div>
        <div className="rounded-lg bg-myunila/10 p-4">
          <p className="text-3xl font-bold text-myunila">{result.mbtiType}</p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {typeof reportTextData.learningStrategy[result.mbtiType] ===
            "string"
              ? reportTextData.learningStrategy[result.mbtiType]
              : reportTextData.learningStrategy[result.mbtiType]}
          </p>
        </div>
      </section>

      {/* Career Fields */}
      <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-3">
          <Briefcase className="h-6 w-6 text-myunila" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Bidang Karir
          </h2>
        </div>
        <div className="space-y-4">
          {result.karirMinat && (
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Minat Karir (Hasil Tes)
              </p>
              <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
                {result.karirMinat}
              </p>
            </div>
          )}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Karir Dominan (Berdasarkan MBTI)
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
              {result.karirDominanMBTI}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Karir Sekunder (Berdasarkan MBTI)
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
              {result.karirSekunderMBTI}
            </p>
          </div>
        </div>
      </section>

      {/* Compatibility */}
      <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-3">
          <Target className="h-6 w-6 text-myunila" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Kesesuaian Minat & Kepribadian
          </h2>
        </div>
        <div
          className={`rounded-lg p-4 ${
            result.kesesuaian === "Sangat Sesuai"
              ? "bg-green-50 dark:bg-green-900/20"
              : result.kesesuaian === "Cukup Sesuai"
                ? "bg-yellow-50 dark:bg-yellow-900/20"
                : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <p
            className={`text-lg font-bold ${
              result.kesesuaian === "Sangat Sesuai"
                ? "text-green-700 dark:text-green-300"
                : result.kesesuaian === "Cukup Sesuai"
                  ? "text-yellow-700 dark:text-yellow-300"
                  : "text-red-700 dark:text-red-300"
            }`}
          >
            {result.kesesuaian}
          </p>
        </div>
      </section>

      {/* Styles */}
      <section className="mb-6 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-3">
          <MessageSquare className="h-6 w-6 text-myunila" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Gaya Kerja & Komunikasi
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Thinking Style
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
              {result.thinkingStyle}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Communication Style
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
              {result.communicationStyle}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Working Style
            </p>
            <p className="mt-1 text-lg font-semibold text-gray-800 dark:text-gray-100">
              {WORKING_STYLE_TITLES[result.workingStyle] || result.workingStyle}
            </p>
          </div>
        </div>
      </section>

      {/* Behavior Dimensions */}
      <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
        <div className="mb-4 flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-myunila" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Dimensi Kesejahteraan Psikologis
          </h2>
        </div>
        <div className="space-y-4">
          {Object.entries(result.behaviorDimensions).map(
            ([key, { percentage, level }]) => (
              <div
                key={key}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    {PWB_TITLES[key] || key}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      level === "Tinggi"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : level === "Sedang"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                    }`}
                  >
                    {level}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full transition-all ${
                      level === "Tinggi"
                        ? "bg-green-500"
                        : level === "Sedang"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                  {percentage}%
                </p>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Back Button */}
      <div className="flex justify-center">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

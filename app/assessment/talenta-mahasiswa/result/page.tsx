"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Brain, CheckCircle, Loader2 } from "lucide-react";

import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import { useAssessmentLogic } from "@/components/Assessment/useAssessmentLogic";

interface AssessmentResult {
  nama?: string;
  npm?: string;
  email?: string;
  bidangKarir: string;
  mbtiType: string;
  kesesuaian: string;
  kesesuaianKarir: string;
  thinkingStyle: string;
  communicationStyle: string;
  workingStyle: string;
  behaviorDimensions: Record<string, string>;
}

export default function TalentResultPage() {
  const router = useRouter();
  const { answers, goTo, currentStep } = useAssessmentFlow();
  const { getFinalResult } = useAssessmentLogic(answers);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentStep !== "result" || !answers || Object.keys(answers).length === 0) {
    setIsLoading(false);
    return;
    }

   try {
      const final = getFinalResult;
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
  }, [answers, getFinalResult, currentStep]);

   if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <Loader2 className="mb-3 h-6 w-6 animate-spin text-primary" />
        <p>Memuat hasil asesmen kamu...</p>
      </div>
    );

  if (!result)
    return (
      <div className="flex h-screen flex-col items-center justify-center text-gray-600 dark:text-gray-300">
        <p>Belum ada hasil asesmen ditemukan.</p>
        <button
          onClick={() => goTo("start")}
          className="mt-4 rounded-full bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          Kembali ke Awal
        </button>
      </div>
    );

  const {
    nama,
    npm,
    email,
    bidangKarir,
    mbtiType,
    kesesuaian,
    kesesuaianKarir,
    thinkingStyle,
    communicationStyle,
    workingStyle,
    behaviorDimensions,
  } = result;

  return (
    <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
      <div className="container mx-auto px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900 sm:p-10">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <button
              onClick={() => router.push("/assessment/talenta-mahasiswa")}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={16} />
              Kembali
            </button>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Hasil Asesmen Talenta Mahasiswa
            </h1>
          </div>

          {/* Identitas */}
          {(nama || npm || email) && (
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Data Identitas
              </h2>
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {nama && (
                  <p>
                    <span className="font-medium">Nama:</span> {nama}
                  </p>
                )}
                {npm && (
                  <p>
                    <span className="font-medium">NPM:</span> {npm}
                  </p>
                )}
                {email && (
                  <p>
                    <span className="font-medium">Email:</span> {email}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bidang & MBTI */}
          <div className="mb-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Bidang Karir Ideal
              </h2>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                {bidangKarir}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Kesesuaian Pilihan Karir:{" "}
                <span
                  className={`font-semibold ${
                    kesesuaianKarir === "Sesuai"
                      ? "text-green-600"
                      : kesesuaianKarir === "Tidak Sesuai"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {kesesuaianKarir}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Tipe Kepribadian (MBTI)
              </h2>
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                {mbtiType}
              </p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Kesesuaian MBTI dengan bidang:{" "}
                <span
                  className={`font-semibold ${
                    kesesuaian === "Sangat Sesuai"
                      ? "text-green-600"
                      : kesesuaian === "Cukup Sesuai"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {kesesuaian}
                </span>
              </p>
            </div>
          </div>

          {/* Gaya Berpikir, Komunikasi, Kerja */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
              <Brain size={20} />
              Gaya Berpikir, Komunikasi, dan Kerja
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gaya Berpikir
                </h3>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {thinkingStyle}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gaya Komunikasi
                </h3>
                <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  {communicationStyle}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gaya Kerja
                </h3>
                <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                  {workingStyle}
                </p>
              </div>
            </div>
          </div>

          {/* Dimensi Perilaku */}
          <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
              <CheckCircle size={20} />
              Pola Perilaku (Behavioral Dimensions)
            </h2>
            {Object.keys(behaviorDimensions).length > 0 ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="p-2 text-left text-gray-500 dark:text-gray-400">
                      Dimensi
                    </th>
                    <th className="p-2 text-left text-gray-500 dark:text-gray-400">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(behaviorDimensions).map(([dim, level]) => (
                    <tr
                      key={dim}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="p-2 font-medium text-gray-700 dark:text-gray-200">
                        {dim}
                      </td>
                      <td
                        className={`p-2 font-semibold ${
                          level === "Tinggi"
                            ? "text-green-600"
                            : level === "Rendah"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {String(level)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada data dimensi perilaku.
              </p>
            )}
          </div>

          {/* Footer */}
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

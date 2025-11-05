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

import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import { useAssessmentLogic } from "@/components/Assessment/useAssessmentLogic";
import reportTextData from "@/data/ReportText.json";

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
  const { answers, goTo, currentStep, clear } = useAssessmentFlow();
  const { getFinalResult } = useAssessmentLogic(answers);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      currentStep !== "result" ||
      !answers ||
      Object.keys(answers).length === 0
    ) {
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
  }, [answers, getFinalResult, currentStep]);

  const handleBackAndClear = () => {
    clear?.();
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
        <p className="text-lg">Belum ada hasil asesmen ditemukan.</p>
        <button
          onClick={() => goTo("start")}
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

  const thinkingStyleDesc = reportTextData.thinkingStyle[thinkingStyle];
  const communicationStyleDesc =
    reportTextData.communicationStyle[communicationStyle];
  const workingStyleDesc = reportTextData.workingStyle[workingStyle];
  const dominantCareerDesc = reportTextData.careerField[karirDominanMBTI];
  const secondaryCareerDesc = reportTextData.careerField[karirSekunderMBTI];
  const kesesuaianDesc =
    kesesuaian === "Sangat Sesuai"
      ? reportTextData.suitability["Sesuai"]
      : reportTextData.suitability["Tidak Sesuai"];
  const learningStrategyDesc = reportTextData.learningStrategy[mbtiType];
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
                {mbtiType}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Bidang Karir Dominan
              </h2>
              <p className="text-2xl font-semibold text-myunila dark:text-myunila-400">
                {karirDominanMBTI}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                Bidang Karir Sekunder
              </h2>
              <p className="text-2xl font-semibold text-myunila dark:text-myunila-400">
                {karirSekunderMBTI}
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
                  {thinkingStyle}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Gaya Komunikasi
                </h3>
                <p className="text-lg font-semibold text-warning dark:text-warning">
                  {communicationStyle}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-center dark:bg-gray-900/40">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pola Kerja
                </h3>
                <p className="text-lg font-semibold text-success dark:text-success">
                  {WORKING_STYLE_TITLES[workingStyle] || workingStyle}
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

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            {/* Bidang Karir Ideal */}
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Briefcase size={20} /> Bakat Bidang Karir
            </h2>

            <h2 className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Bidang Karir Ideal
            </h2>
            <p className="text-2xl font-bold text-myunila-600 dark:text-myunila-400">
              {karirDominanMBTI}
            </p>
            <p className="mt-4 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {dominantCareerDesc}
            </p>

            {/* Bidang Karir Sekunder */}
            <h2 className="mb-2 mt-6 text-sm font-medium text-gray-500 dark:text-gray-400">
              Alternatif Bidang Karir Sekunder
            </h2>
            <p className="text-xl font-bold text-myunila-600/80 dark:text-myunila-400/80">
              {karirSekunderMBTI}
            </p>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {secondaryCareerDesc}
            </p>
          </div>

          {/* Kesesuaian Bakat & Minat */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Target size={20} /> Kesesuaian Bakat & Minat
            </h2>

            {/* Status Keseluruhan */}
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

            {/* === BLOK PERBANDINGAN 3-GRID === */}
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 text-center dark:bg-gray-800 sm:grid-cols-3">
              {/* Kolom 1: Minat Kamu */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Minat Kamu
                </h3>
                <p className="text-lg font-bold text-myunila-600 dark:text-myunila-400">
                  {karirMinat}
                </p>
              </div>

              {/* Kolom 2: Bakat Dominan */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bakat Dominan
                </h3>
                <p className={`text-lg font-bold ${dominantColorClass}`}>
                  {karirDominanMBTI}
                </p>
              </div>

              {/* Kolom 3: Bakat Alternatif */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bakat Sekunder
                </h3>
                <p className={`text-lg font-bold ${secondaryColorClass}`}>
                  {karirSekunderMBTI}
                </p>
              </div>
            </div>
            {/* === AKHIR BLOK BARU === */}

            <p className="mt-4 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {kesesuaianDesc}
            </p>
          </div>

          {/* Gaya Berpikir */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Brain size={20} /> Kecenderungan Gaya Berpikir
            </h2>
            <h3 className="text-xl font-bold text-myunila-600 dark:text-myunila-400">
              {thinkingStyle}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {thinkingStyleDesc}
            </p>
          </div>

          {/* Gaya Komunikasi */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <MessageSquare size={20} /> Kecenderungan Gaya Komunikasi
            </h2>
            <h3 className="text-xl font-bold text-myunila-600 dark:text-myunila-400">
              {communicationStyle}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {communicationStyleDesc}
            </p>
          </div>

          {/* Pola Kerja */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
              <Briefcase size={20} /> Kecenderungan Pola Kerja
            </h2>
            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {WORKING_STYLE_TITLES[workingStyle] || workingStyle}
            </h3>
            <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
              {workingStyleDesc}
            </p>
          </div>

          {/* Keterampilan Psikologis (PWB) */}
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

          {/* --- Saran Pengembangan Talenta --- */}
          <div className="mb-8">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              Saran Pengembangan Talenta
            </h2>

            {/* Strategi Belajar */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-800 dark:text-gray-100">
                <BookOpen size={20} /> Strategi Belajar
              </h3>
              <p className="mt-3 whitespace-pre-line text-base text-gray-700 dark:text-gray-300">
                {learningStrategyDesc}
              </p>
            </div>

            {/* --- PERBAIKAN 3: Perbaiki loop Saran PWB --- */}
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

                {/* Pesan jika semua level tinggi */}
                {pwbDimensions.every(([, data]) => data.level === "Tinggi") && (
                  <p className="text-sm font-medium text-success">
                    Selamat! Semua keterampilan psikologismu berada di level
                    tinggi. Terus pertahankan!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* --- Footer --- */}
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

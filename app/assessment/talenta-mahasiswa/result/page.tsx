"use client";

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAssessmentFlow } from '@/components/Assessment/useAssessmentFlow';
import { calculateResults, CAREER_CATEGORIES, MBTI_DIMENSIONS } from '@/utils/calculateResults';
import jsPDF from 'jspdf';
import { Download, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface ResultType {
  career: {
    topCategory: keyof typeof CAREER_CATEGORIES;
    categoryScores: Record<keyof typeof CAREER_CATEGORIES, number>;
    mbtiType: string;
    mbtiScores: Record<keyof typeof MBTI_DIMENSIONS, { dominant: 'A' | 'B'; score: number }>;
    idealCareer: string;
    description: string;
  };
  behavior: {
    dimensions: Array<{
      name: string;
      avgScore: number;
      interpretation: string;
      recommendation: string;
    }>;
    overallWellbeing: string;
  };
  summary: string;
  recommendations: string[];
}

export default function Result() {
  const router = useRouter();
  const { answers, currentStep, clear } = useAssessmentFlow();
  const [result, setResult] = useState<ResultType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const isCareerComplete = useMemo(
  () =>
    Object.keys(answers).filter(k => {
      const n = Number(k);
      return !isNaN(n) && n >= 1 && n <= 24;
    }).length >= 24,
  [answers]
);

const isBehaviorComplete = useMemo(
  () =>
    Object.keys(answers).filter(k => {
      const n = Number(k);
      return !isNaN(n) && n >= 41 && n <= 76;
    }).length >= 36,
  [answers]
);

const isComplete = isCareerComplete && isBehaviorComplete;
  useEffect(() => {
    console.log('Result Page: Current Step:', currentStep, 'Is Complete:', isComplete);  // Logging yang ditambahkan
    if (currentStep !== 'result') {
      const timer = setTimeout(() => {
        toast.error('Asesmen belum selesai. Kembali ke bagian sebelumnya.');
        router.replace('/assessment/talenta-mahasiswa/behavior-pattern/fill');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, router, isComplete]);

  useEffect(() => {
    if (!isComplete) {
      setError('Asesmen belum lengkap. Kembali dan lengkapi semua soal.');
      setLoading(false);
      return;
    }

    try {
      const computedResult = calculateResults(answers);
      setResult(computedResult);
    } catch (err) {
      console.error('Calculate error:', err);
      setError('Gagal memproses hasil. Pastikan jawaban valid.');
    } finally {
      setLoading(false);
    }
  }, [isComplete, answers]);

  const memoizedResult = useMemo(() => result, [result]);

  const downloadPDF = () => {
    if (!memoizedResult) return;
    const doc = new jsPDF('p', 'mm', 'a4');
    const npm = answers.npm || 'N/A';
    const email = answers.email || 'N/A';
    const date = new Date().toLocaleDateString('id-ID');

    doc.setFontSize(20).setFont('helvetica', 'bold');
    doc.text('Hasil Asesmen Talenta Mahasiswa', 20, 20);
    doc.setFontSize(12).setFont('helvetica', 'normal');
    doc.text(`Universitas Lampung | NPM: ${npm} | Email: ${email}`, 20, 30);
    doc.text(`Tanggal: ${date}`, 20, 40);

    let y = 50;
    doc.setFontSize(14).setFont('helvetica', 'bold').text('Ringkasan Hasil', 20, y);
    y += 10;

    const summaryLines = doc.splitTextToSize(memoizedResult.summary, 170);
    doc.setFontSize(12).setFont('helvetica', 'normal').text(summaryLines, 20, y);
    y += summaryLines.length * 6 + 10;

    doc.setFont('helvetica', 'bold').text('1. Bidang Karir Ideal', 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal').text(memoizedResult.career.idealCareer, 20, y);
    y += 10;

    const descLines = doc.splitTextToSize(memoizedResult.career.description, 170);
    doc.text(descLines, 20, y);
    y += descLines.length * 6 + 10;

    doc.text(
      `Rekomendasi Jurusan: ${CAREER_CATEGORIES[memoizedResult.career.topCategory].majors.join(', ')}`,
      20,
      y
    );
    y += 20;

    doc.setFont('helvetica', 'bold').text('2. Pola Perilaku', 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    memoizedResult.behavior.dimensions.forEach(d => {
      doc.text(`${d.name}: ${d.avgScore.toFixed(1)}/5 - ${d.interpretation}`, 20, y);
      y += 8;
    });
    y += 10;
    doc.text(`Pola Keseluruhan: ${memoizedResult.behavior.overallWellbeing}`, 20, y);
    y += 20;

    doc.setFont('helvetica', 'bold').text('3. Rekomendasi Pengembangan', 20, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    memoizedResult.recommendations.forEach((rec, i) => {
      const recLines = doc.splitTextToSize(`${i + 1}. ${rec}`, 170);
      doc.text(recLines, 20, y);
      y += recLines.length * 6;
    });

    y = 280;
    doc.setFontSize(10).setFont('helvetica', 'italic');
    doc.text('Disclaimer: Hasil ini bersifat panduan. Konsultasikan dengan career counselor Unila.', 20, y);
    doc.text('© Universitas Lampung 2024', 20, y + 10);

    doc.save(`hasil-asesmen-talenta-${npm}-${Date.now()}.pdf`);
    toast.success('PDF berhasil diunduh!');
  };

  const handleReset = () => {
    clear();
    toast.success('Asesmen direset.');
    router.push('/assessment/talenta-mahasiswa/start');
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p>Memproses hasil asesmen...</p>
        </div>
      </div>
    );

  if (error || !memoizedResult)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Terjadi Kesalahan</h2>
          <p className="mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/assessment/talenta-mahasiswa/career-path')}
              className="bg-primary text-white px-6 py-3 rounded-md"
            >
              Kembali ke Asesmen
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-gray-500 text-white px-6 py-3 rounded-md"
            >
              <RefreshCw className="inline w-4 h-4 mr-2" /> Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <section className="pb-16 pt-32 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Selamat! Asesmen Selesai</h1>
          <p>Berikut hasil analisis talenta Anda sebagai panduan karir dan pengembangan diri.</p>
        </div>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-center mb-4">Ringkasan Hasil</h2>
          <p className="text-center leading-relaxed">{memoizedResult.summary}</p>
        </section>

        {/* Karir Ideal */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            🎯 Bidang Karir Ideal
          </h2>
          <p className="mb-4">{memoizedResult.career.idealCareer}</p>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            {memoizedResult.career.description}
          </p>
          <h3 className="font-semibold mb-3">Rekomendasi Jurusan di Unila</h3>
          <ul className="list-disc list-inside">
            {CAREER_CATEGORIES[memoizedResult.career.topCategory].majors.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </section>

        {/* Pola Perilaku */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🧠 Pola Perilaku</h2>
          {memoizedResult.behavior.dimensions.map((d, i) => (
            <div key={i} className="mb-3">
              <strong>{d.name}</strong>: {d.avgScore.toFixed(1)}/5 — {d.interpretation}
            </div>
          ))}
          <p className="mt-4">Pola Keseluruhan: {memoizedResult.behavior.overallWellbeing}</p>
        </section>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={downloadPDF}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-md"
          >
            <Download className="h-4 w-4" /> Unduh PDF
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-md"
          >
            <RefreshCw className="h-4 w-4" /> Reset Asesmen
          </button>
        </div>
      </div>
    </section>
  );
}

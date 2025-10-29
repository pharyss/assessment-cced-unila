"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  ClipboardList,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/CareerPath.json";

export default function CareerPathFill() {
  const router = useRouter();
  const { answers, saveAnswer, next, currentStep } = useAssessmentFlow();

  const questions = useMemo(() => {
    const subA = questionsData.part1.subPartA.questions;
    const subB = questionsData.part1.subPartB.questions.map((q) => ({
      ...q,
      id: q.id + 12,
    }));
    return [...subA, ...subB];
  }, []);

  const [pageIndex, setPageIndex] = useState(() => {
    try {
      return parseInt(localStorage.getItem("career-path-page") || "0", 10);
    } catch {
      return 0;
    }
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);

  const pageSize = 4;
  const totalPages = Math.ceil(questions.length / pageSize);
  const totalQuestions = questions.length;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const currentQuestions = questions.slice(start, end);

  const totalAnswered = Object.keys(answers).filter(
    (key) => !isNaN(Number(key)) && Number(key) <= totalQuestions
  ).length;

  const isAllComplete = totalAnswered >= totalQuestions;
  const currentPageAnswered = currentQuestions.every((q) => answers[q.id]);

  const handleSelect = (qid, value) => {
    saveAnswer(qid.toString(), value);
  };

  const handleNext = () => {
    if (!currentPageAnswered) {
      toast.error("Isi semua pertanyaan di halaman ini dulu!");
      return;
    }

    if (pageIndex < totalPages - 1) {
      const nextPage = pageIndex + 1;
      setPageIndex(nextPage);
      localStorage.setItem("career-path-page", nextPage.toString());
    } else if (isAllComplete) {
      setShowConfirm(true);
    } else {
      toast.error(`Lengkapi semua ${totalQuestions} pertanyaan terlebih dahulu!`);
    }
  };

  const handlePrev = () => {
    if (pageIndex > 0) {
      const prevPage = pageIndex - 1;
      setPageIndex(prevPage);
      localStorage.setItem("career-path-page", prevPage.toString());
    }
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    next();
    router.push("/assessment/talenta-mahasiswa/behavior-pattern");
    localStorage.removeItem("career-path-page");
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pageIndex]);

  useEffect(() => {
    if (
      currentStep === "behavior-pattern" ||
      (currentStep === "career-path/fill" && isAllComplete)
    ) {
      toast("Bagian karir sudah lengkap. Lanjut ke pola perilaku.");
      router.replace("/assessment/talenta-mahasiswa/behavior-pattern");
    }
  }, [currentStep, isAllComplete, router]);

  const progressPercent = ((pageIndex + 1) / totalPages) * 100;

  return (
    <>
      {showInstruction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relativ e mx-4 max-w-2xl rounded-lg bg-white dark:bg-gray-800 p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowInstruction(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              aria-label="Tutup instruksi"
            >
              <X className="h-5 w-5" />
            </button>

            <h1 className="mb-4 text-center text-2xl md:text-3xl font-bold text-myunila">
              Bidang Karir Ideal
            </h1>
            <p className="mb-6 text-center">
              Bagian ini membantumu memahami kecenderungan bidang karir yang paling ideal berdasarkan minat dan karakteristik dirimu. Terdapat 40 soal yang terbagi menjadi dua subbagian.
            </p>

            {/* Kartu Instruksi */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              {/* Minat Karir */}
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 w-full shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-2 bg-myunila-100 dark:bg-myunila-900 rounded-lg text-myunila dark:text-myunila-300">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Minat Karir (12 situasi)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Pilih satu respon yang paling kamu sukai atau paling mungkin
                    kamu lakukan dari empat pilihan yang tersedia. Pilihlah yang
                    paling <em>&quot;aku banget&quot;</em> agar hasilnya akurat.
                  </p>
                </div>
              </div>

              {/* Karakteristik Diri */}
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 w-full shadow-sm hover:shadow-lg transition-shadow">
                <div className="p-2 bg-myunila-100 dark:bg-myunila-900 rounded-lg text-myunila dark:text-myunila-300">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                    Karakteristik Diri (28 situasi)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Pilih satu dari dua opsi yang paling sesuai dengan
                    karaktermu. Tidak ada jawaban benar atau salah.
                  </p>
                </div>
              </div>
            </div>

            <p className="mb-8 text-center font-semibold text-gray-900 dark:text-gray-300">
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
      <section className="relative z-10 overflow-hidden pb-12 pt-24 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[900px] rounded-md bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 md:p-8 lg:p-12">

            <h2 className="mb-4 text-center text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
              {questionsData.part1.title}
            </h2>
            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
              {questionsData.part1.instruction}
            </p>

            <div className="mb-6">
              <div
                className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-2 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                Halaman {pageIndex + 1} dari {totalPages}
              </p>
            </div>

            <div className="space-y-6">
              {currentQuestions.map((q) => (
                <div key={q.id} className="border-b pb-4 last:border-0">
                  <h3 className="mb-3 text-sm sm:text-base lg:text-lg font-medium text-gray-800 dark:text-gray-200">
                    {q.id}. {q.question}
                  </h3>
                  <div className="space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt.label}
                        htmlFor={`opt-${q.id}-${opt.label}`}
                        className={`flex cursor-pointer items-center rounded-md border p-3 transition ${
                          answers[q.id] === opt.label
                            ? "border-primary bg-primary/10"
                            : "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
                        }`}
                      >
                        <input
                          type="radio"
                          id={`opt-${q.id}-${opt.label}`}
                          name={`q-${q.id}`}
                          value={opt.label}
                          checked={answers[q.id] === opt.label}
                          onChange={() => handleSelect(q.id, opt.label)}
                          className="hidden"
                        />
                        <span className="text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                          {opt.label}. {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrev}
                disabled={pageIndex === 0}
                className="flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!currentPageAnswered}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  currentPageAnswered
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {pageIndex === totalPages - 1 ? "Selesai Part 1" : "Lanjut"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Konfirmasi
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
              Apakah Anda yakin ingin melanjutkan ke tes berikutnya? Bagian ini
              tidak dapat diubah lagi. ({totalAnswered}/{totalQuestions} dijawab)
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isAllComplete}
                className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
              >
                Ya, Lanjut
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

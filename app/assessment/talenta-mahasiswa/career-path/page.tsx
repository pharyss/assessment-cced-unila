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

  const [pageIndex, setPageIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showInstruction, setShowInstruction] = useState(true);

  const pageSize = 4;
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / pageSize);
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const currentQuestions = questions.slice(start, end);

  const totalAnswered = Object.keys(answers).filter(
    (key) => !isNaN(Number(key)) && Number(key) <= totalQuestions
  ).length;

  const isAllComplete = totalAnswered >= totalQuestions;
  const currentPageAnswered = currentQuestions.every((q) => answers[q.id]);
  const progressPercent = ((pageIndex + 1) / totalPages) * 100;

  useEffect(() => {
    const stored = localStorage.getItem("career-path-page");
    if (stored) setPageIndex(Number(stored));
  }, []);

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

  useEffect(() => {
    if (isAllComplete && currentStep === "career-path/fill") {
      toast.success("Bidang karir sudah lengkap. Lanjut ke pola perilaku.");
      router.replace("/assessment/talenta-mahasiswa/behavior-pattern");
    }
  }, [isAllComplete, currentStep, router]);

  const handleSelect = (qid, value) => saveAnswer(String(qid), value);

  const handlePageChange = (newPage) => {
    setPageIndex(newPage);
    localStorage.setItem("career-path-page", newPage.toString());
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    next();
    router.push("/assessment/talenta-mahasiswa/behavior-pattern");
    localStorage.removeItem("career-path-page");
  };

  return (
    <>
      {/* ===== MODAL INSTRUKSI ===== */}
      {showInstruction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative mx-4 max-w-2xl rounded-lg border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
            <button
              onClick={() => setShowInstruction(false)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              aria-label="Tutup instruksi"
            >
              <X className="h-5 w-5" />
            </button>

            <h1 className="mb-4 text-center text-2xl font-bold text-myunila md:text-3xl">
              Bidang Karir Ideal
            </h1>
            <p className="mb-6 text-center">
              Bagian ini membantumu memahami kecenderungan bidang karir yang
              paling ideal berdasarkan minat dan karakteristik dirimu. Terdapat
              40 soal yang terbagi menjadi dua subbagian.
            </p>

            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
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
                  className="flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg dark:bg-gray-800"
                >
                  <div className="rounded-lg bg-myunila-100 p-2 text-myunila dark:bg-myunila-900 dark:text-myunila-300">
                    {icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 sm:text-base">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{desc}</p>
                  </div>
                </div>
              ))}
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
      <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
        <div className="container mx-auto px-8 md:px-16 lg:px-32">
          <div className="mx-auto max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 sm:p-10">
            <div className="mb-10 text-center">
              <h2 className="mb-2 text-2xl font-bold text-myunila dark:text-white sm:text-3xl">
                {questionsData.part1.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {questionsData.part1.instruction}
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
                  className="h-full bg-myunila transition-all duration-700 ease-in-out"
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
              {currentQuestions.map((q) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-gray-100 sm:text-lg">
                    {q.id}. {q.question}
                  </h3>
                  <div className="grid gap-3">
                    {q.options.map((opt) => (
                      <label
                        key={opt.label}
                        htmlFor={`opt-${q.id}-${opt.label}`}
                        className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all duration-200 ${
                          answers[q.id] === opt.label
                            ? "border-myunila bg-myunila-100/50 text-myunila dark:border-myunila-600"
                            : "border-gray-200 bg-white hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
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
                        <span className="text-sm font-medium sm:text-base">
                          {opt.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
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
                    ? () => setShowConfirm(true)
                    : () => handlePageChange(pageIndex + 1)
                }
                disabled={!currentPageAnswered}
                className={`flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
                  currentPageAnswered
                    ? "bg-myunila text-white hover:bg-myunila-700"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
              >
                {pageIndex === totalPages - 1 ? "Selesai Part 1" : "Lanjut"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MODAL KONFIRMASI ===== */}
      {showConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 transition-all dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex flex-col items-center text-center">
              <AlertCircle className="text-warning h-16 w-16 mb-3" />
              <h3 className="text-warning text-2xl font-bold dark:text-white">
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
                className="rounded-full border border-gray-200 px-10 py-2.5 text-gray-700 transition-all hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!isAllComplete}
                className="rounded-full bg-myunila px-8 py-2.5 font-medium text-white shadow-lg transition-all hover:bg-myunila-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-myunila-400"
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

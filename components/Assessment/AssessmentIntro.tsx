"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  ClipboardList,
  FileQuestion,
  BookOpen,
  Download,
  ArrowRight,
} from "lucide-react";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";

const AssessmentIntro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { clear, goTo } = useAssessmentFlow();

  const handleLogin = () => {
    try {
      const appKey = process.env.NEXT_PUBLIC_APP_KEY;
      const redirectUrl = encodeURIComponent(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/sso/callback`
      );

      if (!appKey || !redirectUrl) {
        toast.error("Konfigurasi aplikasi belum lengkap!");
        return;
      }

      window.location.href = `https://akses.unila.ac.id/api/live/v1/auth/login/sso?app_key=${appKey}`;
    } catch (error) {
      console.error("Error saat login:", error);
      toast.error("Terjadi kesalahan saat memulai login.");
    }
  };

  const handleStartAssessment = async () => {
    setIsLoading(true);
    try {
      clear?.();
      goTo?.("start");
    } catch (error) {
      console.error("Error di handleStartAssessment:", error);
      toast.error("Gagal memulai asesmen. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const instructions = [
    {
      icon: <FileQuestion className="h-12 w-12 text-myunila sm:h-14 sm:w-14 md:h-16 md:w-16" />,
      text: "Asesmen Talenta Mahasiswa terdiri dari 2 bagian utama, yaitu **Bidang Karier Ideal (40 pertanyaan)** dan **Pola Perilaku (36 pertanyaan)**.",
    },
    {
      icon: <BookOpen className="h-12 w-12 text-myunila sm:h-14 sm:w-14 md:h-16 md:w-16" />,
      text: "Setiap bagian memiliki instruksi dan cara pengerjaan masing-masing, jadi pastikan kamu membacanya dengan cermat sebelum memulai.",
    },
    {
      icon: <Download className="h-12 w-12 text-myunila sm:h-14 sm:w-14 md:h-16 md:w-16" />,
      text: "Setelah menyelesaikan semua bagian asesmen, kamu bisa langsung melihat dan mengunduh hasilnya sebagai panduan pengembangan diri dan kariermu.",
    },
  ];

  return (
    <section
      id="about"
      className="pb-20 pt-24 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]"
    >
      <div className="container mx-auto px-8 md:px-16 lg:px-32">
        <div className="flex flex-col items-center justify-center gap-8 text-center">
          <div>
            <h1 className="mb-4 text-2xl font-bold leading-tight text-black dark:text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Asesmen Talenta Mahasiswa
            </h1>
            <div className="mb-3 md:mb-8 flex items-center justify-center gap-2 text-myunila">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6" />
              <h2 className="text-base font-semibold sm:text-lg md:text-xl">
                Petunjuk Pengisian Asesmen
              </h2>
            </div>
          </div>

          {/* Instruksi */}
          <div className="grid w-full gap-6 lg:grid-cols-3">
            {instructions.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-2xl border border-myunila bg-myunila-50 p-5 text-sm text-gray-700 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 sm:p-6 md:text-base"
              >
                <div className="mb-3">{item.icon}</div>
                <p
                  className="text-center leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: item.text.replace(
                      /\*\*(.*?)\*\*/g,
                      "<span class='text-myunila font-semibold'>$1</span>"
                    ),
                  }}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 md:mt-8">
            <button
              onClick={handleStartAssessment}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-full bg-myunila px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-myunila-700 dark:hover:bg-myunila-400"
            >
              {isLoading ? "Memuat..." : "Mulai Asesmen"}
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AssessmentIntro;

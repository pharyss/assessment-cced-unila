"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";

export default function AssessmentPage() {
  const title = "Asesmen Talenta Mahasiswa";

  const rules = [
    "Asesmen Talenta Mahasiswa terdiri dari 2 bagian utama:",
    "1. Bidang Karier Ideal (40 pertanyaan)",
    "2. Pola Perilaku (36 pertanyaan)",
    "Setiap bagian memiliki instruksi dan cara pengerjaan masing-masing, jadi pastikan kamu membacanya dengan cermat sebelum memulai.",
    "Setelah menyelesaikan semua bagian asesmen, kamu bisa langsung melihat dan mengunduh hasilnya sebagai panduan pengembangan diri dan kariermu.",
    "Selamat mengerjakan!",
  ];

  const [isLoading, setIsLoading] = useState(false);
  const { clear, goTo } = useAssessmentFlow();

   const handleLogin = () => {
    const appKey = process.env.NEXT_PUBLIC_APP_KEY;
    const redirectUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/sso/callback`);
    window.location.href = `https://akses.unila.ac.id/api/live/v1/auth/login/sso?app_key=${appKey}`;
  };

  const handleStartAssessment = async () => {
    setIsLoading(true);
    try {
      clear?.();
      goTo?.("start");
      toast.success("Mulai asesmen baru!");
    } catch (error) {
      console.error("Error di handleStartAssessment:", error);
      toast.error("Gagal memulai asesmen. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main role="main" className="container">
      <section id="about" className="pt-16 md:pt-20 lg:pt-28">
        <div className="border-b border-body-color/[.15] pb-16 pt-20 dark:border-white/[.15] md:pb-20 lg:pb-28">
          <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:gap-x-16">
            
            <div className="w-full px-2 lg:w-1/2">
              <div className="mx-auto max-w-[700px] text-center sm:text-left xl:mx-0" data-wow-delay=".2s">
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl md:text-5xl">
                  {title}
                </h1>

                <div className="mb-4 flex items-center gap-2 text-primary">
                  <ClipboardList className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Petunjuk Pengisian Asesmen</h2>
                </div>

                <ul className="mb-8 list-inside list-disc space-y-2 text-left text-base text-body-color dark:text-body-color-dark">
                  {rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>

                <div className="flex flex-col items-center sm:flex-row sm:justify-start sm:space-x-4">
                  <button onClick={handleLogin} className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-colors duration-300 hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    Mulai Asesmen
                    <ArrowRight className="h-5 w-5" />
                  </button> 
                </div>
              </div>
            </div>

            {/* --- RIGHT SECTION (IMAGE) --- */}
           <div className="relative mx-auto max-w-[500px]">
            <Image
              src="/images/assessment/assessment-details.png"
              alt="Ilustrasi asesmen talenta mahasiswa menampilkan grafik dan analisis karier"
              width={500}
              height={480} // sesuaikan dengan rasio asli gambar
              priority
              className="rounded-lg object-cover drop-shadow-three dark:drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
          />
          </div>


          </div>
        </div>
      </section>
    </main>
  );
}

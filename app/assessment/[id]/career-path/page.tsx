"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function CareerPathPage() {
  const router = useRouter();
  const { id } = useParams();

  const handleStart = () => {
    router.push(`/assessment/${id}/career-path/fill`);
  };

  return (
    <section
      className="relative z-10 overflow-hidden 
      pb-12 pt-24 
      md:pb-16 md:pt-32 
      lg:pb-20 lg:pt-40 
      bg-gradient-to-b from-blue-50 to-blue-100 
      dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container px-4 md:px-6 lg:px-8">
        <div
          className="mx-auto max-w-[800px] rounded-md 
          bg-white dark:bg-gray-800 
          shadow-xl border border-gray-200 dark:border-gray-700 
          p-6 sm:p-8 md:p-12 text-gray-700 dark:text-gray-200"
        >
          {/* Judul */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary mb-6">
            Bidang Karir Ideal
          </h1>

          {/* Deskripsi */}
          <p className="mb-4 text-justify">
            Bagian ini membantumu memahami{" "}
            <strong>kecenderungan bidang karir yang paling ideal </strong>
            berdasarkan <strong>minat dan karakteristik dirimu</strong>. 
            Terdapat <strong>40 soal</strong> yang terbagi menjadi dua subbagian.
          </p>

          <ul className="list-disc pl-6 space-y-3 mb-6 text-sm sm:text-base">
            <li>
              <strong>Minat Karir (12 situasi)</strong> — Pilih satu respon yang
              paling kamu sukai atau paling mungkin kamu lakukan dari empat
              pilihan yang tersedia. Pilihlah yang paling <em>“aku banget”</em>{" "}
              agar hasilnya akurat.
            </li>
            <li>
              <strong>Karakteristik Diri (28 situasi)</strong> — Pilih satu dari
              dua opsi yang paling sesuai dengan karaktermu. Tidak ada jawaban
              benar atau salah.
            </li>
          </ul>

          <p className="italic text-center mb-8">
            Semakin jujur kamu menjawab, semakin akurat hasil yang kamu peroleh.
          </p>

          {/* Tombol Mulai */}
          <div className="flex justify-center">
            <button
              onClick={handleStart}
              className="flex items-center gap-2 
              rounded-full bg-primary text-white 
              px-6 py-3 md:px-8 md:py-4 
              text-sm sm:text-base font-semibold 
              hover:bg-primary/90 transition"
            >
              Mulai Asesmen
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

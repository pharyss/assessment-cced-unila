"use client";

import { AlertCircle } from "lucide-react";

interface StartPageErrorProps {
  errorMessage: string;
}

export default function StartPageError({ errorMessage }: StartPageErrorProps) {
  const handleReload = () => window.location.reload();

  return (
    <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
      <div className="container mx-auto w-full max-w-[720px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-10 md:p-12">
        {/* Title */}
        <h3 className="mb-4 text-center text-2xl font-bold text-black dark:text-white md:text-3xl">
          Mulai Asesmen Talenta
        </h3>

        {/* Subtitle */}
        <div className="mb-10 flex items-center justify-center">
          <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
          <p className="w-full text-center text-base font-medium text-gray-700 dark:text-gray-300 sm:px-6">
            Lengkapi identitasmu sebelum memulai asesmen
          </p>
          <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
        </div>

        {/* Error State */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
          <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400" />

          <p className="mt-4 text-center font-semibold text-danger dark:text-danger">
            Gagal memuat data formulir
          </p>

          <p className="mt-2 text-center text-sm text-danger dark:text-danger">
            {errorMessage}
          </p>

          <button
            onClick={handleReload}
            className="mt-4 rounded-full bg-myunila px-8 py-3 text-base font-medium text-white transition duration-300 hover:bg-myunila-700 hover:shadow-btn-hover md:block md:px-9 lg:px-6 xl:px-9"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    </section>
  );
}

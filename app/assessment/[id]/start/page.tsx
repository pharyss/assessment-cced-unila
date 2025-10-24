"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import toast from "react-hot-toast";

export default function StartPage() {
  const { id } = useParams() as { id: string };
  const { answers, saveAnswer, next } = useAssessmentFlow(id);

  const [npm, setNpm] = useState(answers.npm ?? "");
  const [email, setEmail] = useState(answers.email ?? "");

  useEffect(() => {
    setNpm(answers.npm ?? "");
    setEmail(answers.email ?? "");
  }, [answers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(npm)) {
      toast.error("Isi NPM dengan benar (10 digit angka).", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Format email tidak valid.", {
        duration: 4000,
        position: "top-center",
      });
      return;
    }

    saveAnswer("npm", npm);
    saveAnswer("email", email);

    toast.success("Identitas berhasil disimpan! Memulai asesmen...", {
      duration: 2000,
      position: "top-center",
    });

    next();
  };

  return (
    <section className="relative z-10 overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40 bg-gradient-to-b from-blue-50 to-blue-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="mx-auto max-w-[600px] rounded-md bg-white dark:bg-gray-800 p-10 shadow-lg sm:p-[60px]">
          <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Mulai Asesmen
          </h3>
          <p className="mb-8 text-center text-base font-medium text-body-color">
            Lengkapi identitasmu untuk memulai asesmen
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="mb-2 block text-sm text-dark dark:text-white">
                NPM
              </label>
              <input
                type="text"
                value={npm}
                onChange={(e) =>
                  setNpm(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="Masukkan NPM (10 digit)"
                className="w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary"
              />
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-sm text-dark dark:text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan Email Aktif"
                className="w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-full bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
            >
              Lanjut ke Pertanyaan
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";

export default function StartPage() {
  const { id } = useParams() as { id: string };
  const { answers, saveAnswer, next } = useAssessmentFlow(id);

  const [npm, setNpm] = useState<string>(answers.npm ?? "");
  const [email, setEmail] = useState<string>(answers.email ?? "");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setNpm(answers.npm ?? "");
    setEmail(answers.email ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(npm)) {
      setError("Isi NPM dengan benar (10 digit angka).");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    saveAnswer("npm", npm);
    saveAnswer("email", email);

    next();
  };

  return (
    <section className="relative z-10 overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40 bg-gradient-to-b from-blue-50 to-blue-100 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <div className="shadow-three mx-auto max-w-[600px] rounded-md bg-white px-6 py-10 dark:bg-gray-dark shadow-lg sm:p-[60px]">
              <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Mulai Asesmen
              </h3>
              <div className="mb-8 flex items-center justify-center">
                <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
                <p className="w-full px-5 text-center text-base font-medium text-body-color">
                  Lengkapi identitasmu untuk memulai asesmen
                </p>
                <span className="hidden h-[1px] w-full max-w-[70px] bg-body-color/50 sm:block"></span>
              </div>

              <form onSubmit={handleSubmit}>
                {/* NPM */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm text-dark dark:text-white">
                    NPM
                  </label>
                  <input
                    type="text"
                    name="npm"
                    value={npm}
                    onChange={(e) =>
                      setNpm(e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                    placeholder="Masukkan NPM (10 digit)"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                {/* Email */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm text-dark dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan Email Aktif"
                    className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none transition-all duration-300 focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                  />
                </div>

                {error && (
                  <div className="mb-4 text-center text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    className="shadow-submit dark:shadow-submit-dark flex w-full items-center justify-center rounded-full bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90"
                  >
                    Lanjut ke Pertanyaan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

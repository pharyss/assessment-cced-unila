"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface FormData {
  nama: string;
  npm: string;
  email: string;
}

export default function StartPage() {
  const router = useRouter();
  const { answers, saveAnswer, next, currentStep } = useAssessmentFlow();

  const [formData, setFormData] = useState<FormData>({
    nama: answers.nama ?? "",
    npm: answers.npm ?? "",
    email: answers.email ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [namaError, setNamaError] = useState("");
  const [npmError, setNpmError] = useState("");
  const [emailError, setEmailError] = useState("");

  const namaRef = useRef<HTMLInputElement>(null);
  const npmRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  /* ------------------ Inisialisasi ------------------ */
  useEffect(() => {
    setFormData({
      nama: answers.nama ?? "",
      npm: answers.npm ?? "",
      email: answers.email ?? "",
    });
  }, [answers]);

  useEffect(() => {
    if (currentStep === "start" && namaRef.current) namaRef.current.focus();
  }, [currentStep]);

  /* ------------------ Validasi Input ------------------ */
  const validateNama = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setNamaError("Nama tidak boleh kosong.");
      return false;
    }
    setNamaError("");
    return true;
  }, []);

  const validateNpm = useCallback((value: string): boolean => {
    const trimmed = value.trim().replace(/\D/g, "");
    if (trimmed.length !== 10) {
      setNpmError("NPM harus tepat 10 digit angka (contoh: 2023100001).");
      return false;
    }
    setNpmError("");
    return true;
  }, []);

  const validateEmail = useCallback((value: string): boolean => {
    const trimmed = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Format email tidak valid.");
      return false;
    }
    setEmailError("");
    return true;
  }, []);

  /* ------------------ Handler Perubahan ------------------ */
  const handleNamaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, nama: value }));
    if (value.trim().length > 1) validateNama(value);
  }, [validateNama]);

  const handleNpmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, npm: value }));
    if (value.length === 10) validateNpm(value);
  }, [validateNpm]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, email: value }));
    if (value.includes("@")) validateEmail(value);
  }, [validateEmail]);

  /* ------------------ Handler Blur ------------------ */
  const handleNamaBlur = useCallback(() => {
    if (validateNama(formData.nama)) saveAnswer("nama", formData.nama);
  }, [formData.nama, validateNama, saveAnswer]);

  const handleNpmBlur = useCallback(() => {
    if (validateNpm(formData.npm)) saveAnswer("npm", formData.npm);
  }, [formData.npm, validateNpm, saveAnswer]);

  const handleEmailBlur = useCallback(() => {
    if (validateEmail(formData.email)) saveAnswer("email", formData.email);
  }, [formData.email, validateEmail, saveAnswer]);

  /* ------------------ Submit ------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validNama = validateNama(formData.nama);
    const validNpm = validateNpm(formData.npm);
    const validEmail = validateEmail(formData.email);

    if (!validNama || !validNpm || !validEmail) {
      toast.error("Periksa kembali data identitas Anda.", { duration: 4000 });
      setIsSubmitting(false);
      if (!validNama && namaRef.current) namaRef.current.focus();
      return;
    }

    try {
      saveAnswer("nama", formData.nama);
      saveAnswer("npm", formData.npm);
      saveAnswer("email", formData.email);

      next();
      setTimeout(() => router.push("/assessment/talenta-mahasiswa/career-path"), 600);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Gagal menyimpan data. Coba lagi.", { duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ------------------ Status Lengkap ------------------ */
  const isDataComplete = useMemo(
    () =>
      !namaError &&
      !npmError &&
      !emailError &&
      formData.nama.trim().length > 1 &&
      formData.npm.length === 10 &&
      formData.email.includes("@"),
    [namaError, npmError, emailError, formData]
  );

  return (
    <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-20 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
      <div className="container">
        <div className="mx-auto max-w-[600px] rounded-md border border-gray-200 bg-white p-6 transition-all duration-300 dark:border-gray-700 dark:bg-gray-900 sm:p-10">
          <h3 className="mb-3 text-center text-2xl font-bold text-myunila dark:text-white sm:text-3xl">
            Mulai Asesmen Talenta
          </h3>
          <div className="mb-8 flex items-center justify-center">
          <span className="hidden h-[1px] w-full max-w-[80px] bg-gray-300 dark:bg-gray-700 sm:block" />
          <p className="w-full px-5 text-center text-base font-medium text-gray-700 dark:text-gray-300">
            Lengkapi identitasmu sebelum memulai asesmen
          </p>
          <span className="hidden h-[1px] w-full max-w-[80px] bg-gray-300 dark:bg-gray-700 sm:block" />
        </div>

          <form onSubmit={handleSubmit} role="form" aria-label="Form identitas asesmen">
            {/* Nama */}
            <div className="mb-6">
              <label
                htmlFor="nama"
                className="mb-2 block text-base font-medium text-gray-800 dark:text-gray-200"
              >
                Nama
              </label>
              <input
                ref={namaRef}
                id="nama"
                type="text"
                value={formData.nama}
                onChange={handleNamaChange}
                onBlur={handleNamaBlur}
                placeholder="Masukkan nama lengkap"
                disabled={isSubmitting}
                required
                aria-invalid={!!namaError}
                aria-describedby={namaError ? "nama-error" : undefined}
                className={`w-full rounded-md border px-6 py-3 text-base outline-none transition-all duration-300 focus:border-myunila focus-visible:ring-2 focus-visible:ring-myunila-500 dark:border-transparent dark:bg-[#2C303B] dark:text-white ${
                  namaError
                    ? "border-danger focus:border-danger"
                    : "border-gray-300 focus:border-myunila"
                }`}
              />
              {namaError && (
                <p id="nama-error" className="mt-1 text-xs text-danger">
                  {namaError}
                </p>
              )}
            </div>

            {/* NPM */}
            <div className="mb-6">
              <label
                htmlFor="npm"
                className="mb-2 block text-base font-medium text-gray-800 dark:text-gray-200"
              >
                NPM
              </label>
              <input
                ref={npmRef}
                id="npm"
                type="text"
                value={formData.npm}
                onChange={handleNpmChange}
                onBlur={handleNpmBlur}
                placeholder="Masukkan NPM (10 digit)"
                maxLength={10}
                disabled={isSubmitting}
                required
                aria-invalid={!!npmError}
                aria-describedby={npmError ? "npm-error" : undefined}
               className={`w-full rounded-md border px-6 py-3 text-base outline-none transition-all duration-300 focus:border-myunila focus-visible:ring-2 focus-visible:ring-myunila-500 dark:border-transparent dark:bg-[#2C303B] dark:text-white ${
                  namaError
                    ? "border-danger focus:border-danger"
                    : "border-gray-300 focus:border-myunila"
                }`}
              />
              {npmError && (
                <p id="npm-error" className="mt-1 text-xs text-danger">
                  {npmError}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-2 block text-base font-medium text-gray-800 dark:text-gray-200"
              >
                Email
              </label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                value={formData.email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                placeholder="Masukkan email aktif"
                disabled={isSubmitting}
                required
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "email-error" : undefined}
                className={`w-full rounded-md border px-6 py-3 text-base outline-none transition-all duration-300 focus:border-myunila focus-visible:ring-2 focus-visible:ring-myunila-500 dark:border-transparent dark:bg-[#2C303B] dark:text-white ${
                  namaError
                    ? "border-danger focus:border-danger"
                    : "border-gray-300 focus:border-myunila"
                }`}
              />
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-danger">
                  {emailError}
                </p>
              )}
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !isDataComplete}
              className="flex w-full items-center justify-center rounded-full bg-myunila px-9 py-4 text-base font-medium text-white duration-300 hover:bg-myunila-700 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-myunila-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Lanjut ke Pertanyaan"
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

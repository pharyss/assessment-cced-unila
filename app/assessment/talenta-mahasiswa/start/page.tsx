"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface FormData {
  npm: string;
  email: string;
}

const toastInfo = (message: string, duration: number = 3000) => {
  toast(message, {
    duration,
    style: {
      background: "#3b82f6",
      color: "#fff",
      padding: "12px 16px",
      borderRadius: "8px",
      fontSize: "14px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#3b82f6",
    },
    icon: "ℹ️",
    className: "!dark:bg-gray-800 !dark:text-white",
  });
};

export default function StartPage() {
  const router = useRouter();
  const assessmentFlow = useAssessmentFlow();

  const { answers, saveAnswer, next, currentStep } = assessmentFlow || {
    answers: { npm: "", email: "" },
    saveAnswer: () => {},
    next: () => {},
    currentStep: "start",
  };

  const [formData, setFormData] = useState<FormData>({
    npm: answers.npm ?? "",
    email: answers.email ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [npmError, setNpmError] = useState("");
  const [emailError, setEmailError] = useState("");

  const npmRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({ npm: answers.npm ?? "", email: answers.email ?? "" });
  }, [answers]);

  useEffect(() => {
    if (currentStep === "start" && npmRef.current) npmRef.current.focus();
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== "start") {
      router.replace("/assessment/talenta-mahasiswa/career-path");
      return;
    }

    return () => {
      setNpmError("");
      setEmailError("");
    };
  }, [answers, currentStep, router, isSubmitting]);

  const validateNpm = useCallback((value: string): boolean => {
    const trimmed = value.trim().replace(/\D/g, "");
    if (trimmed.length !== 10) {
      setNpmError("NPM harus tepat 10 digit angka (contoh: 2023100001).");
      return false;
    }
    setNpmError("");
    return true;
  }, []);

  // Validasi format email
  const validateEmail = useCallback((value: string): boolean => {
    const trimmed = value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Format email tidak valid.");
      return false;
    }
    setEmailError("");
    return true;
  }, []);

  const handleNpmChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, npm: value }));
      if (value.length === 10) validateNpm(value);
    },
    [validateNpm]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, email: value }));
      if (value.includes("@")) validateEmail(value);
    },
    [validateEmail]
  );

  const handleNpmBlur = useCallback(() => {
    if (validateNpm(formData.npm)) saveAnswer("npm", formData.npm);
  }, [formData.npm, validateNpm, saveAnswer]);

  const handleEmailBlur = useCallback(() => {
    if (validateEmail(formData.email)) saveAnswer("email", formData.email);
  }, [formData.email, validateEmail, saveAnswer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validNpm = validateNpm(formData.npm);
    const validEmail = validateEmail(formData.email);

    if (!validNpm || !validEmail) {
      toast.error("Periksa kembali NPM dan email Anda.", { duration: 4000 });
      setIsSubmitting(false);
      if (!validNpm && npmRef.current) npmRef.current.focus();
      return;
    }

    try {
      saveAnswer("npm", formData.npm);
      saveAnswer("email", formData.email);
      toast.success("Data berhasil disimpan! Mulai asesmen...", {
        duration: 2000,
      });
      next();
      setTimeout(
        () => router.push("/assessment/talenta-mahasiswa/career-path"),
        500
      );
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Gagal menyimpan data. Coba lagi.", { duration: 4000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDataComplete = useMemo(
    () =>
      !npmError &&
      !emailError &&
      formData.npm.length === 10 &&
      formData.email.includes("@"),
    [npmError, emailError, formData]
  );

  return (
    <section className="relative z-10 overflow-hidden pb-12 pt-28 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container">
        <div className="mx-auto max-w-[600px] rounded-md bg-white dark:bg-gray-800 p-10 shadow-lg sm:p-[60px]">
          <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
            Mulai Asesmen
          </h3>
          <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
            Lengkapi identitasmu untuk memulai asesmen
          </p>

          <form
            onSubmit={handleSubmit}
            role="form"
            aria-label="Form identitas asesmen"
          >
            <div className="mb-6">
              <label
                htmlFor="npm"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                NPM <span aria-hidden="true">*</span>
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
                className={`w-full rounded-md border px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-transparent dark:bg-[#2C303B] dark:text-white ${
                  npmError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
              />
              {npmError && (
                <p id="npm-error" className="mt-1 text-xs text-red-500">
                  {npmError}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-dark dark:text-white"
              >
                Email <span aria-hidden="true">*</span>
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
                className={`w-full rounded-md border px-6 py-3 text-base outline-none transition-all duration-300 focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/50 dark:border-transparent dark:bg-[#2C303B] dark:text-white ${
                  emailError
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
              />
              {emailError && (
                <p id="email-error" className="mt-1 text-xs text-red-500">
                  {emailError}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isDataComplete}
              className="flex w-full items-center justify-center rounded-full bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Memproses...
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

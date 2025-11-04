"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Select from "react-select";
import { Faculties, StudyProgramsByFaculty } from "@/data/StudyPrograms";

interface FormData {
  nama: string;
  npm: string;
  email: string;
  angkatan: string;
  fakultas: string;
  prodi: string;
}

export default function StartPage() {
  const router = useRouter();
  const { answers, saveAnswer, next, currentStep } = useAssessmentFlow();

  const [formData, setFormData] = useState<FormData>({
    nama: answers.nama ?? "",
    npm: answers.npm ?? "",
    email: answers.email ?? "",
    angkatan: answers.angkatan ?? "",
    fakultas: answers.fakultas ?? "",
    prodi: answers.prodi ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<keyof FormData, string>>({
    nama: "",
    npm: "",
    email: "",
    angkatan: "",
    fakultas: "",
    prodi: "",
  });

  const refs = {
    nama: useRef<HTMLInputElement>(null),
    npm: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    angkatan: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (currentStep === "start" && refs.nama.current) refs.nama.current.focus();
  }, [currentStep]);

  const validateField = useCallback((field: keyof FormData, value: string) => {
    let msg = "";
    switch (field) {
      case "nama":
        if (!value.trim()) msg = "Nama tidak boleh kosong";
        break;
      case "npm":
        if (value.trim().replace(/\D/g, "").length !== 10)
          msg = "NPM harus 10 digit";
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          msg = "Email tidak valid";
        break;
      case "angkatan":
        if (value.trim().replace(/\D/g, "").length !== 4)
          msg = "Angkatan harus 4 digit";
        break;
      case "fakultas":
      case "prodi":
        if (!value) msg = "Harap pilih opsi";
        break;
    }
    setErrors((p) => ({ ...p, [field]: msg }));
    return msg === "";
  }, []);

  const handleChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((p) => {
        const newData = { ...p, [field]: value };
        if (field === "fakultas") newData.prodi = "";
        return newData;
      });
      if (errors[field]) validateField(field, value);
    },
    [errors, validateField],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const valid = Object.entries(formData).every(([k, v]) =>
      validateField(k as keyof FormData, v),
    );

    if (!valid) {
      toast.error("Periksa kembali data identitas Anda.");
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedAnswers = { ...answers, ...formData };
      next(updatedAnswers);
    } catch (error) {
      console.error("Error saat menyimpan:", error);
      toast.error("Gagal menyimpan data. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDataComplete = useMemo(
    () =>
      Object.values(errors).every((v) => !v) &&
      formData.nama.trim() &&
      formData.npm.length === 10 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.angkatan.length === 4 &&
      formData.fakultas &&
      formData.prodi,
    [errors, formData],
  );

  return (
    <section className="relative z-10 bg-gradient-to-b from-white via-myunila-50 to-myunila-100 pb-20 pt-24 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 sm:pb-24 sm:pt-32 md:pb-[120px] md:pt-[150px]">
      <div className="container mx-auto w-full max-w-[720px] rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 sm:p-10 md:p-12">
        <h3 className="mb-4 text-center text-2xl font-bold text-black dark:text-white md:text-3xl">
          Mulai Asesmen Talenta
        </h3>

        <div className="mb-10 flex items-center justify-center">
          <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
          <p className="w-full text-center text-base font-medium text-gray-700 dark:text-gray-300 sm:px-6">
            Lengkapi identitasmu sebelum memulai asesmen
          </p>
          <span className="hidden h-[1px] w-full max-w-[50px] bg-gray-300 dark:bg-gray-700 sm:block" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 sm:gap-8">
          {/* Baris 1 */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
            <InputField
              label="Nama"
              value={formData.nama}
              onChange={(v) => handleChange("nama", v)}
              onBlur={() => validateField("nama", formData.nama)}
              error={errors.nama}
              ref={refs.nama}
              placeholder="Masukkan nama lengkap"
              disabled={isSubmitting}
            />
            <InputField
              label="Email"
              value={formData.email}
              onChange={(v) => handleChange("email", v)}
              onBlur={() => validateField("email", formData.email)}
              error={errors.email}
              ref={refs.email}
              placeholder="Masukkan email"
              disabled={isSubmitting}
            />
          </div>

          {/* Baris 2 */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
            <InputField
              label="NPM"
              value={formData.npm}
              onChange={(v) =>
                handleChange("npm", v.replace(/\D/g, "").slice(0, 10))
              }
              onBlur={() => validateField("npm", formData.npm)}
              error={errors.npm}
              ref={refs.npm}
              placeholder="Masukkan NPM"
              disabled={isSubmitting}
            />
            <InputField
              label="Angkatan"
              value={formData.angkatan}
              onChange={(v) =>
                handleChange("angkatan", v.replace(/\D/g, "").slice(0, 4))
              }
              onBlur={() => validateField("angkatan", formData.angkatan)}
              error={errors.angkatan}
              ref={refs.angkatan}
              placeholder="Contoh: 2023"
              disabled={isSubmitting}
            />
          </div>

          {/* Baris 3 */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
            <SelectField
              label="Fakultas"
              value={formData.fakultas}
              onChange={(v) => handleChange("fakultas", v)}
              error={errors.fakultas}
              options={Faculties}
              disabled={isSubmitting}
            />
            <SelectField
              label="Program Studi"
              value={formData.prodi}
              onChange={(v) => handleChange("prodi", v)}
              error={errors.prodi}
              options={
                formData.fakultas
                  ? StudyProgramsByFaculty[formData.fakultas]
                  : []
              }
              disabled={isSubmitting || !formData.fakultas}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isDataComplete}
            className={`flex w-full items-center justify-center rounded-full
              bg-myunila px-8 py-4 text-base font-semibold text-white shadow-md transition
              hover:bg-myunila-700 focus:ring-2 focus:ring-myunila-500 disabled:cursor-not-allowed disabled:opacity-60
              dark:shadow-submit-dark`}
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
    </section>
  );
}

/* ---------- Input Field ---------- */
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  ref?: React.RefObject<HTMLInputElement | null>;
}

const InputField = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  disabled,
  ref,
}: InputFieldProps) => (
  <div className="flex w-full flex-col">
    <label className="mb-2 block text-base font-medium text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-lg border px-4 py-3 text-base outline-none transition
        focus:border-myunila focus:ring-2 focus:ring-myunila
        dark:border-gray-700 dark:bg-gray-800 dark:text-white
        ${error ? "border-danger focus:ring-danger" : "border-gray-300"}`}
    />
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
  </div>
);

/* ---------- Select Field ---------- */
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options: readonly string[];
  disabled?: boolean;
}

const SelectField = ({
  label,
  value,
  onChange,
  error,
  options,
  disabled,
}: SelectFieldProps) => (
  <div className="flex w-full flex-col">
    <label className="mb-2 block text-base font-medium text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <Select
      value={value ? { label: value, value } : null}
      onChange={(opt) => onChange(opt?.value ?? "")}
      options={options.map((o: string) => ({ label: o, value: o }))}
      isDisabled={disabled}
      placeholder={`Pilih ${label.toLowerCase()}`}
      className="text-base dark:bg-gray-800 dark:text-white"
      styles={{
        control: (base, state) => ({
          ...base,
          borderRadius: 8,
          height: 48,
          borderColor: error
            ? "#EF4444"
            : state.isFocused
              ? "#085EA8"
              : "#d1d5db",
          boxShadow: state.isFocused ? "0 0 0 1px #085EA8" : "none",
          backgroundColor: disabled ? "#f9fafb" : "white",
        }),
      }}
    />
    {error && <p className="mt-1 text-xs text-danger">{error}</p>}
  </div>
);

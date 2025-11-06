"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import Select from "react-select";
import { StudentFilters, Student, TestSubmission } from "@/types/api";
import { studentsApi, resultsApi, ApiError } from "@/lib/api-client";
import {
  ASSESSMENT_STORAGE_KEY,
  TEST_IDS,
  ASSESSMENT_ROUTES,
} from "@/lib/constants";

interface FormData {
  nama: string;
  npm: string;
  email: string;
  angkatan: string;
  fakultas: string;
  prodi: string;
  jenjang: string;
}

interface StartAssessmentFormProps {
  filters: StudentFilters;
}

export default function StartAssessmentForm({
  filters,
}: StartAssessmentFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    nama: "",
    npm: "",
    email: "",
    angkatan: "",
    fakultas: "",
    prodi: "",
    jenjang: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<keyof FormData, string>>({
    nama: "",
    npm: "",
    email: "",
    angkatan: "",
    fakultas: "",
    prodi: "",
    jenjang: "",
  });

  const refs = {
    nama: useRef<HTMLInputElement>(null),
    npm: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
  };

  useEffect(() => {
    if (refs.nama.current) refs.nama.current.focus();
  }, []);

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
      case "fakultas":
      case "prodi":
      case "jenjang":
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

    // REQUIREMENT 2.0: Clear localStorage FIRST before anything else
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    console.log("✓ Cleared localStorage");

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
      // Find the IDs from filters
      const enrollmentYear = filters?.enrollmentYears.find(
        (item) => item.name === formData.angkatan,
      );
      const faculty = filters?.faculties.find(
        (item) => item.name === formData.fakultas,
      );
      const major = filters?.majors.find(
        (item) => item.name === formData.prodi,
      );
      const degree = filters?.degrees.find(
        (item) => item.name === formData.jenjang,
      );

      if (!enrollmentYear || !faculty || !major || !degree) {
        toast.error("Data filter tidak valid. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      // REQUIREMENT 2.1: Upsert student (POST /students)
      const studentData = {
        npm: formData.npm,
        name: formData.nama,
        email: formData.email,
        enrollmentYearId: enrollmentYear.id,
        majorId: major.id,
        facultyId: faculty.id,
        degreeId: degree.id,
      };

      const upsertResponse = await studentsApi.createStudent(studentData);

      if (upsertResponse.status !== "success" || !upsertResponse.data) {
        toast.error("Gagal menyimpan data mahasiswa");
        setIsSubmitting(false);
        return;
      }

      const student = upsertResponse.data as Student;
      console.log("✓ Upserted student:", student.id);

      // REQUIREMENT 2.2: Fetch student with submissions (GET /students/{npm})
      const fetchResponse = await studentsApi.getStudentByNpm(formData.npm);

      if (fetchResponse.status !== "success" || !fetchResponse.data) {
        toast.error("Gagal mengambil data mahasiswa");
        setIsSubmitting(false);
        return;
      }

      const studentWithSubmissions = fetchResponse.data as any;
      console.log("✓ Fetched student with submissions");

      // Check for in_progress submission
      let submission: TestSubmission | null = null;
      if (
        studentWithSubmissions.submissions &&
        Array.isArray(studentWithSubmissions.submissions)
      ) {
        submission =
          studentWithSubmissions.submissions.find(
            (sub: TestSubmission) =>
              sub.testId === TEST_IDS.TALENTA_MAHASISWA &&
              sub.status === "in_progress",
          ) || null;

        if (submission) {
          console.log("✓ Found in_progress submission:", submission.id);
          toast.success("Melanjutkan tes yang sedang berlangsung...");
        }
      }

      // REQUIREMENT 2.3: Create new submission if none in_progress
      if (!submission) {
        const submissionData = {
          studentId: student.id,
          testId: TEST_IDS.TALENTA_MAHASISWA,
          status: "in_progress" as const,
          completedAt: null,
        };

        const createResponse =
          await resultsApi.createTestSubmission(submissionData);

        if (createResponse.status !== "success" || !createResponse.data) {
          toast.error("Gagal membuat submission test");
          setIsSubmitting(false);
          return;
        }

        submission = createResponse.data as TestSubmission;
        console.log("✓ Created new submission:", submission.id);
        toast.success("Data berhasil disimpan!");
      }

      // Save submission data to localStorage
      const submissionInfo = {
        studentId: student.id,
        testSubmissionId: submission.id,
        nama: formData.nama,
        npm: formData.npm,
        email: formData.email,
        angkatan: formData.angkatan,
        fakultas: formData.fakultas,
        prodi: formData.prodi,
        jenjang: formData.jenjang,
      };

      localStorage.setItem(
        ASSESSMENT_STORAGE_KEY,
        JSON.stringify(submissionInfo),
      );
      console.log("✓ Saved submission info to localStorage");

      // REQUIREMENT 3: Navigate to career-path
      // Verify data is saved before navigation
      const savedData = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
      if (savedData) {
        console.log("✓ Verified localStorage data before navigation");
        router.push(ASSESSMENT_ROUTES.CAREER_PATH);
      } else {
        toast.error("Gagal menyimpan data ke browser. Coba lagi.");
        setIsSubmitting(false);
        return;
      }
    } catch (error) {
      console.error("Error saat menyimpan:", error);

      if (error instanceof ApiError) {
        if (error.errors && error.errors.length > 0) {
          error.errors.forEach((err) => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else {
          toast.error(error.message || "Gagal menyimpan data. Coba lagi.");
        }
      } else {
        toast.error("Gagal menyimpan data. Coba lagi.");
      }
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
      formData.angkatan &&
      formData.fakultas &&
      formData.prodi &&
      formData.jenjang,
    [errors, formData],
  );

  const angkatanOptions = useMemo(
    () =>
      filters?.enrollmentYears.map((item) => ({
        label: item.name,
        value: item.name,
      })) || [],
    [filters],
  );

  const fakultasOptions = useMemo(
    () =>
      filters?.faculties.map((item) => ({
        label: item.name,
        value: item.name,
      })) || [],
    [filters],
  );

  const prodiOptions = useMemo(
    () =>
      filters?.majors.map((item) => ({
        label: item.name,
        value: item.name,
      })) || [],
    [filters],
  );

  const jenjangOptions = useMemo(
    () =>
      filters?.degrees.map((item) => ({
        label: item.name,
        value: item.name,
      })) || [],
    [filters],
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
              onChange={(v: string) => handleChange("nama", v)}
              onBlur={() => validateField("nama", formData.nama)}
              error={errors.nama}
              ref={refs.nama}
              placeholder="Masukkan nama lengkap"
              disabled={isSubmitting}
            />
            <InputField
              label="Email"
              value={formData.email}
              onChange={(v: string) => handleChange("email", v)}
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
              onChange={(v: string) =>
                handleChange("npm", v.replace(/\D/g, "").slice(0, 10))
              }
              onBlur={() => validateField("npm", formData.npm)}
              error={errors.npm}
              ref={refs.npm}
              placeholder="Masukkan NPM"
              disabled={isSubmitting}
            />

            <SearchableSelectField
              id="angkatan"
              label="Angkatan"
              value={formData.angkatan}
              onChange={(v: string) => handleChange("angkatan", v)}
              error={errors.angkatan}
              options={angkatanOptions}
              disabled={isSubmitting}
              placeholder="Pilih angkatan"
            />
          </div>

          {/* Baris 3 */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
            <SearchableSelectField
              id="fakultas"
              label="Fakultas"
              value={formData.fakultas}
              onChange={(v: string) => handleChange("fakultas", v)}
              error={errors.fakultas}
              options={fakultasOptions}
              disabled={isSubmitting}
              placeholder="Pilih fakultas"
            />

            <SearchableSelectField
              id="prodi"
              label="Program Studi"
              value={formData.prodi}
              onChange={(v: string) => handleChange("prodi", v)}
              error={errors.prodi}
              options={prodiOptions}
              disabled={isSubmitting}
              placeholder="Pilih program studi"
            />
          </div>

          {/* Baris 4 - Jenjang Pendidikan */}
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
            <SearchableSelectField
              id="jenjang"
              label="Jenjang Pendidikan"
              value={formData.jenjang}
              onChange={(v: string) => handleChange("jenjang", v)}
              error={errors.jenjang}
              options={jenjangOptions}
              disabled={isSubmitting}
              placeholder="Pilih jenjang pendidikan"
            />

            <div className="w-full sm:w-1/2" />
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

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: string;
  placeholder?: string;
  disabled?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, value, onChange, onBlur, error, placeholder, disabled }, ref) => (
    <div className="w-full">
      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
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
        className="dark:border-dark-3 w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition focus:border-myunila dark:text-white dark:focus:border-myunila"
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  ),
);

interface SearchableSelectFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error: string;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
  disabled?: boolean;
}

const SearchableSelectField: React.FC<SearchableSelectFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
  disabled,
}) => (
  <div className="w-full">
    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200">
      {label}
    </label>

    <Select
      instanceId={id}
      inputId={id ? `${id}-input` : undefined}
      value={options.find((opt) => opt.value === value) || null}
      onChange={(opt) => onChange(opt?.value || "")}
      options={options}
      placeholder={placeholder}
      isDisabled={disabled}
      isClearable
      classNamePrefix="select"
      className="react-select-container"
      classNames={{
        control: () =>
          "!rounded-lg !border-stroke dark:!border-dark-3 !bg-transparent !min-h-[48px]",

        menu: () => "!rounded-lg !border !border-stroke dark:!border-dark-3",

        option: () => "!text-dark dark:!text-white",
      }}
    />

    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

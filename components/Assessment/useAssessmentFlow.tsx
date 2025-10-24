"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Answers = Record<string, any>; 

const DEFAULT_STEPS = [
  "start",
  "career-path",
  "career-path/fill",
  "behavior-pattern",
  "behavior-pattern/fill",
  "result",
] as const;

type StepName = (typeof DEFAULT_STEPS)[number];

/* ------------------------- Helper Validation ------------------------- */
const isStepComplete = (step: StepName, answers: Answers): boolean => {
  const numericKeys = Object.keys(answers)
    .filter((key) => !isNaN(Number(key)))
    .map(Number);

  switch (step) {
    case "start":
      return Boolean(answers.npm && answers.email);
    case "career-path/fill":
      return numericKeys.filter((id) => id <= 40).length >= 40;
    case "behavior-pattern/fill":
      return numericKeys.filter((id) => id >= 41 && id <= 76).length >= 36;
    case "career-path":
    case "behavior-pattern":
      return true;
    default:
      return false;
  }
};

/* ---------------------------- Main Hook ------------------------------ */
export function useAssessmentFlow() {
  const router = useRouter();
  const id = "talenta-mahasiswa";
  const storageKey = `assessment:${id}`;

  const [answers, setAnswers] = useState<Answers>({});
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [initialized, setInitialized] = useState(false);

  /* ---------------------- Initialization (1x) ---------------------- */
  useEffect(() => {
    if (initialized) return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const loadedAnswers = parsed.answers ?? {};
        let loadedIndex = parsed.stepIndex ?? 0;

        // Validasi stepIndex
        if (loadedIndex < 0 || loadedIndex >= DEFAULT_STEPS.length) loadedIndex = 0;

        // Cek step terakhir yang lengkap
        for (let i = loadedIndex; i > 0; i--) {
          const prevStep = DEFAULT_STEPS[i - 1];
          if (!isStepComplete(prevStep, loadedAnswers)) {
            loadedIndex = i - 1;  // Reset ke langkah sebelumnya jika tidak lengkap
            break;
          }
        }

        setAnswers(loadedAnswers);
        setStepIndex(loadedIndex);
        console.log("Loaded state:", { loadedIndex, loadedAnswers });  // Logging untuk debugging
      }
    } catch (err) {
      console.error("useAssessmentFlow: gagal membaca localStorage", err);
      toast.error("Terjadi kesalahan dalam memuat data. Mulai ulang asesmen.");  // Tambahkan toast untuk pengguna
      localStorage.removeItem(storageKey);
    } finally {
      setInitialized(true);
    }
  }, [initialized, storageKey]);

  /* -------------------------- Utilities ---------------------------- */
  const persist = (newAnswers: Answers, newIndex: number) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ answers: newAnswers, stepIndex: newIndex })
      );
    } catch (err) {
      console.error("useAssessmentFlow: gagal menyimpan ke storage", err);
      toast.error("Gagal menyimpan data. Periksa koneksi Anda.");  // Tambahkan toast untuk pengguna
    }
  };

  const navigate = (index: number) => {
    const stepName = DEFAULT_STEPS[index];
    setStepIndex(index);
    persist(answers, index);
    router.replace(`/assessment/${id}/${stepName}`);
  };

  /* --------------------------- Actions ----------------------------- */
  const saveAnswer = (key: string, value: any) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    persist(updated, stepIndex);
  };

  const resetToStep = (stepName: StepName) => {
    const idx = DEFAULT_STEPS.indexOf(stepName);
    if (idx === -1) return;

    const updated = { ...answers };
    if (stepName === "career-path/fill") {
      Object.keys(updated).forEach((k) => {
        if (!isNaN(Number(k)) && Number(k) <= 40) delete updated[k];
      });
    } else if (stepName === "behavior-pattern/fill") {
      Object.keys(updated).forEach((k) => {
        if (!isNaN(Number(k)) && Number(k) >= 41 && Number(k) <= 76) delete updated[k];
      });
    }

    setAnswers(updated);
    navigate(idx);
    toast.success(`Mulai ${stepName.replace("-", " ")}`);
  };

  const goTo = (stepName: StepName) => {
    const idx = DEFAULT_STEPS.indexOf(stepName);
    if (idx !== -1) navigate(idx);
  };

  const next = () => {
    const current = DEFAULT_STEPS[stepIndex];
    const isCompleteCheck = isStepComplete(current, answers); 
    console.log(`Step: ${current}, Is Complete: ${isCompleteCheck}, Answers:`, answers);  
    if (!isCompleteCheck) {
      toast.error(`Lengkapi ${current.replace("-", " ")} terlebih dahulu!`);
      return;
    }

    const nextIndex = Math.min(stepIndex + 1, DEFAULT_STEPS.length - 1);
    console.log('Maju ke step:', DEFAULT_STEPS[nextIndex]); 
    navigate(nextIndex);
    toast.success(`Maju ke ${DEFAULT_STEPS[nextIndex].replace("-", " ")}`);
  };

  const prev = () => {
    const prevIndex = Math.max(stepIndex - 1, 0);
    navigate(prevIndex);
  };

  const clear = () => {
    localStorage.removeItem(storageKey);
    setAnswers({});
    navigate(0);
    toast.success("Asesmen direset. Mulai baru.");
  };

  /* ----------------------------- Return ---------------------------- */
  return {
    answers,
    setAnswers,
    saveAnswer,
    next,
    prev,
    goTo,
    clear,
    resetToStep,
    stepIndex,
    currentStep: DEFAULT_STEPS[stepIndex],
  };
}
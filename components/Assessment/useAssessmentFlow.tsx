"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import careerPathData from "@/data/CareerPath.json";
import behaviorPatternData from "@/data/BehaviorPattern.json";

type Answers = Record<string, any>;

const DEFAULT_STEPS = ["start", "career-path", "behavior-pattern", "result"] as const;
type StepName = (typeof DEFAULT_STEPS)[number];

/* ------------------------- Helper Validation ------------------------- */
const isStepComplete = (
  step: StepName,
  answers: Answers
): boolean => {
  switch (step) {
    case "start":
      return Boolean(answers.npm && answers.email);

    case "career-path": {
      const subAKeys = careerPathData.subPartA.questions.map((q) => `A-${q.id}`);
      const subBKeys = careerPathData.subPartB.questions.map((q) => `B-${q.id}`);
      const allA = subAKeys.every((k) => answers[k] !== undefined && answers[k] !== "");
      const allB = subBKeys.every((k) => answers[k] !== undefined && answers[k] !== "");
      return allA && allB;
    }

    case "behavior-pattern": {
      const behaviorKeys = behaviorPatternData.questions.map((q) => `C-${q.id}`);
      return behaviorKeys.every((k) => answers[k] !== undefined && answers[k] !== "");
    }

    case "result":
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
  const [stepIndex, setStepIndex] = useState(0);
  const [initialized, setInitialized] = useState(false);

  /* ---------------------- Initialization ---------------------- */
  useEffect(() => {
    if (initialized) return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        const loadedAnswers = parsed.answers ?? {};
        let loadedIndex = parsed.stepIndex ?? 0;

        // Pastikan step sebelumnya lengkap
        for (let i = loadedIndex; i > 0; i--) {
          const prevStep = DEFAULT_STEPS[i - 1];
          if (!isStepComplete(prevStep, loadedAnswers)) {
            loadedIndex = i - 1;
            break;
          }
        }

        setAnswers(loadedAnswers);
        setStepIndex(loadedIndex);
        console.log("🔹 Loaded asesmen:", { loadedIndex, loadedAnswers });
      }
    } catch (err) {
      console.error("❌ Gagal memuat asesmen:", err);
      toast.error("Terjadi kesalahan saat memuat data. Asesmen direset.");
      localStorage.removeItem(storageKey);
    } finally {
      setInitialized(true);
    }
  }, [initialized]);

  /* -------------------------- Utilities ---------------------------- */
  const persist = (newAnswers: Answers, newIndex: number) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ answers: newAnswers, stepIndex: newIndex })
      );
    } catch (err) {
      console.error("❌ Gagal menyimpan asesmen:", err);
      toast.error("Gagal menyimpan data. Coba lagi.");
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

  const next = () => {
    const currentStep = DEFAULT_STEPS[stepIndex];
    if (!isStepComplete(currentStep, answers)) {
      toast.error(`Lengkapi ${currentStep.replace("-", " ")} terlebih dahulu!`);
      return;
    }

    const nextIndex = Math.min(stepIndex + 1, DEFAULT_STEPS.length - 1);
    navigate(nextIndex);
  };

  const prev = () => {
    const prevIndex = Math.max(stepIndex - 1, 0);
    navigate(prevIndex);
  };

  const goTo = (stepName: StepName) => {
    const idx = DEFAULT_STEPS.indexOf(stepName);
    if (idx !== -1) navigate(idx);
  };

  const clear = () => {
    localStorage.removeItem(storageKey);
    setAnswers({});
    navigate(0);
  };

  return {
    answers,
    setAnswers,
    saveAnswer,
    next,
    prev,
    goTo,
    clear,
    stepIndex,
    currentStep: DEFAULT_STEPS[stepIndex],
  };
}

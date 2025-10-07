"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Answers = Record<string, any>;
const DEFAULT_STEPS = ["start", "fill-part1", "fill-part2", "result"];

export function useAssessmentFlow(id: string, steps: string[] = DEFAULT_STEPS) {
    const router = useRouter();
    const storageKey = `assessment:${id}`;

    const [answers, setAnswers] = useState<Answers>({});
    const [stepIndex, setStepIndex] = useState<number>(0);
    const [initialized, setInitialized] = useState(false);

    // 🔹 Load state hanya sekali saat mount
    useEffect(() => {
        if (!id || initialized) return;

        try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
            const parsed = JSON.parse(raw);
            setAnswers(parsed.answers ?? {});
            setStepIndex(parsed.stepIndex ?? 0);
        }
        } catch (e) {
        console.warn("useAssessmentFlow: error reading storage", e);
        } finally {
        setInitialized(true);
        }
    }, [id, initialized, storageKey]);

    function persist(newAnswers: Answers, newIndex: number) {
        try {
        localStorage.setItem(
            storageKey,
            JSON.stringify({ answers: newAnswers, stepIndex: newIndex })
        );
        } catch (e) {
        console.warn("useAssessmentFlow: error writing storage", e);
        }
    }

    const saveAnswer = (key: string, value: any) => {
        const next = { ...answers, [key]: value };
        setAnswers(next);
        persist(next, stepIndex);
    };

    const goTo = (stepName: string) => {
        const idx = steps.indexOf(stepName);
        if (idx === -1) return;
        setStepIndex(idx);
        persist(answers, idx);
        router.push(`/assessment/${id}/${stepName}`);
    };

    const next = () => {
        const idx = Math.min(stepIndex + 1, steps.length - 1);
        setStepIndex(idx);
        persist(answers, idx);
        router.push(`/assessment/${id}/${steps[idx]}`);
    };

    const prev = () => {
        const idx = Math.max(stepIndex - 1, 0);
        setStepIndex(idx);
        persist(answers, idx);
        router.push(`/assessment/${id}/${steps[idx]}`);
    };

    const clear = () => {
        try {
        localStorage.removeItem(storageKey);
        } catch {}
        // 🚀 Jangan trigger useEffect lagi → cukup reset state lokal
        setAnswers({});
        setStepIndex(0);
        setInitialized(true); // biar tidak reload data lama dari localStorage
    };

    return {
        answers,
        saveAnswer,
        stepIndex,
        next,
        prev,
        goTo,
        clear,
        setAnswers,
    };
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/assessment-part2.json";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function FillPart2Page() {
    const { id } = useParams() as { id: string };
    const { answers, saveAnswer, next } = useAssessmentFlow(id);

    const part2 = questionsData.part2;
    const dimensions = Object.entries(part2.dimensions);

    const [currentDimIndex, setCurrentDimIndex] = useState(0);
    const [scale] = useState(part2.scale);

    const [dimKey, currentDimension] = dimensions[currentDimIndex];

    const handleSelect = (qid: string | number, value: number) => {
        saveAnswer(qid.toString(), value);
    };

    const handleNext = () => {
        const allAnswered = currentDimension.questions.every(
        (q: any) => answers[q.id] !== undefined
        );
        if (!allAnswered) return alert("Isi semua pertanyaan dulu!");

        if (currentDimIndex < dimensions.length - 1) {
        setCurrentDimIndex((prev) => prev + 1);
        } else {
        next(); // selesai → ke result
        }
    };

    const handlePrev = () => {
        if (currentDimIndex > 0) setCurrentDimIndex((prev) => prev - 1);
    };

    return (
        <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[120px] bg-gray-50 dark:bg-dark">
        <div className="container">
            <div className="mx-auto max-w-[900px] rounded-md bg-white dark:bg-gray-dark shadow-lg p-8 sm:p-12">
            {/* Header */}
            <h2 className="mb-2 text-center text-2xl font-bold text-black dark:text-white">
                {part2.title}
            </h2>
            <p className="mb-6 text-center text-sm text-gray-600 dark:text-gray-300">
                {part2.instruction}
            </p>

            {/* Dimensi */}
            <h3 className="mb-6 text-xl font-semibold text-primary">
                {currentDimension.title}
            </h3>

            {/* Pertanyaan */}
            <div className="space-y-8">
                {currentDimension.questions.map((q: any, idx: number) => (
                <div key={q.id} className="border-b pb-6">
                    <p className="mb-4 font-medium text-gray-800 dark:text-gray-200">
                    {idx + 1}. {q.text}
                    </p>

                    {/* Skala Likert */}
                    <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-500">
                        {scale.labels[scale.min]}
                    </span>
                    <div className="flex flex-1 justify-center gap-6">
                        {[...Array(scale.max)].map((_, i) => {
                        const val = i + 1;
                        return (
                            <label key={val} className="cursor-pointer text-center">
                            <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={val}
                                checked={answers[q.id] === val}
                                onChange={() => handleSelect(q.id, val)}
                                className="hidden"
                            />
                            <span
                                className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                                answers[q.id] === val
                                    ? "border-primary bg-primary text-white"
                                    : "border-gray-400 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            >
                                {val}
                            </span>
                            </label>
                        );
                        })}
                    </div>
                    <span className="text-sm text-gray-500">
                        {scale.labels[scale.max]}
                    </span>
                    </div>
                </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between">
                <button
                type="button"
                onClick={handlePrev}
                disabled={currentDimIndex === 0}
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
                </button>
                <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90"
                >
                {currentDimIndex === dimensions.length - 1 ? "Selesai" : "Lanjut"}
                <ArrowRight className="h-4 w-4" />
                </button>
            </div>
            </div>
        </div>
        </section>
    );
}

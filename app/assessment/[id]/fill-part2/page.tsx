"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/assessmentPart2.json";
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

    // Scroll ke atas tiap ganti halaman
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentDimIndex]);

    const progressPercent = ((currentDimIndex + 1) / dimensions.length) * 100;

    return (
        <section className="relative z-10 overflow-hidden 
        pb-12 pt-28 md:pb-16 md:pt-32 lg:pb-20 lg:pt-40 
        bg-gradient-to-b from-blue-50 to-blue-100 
        dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">
        
        <div className="container px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-[900px] rounded-md 
            bg-white dark:bg-gray-800 shadow-lg 
            p-6 md:p-8 lg:p-12 border border-gray-200 dark:border-gray-700">
            
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercent}%` }}
                />
                </div>
                <p className="mt-2 text-center text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-300">
                Halaman {currentDimIndex + 1} dari {dimensions.length}
                </p>
            </div>

            {/* Header */}
            <h2 className="mb-2 text-center text-xl sm:text-2xl md:text-3xl font-bold text-black dark:text-white">
                {questionsData.part2.title}
            </h2>
            <p className="mb-6 text-center text-xs md:text-sm lg:text-base text-gray-600 dark:text-gray-300">
                {part2.instruction}
            </p>

            {/* Pertanyaan */}
            <div className="space-y-6 md:space-y-8">
                {currentDimension.questions.map((q: any, idx: number) => (
                <div key={q.id} className="border-b pb-4 md:pb-6 last:border-0">
                    <p className="mb-3 md:mb-4 text-sm md:text-base lg:text-lg font-medium text-gray-800 dark:text-gray-200">
                    {idx + 1}. {q.text}
                    </p>

                    {/* Skala Likert */}
                    <div className="flex items-center justify-between gap-2 md:gap-4 lg:gap-6">
                    <span className="text-xs md:text-sm text-red-500 font-medium">
                        {scale.labels[scale.min]}
                    </span>
                    <div className="flex flex-1 justify-center gap-3 md:gap-4 lg:gap-6">
                        {[...Array(scale.max)].map((_, i) => {
                        const val = i + 1;
                        const isSelected = answers[q.id] === val;
                        return (
                            <label key={val} className="cursor-pointer">
                            <input
                                type="radio"
                                name={`q-${q.id}`}
                                value={val}
                                checked={isSelected}
                                onChange={() => handleSelect(q.id, val)}
                                className="hidden"
                            />
                            <span
                                className={`flex h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10 
                                items-center justify-center rounded-full border 
                                transition-all duration-200 ease-in-out transform
                                ${
                                    isSelected
                                    ? "border-primary bg-primary text-white scale-110 shadow-md ring-2 ring-primary/40"
                                    : "border-gray-400 bg-white hover:scale-110 hover:shadow"
                                }`}
                            />
                            </label>
                        );
                        })}
                    </div>
                    <span className="text-xs md:text-sm text-green-500 font-medium">
                        {scale.labels[scale.max]}
                    </span>
                    </div>
                </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="mt-8 md:mt-10 flex items-center justify-between">
                <button
                type="button"
                onClick={handlePrev}
                disabled={currentDimIndex === 0}
                className="flex items-center gap-2 rounded-full border 
                    px-4 py-2 md:px-6 md:py-3 
                    text-xs md:text-sm font-medium text-gray-600 
                    hover:bg-gray-100 disabled:opacity-40"
                >
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> Sebelumnya
                </button>
                <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-full bg-primary 
                    px-4 py-2 md:px-6 md:py-3 
                    text-xs md:text-sm font-medium text-white 
                    hover:bg-primary/90"
                >
                {currentDimIndex === dimensions.length - 1 ? "Selesai" : "Lanjut"}
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </button>
            </div>
            </div>
        </div>
        </section>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/assessmentPart1.json";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function FillPage() {
    const { id } = useParams() as { id: string };
    const { answers, saveAnswer, next } = useAssessmentFlow(id);

    // Gabungkan semua soal dari SubBagian A & B
    const questions = [
        ...questionsData.part1.subPartA.questions,
        ...questionsData.part1.subPartB.questions,
    ];

    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 4;

    const start = pageIndex * pageSize;
    const end = start + pageSize;
    const currentQuestions = questions.slice(start, end);

    const totalPages = Math.ceil(questions.length / pageSize);

    const handleSelect = (qid: string | number, value: string) => {
        saveAnswer(qid.toString(), value);
    };

    const handleNext = () => {
        const allAnswered = currentQuestions.every((q) => answers[q.id]);
        if (!allAnswered) return alert("Isi semua pertanyaan dulu!");

        if (pageIndex < totalPages - 1) {
        setPageIndex((prev) => prev + 1);
        } else {
        next();
        }
    };

    const handlePrev = () => {
        if (pageIndex > 0) setPageIndex((prev) => prev - 1);
    };

    // Scroll ke atas tiap ganti pageIndex
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageIndex]);

    const progressPercent = ((pageIndex + 1) / totalPages) * 100;

    return (
        <section className="relative z-10 overflow-hidden 
        pb-12 pt-24 
        md:pb-16 md:pt-32 
        lg:pb-20 lg:pt-40 
        bg-gradient-to-b from-blue-50 to-blue-100 
        dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800">

        <div className="container px-4 md:px-6 lg:px-8">
            <div className="mx-auto max-w-[900px] rounded-md 
            bg-white dark:bg-gray-800 
            shadow-xl border border-gray-200 dark:border-gray-700 
            p-4 sm:p-6 md:p-8 lg:p-12">

            {/* Header */}
            <h2 className="mb-4 text-center 
                text-xl sm:text-2xl md:text-3xl 
                font-bold text-black dark:text-white">
                {questionsData.part1.title}
            </h2>
            
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progressPercent}%` }}
                />
                </div>
                <p className="mt-2 text-center text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-300">
                Halaman {pageIndex + 1} dari {totalPages}
                </p>
            </div>

            {/* Soal */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {currentQuestions.map((q) => {
                const currentAnswer = answers[q.id] ?? "";
                return (
                    <div key={q.id} className="border-b pb-4 sm:pb-5 md:pb-6 last:border-0">
                    <h3 className="mb-3 sm:mb-4 
                        text-sm sm:text-base lg:text-lg 
                        font-medium text-gray-800 dark:text-gray-200">
                        {q.id}. {q.question}
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        {q.options.map((opt) => (
                        <label
                            key={opt.label}
                            className={`flex cursor-pointer items-center 
                            rounded-md border p-2 sm:p-3 md:p-4 
                            transition
                            ${
                                currentAnswer === opt.label
                                ? "border-primary bg-primary/10"
                                : "border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-900"
                            }`}
                        >
                            <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt.label}
                            checked={currentAnswer === opt.label}
                            onChange={() => handleSelect(q.id, opt.label)}
                            className="hidden"
                            />
                            <span className="text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-200">
                            {opt.label}. {opt.text}
                            </span>
                        </label>
                        ))}
                    </div>
                    </div>
                );
                })}
            </div>

            {/* Navigation */}
            <div className="mt-8 md:mt-10 flex items-center justify-between">
                <button
                type="button"
                onClick={handlePrev}
                disabled={pageIndex === 0}
                className="flex items-center gap-1 sm:gap-2 
                    rounded-full border 
                    px-3 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-3 
                    text-xs sm:text-sm font-medium 
                    text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" /> Sebelumnya
                </button>
                <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 sm:gap-2 
                    rounded-full bg-primary 
                    px-3 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-3 
                    text-xs sm:text-sm font-medium text-white 
                    hover:bg-primary/90"
                >
                {pageIndex === totalPages - 1 ? "Selesai" : "Lanjut"}
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
            </div>
            </div>
        </div>
        </section>
    );
}

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAssessmentFlow } from "@/components/Assessment/useAssessmentFlow";
import questionsData from "@/data/assessment-part1.json";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function FillPage() {
    const { id } = useParams() as { id: string };
    const { answers, saveAnswer, next } = useAssessmentFlow(id);

    // Gabungkan semua soal dari SubBagian A & B (sementara hardcode untuk part1)
    const questions = [
        ...questionsData.part1.subPartA.questions,
        ...questionsData.part1.subPartB.questions,
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const currentQuestion = questions[currentIndex];
    const currentAnswer = answers[currentQuestion.id] ?? "";

    const handleSelect = (optionLabel: string) => {
        saveAnswer(currentQuestion.id.toString(), optionLabel);
    };

    const handleNext = () => {
        if (!answers[currentQuestion.id]) return alert("Pilih salah satu jawaban dulu!");
        if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        } else {
        next(); // selesai -> ke /assessment/[id]/result
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
    };

    return (
        <section className="relative z-10 overflow-hidden pb-16 pt-36 md:pb-20 lg:pb-28 lg:pt-[120px] bg-gray-50 dark:bg-dark">
        <div className="container">
            <div className="mx-auto max-w-[700px] rounded-md bg-white dark:bg-gray-dark shadow-lg p-8 sm:p-12">
            {/* Judul */}
            <h2 className="mb-4 text-center text-2xl font-bold text-black dark:text-white">
                {questionsData.part1.title}
            </h2>
            <p className="mb-8 text-center text-base text-body-color">
                {currentIndex + 1} dari {questions.length} soal
            </p>

            {/* Soal */}
            <div>
                <h3 className="mb-6 text-lg font-semibold text-black dark:text-white">
                {currentQuestion.question}
                </h3>
                <div className="space-y-4">
                {currentQuestion.options.map((opt) => (
                    <label
                    key={opt.label}
                    className={`flex cursor-pointer items-center rounded-md border p-4 transition ${
                        currentAnswer === opt.label
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    >
                    <input
                        type="radio"
                        name={`q-${currentQuestion.id}`}
                        value={opt.label}
                        checked={currentAnswer === opt.label}
                        onChange={() => handleSelect(opt.label)}
                        className="hidden"
                    />
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                        {opt.label}. {opt.text}
                    </span>
                    </label>
                ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-10 flex items-center justify-between">
                <button
                type="button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                <ArrowLeft className="h-4 w-4" /> Sebelumnya
                </button>
                <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90"
                >
                {currentIndex === questions.length - 1 ? "Selesai" : "Lanjut"}
                <ArrowRight className="h-4 w-4" />
                </button>
            </div>
            </div>
        </div>
        </section>
    );
}

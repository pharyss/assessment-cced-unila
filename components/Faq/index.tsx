"use client";

import { useState } from "react";
import { Faq } from "@/types/faq";
import faqData from "./faqData";

interface AccordionItemProps {
  id: number;
  question: string;
  answer: string;
}

const AccordionItem = ({ question, answer }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full justify-between items-center py-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:text-primary transition-colors"
      >
        <span className="text-base md:text-lg">{question}</span>
        <span
          className={`ml-3 flex h-6 w-6 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
            isOpen
              ? "bg-primary text-white border-primary"
              : "border-gray-400 text-gray-600 dark:text-gray-300"
          }`}
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden pb-4 text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function FAQ({ className = "" }: { className?: string }) {
  return (
    <section
      id="faq"
      className={`relative py-16 md:py-20 lg:py-24 ${className}`}
    >
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-2xl bg-white/70 backdrop-blur-sm shadow-lg dark:bg-gray-900/70 p-8 md:p-10">
          <h2 className="mb-2 text-center text-3xl font-bold text-primary dark:text-white">
            Pertanyaan Umum
          </h2>
          <p className="mb-8 text-center text-base text-gray-600 dark:text-gray-300">
            Temukan jawaban dari pertanyaan yang sering diajukan.
          </p>

          {faqData.map((item: Faq) => (
            <AccordionItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

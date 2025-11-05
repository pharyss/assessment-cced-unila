<<<<<<< HEAD
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
        className="flex w-full justify-between items-center py-4 text-left font-medium text-gray-800 dark:text-gray-200 hover:text-myunila transition-colors"
      >
        <span className="text-base md:text-lg">{question}</span>
        <span
          className={`ml-3 flex h-6 w-6 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
            isOpen
              ? "bg-myunila text-white border-myunila"
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
      <div className="container mx-auto px-8 md:px-16 lg:px-32">
        <div className="mx-auto max-w-7xl rounded-2xl bg-white backdrop-blur-sm shadow-lg dark:bg-gray-900/70 p-8 md:p-10">
          <h2 className="mb-2 text-center text-3xl font-bold text-myunila dark:text-white">
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
=======
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
        className="flex w-full justify-between items-center py-4 md:py-5 text-left font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
      >
        <span className="text-sm md:text-base lg:text-lg">{question}</span>
        <span className="ml-2 text-xl md:text-2xl text-gray-500 dark:text-gray-400">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden text-gray-600 dark:text-gray-400 pb-4 text-sm md:text-base leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

export default function FAQ() {
  return (
    <div
      className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 rounded-sm bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
      data-wow-delay=".15s"
    >
      <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
        FAQ
      </h2>
      <p className="mb-6 text-base font-medium text-body-color">
        Pertanyaan yang sering diajukan.
      </p>
      {faqData.map((item: Faq) => (
        <AccordionItem key={item.id} {...item} />
      ))}
    </div>
  );
}
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc

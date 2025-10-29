"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TEXTS = ["Talenta Diri", "Bidang", "Potensi Diri", "Arah Karier"];

const HeroTwo = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % TEXTS.length),
      2500
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="
        relative z-10 flex items-center justify-center overflow-hidden
        bg-gradient-to-b from-white via-myunila-50 to-myunila-100
        pb-16 pt-[120px] text-center 
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 
        md:pb-[120px] md:pt-[150px] xl:min-h-screen
        transition-colors duration-500
      "
      style={{
        backgroundImage: "url('/images/hero/background.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-myunila-50/60 to-myunila-100/50 dark:from-gray-950/80 dark:via-gray-900/75 dark:to-gray-800/80 transition-colors duration-500" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        className="
          absolute -right-8 -top-8 h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80
          rounded-full bg-myunila/60 dark:bg-myunila-300/20 blur-3xl
        "
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="
          absolute -bottom-10 -left-10 h-48 w-48 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 xl:h-96 xl:w-96
          rounded-full bg-myunila/50 dark:bg-myunila-300/15 blur-3xl
        "
      />

      <div className="relative z-10 mx-auto max-w-[800px] px-6">
        <motion.h1
          className="mb-6 text-3xl font-bold leading-tight text-gray-900 dark:text-gray-50 sm:text-4xl md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div>
              Kenali{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={TEXTS[index]}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="mx-1 inline-block text-myunila"
                >
                  {TEXTS[index]}
                </motion.span>
              </AnimatePresence>
              ,
            </div>
            <div>Persiapkan Sejak Dini!</div>
          </div>
        </motion.h1>

        <motion.p
          className="mb-8 text-base leading-relaxed text-gray-700 dark:text-gray-300 md:text-lg lg:text-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Asesmen Talenta Universitas Lampung hadir untuk membantumu memahami
          karakteristik, minat, dan potensi diri. Yuk, kenali arah kariermu
          sejak dini bersama kami!
        </motion.p>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <Link
            href="/assessment/talenta-mahasiswa"
            className="inline-flex items-center gap-2 rounded-full bg-myunila px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-myunila-700 dark:hover:bg-myunila-400"
          >
            Mulai Eksplorasi
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroTwo;

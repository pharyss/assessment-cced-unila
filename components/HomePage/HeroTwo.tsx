"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TextLoop from "react-text-loop";
import { motion } from "framer-motion";

const HeroTwo = () => {
  return (
    <section
      id="home"
      className="
        relative z-10 flex items-center justify-center overflow-hidden bg-gradient-to-b
        from-white via-myunila-50 to-myunila-100 pb-16 
        pt-[120px] text-center dark:from-gray-900
        dark:via-gray-800 dark:to-gray-900 md:pb-[120px] md:pt-[150px] 
        xl:min-h-screen
      "
      style={{
        backgroundImage: "url('/images/hero/background.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay gradasi lembut */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-myunila-50/60 to-myunila-100/50 dark:from-gray-900/80 dark:via-gray-800/70 dark:to-gray-900/80" />

      {/* Elemen blur bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        className="
    absolute -right-6 -top-6 h-32 w-32
    rounded-full bg-myunila blur-3xl sm:-right-8
    sm:-top-8 sm:h-44 sm:w-44 md:-right-10
    md:-top-10 md:h-56 md:w-56 lg:-right-12
    lg:-top-12 lg:h-60 lg:w-60 xl:-right-16
    xl:-top-16 xl:h-72 xl:w-72
  "
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="
    absolute -bottom-8 -left-8 h-40 w-40
    rounded-full bg-myunila blur-3xl sm:-bottom-10
    sm:-left-10 sm:h-52 sm:w-52 md:-bottom-12
    md:-left-12 md:h-64 md:w-64 lg:-bottom-14
    lg:-left-14 lg:h-72 lg:w-72 xl:-bottom-16
    xl:-left-16 xl:h-80 xl:w-80
  "
      /> 

      {/* Konten utama */}
      <div className="relative z-10 mx-auto max-w-[800px] px-6">
        <motion.h1
          className="mb-5 text-3xl font-bold leading-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Kenali {" "}
          <TextLoop interval={2000} springConfig={{ stiffness: 180, damping: 10 }}>
            <span className="text-myunila">Talenta Dirimu</span>
            <span className="text-myunila">Bidang yang Tepat</span>
            <span className="text-myunila">Gaya Belajarmu</span>
            <span className="text-myunila">Potensi Kariermu</span>
          </TextLoop>
          , Persiapkan
          Sejak Dini!
        </motion.h1>

        <motion.p
          className="mb-8 text-base leading-relaxed text-gray-700 dark:text-gray-300 sm:text-lg md:text-xl"
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
            className="inline-flex items-center gap-2 rounded-full bg-myunila px-8 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-myunila/80"
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

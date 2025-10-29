"use client";

import { motion } from "framer-motion";

const Vision = () => {
  return (
    <section
      id="introduction"
      className="relative py-12 md:py-16 lg:py-20 
      bg-gradient-to-b from-white via-myunila-50 to-myunila-100 
      dark:from-gray-950 dark:via-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-8 md:px-16 lg:px-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight 
          text-gray-900 dark:text-gray-50 mb-10"
        >
          Mari Ambil Bagian dan Mulai Eksplorasi{" "}
          <span className="text-myunila dark:text-myunila-300">
            Karakteristik dan Potensimu!
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative 
          bg-white dark:bg-gray-900/70 
          backdrop-blur-md border border-myunila-100 dark:border-gray-700 
          rounded-2xl shadow-lg px-6 py-10 md:px-10 lg:px-16 overflow-hidden"
        >
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 italic font-medium max-w-4xl mx-auto">
            “Sebagai bagian dari komitmen Universitas Lampung dalam mendukung
            pengembangan talenta mahasiswa, asesmen ini diharapkan mampu
            memberikan landasan yang kuat bagi penyusunan strategi pembinaan,
            pengembangan akademik, maupun persiapan karir yang berkelanjutan.”
          </p>
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 0.2 }}
  viewport={{ once: true }}
  className="absolute -left-6 -top-6 w-24 h-24 
             sm:-left-8 sm:-top-8 sm:w-32 sm:h-32 
             md:-left-10 md:-top-10 md:w-40 md:h-40 
             lg:-left-12 lg:-top-12 lg:w-48 lg:h-48 
             bg-myunila-200 dark:bg-myunila-300/20 
             blur-3xl rounded-full"
/>

<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1, delay: 0.3 }}
  viewport={{ once: true }}
  className="absolute -right-6 -bottom-6 w-28 h-28 
             sm:-right-8 sm:-bottom-8 sm:w-36 sm:h-36 
             md:-right-10 md:-bottom-10 md:w-44 md:h-44 
             lg:-right-12 lg:-bottom-12 lg:w-52 lg:h-52 
             bg-myunila-200 dark:bg-myunila-300/20 
             blur-3xl rounded-full"
/>

        </motion.div>
      </div>
    </section>
  );
};

export default Vision;

"use client";

import { motion } from "framer-motion";

const Vision = () => {
  return (
    <section
      id="introduction"
      className="relative py-16 md:py-20 lg:py-24 bg-gradient-to-b from-white via-primary/5 to-primary/10 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-6 md:px-10 lg:px-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-gray-900 dark:text-white mb-10"
        >
          Mari Ambil Bagian dan Mulai Eksplorasi{" "}
          <span className="text-primary">Karakteristik dan Potensimu!</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative bg-white/80 dark:bg-gray-900/60 backdrop-blur-md border border-primary/10 rounded-2xl shadow-lg px-6 py-10 md:px-10 lg:px-16 overflow-hidden"
        >
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 italic font-medium max-w-4xl mx-auto">
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
            className="absolute -left-12 -top-12 w-40 h-40 bg-primary/20 blur-3xl rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="absolute -right-12 -bottom-12 w-52 h-52 bg-primary/30 blur-3xl rounded-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Vision;

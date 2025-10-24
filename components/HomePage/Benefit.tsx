"use client";

import { GraduationCap, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const Benefit = () => {
  return (
    <section id="benefits" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6 md:px-10 lg:px-20 space-y-24">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col-reverse lg:flex-row items-center gap-12"
        >
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Apa sih manfaatnya untuk kamu?
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong>Potret Talenta Individual</strong> menjadi indikator utama yang membantu kamu
              memahami potensi diri dan menentukan arah pengembangan pribadi.
              Dengan begitu, kamu bisa merancang masa depan karier yang gemilang sejak bangku kuliah.
            </p>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="bg-primary/10 p-10 rounded-2xl shadow-inner flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-20 h-20 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col-reverse lg:flex-row-reverse items-center gap-12"
        >
          <div className="lg:w-1/2 text-center lg:text-left">
            <h3 className="text-3xl font-bold text-primary mb-4">
              Apa sih manfaatnya untuk kampus?
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong>Peta Talenta Mahasiswa</strong> menjadi dasar penting bagi Universitas Lampung
              untuk menyusun strategi dan program pengembangan yang tepat sasaran, 
              sesuai kebutuhan dan potensi nyata mahasiswa.
            </p>
          </div>

          <div className="lg:w-1/2 flex justify-center">
            <div className="bg-primary/10 p-10 rounded-2xl shadow-inner flex flex-col items-center hover:scale-105 transition-transform duration-300">
              <BarChart3 className="w-20 h-20 text-primary" />
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Benefit;

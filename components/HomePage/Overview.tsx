"use client";

import { Briefcase, Brain } from "lucide-react";
import { motion } from "framer-motion";

const Overview = () => {
  return (
    <section id="about" className="pt-16 md:pt-20 lg:pt-28 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-6 md:px-10 lg:px-20">
        <div className="border-b border-gray-200 dark:border-white/15 pb-16 md:pb-20 lg:pb-28">
          <div className="text-center mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-6 text-3xl font-bold leading-tight text-primary sm:text-4xl md:text-[45px]"
            >
              Sekilas tentang “Asesmen Talenta Mahasiswa”
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="mx-auto mb-10 max-w-5xl text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300"
            >
              Kami percaya setiap Mahasiswa Universitas Lampung memiliki talenta yang luar biasa. 
              Berdasarkan keyakinan itu, kami menghadirkan asesmen khusus yang membantu kamu 
              mengenali karakteristik diri dan potensi terbaikmu.
            </motion.p>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 lg:gap-12">
        
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-8 lg:p-10 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="rounded-full bg-primary/10 p-5">
                    <Briefcase className="h-12 w-12 text-primary" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Asesmen Bidang Karier Ideal
                  </h4>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Membantumu menemukan bidang karier yang paling sesuai 
                    dengan minat, kepribadian, dan potensi unikmu sebagai 
                    mahasiswa Universitas Lampung.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-8 lg:p-10 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="rounded-full bg-primary/10 p-5">
                    <Brain className="h-12 w-12 text-primary" />
                  </div>
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Asesmen Pola Perilaku
                  </h4>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Menggali cara kamu berpikir, berinteraksi, dan mengambil keputusan. 
                    Memberikan gambaran utuh tentang pola perilakumu dalam konteks 
                    akademik dan profesional.
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              viewport={{ once: true }}
              className="mx-auto mt-12 max-w-5xl text-base md:text-lg lg:text-xl leading-relaxed text-gray-700 dark:text-gray-300"
            >
              Melalui asesmen ini, kamu akan mendapatkan{" "}
              <strong className="text-primary">“Potret Talenta Individual”</strong>, sedangkan
              Universitas memperoleh{" "}
              <strong className="text-primary">“Peta Talenta Mahasiswa Universitas Lampung”</strong>.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;

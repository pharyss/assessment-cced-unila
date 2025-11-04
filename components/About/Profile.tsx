"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const Profile = () => {
  return (
    <section className="pb-[120px] pt-[50px]">
      <div className="container mx-auto flex flex-wrap justify-center px-8 md:px-16 lg:px-32">
        <div>
          <h2 className="mb-8 text-center text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight">
            Center for Career and Entrepreneurship Development{" "}
            <span className="text-myunila">University of Lampung</span>
          </h2>

          <div className="mb-10 w-full overflow-hidden rounded">
            <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
              <Image
                src="/images/about/about-image.png"
                alt="Profil CCED Unila"
                fill
                className="object-contain object-center"
              />
            </div>
          </div>

          <p className="mx-auto mb-8 text-center text-base leading-relaxed text-gray-700 dark:text-gray-300">
            UPA Pengembangan Karier dan Kewirausahaan Universitas Lampung
            merupakan unit kerja yang berfokus pada peningkatan kualitas lulusan
            agar siap bersaing di dunia kerja. UPA ini tidak hanya memfasilitasi
            penyerapan lulusan oleh dunia usaha, industri, dan kerja, tetapi
            juga berperan aktif dalam menumbuhkan minat serta budaya
            kewirausahaan di kalangan mahasiswa dan alumni.
          </p>

          <h3 className="dark:text-myunila-light mb-6 text-xl font-bold leading-tight text-myunila md:text-2xl">
            Fungsi Utama
          </h3>
          <ul className="mb-10 list-disc pl-6 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            <li>
              Inventarisasi dan identifikasi kebutuhan dunia usaha, industri,
              dan dunia kerja.
            </li>
            <li>
              Peningkatan kemampuan mahasiswa dalam pengembangan karier dan
              kewirausahaan.
            </li>
            <li>
              Fasilitasi serta kerja sama dalam pengembangan karier dan
              kewirausahaan.
            </li>
            <li>
              Penyediaan layanan informasi terkait pengembangan karier dan
              kewirausahaan.
            </li>
          </ul>

          <h3 className="dark:text-myunila-light mb-6 text-xl font-bold leading-tight text-myunila md:text-2xl">
            Apa yang Kami Lakukan
          </h3>

          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-lg font-semibold text-black dark:text-white md:text-xl">
                1. Pendataan
              </h4>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Melaksanakan perencanaan, pelaksanaan, pengendalian, dan
                pelaporan penelusuran serta pendataan lulusan sebagai dasar
                pengembangan karier.
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-lg font-semibold text-black dark:text-white md:text-xl">
                2. Menyiapkan Alumni
              </h4>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Membekali lulusan dengan keterampilan dan wawasan agar mampu
                berkompetisi di dunia kerja, baik sebagai pelaku usaha maupun
                profesional di berbagai bidang.
              </p>
            </div>

            <div>
              <h4 className="mb-2 text-lg font-semibold text-black dark:text-white md:text-xl">
                3. Menyukseskan Program
              </h4>
              <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                Mendukung program pemerintah dalam memetakan serta
                menyelaraskan kebutuhan dunia kerja dengan pendidikan tinggi di
                Indonesia, sekaligus menumbuhkan budaya kewirausahaan di
                kalangan mahasiswa dan alumni Universitas Lampung.
              </p>
            </div>
          </div>

          <div
            className="relative mt-12 overflow-hidden rounded-2xl border border-myunila-100 
            bg-white px-6 py-10 shadow-lg backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/70 md:px-10 lg:px-16"
          >
            <p className="mx-auto max-w-4xl text-center text-base font-medium italic text-gray-700 dark:text-gray-300">
              “Sebagai bagian dari komitmen Universitas Lampung dalam mendukung
              pengembangan talenta mahasiswa, asesmen ini diharapkan mampu
              memberikan landasan yang kuat bagi penyusunan strategi pembinaan,
              pengembangan akademik, maupun persiapan karier yang
              berkelanjutan.”
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute -left-6 -top-6 h-24 w-24 
                rounded-full bg-myunila-200 blur-3xl dark:bg-myunila-300/20 
                sm:-left-8 sm:-top-8 sm:h-32 sm:w-32 
                md:-left-10 md:-top-10 md:h-40 md:w-40 
                lg:-left-12 lg:-top-12 
                lg:h-48 lg:w-48"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-6 h-28 w-28 
                rounded-full bg-myunila-200 blur-3xl dark:bg-myunila-300/20 
                sm:-bottom-8 sm:-right-8 sm:h-36 sm:w-36 
                md:-bottom-10 md:-right-10 md:h-44 md:w-44 
                lg:-bottom-12 lg:-right-12 
                lg:h-52 lg:w-52"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;

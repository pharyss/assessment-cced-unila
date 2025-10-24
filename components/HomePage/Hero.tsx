import Link from "next/link";
import Image from 'next/image'
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <>
      <section
        id="home"
        className="dark:bg-gray-dark relative z-10 overflow-hidden bg-white pb-16 pt-[120px] md:pb-[120px] md:pt-[150px] xl:pb-[160px] xl:pt-[180px] 2xl:pb-[200px] 2xl:pt-[210px]"
      >
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp mx-auto max-w-[700px] text-center sm:text-left xl:mx-0"
                data-wow-delay=".2s"
              >
                <h1 className="mb-5 text-3xl font-bold leading-tight text-black dark:text-white sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
                  Kenali Talenta Diri, Persiapkan Sejak Dini!
                </h1>
                <p className="dark:text-white mb-8 text-base !leading-relaxed text-body-color sm:text-lg md:text-xl">
                  Asesmen Talenta Universitas Lampung Hadir!  Supaya  kamu kenal, lalu paham karakteristik, minat, dan potensi diri. Tentunya, hal ini bisa menjawab  rasa bimbangmu tentang “Salah jurusan dan rencana masa depan”. 
                  Bersama kami, siapkan karier impian sejak dini!
                </p>
                <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:items-start sm:justify-start sm:space-x-4 sm:space-y-0">
                  <Link
                    href="/assessment/talenta-mahasiswa"
                    className="flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
                  >
                    Mulai Eksplorasi
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 z-[-1] opacity-30 dark:opacity-30 lg:opacity-100 lg:dark:opacity-70">
          <Image
            src="/images/hero/hero-bg.png"
            alt="Landscape picture"
            width={700}
            height={500}
          />
        </div>

      </section>
    </>
  );
};

export default Hero;

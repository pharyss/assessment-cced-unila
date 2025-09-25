import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil CCED | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Profil CCED"
        description="Tentang Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung."
      />
      <section className="pb-[120px] pt-[50px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4 lg:w-8/12">
              <div>
                <h2 className="mb-8 text-3xl font-bold leading-tight text-center text-black dark:text-white sm:text-4xl sm:leading-tight">
                  Center for Career and Entrepreneurship Development University of Lampung
                </h2>
                <div>
                  <div className="mb-10 w-full overflow-hidden rounded">
                    <div className="relative aspect-[97/60] w-full sm:aspect-[97/44]">
                      <Image
                        src="/images/about/about-image.png"
                        alt="image"
                        fill
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                  <p className="mb-8 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    UPA Pengembangan Karier dan Kewirausahaan Universitas Lampung
                    merupakan unit kerja yang berfokus pada peningkatan kualitas
                    lulusan agar siap bersaing di dunia kerja. UPA ini tidak hanya
                    memfasilitasi penyerapan lulusan oleh dunia usaha, industri, dan
                    kerja, tetapi juga berperan aktif dalam menumbuhkan minat serta
                    budaya kewirausahaan di kalangan mahasiswa dan alumni.
                  </p>

                  <h3 className="font-xl mb-6 font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
                    Fungsi Utama
                  </h3>
                  <ul className="mb-10 list-disc pl-6 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    <li>
                      Inventarisasi dan identifikasi kebutuhan dunia usaha, industri, dan dunia
                      kerja.
                    </li>
                    <li>
                      Peningkatan kemampuan mahasiswa dalam pengembangan karier dan
                      kewirausahaan.
                    </li>
                    <li>
                      Fasilitasi serta kerja sama dalam pengembangan karier dan kewirausahaan.
                    </li>
                    <li>
                      Penyediaan layanan informasi terkait pengembangan karier dan
                      kewirausahaan.
                    </li>
                  </ul>

                  <h3 className="font-xl mb-6 font-bold leading-tight text-black dark:text-white sm:text-2xl sm:leading-tight lg:text-xl lg:leading-tight xl:text-2xl xl:leading-tight">
                    Apa yang Kami Lakukan
                  </h3>

                  <h4 className="mb-2 text-lg font-semibold text-black dark:text-white sm:text-xl lg:text-lg xl:text-xl">
                    1. Pendataan
                  </h4>
                  <p className="mb-6 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    Melaksanakan perencanaan, pelaksanaan, pengendalian, dan pelaporan
                    penelusuran serta pendataan lulusan sebagai dasar pengembangan karier.
                  </p>

                  <h4 className="mb-2 text-lg font-semibold text-black dark:text-white sm:text-xl lg:text-lg xl:text-xl">
                    2. Menyiapkan Alumni
                  </h4>
                  <p className="mb-6 text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    Membekali lulusan dengan keterampilan dan wawasan agar mampu berkompetisi
                    di dunia kerja, baik sebagai pelaku usaha maupun profesional di berbagai
                    bidang.
                  </p>

                  <h4 className="mb-2 text-lg font-semibold text-black dark:text-white sm:text-xl lg:text-lg xl:text-xl">
                    3. Menyukseskan Program
                  </h4>
                  <p className="text-base font-medium leading-relaxed text-body-color sm:text-lg sm:leading-relaxed lg:text-base lg:leading-relaxed xl:text-lg xl:leading-relaxed">
                    Mendukung program pemerintah dalam memetakan serta menyelaraskan kebutuhan
                    dunia kerja dengan pendidikan tinggi di Indonesia, sekaligus menumbuhkan
                    budaya kewirausahaan di kalangan mahasiswa dan alumni Universitas Lampung.
                  </p>

                  <div className="relative z-10 my-10 overflow-hidden rounded-md bg-gradient-to-r from-primary/10 to-primary/5 p-4 md:p-9 lg:p-8 xl:p-9">
                    <p className="text-center text-base font-medium italic text-body-color">
                      Karier yang gemilang dan kewirausahaan yang sukses bukanlah hasil instan, 
                      melainkan perjalanan panjang yang dimulai dari langkah-langkah kecil yang konsisten. 
                      Bersama UPA CCED Universitas Lampung, mahasiswa dan alumni dibekali keterampilan, 
                      wawasan, serta jejaring untuk meraih masa depan yang lebih baik.
                    </p>

                    <span className="absolute left-0 top-0 z-[-1]">
                      <svg
                        width="132"
                        height="109"
                        viewBox="0 0 132 109"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M33.0354 90.11C19.9851 102.723 -3.75916 101.834 -14 99.8125V-15H132C131.456 -12.4396 127.759 -2.95278 117.318 14.5117C104.268 36.3422 78.7114 31.8952 63.2141 41.1934C47.7169 50.4916 49.3482 74.3435 33.0354 90.11Z"
                          fill="url(#paint0_linear_111:606)"
                        />
                        <path
                          opacity="0.5"
                          d="M33.3654 85.0768C24.1476 98.7862 1.19876 106.079 -9.12343 108.011L-38.876 22.9988L100.816 -25.8905C100.959 -23.8126 99.8798 -15.5499 94.4164 0.87754C87.5871 21.4119 61.9822 26.677 49.5641 38.7512C37.146 50.8253 44.8877 67.9401 33.3654 85.0768Z"
                          fill="url(#paint1_linear_111:606)"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear_111:606"
                            x1="94.7523"
                            y1="82.0246"
                            x2="8.40951"
                            y2="52.0609"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="white" stopOpacity="0.06" />
                            <stop
                              offset="1"
                              stopColor="white"
                              stopOpacity="0"
                            />
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear_111:606"
                            x1="90.3206"
                            y1="58.4236"
                            x2="1.16149"
                            y2="50.8365"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="white" stopOpacity="0.06" />
                            <stop
                              offset="1"
                              stopColor="white"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <span className="absolute bottom-0 right-0 z-[-1]">
                      <svg
                        width="53"
                        height="30"
                        viewBox="0 0 53 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          opacity="0.8"
                          cx="37.5"
                          cy="37.5"
                          r="37.5"
                          fill="#4A6CF7"
                        />
                        <mask
                          id="mask0_111:596"
                          style={{ maskType: "alpha" }}
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="75"
                          height="75"
                        >
                          <circle
                            opacity="0.8"
                            cx="37.5"
                            cy="37.5"
                            r="37.5"
                            fill="#4A6CF7"
                          />
                        </mask>
                        <g mask="url(#mask0_111:596)">
                          <circle
                            opacity="0.8"
                            cx="37.5"
                            cy="37.5"
                            r="37.5"
                            fill="url(#paint0_radial_111:596)"
                          />
                          <g opacity="0.8" filter="url(#filter0_f_111:596)">
                            <circle
                              cx="40.8089"
                              cy="19.853"
                              r="15.4412"
                              fill="white"
                            />
                          </g>
                        </g>
                        <defs>
                          <filter
                            id="filter0_f_111:596"
                            x="4.36768"
                            y="-16.5881"
                            width="72.8823"
                            height="72.8823"
                            filterUnits="userSpaceOnUse"
                            colorInterpolationFilters="sRGB"
                          >
                            <feFlood
                              floodOpacity="0"
                              result="BackgroundImageFix"
                            />
                            <feBlend
                              mode="normal"
                              in="SourceGraphic"
                              in2="BackgroundImageFix"
                              result="shape"
                            />
                            <feGaussianBlur
                              stdDeviation="10.5"
                              result="effect1_foregroundBlur_111:596"
                            />
                          </filter>
                          <radialGradient
                            id="paint0_radial_111:596"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(37.5 37.5) rotate(90) scale(40.2574)"
                          >
                            <stop stopOpacity="0.47" />
                            <stop offset="1" stopOpacity="0" />
                          </radialGradient>
                        </defs>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;

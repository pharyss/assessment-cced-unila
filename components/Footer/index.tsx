"use client";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer
        className="wow fadeInUp bg-[url('/images/footer/bg-footer.png')] bg-cover bg-center relative z-10 pt-10 md:pt-15 lg:pt-18"
        data-wow-delay=".1s"
      >
      <div>
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-4/12">
              <div className="mb-12 max-w-[360px] lg:mb-16">
                <Link href="/" className="mb-8 inline-block">
                  <Image
                    src="/images/logo/logo.png"
                    alt="logo"
                    className="w-full"
                    width={140}
                    height={30}
                  />
                </Link>
                <p className="text-body-color-dark mb-9 text-base leading-relaxed">
                  Center for Career & Entrepreneurship Development
                  Universitas Lampung
                </p>

                <h2 className="mb-5 text-xl font-bold text-white">
                  Stay Connected
                </h2>

                <div className="flex items-center">
                  {/* YouTube */}
                  <a
                    href="https://www.youtube.com/@cced_unila"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="text-body-color-dark mr-6 duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="14"
                      viewBox="0 0 18 14"
                      className="fill-current"
                    >
                      <path d="M17.5058 2.07119C17.3068 1.2488 16.7099 0.609173 15.9423 0.395963C14.5778 7.26191e-08 9.0627 0 9.0627 0C9.0627 0 3.54766 7.26191e-08 2.18311 0.395963C1.41555 0.609173 0.818561 1.2488 0.619565 2.07119C0.25 3.56366 0.25 6.60953 0.25 6.60953C0.25 6.60953 0.25 9.68585 0.619565 11.1479C0.818561 11.9703 1.41555 12.6099 2.18311 12.8231C3.54766 13.2191 9.0627 13.2191 9.0627 13.2191C9.0627 13.2191 14.5778 13.2191 15.9423 12.8231C16.7099 12.6099 17.3068 11.9703 17.5058 11.1479C17.8754 9.68585 17.8754 6.60953 17.8754 6.60953C17.8754 6.60953 17.8754 3.56366 17.5058 2.07119ZM7.30016 9.44218V3.77687L11.8771 6.60953L7.30016 9.44218Z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/cced_unila"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="text-body-color-dark mr-6 duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.75-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
                    </svg>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://s.id/ShintaCCED"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="text-body-color-dark duration-300 hover:text-primary"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      className="fill-current"
                    >
                      <path d="M12 2a10 10 0 0 0-8.94 14.56L2 22l5.61-1.52A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.82 12.28l-.26.41.67 3-3.09-.84-.38.23A8 8 0 1 1 12 4zm4.29 10.46c-.23-.11-1.36-.67-1.57-.75-.21-.08-.36-.11-.51.11s-.59.75-.72.91c-.13.15-.27.17-.5.06a6.57 6.57 0 0 1-1.94-1.2 7.25 7.25 0 0 1-1.34-1.65c-.14-.25 0-.38.1-.5.1-.1.23-.27.34-.4.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.4-.06-.11-.51-1.24-.7-1.7-.18-.43-.36-.37-.51-.38h-.43c-.15 0-.4.06-.61.29-.21.23-.8.77-.8 1.88s.82 2.18.93 2.33c.11.15 1.61 2.47 3.9 3.46 2.29.99 2.29.66 2.7.62.41-.04 1.36-.55 1.55-1.08.19-.53.19-.99.13-1.08-.06-.09-.21-.15-.44-.26z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-white">
                  Alamat
                </h2>
                <ul>
                  <li>
                    <p
                      className="text-body-color-dark mb-4 inline-block text-base duration-300"
                    >
                      Jl. Prof. Dr. Ir. Sumantri Brojonegoro, Gedong Meneng, Kec. Rajabasa, Kota Bandar Lampung, Lampung 35141
                    </p>
                  </li>
                  <li>
                    <p
                      className="text-body-color-dark mb-4 inline-block text-base duration-300"
                    >
                      Telp: +6285769510880
                    </p>
                  </li>
                  <li>
                    <p
                      className="text-body-color-dark mb-4 inline-block text-base duration-300"
                    >
                      Email: pjk@kpa.unila.ac.id
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-2/12 xl:w-2/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-white">
                  Tautan
                </h2>
                <ul>
                  <li>
                    <a
                      href="https://cced.unila.ac.id/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-color-dark mb-4 inline-block text-base duration-300 hover:text-primary"
                    >
                      CCED Universitas Lampung
                    </a>
                  </li>
                  <li>
                    <a
                      href="/tes-asesmen"
                      className="text-body-color-dark mb-4 inline-block text-base duration-300 hover:text-primary"
                    >
                      Tes Asesmen
                    </a>
                  </li>
                  <li>
                    <a
                      href="/infografis"
                      className="text-body-color-dark mb-4 inline-block text-base duration-300 hover:text-primary"
                    >
                      Infografis
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-3/12">
              <div className="mb-12 lg:mb-16">
                <h2 className="mb-10 text-xl font-bold text-white">
                  Panduan & Bantuan
                </h2>
                <ul>
                  <li>
                    <a
                      href="/#contact"
                      className="text-body-color-dark mb-4 inline-block text-base duration-300 hover:text-primary"
                    >
                      Hubungi Kami
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="text-body-color-dark mb-4 inline-block text-base duration-300 hover:text-primary"
                    >
                      Panduan
                    </a>
                  </li>
                  <li>
                    <a
                      href="/about"
                      className="text-body-color-dark mb-4 inline-block text-base duration-300 hover:text-primary"
                    >
                      Tentang Kami
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D2D8E183] to-transparent dark:via-[#959CB183]"></div>
          <div className="py-8">
            <p className="text-center text-base text-body-color text-white">
              @2025 CCED Universitas Lampung
            </p>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
};

export default Footer;

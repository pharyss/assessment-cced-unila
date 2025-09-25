import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hubungi Kami"
        description="Tentang Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung."
      />

      <section id="contact" className="overflow-hidden py-[50px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap lg:items-stretch">
            <div className="w-full px-4 lg:w-1/2">
              <div
                className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 flex h-full flex-col rounded-md bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                data-wow-delay=".15s
              "
              >
                <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                  Butuh Bantuan? Hubungi Kami
                </h2>
                <p className="mb-12 text-base font-medium text-body-color">
                  Tim kami akan segera menghubungimu melalui email.
                </p>
                <form>
                  <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label
                          htmlFor="name"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Nama
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan namamu"
                          className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
                    <div className="w-full px-4 md:w-1/2">
                      <div className="mb-8">
                        <label
                          htmlFor="email"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="Masukkan emailmu"
                          className="border-stroke dark:text-body-color-dark dark:shadow-two w-full rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        />
                      </div>
                    </div>
                    <div className="w-full px-4">
                      <div className="mb-8">
                        <label
                          htmlFor="message"
                          className="mb-3 block text-sm font-medium text-dark dark:text-white"
                        >
                          Pesan
                        </label>
                        <textarea
                          name="message"
                          rows={5}
                          placeholder="Masukkan pesanmu"
                          className="border-stroke dark:text-body-color-dark dark:shadow-two w-full resize-none rounded-md border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:focus:border-primary dark:focus:shadow-none"
                        ></textarea>
                      </div>
                    </div>
                    <div className="w-full px-4">
                      <button className="shadow-submit dark:shadow-submit-dark rounded-full bg-primary px-9 py-4 text-base font-medium text-white duration-300 hover:bg-primary/90">
                        Kirim Pesan
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <div
                className="wow fadeInUp shadow-three dark:bg-gray-dark mb-12 flex h-full flex-col rounded-md bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
                data-wow-delay=".15s"
              >
                <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                  Alamat
                </h2>
                <p className="mb-6 text-base font-medium text-body-color">
                  Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung <br />
                  Jl. Prof. Dr. Sumantri Brojonegoro No.1, Gedong Meneng, Bandar Lampung, Lampung 35141
                </p>
                <div className="overflow-hidden rounded-md h-64 sm:h-72 lg:h-80">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1980.892407066265!2d105.2396198772669!3d-5.363837994610144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e40db0685c4e68b%3A0x2d2f49a17df0a2db!2sUniversitas%20Lampung!5e0!3m2!1sid!2sid!4v1695980000000!5m2!1sid!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center">
            <h2 className="mb-5 text-2xl font-bold text-black dark:text-white">
              Connected to Us
            </h2>

            <div className="flex justify-center items-center space-x-8">
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@cced_unila"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="dark:text-body-color-dark text-body-color duration-300 hover:text-primary dark:hover:text-primary"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 18 14"
                  className="fill-current w-8 h-8"
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
                className="dark:text-body-color-dark text-body-color duration-300 hover:text-primary dark:hover:text-primary"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  className="fill-current w-8 h-8"
                >
                  <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.75-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://s.id/ShintaCCED"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="dark:text-body-color-dark text-body-color duration-300 hover:text-primary dark:hover:text-primary"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  className="fill-current w-8 h-8"
                >
                  <path d="M12 2a10 10 0 0 0-8.94 14.56L2 22l5.61-1.52A10 10 0 1 0 12 2zm0 2a8 8 0 0 1 6.82 12.28l-.26.41.67 3-3.09-.84-.38.23A8 8 0 1 1 12 4zm4.29 10.46c-.23-.11-1.36-.67-1.57-.75-.21-.08-.36-.11-.51.11s-.59.75-.72.91c-.13.15-.27.17-.5.06a6.57 6.57 0 0 1-1.94-1.2 7.25 7.25 0 0 1-1.34-1.65c-.14-.25 0-.38.1-.5.1-.1.23-.27.34-.4.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.4-.06-.11-.51-1.24-.7-1.7-.18-.43-.36-.37-.51-.38h-.43c-.15 0-.4.06-.61.29-.21.23-.8.77-.8 1.88s.82 2.18.93 2.33c.11.15 1.61 2.47 3.9 3.46 2.29.99 2.29.66 2.7.62.41-.04 1.36-.55 1.55-1.08.19-.53.19-.99.13-1.08-.06-.09-.21-.15-.44-.26z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default AboutPage;

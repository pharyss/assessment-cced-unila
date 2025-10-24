import Breadcrumb from "@/components/Common/Breadcrumb";
import ContactForm from "@/components/Contact/ContactForm";
import ContactAddress from "@/components/Contact/ContactAddress";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hubungi Kami"
        description="Tentang  Center for Career & Entrepreneurship Development Universitas Lampung."
      />

      <section id="contact" className="overflow-hidden py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap lg:items-stretch">
            <div className="w-full px-4 mb-10 lg:mb-0 lg:w-1/2">
              <ContactForm />
            </div>
            <div className="w-full px-4 lg:w-1/2">
              <ContactAddress />
            </div>
          </div>

          <div className="mt-14 text-center">
            <h2 className="mb-5 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Connected to Us
            </h2>

            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8">
              {/* YouTube */}
              <a
                href="https://www.youtube.com/@cced_unila"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-body-color dark:text-body-color-dark transition-colors duration-300 hover:text-primary dark:hover:text-primary"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 18 14"
                  className="fill-current sm:w-8 sm:h-8 w-7 h-7"
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
                className="text-body-color dark:text-body-color-dark transition-colors duration-300 hover:text-primary dark:hover:text-primary"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  className="fill-current sm:w-8 sm:h-8 w-7 h-7"
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
                className="text-body-color dark:text-body-color-dark transition-colors duration-300 hover:text-primary dark:hover:text-primary"
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  className="fill-current sm:w-8 sm:h-8 w-7 h-7"
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

export default ContactPage;

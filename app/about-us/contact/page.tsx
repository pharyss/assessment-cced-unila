<<<<<<< HEAD
import Breadcrumb from "@/components/Common/Breadcrumb";
import ContactForm from "@/components/Contact/ContactForm";
import ContactAddress from "@/components/Contact/ContactAddress";
import Socials from "@/components/Contact/Socials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | CCED Universitas Lampung",
  description:
    "Halaman kontak Center for Career & Entrepreneurship Development Universitas Lampung.",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Hubungi Kami"
        description="Hubungi Center for Career & Entrepreneurship Development Universitas Lampung untuk informasi lebih lanjut."
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
          <Socials />
        </div>
      </section>
=======
import AboutSectionOne from "@/components/About/AboutSectionOne";
import AboutSectionTwo from "@/components/About/AboutSectionTwo";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Tentang Kami"
        description="Tentang Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung."
      />
      <AboutSectionOne />
      <AboutSectionTwo />
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
    </>
  );
};

<<<<<<< HEAD
export default ContactPage;
=======
export default AboutPage;
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc

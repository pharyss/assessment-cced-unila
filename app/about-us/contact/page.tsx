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
    </>
  );
};

export default ContactPage;

import FAQ from "@/components/Faq";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FaQ | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
  // other metadata
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Frequently Asked Question"
        description="Tentang Unit Penunjang Akademik Center for Career & Entrepreneurship Development Universitas Lampung."
      />

      <section className="py-[50px]">
        <div className="container">
            <FAQ />
        </div>
      </section>
    </>
  );
};

export default AboutPage;

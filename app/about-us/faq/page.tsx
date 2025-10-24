import FAQ from "@/components/Faq";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FaQ | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Frequently Asked Question"
        description="Tentang Center for Career & Entrepreneurship Development Universitas Lampung."
      />
      <FAQ className="bg-white dark:bg-gray-900" />
    </>
  );
};

export default AboutPage;

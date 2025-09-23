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
    </>
  );
};

export default AboutPage;

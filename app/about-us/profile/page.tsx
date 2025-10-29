import Breadcrumb from "@/components/Common/Breadcrumb";
import Profile from "@/components/About/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil CCED | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Profil CCED"
        description="Tentang Center for Career & Entrepreneurship Development Universitas Lampung."
      />
      <Profile />
    </>
  );
};

export default AboutPage;

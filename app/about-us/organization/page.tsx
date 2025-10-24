import Breadcrumb from "@/components/Common/Breadcrumb";
import OrganizationStructure from "@/components/About/OrganizationStructure";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Struktur Organisasi | CCED Universitas Lampung",
  description: "Tentang CCED Universitas Lampung",
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumb
        pageName="Struktur Organisasi"
        description="Tentang Center for Career & Entrepreneurship Development Universitas Lampung."
      />
      <OrganizationStructure />
    </>
  );
}

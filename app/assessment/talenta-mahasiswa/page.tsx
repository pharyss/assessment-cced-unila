import AssessmentIntro from "@/components/Assessment/AssessmentIntro";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asesmen Talenta Mahasiswa | CCED Universitas Lampung",
  description:
    "Asesmen Talenta Mahasiswa Center for Career & Entrepreneurship Development Universitas Lampung.",
};

export default function AssessmentPage() {
  return (
    <>
      <AssessmentIntro />
    </>
  );
}

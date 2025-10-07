import AboutSectionOne from "@/components/About/AboutSectionOne";
import ScrollUp from "@/components/Common/ScrollUp";
import Introduction from "@/components/Introduction";
import Hero from "@/components/Hero";
import FAQ from "@/components/Faq";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asesmen CCED Universitas Lampung",
  description: "Layanan Tes Asesmen CCED Universitas Lampung",
  // other metadata
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <AboutSectionOne />
      <Introduction />
      <FAQ />
    </>
  );
}

import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/HomePage/Hero";
import HeroTwo from "@/components/HomePage/HeroTwo";
import FAQ from "@/components/Faq";
import { Metadata } from "next";
import Overview from "@/components/HomePage/Overview";
import Benefit from "@/components/HomePage/Benefit";
import Vision from "@/components/HomePage/Vision";

export const metadata: Metadata = {
  title: "Asesmen CCED Universitas Lampung",
  description: "Layanan Tes Asesmen CCED Universitas Lampung",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <HeroTwo />
      <Overview />
      <Benefit />
      <Vision />
      <FAQ className="bg-gradient-to-b from-primary/10 via-primary/15 to-primary/20 dark:from-gray-800 dark:to-gray-700"/>
    </>
  );
}

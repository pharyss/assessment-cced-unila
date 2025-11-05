<<<<<<< HEAD
import ScrollUp from "@/components/Common/ScrollUp";
import Hero from "@/components/HomePage/Hero";
import HeroTwo from "@/components/HomePage/HeroTwo";
import FAQ from "@/components/Faq";
import { Metadata } from "next";
import Overview from "@/components/HomePage/Overview";
import Benefit from "@/components/HomePage/Benefit";
import Vision from "@/components/HomePage/Vision";
=======
import AboutSectionOne from "@/components/About/AboutSectionOne";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import { Metadata } from "next";
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc

export const metadata: Metadata = {
  title: "Asesmen CCED Universitas Lampung",
  description: "Layanan Tes Asesmen CCED Universitas Lampung",
<<<<<<< HEAD
=======
  // other metadata
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
};

export default function Home() {
  return (
    <>
      <ScrollUp />
<<<<<<< HEAD
      <HeroTwo />
      <Overview />
      <Benefit />
      <Vision />
      <FAQ className="bg-gradient-to-b from-myunila-100 via-myunila-200 to-myunila-300 dark:from-gray-800 dark:to-gray-700"/>
=======
      <Hero />
      <AboutSectionOne />
      <Features />
      <Contact />
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
    </>
  );
}

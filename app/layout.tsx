<<<<<<< HEAD
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import { ClientProviders } from "./ClientProviders";
import "./global.css";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Asesmen Talenta Mahasiswa - Universitas Lampung",
    template: "%s | Asesmen Talenta Unila",
  },
  description:
    "Platform asesmen karir dan pola perilaku untuk mahasiswa Universitas Lampung.",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Asesmen Talenta Mahasiswa Unila",
    description:
      "Temukan talenta karir dan pola perilaku Anda melalui asesmen interaktif.",
    url: "https://yourdomain.com",
    siteName: "Unila Assessment",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Asesmen Talenta Unila",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  generator: "Next.js + Tailwind CSS",
  robots: {
    index: process.env.NODE_ENV === "production",
    follow: true,
  },
};
=======
"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "../styles/index.css";
const inter = Inter({ subsets: ["latin"] });
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <html lang="id" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins bg-[#FCFCFC] dark:bg-black text-gray-900 dark:text-gray-100">
        <ClientProviders>{children}</ClientProviders>
=======
    <html suppressHydrationWarning lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </Providers>
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc
      </body>
    </html>
  );
}
<<<<<<< HEAD
=======

import { Providers } from "./providers";
>>>>>>> 880ec58fb4eb94d770c441b8e71cd182a492ccfc

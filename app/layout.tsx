import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import { ClientProviders } from "./ClientProviders";
import "../styles/index.css";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={poppins.variable} suppressHydrationWarning>
      <body className="font-poppins bg-[#FCFCFC] dark:bg-black text-gray-900 dark:text-gray-100">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

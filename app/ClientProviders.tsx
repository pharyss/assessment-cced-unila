"use client";

import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Providers } from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <Providers>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="z-50"
        toastOptions={{
          duration: 4000,
          style: {
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease-in-out",
            background: "#6b7280", // default (gray)
            color: "#fff",
          },
          blank: {
            duration: 3000,
            style: {
              background: "#3b82f6", // info
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#3b82f6",
            },
            icon: "ℹ️",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981", // green
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444", // red
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
          loading: {
            duration: 2000,
            style: {
              background: "#f59e0b", // amber
              color: "#fff",
            },
          },
          className: "!dark:bg-gray-800 !dark:text-white",
        }}
      />
    </Providers>
  );
}

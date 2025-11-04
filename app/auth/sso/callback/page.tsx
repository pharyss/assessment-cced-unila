"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function SsoCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      console.error("Token tidak ditemukan di URL callback");
      router.push("/login");
      return;
    }

    fetch("https://asesmen-unila.test/api/auth/sso-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status && data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/asesmen");
        } else {
          alert("Login gagal. Silakan coba lagi.");
          router.push("/login");
        }
      })
      .catch((err) => {
        console.error("Error verifikasi token:", err);
        router.push("/login");
      });
  }, [params, router]);

  return (
    <div className="flex h-screen flex-col items-center justify-center text-gray-700">
      <p>Memverifikasi akun Anda...</p>
    </div>
  );
}

export default function SsoCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen flex-col items-center justify-center text-gray-700">
          <p>Memuat...</p>
        </div>
      }
    >
      <SsoCallbackContent />
    </Suspense>
  );
}

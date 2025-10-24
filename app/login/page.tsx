"use client";

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = "https://asesmen-unila.test/login/sso";
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">Selamat Datang di Sistem Asesmen</h1>
      <p className="text-gray-500">Masuk menggunakan akun SSO Universitas Lampung</p>
      <button
        onClick={handleLogin}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
      >
        Login dengan SSO Unila
      </button>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";

const Signin = () => {
  return (
    <section
      id="signin"
      className="
        relative z-10 flex items-center justify-center overflow-hidden
        bg-gradient-to-b from-white via-myunila-50 to-myunila-100
        pb-16 pt-[120px] text-center 
        dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 
        md:pb-[120px] md:pt-[150px] xl:min-h-screen
        transition-colors duration-500
      "
      style={{
        backgroundImage: "url('/images/hero/background.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-myunila-50/60 to-myunila-100/50 dark:from-gray-950/80 dark:via-gray-900/75 dark:to-gray-800/80 transition-colors duration-500" />

      {/* Dekorasi blur */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute -right-8 -top-8 h-40 w-40 sm:h-52 sm:w-52 md:h-64 md:w-64 lg:h-72 lg:w-72 xl:h-80 xl:w-80 rounded-full bg-myunila/60 dark:bg-myunila-400/20 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        viewport={{ once: true }}
        className="absolute -bottom-10 -left-10 h-48 w-48 sm:h-60 sm:w-60 md:h-72 md:w-72 lg:h-80 lg:w-80 xl:h-96 xl:w-96 rounded-full bg-myunila/50 dark:bg-myunila-300/10 blur-3xl"
      />

      {/* Card form */}
      <div className="relative z-10 shadow-three mx-auto max-w-[600px] rounded-lg bg-white/90 px-6 py-10 backdrop-blur-sm dark:bg-gray-900/90 sm:p-[60px] transition-colors duration-500">
        <h3 className="mb-3 text-center text-2xl font-bold text-black dark:text-white sm:text-3xl">
          Selamat Datang di{" "}
          <span className="text-myunila dark:text-myunila-400">
            CCED Universitas Lampung
          </span>
        </h3>

        <div className="mb-8 flex items-center justify-center">
          <span className="hidden h-[1px] w-full max-w-[80px] bg-gray-300 dark:bg-gray-700 sm:block" />
          <p className="w-full px-5 text-center text-base font-medium text-gray-700 dark:text-gray-300">
            Masuk ke akunmu
          </p>
          <span className="hidden h-[1px] w-full max-w-[80px] bg-gray-300 dark:bg-gray-700 sm:block" />
        </div>

        <form className="w-full text-left space-y-8">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-base font-medium text-gray-800 dark:text-gray-200"
            >
              Username
            </label>
            <div
              className="
                flex items-center gap-3 bg-gray-50 border border-gray-200 
                hover:border-myunila focus-within:border-myunila
                transition-all duration-300 shadow-sm hover:shadow-md 
                rounded-md overflow-hidden px-5
                dark:bg-gray-800 dark:border-gray-700
              "
            >
              <User className="text-gray-500 dark:text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                placeholder="Masukkan username"
                className="
                  w-full py-3 text-base text-gray-800
                  bg-transparent outline-none placeholder-gray-400
                  dark:text-gray-100 dark:placeholder-gray-500
                "
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-base font-medium text-gray-800 dark:text-gray-200"
            >
              Sandi
            </label>
            <div
              className="
                flex items-center gap-3 bg-gray-50 border border-gray-200 
                hover:border-myunila focus-within:border-myunila
                transition-all duration-300 shadow-sm hover:shadow-md 
                rounded-md overflow-hidden px-5
                dark:bg-gray-800 dark:border-gray-700
              "
            >
              <Lock className="text-gray-500 dark:text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="password"
                placeholder="Masukkan sandi"
                className="
                  w-full py-3 text-base text-gray-800
                  bg-transparent outline-none placeholder-gray-400
                  dark:text-gray-100 dark:placeholder-gray-500
                "
              />
            </div>
          </div>

          {/* Lupa sandi */}
          <div className="flex flex-col justify-between sm:flex-row sm:items-center">
            <a
              href="#0"
              className="text-sm font-medium text-myunila hover:underline dark:text-myunila-400"
            >
              Lupa sandi?
            </a>
          </div>

          {/* Tombol */}
          <div>
            <button
              type="submit"
              className="
                flex w-full items-center justify-center rounded-full 
                bg-myunila px-9 py-4 text-base font-medium text-white 
                duration-300 hover:bg-myunila-700 
                shadow-submit dark:shadow-submit-dark
              "
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Signin;

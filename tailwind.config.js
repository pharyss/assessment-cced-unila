/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      xs: "450px",
      sm: "575px",
      md: "768px",
      lg: "992px",
      xl: "1200px",
      "2xl": "1400px",
    },
    extend: {
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#121723",
        dark: "#1D2430",
        primary: "#2b81cdff",
        yellow: "#FBB040",
        "body-color": "#788293",
        "body-color-dark": "#959CB1",
        "gray-dark": "#1E232E",
        "gray-light": "#F0F2F9",
        stroke: "#E3E8EF",
        "stroke-dark": "#353943",
        "bg-color-dark": "#161b27ff",

        // Warna status
        success: "#108981",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3882F6",

        // Warna myunila
        myunila: {
          DEFAULT: "#085EA8",
          50: "#E6F2FA",
          100: "#CCE5F5",
          200: "#99CBEA",
          300: "#6681E1",
          400: "#3397D7",
          500: "#0B5EA8",
          600: "#094886",
          700: "#073864",
          800: "#052542",
          900: "#021220",
        },
      },

      backgroundImage: {
        "gradient-blue-modern":
          "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1e40af 100%)",
        "gradient-ocean": "linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)",
        "gradient-sky":
          "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        one: "0px 2px 3px rgba(7, 7, 77, 0.05)",
        two: "0px 5px 10px rgba(6, 8, 15, 0.1)",
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
        sticky: "inset 0 -1px 0 0 rgba(0, 0, 0, 0.1)",
        "sticky-dark": "inset 0 -1px 0 0 rgba(255, 255, 255, 0.1)",
        "feature-2": "0px 10px 40px rgba(48, 86, 211, 0.12)",
        submit: "0px 5px 20px rgba(4, 10, 34, 0.1)",
        "submit-dark": "0px 5px 20px rgba(4, 10, 34, 0.1)",
        btn: "0px 1px 2px rgba(4, 10, 34, 0.15)",
        "btn-hover": "0px 1px 2px rgba(0, 0, 0, 0.15)",
        "btn-light": "0px 1px 2px rgba(0, 0, 0, 0.1)",
      },

      dropShadow: {
        three: "0px 5px 15px rgba(6, 8, 15, 0.05)",
      },
    },
  },
  plugins: [],
};

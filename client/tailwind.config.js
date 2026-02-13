/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "forest-green": {
          50: "#f0f9f4",
          100: "#dcf2e3",
          200: "#bce4ca",
          300: "#8fcea8",
          400: "#5bb07e",
          500: "#38915f",
          600: "#2a744d",
          700: "#245c3f",
          800: "#214a35",
          900: "#1d3e2d",
          950: "#0f2319",
        },
        wood: {
          50: "#faf7f2",
          100: "#f4ede0",
          200: "#e7d8c0",
          300: "#d7be9a",
          400: "#c69f73",
          500: "#b8875a",
          600: "#a9734d",
          700: "#8d5d42",
          800: "#744e3b",
          900: "#604232",
          950: "#332019",
        },
        cream: "#fdfcf9",
        sage: "#e8f0e9",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(45, 116, 77, 0.12)",
        "soft-lg": "0 12px 40px -8px rgba(45, 116, 77, 0.18)",
        organic: "0 8px 32px -4px rgba(30, 62, 45, 0.15)",
        leaf: "0 2px 16px -2px rgba(42, 116, 77, 0.2)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "leaf-shine": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.4s ease-out forwards",
        float: "float 4s ease-in-out infinite",
        "leaf-shine": "leaf-shine 3s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-organic": "linear-gradient(135deg, #f0f9f4 0%, #fdfcf9 50%, #f4ede0 100%)",
        "gradient-hero": "linear-gradient(160deg, #fdfcf9 0%, #e8f0e9 40%, #dcf2e3 100%)",
        "leaf-pattern": "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 5c-2 8-8 14-14 18 6 4 12 10 14 18 2-8 8-14 14-18-6-4-12-10-14-18z' fill='%232a744d' fill-opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

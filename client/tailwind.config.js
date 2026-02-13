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
          950: "#0f2319"
        },
        "wood": {
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
          950: "#332019"
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

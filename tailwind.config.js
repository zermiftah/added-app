/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBFBFD",
        "cream-soft": "#F5F5F7",
        "cream-warm": "#F0EFEA",
        ink: "#0E0E0E",
        "ink-soft": "#1A1A1A",
        stone: "#6B6863",
        "stone-light": "#A6A39E",
        maroon: "#6B1818",
        "maroon-soft": "#7E2424",
        accent: "#C8354B",
        "accent-deep": "#9E2538",
        "accent-rose": "#E8B4BD",
      },
      fontFamily: {
        fraunces: ["'Fraunces'", "serif"],
        inter: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        dm: ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
}

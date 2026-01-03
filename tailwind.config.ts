import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "var(--color-cream)",
        'warm-white': "var(--color-warm-white)",
        charcoal: "var(--color-charcoal)",
        'charcoal-light': "var(--color-charcoal-light)",
        taupe: "var(--color-taupe)",
        'taupe-light': "var(--color-taupe-light)",
        'taupe-dark': "var(--color-taupe-dark)",
        bronze: "var(--color-bronze)",
        'bronze-light': "var(--color-bronze-light)",
        'bronze-dark': "var(--color-bronze-dark)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;

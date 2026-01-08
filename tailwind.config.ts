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
        // Primary palette - restrained luxury
        cream: {
          DEFAULT: "var(--color-cream)",
          50: "#FEFDFB",
          100: "#FAF8F3",
          200: "#F5F2EB",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          50: "#F7F7F6",
          100: "#E8E8E6",
          200: "#D1D0CD",
          300: "#A9A8A4",
          400: "#7A7975",
          500: "#5A5955",
          600: "#3D3C39",
          700: "#2A2927",
          800: "#1C1B1A",
          900: "#0F0F0E",
        },
        // Accent - warm bronze (used sparingly)
        accent: {
          DEFAULT: "var(--color-accent)",
          light: "var(--color-accent-light)",
          dark: "var(--color-accent-dark)",
        },
        // Legacy support
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
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      fontSize: {
        // Refined type scale
        'display': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'headline': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'title': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7', letterSpacing: '-0.01em' }],
        'body': ['1rem', { lineHeight: '1.7', letterSpacing: '-0.005em' }],
        'caption': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.08em' }],
      },
      spacing: {
        // Section spacing
        'section': 'clamp(5rem, 12vw, 10rem)',
        'section-sm': 'clamp(3rem, 8vw, 6rem)',
        // Container gutters
        'gutter': 'clamp(1.5rem, 4vw, 3rem)',
      },
      maxWidth: {
        'container': '80rem', // 1280px
        'content': '65rem', // 1040px
        'prose': '42rem', // 672px
      },
      borderRadius: {
        'card': '0.375rem',
      },
      boxShadow: {
        'soft': '0 2px 8px -2px rgba(0, 0, 0, 0.08)',
        'lift': '0 8px 24px -8px rgba(0, 0, 0, 0.12)',
        'glow': '0 0 40px -10px rgba(184, 160, 104, 0.15)',
        // Premium multi-layer shadows
        'premium': '0 1px 2px rgba(0, 0, 0, 0.02), 0 4px 8px rgba(0, 0, 0, 0.03), 0 8px 16px rgba(0, 0, 0, 0.04)',
        'premium-lg': '0 2px 4px rgba(0, 0, 0, 0.02), 0 8px 16px rgba(0, 0, 0, 0.05), 0 16px 32px rgba(0, 0, 0, 0.06)',
        // Bronze-tinted shadows
        'bronze-glow': '0 0 30px rgba(184, 160, 104, 0.12), 0 0 60px rgba(184, 160, 104, 0.06)',
        // Inner shadow for depth
        'inner-subtle': 'inset 0 1px 3px rgba(0, 0, 0, 0.04)',
        'inner-bronze': 'inset 0 0 20px rgba(184, 160, 104, 0.04)',
      },
      transitionDuration: {
        'fast': '250ms',
        'standard': '300ms',
        'medium': '350ms',
        'slow': '800ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.6' },
        },
        static: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '4px 4px' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;

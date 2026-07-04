import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Themeable tokens (see globals.css). RGB-channel vars keep /opacity working.
        ink: {
          DEFAULT: 'rgb(var(--bg-rgb) / <alpha-value>)',
          900: 'rgb(var(--surface-1-rgb) / <alpha-value>)',
          800: 'rgb(var(--surface-2-rgb) / <alpha-value>)',
          700: 'rgb(var(--surface-3-rgb) / <alpha-value>)',
          600: 'rgb(var(--surface-4-rgb) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--gold-rgb) / <alpha-value>)',
          light: 'rgb(var(--gold-light-rgb) / <alpha-value>)',
          dark: 'rgb(var(--gold-dark-rgb) / <alpha-value>)',
        },
        sand: {
          DEFAULT: 'rgb(var(--text-rgb) / <alpha-value>)',
          muted: 'rgb(var(--text-muted-rgb) / <alpha-value>)',
        },
        foam: 'rgb(var(--foam-rgb) / <alpha-value>)',
        // Hairlines / dividers: white on dark, near-black on light.
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'EB Garamond', 'serif'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'Caveat', 'EB Garamond', 'cursive'],
      },
      letterSpacing: {
        eyebrow: '0.32em',
      },
      maxWidth: {
        content: '1280px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'slow-zoom': 'slow-zoom 18s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface2)',
        border: 'var(--color-border)',
        border2: 'var(--color-border2)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        accent2: 'var(--color-accent2)',
        green: 'var(--color-green)',
        red: 'var(--color-red)',
        blue: 'var(--color-blue)',
        orange: 'var(--color-orange)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        playfair: ['var(--font-playfair)'],
      },
    },
  },
};

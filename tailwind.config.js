/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Noto Serif', 'serif'],
        serif: ['Noto Serif', 'serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FF6B6B',
          dark: '#EE5A52',
        },
        secondary: {
          DEFAULT: '#4ECDC4',
          dark: '#45B7AF',
        },
        accent: {
          DEFAULT: '#FFE66D',
          dark: '#F4D35E',
        },
      },
    },
  },
  plugins: [],
}


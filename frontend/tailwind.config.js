/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#030712',
        'primary-light': '#1f2937',
        'primary-dark': '#000000',
      }
    },
  },
  plugins: [],
}
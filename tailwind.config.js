/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#14151A',
        'card-bg': '#1C1D24',
        primary: '#7C5DFA',
        'primary-hover': '#9277FF',
        text: '#FFFFFF',
        'text-secondary': '#888EB0',
        border: '#252945',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
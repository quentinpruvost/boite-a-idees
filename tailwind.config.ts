import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        'hospital-blue': {
          DEFAULT: '#005A9E', // Bleu institutionnel
          light: '#E6F0F6',
        },
        'hospital-green': {
          DEFAULT: '#009A7F', // Vert médical / Action
          light: '#E6F5F3',
        },
      },
    },
  },
  plugins: [],
};
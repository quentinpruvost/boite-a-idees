import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      fontFamily: {
        // Ajoute la police 'Inter' à la pile de polices sans-serif
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
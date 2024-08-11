const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    colors: {
      primary: '#DBBFFF',
      secondary: '#23223C',
      background: '#131221',
      white: '#FFFFFF',
    },
    extend: {
      boxShadow: {
        custom: '-25px -25px 30px -15px rgba(0, 0, 0, 0.25)',
      },
    },
    fontFamily: {
      sans: ['Inter Variable', ...defaultTheme.fontFamily.sans],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

import type { Config } from 'tailwindcss';

const { nextui } = require('@nextui-org/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    nextui({
      themes: {
        dark: {
          colors: {
            background: '#131221',
            primary: {
              DEFAULT: '#DBBFFF',
              foreground: '#000000',
            },
            secondary: {
              DEFAULT: '#3F3E55',
              foreground: '#ffffff',
            },
            midground: '#23223C',
            focus: '#DBBFFF',
          },
        },
      },
    }),
  ],
};
export default config;

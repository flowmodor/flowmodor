import type { Config } from 'tailwindcss';

const { heroui } = require('@heroui/react');

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
    heroui({
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
            danger: '#f5385a',
            midground: '#23223C',
            focus: '#DBBFFF',
          },
        },
      },
    }),
  ],
};
export default config;

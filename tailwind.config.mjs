const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
    fontFamily: {
      sans: ['Inter Variable', ...defaultTheme.fontFamily.sans],
    },
  },
	plugins: [],
}

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://flowmo.io',
  integrations: [react(), tailwind(), sitemap()],
  trailingSlash: 'never',
});

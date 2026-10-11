import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: doména. Do té doby GitHub Pages adresa; po změně upravit `site` (a `base`, pokud je web v podsložce).
const site = process.env.SITE_URL || 'https://TODO-uzivatel.github.io';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});

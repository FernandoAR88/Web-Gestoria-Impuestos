// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANTE: cambia `site` por el dominio definitivo antes de publicar.
// Se usa para las URLs canónicas, Open Graph y el sitemap.
export default defineConfig({
  site: 'https://www.example.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/gracias/'),
    }),
  ],
});

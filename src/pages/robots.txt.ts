import type { APIRoute } from 'astro';
import { site as config } from '../config/site';

// Mientras la web esté en preparación no se deja indexar nada.
export const GET: APIRoute = ({ site }) =>
  new Response(
    config.preLaunch
      ? 'User-agent: *\nDisallow: /\n'
      : `User-agent: *\nAllow: /\nDisallow: /gracias/\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

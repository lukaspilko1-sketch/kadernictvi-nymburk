import type { APIRoute } from 'astro';
import { robotsTxt } from '../lib/robots';

// Adresa mapy webu se bere z SITE_URL a BASE_PATH (astro.config.mjs), takže se po změně domény změní sama.
export const GET: APIRoute = ({ site }) =>
  new Response(robotsTxt(site ?? 'http://localhost', import.meta.env.BASE_URL), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

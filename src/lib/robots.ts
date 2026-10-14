/** Obsah robots.txt s adresou mapy webu odvozenou z adresy webu (site) a podsložky (base). */
export function robotsTxt(site: string | URL, base = '/'): string {
  const cesta = `/${base.replace(/^\/+|\/+$/g, '')}`.replace(/^\/$/, '');
  const mapa = new URL(`${cesta}/sitemap-index.xml`, site).href;
  return `User-agent: *\nAllow: /\n\nSitemap: ${mapa}\n`;
}

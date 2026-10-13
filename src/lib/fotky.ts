import type { ImageMetadata } from 'astro';
import { galerie } from './data';

const vsechny = import.meta.glob<{ default: ImageMetadata }>('../assets/galerie/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true });

/** Fotka podle názvu souboru nebo cesty (např. /src/assets/galerie/foto.jpg). Chybějící fotka shodí build. */
export function fotka(src: string): ImageMetadata {
  const nazev = src.split('/').pop()!;
  const m = vsechny[`../assets/galerie/${nazev}`];
  if (!m) {
    throw new Error(`\n\nFotka „${nazev}“ chybí ve složce src/assets/galerie/ (nebo má nepodporovaný formát; povolené jsou jpg, png, webp). Build se zastavil, web zůstává beze změny.\n`);
  }
  return m.default;
}

export interface PolozkaGalerie {
  soubor: string;
  alt: string;
  img: ImageMetadata;
}

/** Zapnuté fotky podle pole „poradi“. */
export function galerieFotky(): PolozkaGalerie[] {
  return galerie.fotky
    .filter((f: { zobrazit: boolean }) => f.zobrazit)
    .map((f: { src: string; alt: string }) => ({ soubor: f.src.split('/').pop()!, alt: f.alt, img: fotka(f.src) }));
}

import type { ImageMetadata } from 'astro';
import galerie from '../data/galerie.json';

const vsechny = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/*.{jpg,jpeg,png,webp}', { eager: true });

export function fotka(soubor: string): ImageMetadata | null {
  const m = vsechny[`../assets/photos/${soubor}`];
  if (!m) {
    console.warn(`[galerie] Chybí fotka src/assets/photos/${soubor}, položka se skryje.`);
    return null;
  }
  return m.default;
}

export interface PolozkaGalerie {
  soubor: string;
  alt: string;
  img: ImageMetadata;
}

/** Jen zapnuté fotky, které opravdu existují. */
export function galerieFotky(): PolozkaGalerie[] {
  return galerie.fotky.flatMap((f) => {
    if (!f.zobrazit) return [];
    const img = fotka(f.soubor);
    return img ? [{ soubor: f.soubor, alt: f.alt, img }] : [];
  });
}

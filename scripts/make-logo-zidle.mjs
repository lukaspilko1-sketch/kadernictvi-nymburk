// Vyrobí logo-židli pro hlavičku: čtvercový výřez 120 × 120 px ze zdroje src/assets/logo-zidle.jpg
// (perokresba kadeřnické židle, stejná jako profilový obrázek salonu na Facebooku).
// Kruh dělá CSS (border-radius), tady se jen zmenší (lanczos3, bez jakéhokoli dalšího zvětšování)
// a bílé pozadí kresby se „vynásobí“ barvou hlavičky, aby kolem židle nebyl bílý flek.
// Spuštění: node scripts/make-logo-zidle.mjs  (výstup: public/logo-zidle.webp)
import sharp from 'sharp';

const ZDROJ = 'src/assets/logo-zidle.jpg';
const VYSTUP = 'public/logo-zidle.webp';
const VELIKOST = 120;
const KREM = { r: 245, g: 244, b: 242 }; // --krem

const zmenseno = await sharp(ZDROJ)
  .resize(VELIKOST, VELIKOST, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
  .greyscale()
  .linear(1.12, -14) // mírně silnější linky, ať se jemné šrafování po zmenšení nerozpije do šedi
  .toColourspace('srgb')
  .toBuffer();

await sharp({ create: { width: VELIKOST, height: VELIKOST, channels: 3, background: KREM } })
  .composite([{ input: zmenseno, blend: 'multiply' }])
  .webp({ quality: 92, effort: 6 })
  .toFile(VYSTUP);

console.log(`logo židle hotovo: ${VYSTUP} (${VELIKOST}×${VELIKOST})`);

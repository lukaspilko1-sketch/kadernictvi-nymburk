// NÁVRH sjednocení favicony a og.png s logem (kulatá židle v champagne rámečku).
// Nic nepřepisuje v public/, jen vyrobí náhledy do složky nahled-favicon-og/ ke schválení.
// Spuštění: node scripts/navrh-favicon-og.mjs
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const ZDROJ = 'src/assets/logo-zidle.jpg';
const OUT = 'nahled-favicon-og';
const KREM = '#f5f4f2', CERNA = '#1d1d1f', CHAMPAGNE = '#c9ab78', SEDA = '#4b4c50';
mkdirSync(OUT, { recursive: true });

/** Kulatá židle s champagne rámečkem o průměru d (bez zvětšování, jen zmenšení lanczos3). */
async function kolo(d, ramek) {
  const vnitrni = d - 2 * ramek;
  const zidle = await sharp(ZDROJ)
    .resize(vnitrni, vnitrni, { fit: 'cover', kernel: 'lanczos3' })
    .greyscale()
    .linear(1.12, -14)
    .toColourspace('srgb')
    .toBuffer();
  const maska = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${vnitrni}" height="${vnitrni}"><circle cx="${vnitrni / 2}" cy="${vnitrni / 2}" r="${vnitrni / 2}" fill="#fff"/></svg>`);
  const oriznuta = await sharp({ create: { width: vnitrni, height: vnitrni, channels: 3, background: KREM } })
    .composite([{ input: zidle, blend: 'multiply' }])
    .png()
    .toBuffer()
    .then((b) => sharp(b).composite([{ input: maska, blend: 'dest-in' }]).png().toBuffer());
  const podklad = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${d}" height="${d}"><circle cx="${d / 2}" cy="${d / 2}" r="${d / 2}" fill="${CHAMPAGNE}"/></svg>`);
  return sharp(podklad).composite([{ input: oriznuta, left: ramek, top: ramek }]).png().toBuffer();
}

// Favicony: 32 (záložka), 180 (apple-touch-icon), 512 (PWA / sdílení)
const f32 = await kolo(32, 2);
const f180 = await kolo(180, 6);
const f512 = await kolo(512, 14);
await sharp(f32).toFile(`${OUT}/favicon-32.png`);
await sharp(f180).flatten({ background: KREM }).toFile(`${OUT}/apple-touch-icon-180.png`);
await sharp(f512).toFile(`${OUT}/icon-512.png`);

// og.png 1200 × 630: logo vlevo, název a podtitulek vpravo
const logo = await kolo(380, 8);
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<rect width="1200" height="630" fill="${KREM}"/>
<rect x="28" y="28" width="1144" height="574" fill="none" stroke="${CHAMPAGNE}" stroke-width="3"/>
<line x1="520" y1="160" x2="520" y2="470" stroke="${CHAMPAGNE}" stroke-width="3"/>
<text x="560" y="272" font-family="Georgia, serif" font-size="62" fill="${CERNA}">Kadeřnictví</text>
<text x="560" y="344" font-family="Georgia, serif" font-size="62" fill="${CERNA}">a holičství</text>
<text x="560" y="416" font-family="Georgia, serif" font-size="62" font-style="italic" fill="#9a7c4a">Nymburk</text>
<text x="560" y="478" font-family="Georgia, serif" font-size="30" fill="${SEDA}">Pánské a dětské střihy · bez objednání</text>
<text x="600" y="565" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${CERNA}">Zbožská 664/4, Nymburk · 603 242 505</text>
</svg>`);
await sharp(text).composite([{ input: logo, left: 100, top: 125 }]).png().toFile(`${OUT}/og.png`);

// Náhledový plech: favicon ve skutečné velikosti 16/32/48 (zvětšeno pro čitelnost) + 180 + og
const p16 = await sharp(f512).resize(16, 16, { kernel: 'lanczos3' }).png().toBuffer();
const p32 = await sharp(f512).resize(32, 32, { kernel: 'lanczos3' }).png().toBuffer();
const p48 = await sharp(f512).resize(48, 48, { kernel: 'lanczos3' }).png().toBuffer();

const dlazdice = [
  { input: await sharp(p16).resize(64, 64, { kernel: 'nearest' }).png().toBuffer(), left: 20, top: 20 },
  { input: await sharp(p32).resize(128, 128, { kernel: 'nearest' }).png().toBuffer(), left: 110, top: 20 },
  { input: await sharp(p48).resize(144, 144, { kernel: 'nearest' }).png().toBuffer(), left: 270, top: 20 },
  { input: f180, left: 450, top: 20 },
];
await sharp({ create: { width: 660, height: 220, channels: 3, background: '#ffffff' } }).composite(dlazdice).png().toFile(`${OUT}/_nahled-favicon.png`);

console.log('Náhledy hotové ve složce', OUT);

// Generuje SVG/PNG loga z jedné definice. Spuštění: node scripts/make-logo.mjs
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const UHEL = '#2b2a27', SALVEJ = '#4f6b57', KREM = '#f3efe6', ZLATA = '#c9a36b';

const scissors = (c = UHEL, cut = KREM) => `<g transform="translate(62 58) scale(0.62)">
<ellipse cx="-15" cy="38" rx="8.5" ry="11" fill="none" stroke="${c}" stroke-width="3.6" transform="rotate(18 -15 38)"/>
<ellipse cx="15" cy="38" rx="8.5" ry="11" fill="none" stroke="${c}" stroke-width="3.6" transform="rotate(-18 15 38)"/>
<path d="M-13 28 L-3 8 L-5 3 L8 -4 L19 -58 L6 -22 L3 5 L-8 29Z" fill="${c}" stroke="${cut}" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M13 28 L3 8 L5 3 L-8 -4 L-19 -58 L-6 -22 L-3 5 L8 29Z" fill="${c}" stroke="${cut}" stroke-width="1.4" stroke-linejoin="round"/>
<circle cx="0" cy="3" r="2.3" fill="${cut}" stroke="${c}" stroke-width="1.2"/></g>`;

const comb = (c = SALVEJ) => {
  let s = `<g transform="translate(62 104)"><rect x="-48" y="-14" width="96" height="7.28" rx="3.64" fill="${c}"/>`;
  for (let i = 0; i < 14; i++) s += `<rect x="${(-45 + i * 3.6).toFixed(1)}" y="-7.72" width="1.9" height="21.7" rx="0.9" fill="${c}"/>`;
  for (let i = 0; i < 6; i++) s += `<rect x="${(6.9 + i * 6.4).toFixed(1)}" y="-7.72" width="3" height="21.7" rx="1.3" fill="${c}"/>`;
  return s + '</g>';
};

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 14 104 108" width="104" height="108" role="img" aria-label="Nůžky nad barberským hřebenem">${scissors()}${comb()}</svg>`;

const text = (x) => `<line x1="${x - 16}" y1="22" x2="${x - 16}" y2="108" stroke="${ZLATA}" stroke-width="1.6"/>
<text x="${x}" y="60" font-family="Fraunces, Georgia, serif" font-size="30" fill="${UHEL}">Kadeřnictví</text>
<text x="${x}" y="92" font-family="Fraunces, Georgia, serif" font-size="30" fill="${UHEL}">&amp; holičství <tspan fill="${SALVEJ}" font-style="italic">Nymburk</tspan></text>`;

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 130" width="420" height="130" role="img" aria-label="Kadeřnictví a holičství Nymburk"><title>Kadeřnictví a holičství Nymburk</title>${scissors()}${comb()}${text(140)}</svg>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${SALVEJ}"/><g transform="translate(32 33) scale(0.46) translate(-62 -66)">${scissors(KREM, SALVEJ)}${comb(ZLATA)}</g></svg>`;

writeFileSync('public/logo-mark.svg', mark);
writeFileSync('public/logo.svg', logo);
writeFileSync('public/favicon.svg', favicon);

await sharp(Buffer.from(logo), { density: 300 }).resize({ width: 512 }).flatten({ background: KREM }).png().toFile('public/logo-512.png');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${KREM}"/><rect x="30" y="30" width="1140" height="570" fill="none" stroke="${ZLATA}" stroke-width="3"/><g transform="translate(95 150) scale(2.4)">${logo.replace(/^<svg[^>]*>|<\/svg>$/g, '')}</g><text x="600" y="545" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${UHEL}">Zbožská 664/4, Nymburk · 603 242 505</text></svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og.png');
console.log('logo hotovo');

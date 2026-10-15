// Generuje SVG/PNG loga z jedné definice. Spuštění: node scripts/make-logo.mjs
// Varianta 2: nůžky nad barberským hřebenem, svislá linka, nápis. Paleta „Černá, šedá & champagne".
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const CERNA = '#1d1d1f', SEDA = '#4b4c50', KREM = '#f5f4f2';
const CHAMPAGNE = '#c9ab78', HREBEN = '#a08150';

const f = (n) => +n.toFixed(2);

/** Čepel jako zúžený trojúhelník (hrot -> pivot) + dřík ke kroužku + zvýrazněná ostrá hrana. */
function cepel({ tip, pivot, ring, vnitrni }, c, hrana) {
  const dx = pivot[0] - tip[0], dy = pivot[1] - tip[1];
  const len = Math.hypot(dx, dy);
  const nx = -dy / len, ny = dx / len; // normála
  const w = 5.6; // polovina šířky čepele u pivotu
  const a = [pivot[0] + nx * w, pivot[1] + ny * w];
  const b = [pivot[0] - nx * w, pivot[1] - ny * w];
  // vnitřní strana = ta, která míří k druhé čepeli
  const vn = vnitrni === 'a' ? a : b;
  const hx = f(tip[0] + (vn[0] - tip[0]) * 0.8), hy = f(tip[1] + (vn[1] - tip[1]) * 0.8);
  return `<path d="M${tip[0]} ${tip[1]}L${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}Z" fill="${c}" stroke="${c}" stroke-width="1.6" stroke-linejoin="round"/>
<path d="M${pivot[0]} ${pivot[1]}L${ring[0]} ${ring[1]}" stroke="${c}" stroke-width="6.2" stroke-linecap="round" fill="none"/>
<line x1="${tip[0]}" y1="${f(tip[1] + 3)}" x2="${hx}" y2="${hy}" stroke="${hrana}" stroke-width="1.5" stroke-linecap="round"/>`;
}

/** Nůžky se středem pivotu v (0,0); otevřené. */
const nuzky = (c = CERNA, hrana = KREM) => `
<ellipse cx="-17" cy="40" rx="10" ry="13" fill="none" stroke="${c}" stroke-width="5" transform="rotate(20 -17 40)"/>
<ellipse cx="17" cy="40" rx="10" ry="13" fill="none" stroke="${c}" stroke-width="5" transform="rotate(-20 17 40)"/>
${cepel({ tip: [22, -62], pivot: [0, 2], ring: [-11, 27], vnitrni: 'a' }, c, hrana)}
${cepel({ tip: [-22, -62], pivot: [0, 2], ring: [11, 27], vnitrni: 'b' }, c, hrana)}
<circle cx="0" cy="2" r="3.6" fill="${hrana}" stroke="${c}" stroke-width="1.8"/>`;

/** Barberský hřeben: jemné zuby vlevo, hrubší vpravo. Středem je (0,0) = střed hřbetu. */
const hreben = (c = HREBEN) => {
  let s = `<rect x="-48" y="-5" width="96" height="10" rx="5" fill="${c}"/>`;
  for (let i = 0; i < 7; i++) s += `<rect x="${f(-44 + i * 5.4)}" y="0" width="3.2" height="22" rx="1.6" fill="${c}"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${f(3 + i * 10.6)}" y="0" width="5.6" height="22" rx="2.4" fill="${c}"/>`;
  return s;
};

const znacka = (cn = CERNA, ch = HREBEN, hrana = KREM) =>
  `<g transform="translate(62 56) scale(0.6)">${nuzky(cn, hrana)}</g><g transform="translate(62 96)">${hreben(ch)}</g>`;

const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="10 14 104 108" width="104" height="108" role="img" aria-label="Nůžky nad barberským hřebenem">${znacka()}</svg>`;

const text = (x) => `<line x1="${x - 16}" y1="22" x2="${x - 16}" y2="108" stroke="${CHAMPAGNE}" stroke-width="2"/>
<text x="${x}" y="60" font-family="Fraunces, Georgia, serif" font-size="30" fill="${CERNA}">Kadeřnictví</text>
<text x="${x}" y="92" font-family="Fraunces, Georgia, serif" font-size="30" fill="${CERNA}">&amp; holičství <tspan fill="${SEDA}" font-style="italic">Nymburk</tspan></text>`;

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 130" width="420" height="130" role="img" aria-label="Kadeřnictví a holičství Nymburk"><title>Kadeřnictví a holičství Nymburk</title>${znacka()}${text(140)}</svg>`;


writeFileSync('public/logo-mark.svg', mark);
writeFileSync('public/logo.svg', logo);

await sharp(Buffer.from(logo), { density: 300 }).resize({ width: 512 }).flatten({ background: KREM }).png().toFile('public/logo-512.png');

// Favicony a og.png (židle) už tenhle skript nevyrábí, jsou hotové v public/ (favicon.ico, favicon-32.png, apple-touch-icon.png, icon-*.png, og.png).
console.log('logo hotovo');

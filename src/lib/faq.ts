// Časté dotazy a pomocné texty generované z dat webu (hodiny, ceník, adresa, platba).
// Díky tomu odpovědi nikdy nejsou v rozporu se zbytkem stránky. Co nejde z dat sestavit, se nezobrazí.
import { dnyPoradi, kratkyCas, type Den, type Hodiny } from './otevreno';

const DNY_1P: Record<Den, string> = { po: 'pondělí', ut: 'úterý', st: 'středa', ct: 'čtvrtek', pa: 'pátek', so: 'sobota', ne: 'neděle' };
const DNY_KRATCE: Record<Den, string> = { po: 'Po', ut: 'Út', st: 'St', ct: 'Čt', pa: 'Pá', so: 'So', ne: 'Ne' };

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function spoj(slova: string[]): string {
  if (slova.length <= 1) return slova.join('');
  return `${slova.slice(0, -1).join(', ')} a ${slova[slova.length - 1]}`;
}

/** „pondělí až pátek“, „pondělí, středa a pátek“; prázdné, když je zavřeno celý týden. */
export function dnyOtevreno(hodiny: Hodiny): string {
  const otevrene = dnyPoradi.map((d, i) => (hodiny[d] ? i : -1)).filter((i) => i >= 0);
  if (!otevrene.length) return '';
  const souvisle = otevrene.every((i, k) => k === 0 || i === otevrene[k - 1] + 1);
  if (souvisle && otevrene.length >= 3) return `${DNY_1P[dnyPoradi[otevrene[0]]]} až ${DNY_1P[dnyPoradi[otevrene[otevrene.length - 1]]]}`;
  return spoj(otevrene.map((i) => DNY_1P[dnyPoradi[i]]));
}

/** „Po 8:00–14:30, Út 8:00–16:30, …, o víkendu zavřeno.“; prázdné, když je zavřeno celý týden. */
export function popisHodin(hodiny: Hodiny): string {
  const casti: string[] = [];
  for (const d of dnyPoradi) {
    const h = hodiny[d];
    if (h) casti.push(`${DNY_KRATCE[d]} ${kratkyCas(h.od)}–${kratkyCas(h.do)}`);
  }
  if (!casti.length) return '';
  const zavrene = dnyPoradi.filter((d) => !hodiny[d]);
  if (zavrene.length === 2 && zavrene.includes('so') && zavrene.includes('ne')) casti.push('o víkendu zavřeno');
  else for (const d of zavrene) casti.push(`${DNY_KRATCE[d]} zavřeno`);
  return `${casti.join(', ')}.`;
}

/** „Stříháme pány a děti z Nymburka, Poděbrad a Sadské.“ (druhé pády se berou z dat). */
export function vetaObci(uvod: string, obce: { z: string }[]): string {
  if (!obce.length) return '';
  return `${uvod} ${spoj(obce.map((o) => o.z))}.`;
}

interface Cenik {
  skupiny: { id: string; sekce: { polozky: { nazev: string; cena: number }[] }[] }[];
}

/** Cena položky „Klasika“ z pánského ceníku (nebo undefined, když tam není). */
export function cenaKlasiky(cenik: Cenik): number | undefined {
  const panske = cenik.skupiny.find((s) => s.id === 'panske');
  for (const sekce of panske?.sekce ?? []) {
    const p = sekce.polozky.find((x) => x.nazev.trim().toLowerCase() === 'klasika');
    if (p) return p.cena;
  }
  return undefined;
}

export interface KontextDotazu {
  hodiny: Hodiny;
  cenik: Cenik;
  facebook: string;
  platba: string;
  adresa: { ulice: string; mesto: string; psc?: string };
  maFotkuBudovy: boolean;
}

export interface Dotaz {
  otazka: string;
  /** Bezpečné HTML (text je escapovaný, jen odkazy jsou vložené kódem). */
  html: string;
}

function znacky(k: KontextDotazu): Record<string, string | undefined> {
  const kontakt = '<a href="#kontakt">Kontakt</a>';
  const psc = k.adresa.psc?.trim();
  const klasika = cenaKlasiky(k.cenik);
  return {
    dny: dnyOtevreno(k.hodiny) || undefined,
    hodiny: popisHodin(k.hodiny) || undefined,
    facebook: k.facebook ? `<a href="${escape(k.facebook)}" target="_blank" rel="noopener noreferrer">Facebooku</a>` : undefined,
    klasika: klasika === undefined ? undefined : `${klasika.toLocaleString('cs-CZ')} Kč`,
    platba: k.platba.trim() ? escape(k.platba.trim()) : undefined,
    adresa: `${escape(k.adresa.ulice)}, ${psc ? `${escape(psc)} ` : ''}${escape(k.adresa.mesto)}`,
    mapa: k.maFotkuBudovy ? `Mapa a fotka vstupu jsou v sekci ${kontakt}` : `Mapa je v sekci ${kontakt}`,
  };
}

/** Dosadí údaje do odpovědi. Když některá značka nemá data, vrátí null (otázka se nezobrazí). */
export function vykresliOdpoved(sablona: string, k: KontextDotazu): string | null {
  const hodnoty = znacky(k);
  let chybi = false;
  const html = sablona
    .split(/(\{[^}]+\})/)
    .map((cast) => {
      const m = cast.match(/^\{([^}]+)\}$/);
      if (!m) return escape(cast);
      const v = hodnoty[m[1]];
      if (v === undefined) chybi = true;
      return v ?? '';
    })
    .join('');
  return chybi ? null : html;
}

export function sestavDotazy(dotazy: { otazka: string; odpoved: string }[], k: KontextDotazu): Dotaz[] {
  return dotazy.flatMap((d) => {
    const html = vykresliOdpoved(d.odpoved, k);
    return html === null ? [] : [{ otazka: d.otazka, html }];
  });
}

import { describe, it, expect } from 'vitest';
import { nactiAValiduj } from '../src/lib/nacti-data.mjs';
import { cenaKlasiky, dnyOtevreno, popisHodin, sestavDotazy, vetaObci, vykresliOdpoved, type KontextDotazu } from '../src/lib/faq';
import { formatujPsc, sestavJsonLd } from '../src/lib/jsonld';
import { robotsTxt } from '../src/lib/robots';

const data = nactiAValiduj();
const { firma, cenik, okoli, seo } = data;

const kontext = (zmeny: Partial<KontextDotazu> = {}): KontextDotazu => ({
  hodiny: firma.hodiny,
  cenik,
  facebook: firma.facebook,
  platba: firma.platba,
  adresa: firma.adresa,
  maFotkuBudovy: false,
  ...zmeny,
});

describe('hodiny pro dotazy', () => {
  it('dny otevření: pondělí až pátek', () => {
    expect(dnyOtevreno(firma.hodiny)).toBe('pondělí až pátek');
  });
  it('nesouvislé dny se vyjmenují', () => {
    const h = { ...firma.hodiny, ut: null, ct: null };
    expect(dnyOtevreno(h)).toBe('pondělí, středa a pátek');
  });
  it('popis hodin z dat, víkend zavřeno', () => {
    expect(popisHodin(firma.hodiny)).toBe('Po 8:00–14:30, Út 8:00–16:30, St 8:00–14:30, Čt 8:00–16:30, Pá 8:00–14:00, o víkendu zavřeno.');
  });
  it('jednotlivé zavřené dny se vypíšou zvlášť', () => {
    const h = { ...firma.hodiny, st: null };
    expect(popisHodin(h)).toContain('St zavřeno');
  });
  it('otevřená sobota se projeví', () => {
    const h = { ...firma.hodiny, so: { od: '09:00', do: '11:00' } };
    expect(popisHodin(h)).toContain('So 9:00–11:00');
    expect(popisHodin(h)).toContain('Ne zavřeno');
  });
});

describe('cena klasiky a odpovědi z dat', () => {
  it('cena Klasiky se bere z pánského ceníku', () => {
    expect(cenaKlasiky(cenik)).toBe(cenik.skupiny[0].sekce[0].polozky.find((p: any) => p.nazev === 'Klasika').cena);
  });

  it('odpověď o ceně obsahuje aktuální cenu a bez Klasiky se otázka vynechá', () => {
    const d = [{ otazka: 'Kolik stojí střih?', odpoved: 'Pánská klasika stojí {klasika}. Celý ceník najdete výše.' }];
    const s = sestavDotazy(d, kontext());
    expect(s).toHaveLength(1);
    expect(s[0].html).toMatch(/stojí \d+ Kč\./);
    const bezKlasiky = { skupiny: cenik.skupiny.map((g: any) => ({ ...g, sekce: g.sekce.map((x: any) => ({ ...x, polozky: x.polozky.filter((p: any) => p.nazev !== 'Klasika') })) })) };
    expect(sestavDotazy(d, kontext({ cenik: bezKlasiky }))).toHaveLength(0);
  });

  it('prázdná platba skryje otázku o platbě', () => {
    const d = [{ otazka: 'Čím mohu platit?', odpoved: '{platba}' }];
    expect(sestavDotazy(d, kontext())).toHaveLength(1);
    expect(sestavDotazy(d, kontext({ platba: '' }))).toHaveLength(0);
    expect(sestavDotazy(d, kontext({ platba: '   ' }))).toHaveLength(0);
  });

  it('adresa s PSČ, mapa podle toho, zda je fotka budovy', () => {
    const a = vykresliOdpoved('{adresa}. {mapa}.', kontext())!;
    expect(a).toContain('Zbožská 664/4, 288 02 Nymburk');
    expect(a).toContain('Mapa je v sekci');
    expect(a).toContain('href="#kontakt"');
    expect(vykresliOdpoved('{mapa}', kontext({ maFotkuBudovy: true }))).toContain('Mapa a fotka vstupu jsou');
    expect(vykresliOdpoved('{adresa}', kontext({ adresa: { ulice: 'Ulice 1', mesto: 'Město' } }))).toBe('Ulice 1, Město');
  });

  it('facebook je odkaz v novém okně a text se escapuje', () => {
    const h = vykresliOdpoved('Na {facebook} <b>x</b>', kontext())!;
    expect(h).toContain('target="_blank"');
    expect(h).toContain('&lt;b&gt;');
    expect(h).not.toContain('<b>');
  });

  it('výchozí dotazy z okoli.json se všechny zobrazí', () => {
    const s = sestavDotazy(okoli.dotazy, kontext());
    expect(s).toHaveLength(okoli.dotazy.length);
    expect(s.every((d) => d.html.length > 0)).toBe(true);
  });

  it('věta o obcích používá druhé pády z dat', () => {
    const v = vetaObci(okoli.obceUvod, okoli.obce);
    expect(v).toBe('Stříháme pány a děti z Nymburka, Poděbrad, Lysé nad Labem, Sadské, Milovic, Kostomlat nad Labem, Semic, Hořátve a Kovanic.');
  });
});

describe('JSON-LD', () => {
  const vstup = (zmeny: any = {}) => ({
    firma: { ...firma, ...zmeny },
    seo,
    obce: okoli.obce,
    url: 'https://example.cz/',
    obrazek: 'https://example.cz/og.png',
    logo: 'https://example.cz/logo-zidle.webp',
  });

  it('areaServed pochází z pole obce', () => {
    const ld: any = sestavJsonLd(vstup());
    expect(ld.areaServed).toHaveLength(okoli.obce.length);
    expect(ld.areaServed[1]).toEqual({ '@type': 'City', name: 'Poděbrady' });
  });

  it('adresa má PSČ, kraj a stát; telefon a popis z dat', () => {
    const ld: any = sestavJsonLd(vstup());
    expect(ld.address).toMatchObject({ postalCode: '288 02', addressRegion: 'Středočeský kraj', addressCountry: 'CZ' });
    expect(ld.telephone).toBe('+420603242505');
    expect(ld.description).toBe(seo.description);
    expect(ld.priceRange).toBeUndefined();
    expect(ld['@type']).toBe('HairSalon');
  });

  it('hotovost, název provozovatele a IČ jen když jsou vyplněné', () => {
    const plne: any = sestavJsonLd(vstup());
    expect(plne).toMatchObject({ paymentAccepted: 'Hotovost', currenciesAccepted: 'CZK', legalName: 'Lucie Řehořová', taxID: '71108271' });
    const prazdne: any = sestavJsonLd(vstup({ platba: '', provozovatel: { jmeno: '', ic: '' } }));
    expect(prazdne.paymentAccepted).toBeUndefined();
    expect(prazdne.currenciesAccepted).toBeUndefined();
    expect(prazdne.legalName).toBeUndefined();
    expect(prazdne.taxID).toBeUndefined();
  });

  it('neplatné PSČ se do JSON-LD nedostane', () => {
    expect(formatujPsc('28802')).toBe('288 02');
    expect(formatujPsc('288 02')).toBe('288 02');
    expect(formatujPsc('TODO')).toBeUndefined();
    const ld: any = sestavJsonLd(vstup({ adresa: { ...firma.adresa, psc: 'TODO' } }));
    expect(ld.address.postalCode).toBeUndefined();
  });

  it('zavřené dny nemají openingHoursSpecification', () => {
    const ld: any = sestavJsonLd(vstup());
    const dny = ld.openingHoursSpecification.map((o: any) => o.dayOfWeek);
    expect(dny).toEqual(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  });
});

describe('robots.txt', () => {
  it('adresa mapy webu se skládá z adresy a podsložky', () => {
    expect(robotsTxt('https://lukaspilko1-sketch.github.io', '/kadernictvi-nymburk')).toContain('Sitemap: https://lukaspilko1-sketch.github.io/kadernictvi-nymburk/sitemap-index.xml');
    expect(robotsTxt('https://lukaspilko1-sketch.github.io', '/kadernictvi-nymburk/')).toContain('/kadernictvi-nymburk/sitemap-index.xml');
  });
  it('na vlastní doméně bez podsložky', () => {
    const t = robotsTxt(new URL('https://kadernictvi-nymburk.cz'), '/');
    expect(t).toContain('Sitemap: https://kadernictvi-nymburk.cz/sitemap-index.xml');
    expect(t).toContain('User-agent: *');
    expect(t).not.toContain('TODO');
  });
});

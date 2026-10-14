import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { nactiAValiduj } from '../src/lib/nacti-data.mjs';

// Pracujeme v dočasné kopii dat a fotek, ať se skutečný obsah nemění.
let root: string;
const cesta = (soubor: string) => join(root, 'src/data', soubor);
const uprav = (soubor: string, fn: (d: any) => void) => {
  const d = JSON.parse(readFileSync(cesta(soubor), 'utf8'));
  fn(d);
  writeFileSync(cesta(soubor), JSON.stringify(d, null, 2));
};
const zprava = (fn: () => unknown) => {
  try {
    fn();
  } catch (e) {
    return (e as Error).message;
  }
  return '';
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'kadernictvi-'));
  cpSync('src/data', join(root, 'src/data'), { recursive: true });
  cpSync('src/assets/galerie', join(root, 'src/assets/galerie'), { recursive: true });
});
afterEach(() => rmSync(root, { recursive: true, force: true }));

describe('platná data', () => {
  it('skutečný obsah webu projde kontrolou', () => {
    const d = nactiAValiduj();
    expect(d.firma.telefonOdkaz).toBe('tel:+420603242505');
    expect(d.firma.hodiny.so).toBeNull();
    expect(d.firma.hodiny.po).toEqual({ od: '08:00', do: '14:30' });
  });
});

describe('pouze pánské a dětské', () => {
  it('ceník má dvě skupiny a služby dvě položky', () => {
    const d = nactiAValiduj();
    expect(d.cenik.skupiny.map((s: any) => s.id)).toEqual(['panske', 'detske']);
    expect(d.sluzby.polozky.map((s: any) => s.id).sort()).toEqual(['detske', 'panske']);
  });

  it('neznámá skupina ceníku není povolená', () => {
    uprav('cenik.json', (d) => d.skupiny.push({ id: 'jina', nazev: 'Jiná', sekce: [] }));
    expect(zprava(() => nactiAValiduj(root))).toContain('cenik.json');
  });

  it('chybějící dětská skupina shodí build', () => {
    uprav('cenik.json', (d) => (d.skupiny = d.skupiny.filter((s: any) => s.id !== 'detske')));
    expect(zprava(() => nactiAValiduj(root))).toContain('obě skupiny');
  });
});

describe('fotka budovy', () => {
  it('prázdné pole fotoBudovy je v pořádku', () => {
    expect(nactiAValiduj(root).firma.fotoBudovy).toBe('');
  });

  it('vyplněné pole s existující fotkou projde', () => {
    copyFileSync(join(root, 'src/assets/galerie/panske-1.jpg'), join(root, 'src/assets/galerie/budova.jpg'));
    uprav('firma.json', (d) => (d.fotoBudovy = '/src/assets/galerie/budova.jpg'));
    expect(nactiAValiduj(root).firma.fotoBudovy).toContain('budova.jpg');
  });

  it('vyplněné pole s neexistující fotkou shodí build', () => {
    uprav('firma.json', (d) => (d.fotoBudovy = '/src/assets/galerie/neni-budova.jpg'));
    const m = zprava(() => nactiAValiduj(root));
    expect(m).toContain('fotoBudovy');
    expect(m).toContain('neni-budova.jpg');
  });
});

describe('scénáře úprav', () => {
  it('změna ceny projde', () => {
    uprav('cenik.json', (d) => (d.skupiny[0].sekce[0].polozky[0].cena = 240));
    expect(nactiAValiduj(root).cenik.skupiny[0].sekce[0].polozky[0].cena).toBe(240);
  });

  it('nová položka a nová sekce v dětském ceníku projdou', () => {
    uprav('cenik.json', (d) => {
      d.skupiny[1].sekce = [{ nazev: 'Střih', polozky: [{ nazev: 'Dětský střih', cena: 180, poznamka: 'do 6 let' }] }];
    });
    const c = nactiAValiduj(root).cenik;
    expect(c.skupiny[1].sekce[0].polozky[0].nazev).toBe('Dětský střih');
  });

  it('chybějící cena shodí build s českou hláškou', () => {
    uprav('cenik.json', (d) => delete d.skupiny[0].sekce[0].polozky[0].cena);
    const m = zprava(() => nactiAValiduj(root));
    expect(m).toContain('NEPLATNÁ');
    expect(m).toContain('cenik.json');
    expect(m).toContain('Cena musí být číslo');
  });

  it('prázdná sekce ceníku je chyba', () => {
    uprav('cenik.json', (d) => (d.skupiny[1].sekce = [{ nazev: 'Střih', polozky: [] }]));
    expect(zprava(() => nactiAValiduj(root))).toContain('aspoň jednu položku');
  });

  it('špatně zadaný čas shodí build', () => {
    uprav('firma.json', (d) => (d.hodiny.po.od = '8h'));
    const m = zprava(() => nactiAValiduj(root));
    expect(m).toContain('hodiny › po › od');
    expect(m).toContain('HH:MM');
  });

  it('čas „do“ dřívější než „od“ shodí build', () => {
    uprav('firma.json', (d) => {
      d.hodiny.ut.od = '16:00';
      d.hodiny.ut.do = '08:00';
    });
    expect(zprava(() => nactiAValiduj(root))).toContain('musí být později');
  });

  it('zavřený den nemusí mít časy', () => {
    uprav('firma.json', (d) => (d.hodiny.st = { zavreno: true, od: '', do: '' }));
    expect(nactiAValiduj(root).firma.hodiny.st).toBeNull();
  });

  it('víkend lze otevřít (zavreno: false s časy)', () => {
    uprav('firma.json', (d) => (d.hodiny.so = { zavreno: false, od: '09:00', do: '11:00' }));
    expect(nactiAValiduj(root).firma.hodiny.so).toEqual({ od: '09:00', do: '11:00' });
  });

  it('nová fotka s popisem projde, bez popisu (alt) ne', () => {
    copyFileSync(join(root, 'src/assets/galerie/panske-1.jpg'), join(root, 'src/assets/galerie/nova.jpg'));
    uprav('galerie.json', (d) => d.fotky.push({ src: '/src/assets/galerie/nova.jpg', alt: 'Nový střih', zobrazit: true, poradi: 99 }));
    expect(nactiAValiduj(root).galerie.fotky.at(-1).src).toContain('nova.jpg');
    uprav('galerie.json', (d) => (d.fotky.at(-1).alt = ''));
    expect(zprava(() => nactiAValiduj(root))).toContain('popis fotky');
  });

  it('neexistující fotka shodí build a řekne který soubor', () => {
    uprav('galerie.json', (d) => d.fotky.push({ src: '/src/assets/galerie/neni.jpg', alt: 'x', zobrazit: true, poradi: 50 }));
    const m = zprava(() => nactiAValiduj(root));
    expect(m).toContain('neni.jpg');
    expect(m).toContain('neexistuje');
  });

  it('skrytá fotka zůstává v datech se zobrazit: false', () => {
    uprav('galerie.json', (d) => (d.fotky[0].zobrazit = false));
    expect(nactiAValiduj(root).galerie.fotky.find((f: any) => f.src.endsWith('panske-1.jpg')).zobrazit).toBe(false);
  });

  it('pořadí fotek řídí pole poradi', () => {
    uprav('galerie.json', (d) => {
      d.fotky[0].poradi = 100;
      d.fotky[1].poradi = 0;
    });
    const f = nactiAValiduj(root).galerie.fotky;
    expect(f[0].src).toContain('detske-1.jpg');
    expect(f.at(-1).src).toContain('panske-1.jpg');
  });

  it('chybný telefon a poškozený JSON mají srozumitelnou hlášku', () => {
    uprav('firma.json', (d) => (d.telefon = '123'));
    expect(zprava(() => nactiAValiduj(root))).toContain('9 číslic');
    writeFileSync(cesta('seo.json'), '{ rozbité');
    expect(zprava(() => nactiAValiduj(root))).toContain('není platný JSON');
  });

  it('příliš dlouhý popis stránky (SEO) je chyba', () => {
    uprav('seo.json', (d) => (d.description = 'x'.repeat(200)));
    expect(zprava(() => nactiAValiduj(root))).toContain('max. 160');
  });
});

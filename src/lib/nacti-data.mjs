// Načtení a kontrola obsahu z src/data/*.json. Používá web při buildu i `npm run validate`.
// Když je v datech chyba, vyhodí Error s českou hláškou (build selže, stará verze webu zůstane online).
import { readFileSync, existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { z } from 'zod';

const ADRESAR_FOTEK = 'src/assets/galerie';
const CAS = /^([01]\d|2[0-3]):[0-5]\d$/;
const DNY = ['po', 'ut', 'st', 'ct', 'pa', 'so', 'ne'];
const NAZVY_DNU = { po: 'pondělí', ut: 'úterý', st: 'středa', ct: 'čtvrtek', pa: 'pátek', so: 'sobota', ne: 'neděle' };

const text = (popis) => z.string({ error: `Chybí ${popis}.` }).trim().min(1, { error: `Vyplňte ${popis}.` });
const cislo = (popis) => z.number({ error: `${popis} musí být číslo.` });

const den = z
  .object({
    zavreno: z.boolean().default(false),
    od: z.string().default(''),
    do: z.string().default(''),
  })
  .superRefine((d, ctx) => {
    if (d.zavreno) return;
    for (const k of ['od', 'do']) {
      if (!CAS.test(d[k])) {
        ctx.addIssue({ code: 'custom', path: [k], message: `Špatný čas „${d[k]}“. Zadejte ho jako HH:MM, např. 08:30 (nebo zaškrtněte Zavřeno).` });
      }
    }
    if (CAS.test(d.od) && CAS.test(d.do) && d.do <= d.od) {
      ctx.addIssue({ code: 'custom', path: ['do'], message: `Čas „do“ (${d.do}) musí být později než „od“ (${d.od}).` });
    }
  });

const firmaSchema = z
  .object({
    nazev: text('název salonu'),
    adresa: z.object({ ulice: text('ulici'), mesto: text('město'), psc: z.string().optional() }),
    telefon: z
      .string({ error: 'Chybí telefon.' })
      .refine((t) => t.replace(/\s/g, '').replace(/^\+?420/, '').match(/^\d{9}$/), { error: 'Telefon zadejte jako 9 číslic, např. 603 242 505.' }),
    facebook: z.string({ error: 'Chybí odkaz na Facebook.' }).regex(/^https:\/\//, { error: 'Odkaz na Facebook musí začínat https://' }),
    souradnice: z
      .object({
        lat: z.number().min(-90).max(90).nullable().default(null),
        lon: z.number().min(-180).max(180).nullable().default(null),
      })
      .refine((s) => (s.lat === null) === (s.lon === null), { error: 'Souřadnice: vyplňte zeměpisnou šířku i délku, nebo ani jednu.' }),
    hodiny: z.object(Object.fromEntries(DNY.map((d) => [d, den]))),
    oNas: z.object({
      nadpis: text('nadpis sekce O nás'),
      text: z.array(text('odstavec textu O nás'), { error: 'Chybí odstavce textu O nás.' }).min(1, { error: 'Text O nás musí mít aspoň jeden odstavec.' }),
    }),
  });

const polozka = z.object({
  nazev: text('název položky ceníku'),
  cena: cislo('Cena').nonnegative({ error: 'Cena nesmí být záporná.' }),
  poznamka: z.string().optional(),
});
const skupina = z.object({
  id: z.enum(['panske', 'damske', 'detske']),
  nazev: text('název skupiny ceníku'),
  poznamka: z.string().optional(),
  sekce: z
    .array(
      z.object({
        nazev: text('název sekce ceníku'),
        polozky: z.array(polozka).min(1, { error: 'Sekce ceníku musí mít aspoň jednu položku (nebo ji smažte).' }),
      }),
    )
    .default([]),
});
const cenikSchema = z.object({
  platnostOd: text('datum „Ceník platný od“'),
  skupiny: z.array(skupina).refine((s) => ['panske', 'damske', 'detske'].every((id) => s.some((x) => x.id === id)), {
    error: 'V ceníku musí zůstat všechny tři skupiny (pánské, dámské, dětské).',
  }),
});

const galerieSchema = z.object({
  fotky: z.array(
    z.object({
      src: text('soubor fotky'),
      alt: text('popis fotky (alt text)'),
      zobrazit: z.boolean().default(true),
      poradi: z.number().optional(),
    }),
  ),
});

const sluzbySchema = z.object({
  nadpis: text('nadpis sekce Služby'),
  polozky: z.array(
    z.object({
      id: z.enum(['damske', 'panske', 'detske']),
      nazev: text('název služby'),
      ikona: z.enum(['kartac', 'britva', 'nuzky', 'hreben']),
      text: text('text služby'),
      foto: text('fotku služby'),
      alt: text('popis fotky služby (alt text)'),
    }),
  ).min(1, { error: 'Chybí služby.' }),
});

const seoSchema = z.object({
  title: text('titulek stránky (title)').max(70, { error: 'Titulek je příliš dlouhý (max. 70 znaků).' }),
  description: text('popis stránky (description)').max(160, { error: 'Popis stránky je příliš dlouhý (max. 160 znaků).' }),
});

/** Převede „603 242 505“ na tel:+420603242505. */
export function telefonOdkaz(telefon) {
  const cisla = telefon.replace(/\s/g, '').replace(/^\+?420/, '');
  return `tel:+420${cisla}`;
}

function nactiJson(root, soubor, chyby) {
  const cesta = join(root, 'src/data', soubor);
  if (!existsSync(cesta)) {
    chyby.push(`src/data/${soubor}: soubor neexistuje.`);
    return undefined;
  }
  try {
    return JSON.parse(readFileSync(cesta, 'utf8'));
  } catch (e) {
    chyby.push(`src/data/${soubor}: soubor není platný JSON (${e.message}).`);
    return undefined;
  }
}

function over(root, soubor, schema, chyby) {
  const data = nactiJson(root, soubor, chyby);
  if (data === undefined) return undefined;
  const vysledek = schema.safeParse(data);
  if (!vysledek.success) {
    for (const i of vysledek.error.issues) {
      const kde = i.path.length ? i.path.map((p) => (typeof p === 'number' ? `#${p + 1}` : p)).join(' › ') : '(celý soubor)';
      chyby.push(`src/data/${soubor} › ${kde}: ${i.message}`);
    }
    return undefined;
  }
  return vysledek.data;
}

/** Název souboru z cesty uložené editorem (např. /src/assets/galerie/foto.jpg). */
export const nazevFotky = (src) => basename(src);

function overFoto(root, src, kde, chyby) {
  if (!existsSync(join(root, ADRESAR_FOTEK, nazevFotky(src)))) {
    chyby.push(`${kde}: fotka „${nazevFotky(src)}“ neexistuje ve složce ${ADRESAR_FOTEK}/. Nahrajte ji nebo opravte název.`);
  }
}

/** Načte všechna data, zkontroluje je a vrátí je upravená pro web. Při chybě vyhodí Error. */
export function nactiAValiduj(root = process.cwd()) {
  const chyby = [];
  const firma = over(root, 'firma.json', firmaSchema, chyby);
  const cenik = over(root, 'cenik.json', cenikSchema, chyby);
  const galerie = over(root, 'galerie.json', galerieSchema, chyby);
  const sluzby = over(root, 'sluzby.json', sluzbySchema, chyby);
  const seo = over(root, 'seo.json', seoSchema, chyby);

  galerie?.fotky.forEach((f, i) => overFoto(root, f.src, `src/data/galerie.json › fotky › #${i + 1}`, chyby));
  sluzby?.polozky.forEach((s, i) => overFoto(root, s.foto, `src/data/sluzby.json › polozky › #${i + 1} (${s.nazev})`, chyby));

  if (chyby.length) {
    throw new Error(`\n\nDATA WEBU JSOU NEPLATNÁ, build se zastavil. Web na internetu zůstává beze změny.\nOpravte tyto chyby:\n\n - ${chyby.join('\n - ')}\n`);
  }

  return {
    firma: {
      ...firma,
      telefonOdkaz: telefonOdkaz(firma.telefon),
      // pro logiku otevřeno/zavřeno: zavřený den = null, jinak { od, do }
      hodiny: Object.fromEntries(DNY.map((d) => [d, firma.hodiny[d].zavreno ? null : { od: firma.hodiny[d].od, do: firma.hodiny[d].do }])),
    },
    cenik,
    galerie: {
      fotky: [...galerie.fotky]
        .map((f, i) => ({ ...f, _i: i }))
        .sort((a, b) => (a.poradi ?? 1e9) - (b.poradi ?? 1e9) || a._i - b._i),
    },
    sluzby,
    seo,
  };
}

export { DNY, NAZVY_DNU };

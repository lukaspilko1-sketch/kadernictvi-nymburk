// Strukturovaná data (schema.org HairSalon) sestavená z dat webu. Žádné údaje natvrdo.
import { dnyPoradi, type Hodiny } from './otevreno';

const DNY_SCHEMA = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface VstupJsonLd {
  firma: {
    nazev: string;
    telefon: string;
    facebook: string;
    adresa: { ulice: string; mesto: string; psc?: string };
    souradnice: { lat: number | null; lon: number | null };
    hodiny: Hodiny;
    platba: string;
    provozovatel: { jmeno: string; ic: string };
  };
  seo: { description: string };
  obce: { nazev: string }[];
  url: string;
  obrazek: string;
  logo: string;
}

/** Platné české PSČ (5 číslic, volitelně s mezerou) ve tvaru „288 02“, jinak undefined. */
export function formatujPsc(psc?: string): string | undefined {
  const m = psc?.trim().match(/^(\d{3})\s?(\d{2})$/);
  return m ? `${m[1]} ${m[2]}` : undefined;
}

export function sestavJsonLd(v: VstupJsonLd): Record<string, unknown> {
  const { firma } = v;
  const cisla = firma.telefon.replace(/\s/g, '').replace(/^\+?420/, '');
  const psc = formatujPsc(firma.adresa.psc);

  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HairSalon',
    name: firma.nazev,
    description: v.seo.description,
    url: v.url,
    telephone: `+420${cisla}`,
    image: v.obrazek,
    logo: v.logo,
    address: {
      '@type': 'PostalAddress',
      streetAddress: firma.adresa.ulice,
      addressLocality: firma.adresa.mesto,
      ...(psc ? { postalCode: psc } : {}),
      addressRegion: 'Středočeský kraj',
      addressCountry: 'CZ',
    },
    areaServed: v.obce.map((o) => ({ '@type': 'City', name: o.nazev })),
    openingHoursSpecification: dnyPoradi.flatMap((d, i) => {
      const h = firma.hodiny[d];
      return h ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: DNY_SCHEMA[i], opens: h.od, closes: h.do }] : [];
    }),
    sameAs: [firma.facebook],
  };

  const { lat, lon } = firma.souradnice;
  if (lat != null && lon != null) ld.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lon };
  if (firma.platba.trim()) {
    ld.paymentAccepted = 'Hotovost';
    ld.currenciesAccepted = 'CZK';
  }
  if (firma.provozovatel.jmeno.trim()) ld.legalName = firma.provozovatel.jmeno.trim();
  if (firma.provozovatel.ic.trim()) ld.taxID = firma.provozovatel.ic.trim();
  return ld;
}

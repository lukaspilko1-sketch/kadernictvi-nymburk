export type Den = 'po' | 'ut' | 'st' | 'ct' | 'pa' | 'so' | 'ne';
export type Hodiny = Record<Den, { od: string; do: string } | null>;

export interface Stav {
  den: Den;
  otevreno: boolean;
  text: string;
  /** Příští otevření, např. "zítra v 8:00" nebo "v pondělí v 8:00" (jen když je zavřeno). */
  dalsi?: string;
}

const DNY: Record<string, Den> = { Mon: 'po', Tue: 'ut', Wed: 'st', Thu: 'ct', Fri: 'pa', Sat: 'so', Sun: 'ne' };

export const dnyPoradi: Den[] = ['po', 'ut', 'st', 'ct', 'pa', 'so', 'ne'];

const naMinuty = (hhmm: string): number => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "08:00" -> "8:00" */
export const kratkyCas = (hhmm: string): string => hhmm.replace(/^0/, '');

/** Aktuální den a minuty od půlnoci v časové zóně Europe/Prague (ne podle zařízení). */
export function prazskyCas(now: Date): { den: Den; minuty: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Prague',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return {
    den: DNY[get('weekday')],
    minuty: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

const PADEJ: Record<Den, string> = {
  po: 'v pondělí', ut: 'v úterý', st: 've středu', ct: 've čtvrtek', pa: 'v pátek', so: 'v sobotu', ne: 'v neděli',
};

/** Nejbližší otevření po dnešku (přeskočí zavřené dny, funguje přes víkend). */
export function pristiOtevreni(hodiny: Hodiny, den: Den): string | undefined {
  const i = dnyPoradi.indexOf(den);
  for (let posun = 1; posun <= 7; posun++) {
    const d = dnyPoradi[(i + posun) % 7];
    const h = hodiny[d];
    if (h) return `${posun === 1 ? 'zítra' : PADEJ[d]} v ${kratkyCas(h.od)}`;
  }
  return undefined;
}

export function stavDnes(hodiny: Hodiny, now: Date = new Date()): Stav {
  const { den, minuty } = prazskyCas(now);
  const dnes = hodiny[den];
  const zavreno = (): Stav => {
    const dalsi = pristiOtevreni(hodiny, den);
    return { den, otevreno: false, dalsi, text: dalsi ? `Dnes zavřeno · otevíráme ${dalsi}` : 'Dnes zavřeno' };
  };
  if (!dnes) return zavreno();
  const od = naMinuty(dnes.od);
  const doo = naMinuty(dnes.do);
  if (minuty < od) return { den, otevreno: false, text: `Dnes otevíráme v ${kratkyCas(dnes.od)}` };
  if (minuty < doo) return { den, otevreno: true, text: `Dnes otevřeno do ${kratkyCas(dnes.do)}` };
  return zavreno();
}

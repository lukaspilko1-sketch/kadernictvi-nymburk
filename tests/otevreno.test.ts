import { describe, it, expect } from 'vitest';
import { stavDnes, prazskyCas } from '../src/lib/otevreno';
import firma from '../src/data/firma.json';

const h = firma.hodiny as never;
// Letní čas (CEST, UTC+2) a zimní (CET, UTC+1), zadáváme v UTC.
const cest = (iso: string) => new Date(iso);

describe('stavDnes', () => {
  it('pondělí uprostřed otevírací doby', () => {
    // po 2025-06-09 10:00 CEST = 08:00 UTC
    const s = stavDnes(h, cest('2025-06-09T08:00:00Z'));
    expect(s).toMatchObject({ den: 'po', otevreno: true, text: 'Dnes otevřeno do 14:30' });
  });
  it('úterý otevřeno do 16:30', () => {
    expect(stavDnes(h, cest('2025-06-10T10:00:00Z')).text).toBe('Dnes otevřeno do 16:30');
  });
  it('těsně před otevřením', () => {
    // po 07:59 CEST = 05:59 UTC
    const s = stavDnes(h, cest('2025-06-09T05:59:00Z'));
    expect(s.otevreno).toBe(false);
    expect(s.text).toBe('Dnes otevíráme v 8:00');
  });
  it('přesně v čas otevření je otevřeno', () => {
    expect(stavDnes(h, cest('2025-06-09T06:00:00Z')).otevreno).toBe(true);
  });
  it('těsně po zavření (pá 14:00)', () => {
    // pá 2025-06-13 14:00 CEST = 12:00 UTC
    const s = stavDnes(h, cest('2025-06-13T12:00:00Z'));
    expect(s).toMatchObject({ den: 'pa', otevreno: false, text: 'Dnes zavřeno · otevíráme v pondělí v 8:00' });
  });
  it('těsně před zavřením (pá 13:59)', () => {
    expect(stavDnes(h, cest('2025-06-13T11:59:00Z')).otevreno).toBe(true);
  });
  it('sobota a neděle zavřeno', () => {
    expect(stavDnes(h, cest('2025-06-14T08:00:00Z'))).toMatchObject({ den: 'so', otevreno: false, text: 'Dnes zavřeno · otevíráme v pondělí v 8:00' });
    expect(stavDnes(h, cest('2025-06-15T08:00:00Z'))).toMatchObject({ den: 'ne', otevreno: false, dalsi: 'zítra v 8:00' });
  });
  it('přechod přes půlnoc: neděle 23:30 UTC je už pondělí v Praze', () => {
    // ne 2025-06-15 22:30 UTC = po 00:30 CEST
    expect(prazskyCas(cest('2025-06-15T22:30:00Z')).den).toBe('po');
    expect(stavDnes(h, cest('2025-06-15T22:30:00Z')).text).toBe('Dnes otevíráme v 8:00');
  });
  it('zimní čas: čt 08:30 CET = 07:30 UTC', () => {
    expect(stavDnes(h, cest('2025-12-04T07:30:00Z'))).toMatchObject({ den: 'ct', otevreno: true });
  });
  it('použije pražský čas, ne UTC: po 15:00 UTC v pátek je už zavřeno', () => {
    expect(stavDnes(h, cest('2025-12-05T13:30:00Z')).otevreno).toBe(false);
  });
  it('po zavření v pondělí se otevírá zítra', () => {
    // po 2025-06-09 15:00 CEST = 13:00 UTC
    expect(stavDnes(h, cest('2025-06-09T13:00:00Z')).text).toBe('Dnes zavřeno · otevíráme zítra v 8:00');
  });
  it('čtvrtek po zavření: otevíráme zítra v 8:00', () => {
    expect(stavDnes(h, cest('2025-06-12T15:00:00Z')).dalsi).toBe('zítra v 8:00');
  });
  it('přechod týdne: pátek 23:30 CEST je ještě pátek, v sobotu 00:30 už víkend', () => {
    expect(stavDnes(h, cest('2025-06-13T21:30:00Z')).dalsi).toBe('v pondělí v 8:00');
    expect(stavDnes(h, cest('2025-06-13T22:30:00Z'))).toMatchObject({ den: 'so', dalsi: 'v pondělí v 8:00' });
  });
  it('bez jakýchkoli hodin jen „Dnes zavřeno“', () => {
    const nic = { po: null, ut: null, st: null, ct: null, pa: null, so: null, ne: null } as never;
    expect(stavDnes(nic, cest('2025-06-09T08:00:00Z')).text).toBe('Dnes zavřeno');
  });
});

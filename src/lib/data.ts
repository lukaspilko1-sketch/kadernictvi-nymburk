// Jediné místo, odkud web bere obsah. Data se při buildu zkontrolují (viz nacti-data.mjs).
// Když jsou neplatná, build skončí českou chybou a nasazená verze webu zůstane beze změny.
import { nactiAValiduj } from './nacti-data.mjs';

const data = nactiAValiduj();

export const firma = data.firma;
export const cenik = data.cenik;
export const galerie = data.galerie;
export const sluzby = data.sluzby;
export const seo = data.seo;
export const okoli = data.okoli;

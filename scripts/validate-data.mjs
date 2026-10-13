// Zkontroluje obsah webu (src/data/*.json a fotky). Spuštění: npm run validate
import { nactiAValiduj } from '../src/lib/nacti-data.mjs';

try {
  const d = nactiAValiduj();
  console.log(`Data jsou v pořádku: ${d.cenik.skupiny.length} skupiny ceníku, ${d.galerie.fotky.filter((f) => f.zobrazit).length} zobrazených fotek v galerii.`);
} catch (e) {
  console.error(e.message);
  process.exit(1);
}

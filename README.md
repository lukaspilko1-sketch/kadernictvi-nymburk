# Kadeřnictví a holičství Nymburk

Jednostránkový statický web (Astro, vanilla CSS). Texty, ceny, hodiny a fotky jsou v `src/data/*.json`, takže se mění bez zásahu do komponent.

## Spuštění

```bash
npm install
npm run dev      # vývoj na http://localhost:4321
npm run build    # produkční build do dist/
npm run preview  # náhled buildu
npm test         # jednotkové testy (Vitest): otevřeno / zavřeno
```

## Kde co změnit

| Co | Kde |
|---|---|
| Adresa, telefon, Facebook, hodiny, text „O nás" | `src/data/firma.json` |
| Ceníky (pánský, dámský, dětský), platnost ceníku | `src/data/cenik.json` |
| Fotky v galerii, alt texty, skrytí fotky | `src/data/galerie.json` (soubor v `src/assets/photos/`) |
| Logo | `scripts/make-logo.mjs` (jedna definice), pak `node scripts/make-logo.mjs` vygeneruje `public/logo.svg`, `logo-mark.svg`, `favicon.svg`, `logo-512.png`, `og.png` |
| Barvy a písma | CSS proměnné na začátku `src/styles/global.css` |
| Fonty | balíčky `@fontsource-variable/*`, hostované lokálně, žádné CDN |

### Přidání ceny / ceníku
V `cenik.json` přidejte do skupiny `sekce` s položkami `{ "nazev": "...", "cena": 250 }`. Prázdná skupina zobrazí „Ceník doplníme, zavolejte nám".

### Fotky
Nahrajte soubor do `src/assets/photos/` a přidejte řádek do `galerie.json`. Fotku skryjete nastavením `"zobrazit": false`. Pokud soubor chybí, build vypíše varování a položku vynechá.

**Upozornění:** na fotkách jsou skuteční zákazníci, včetně dětí. Před zveřejněním musí mít majitelka jejich souhlas. Původní fotky jsou z Facebooku, tedy v menším rozlišení. Až budou vlastní, stačí je vyměnit.

## Nasazení (GitHub Pages)

1. Vytvořte veřejný repozitář na GitHubu a pushněte větev `main`.
2. V repozitáři: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
3. Workflow `.github/workflows/deploy.yml` při každém pushi spustí testy, build a nasazení. Adresa bude `https://<uzivatel>.github.io/<repozitar>/`.
4. Až bude vlastní doména: v `deploy.yml` nastavte `SITE_URL` na ni a odstraňte `BASE_PATH`, v *Settings → Pages* přidejte doménu a upravte `Sitemap:` v `public/robots.txt`.

Lokálně lze adresu přepsat proměnnými `SITE_URL` a `BASE_PATH`.

## Kontrola kvality
- Otevírací doba (pás pod hero) a štítek „Dnes otevřeno / zavřeno · otevíráme …“ se počítá podle času `Europe/Prague` (ne podle zařízení), logika je v `src/lib/otevreno.ts` a testy v `tests/`.
- Bez JS jsou vidět všechny tři ceníky pod sebou, dlaždice s hodinami i galerie (fotky se otevřou jako obrázek). JS potřebuje jen lightbox, záložky, menu a štítek otevřeno.
- Web nepoužívá cookies ani trackery. Externí obsah je jen mapa z OpenStreetMap, a to až po doplnění souřadnic (do té doby karta s odkazem na Mapy.cz).

## TODO
- Dámský ceník a dětský ceník (`cenik.json`)
- Skutečný text „O nás" a fotky salonu (`firma.json`)
- Ověřit platnost pánského ceníku (platnost od 1. 3. 2025)
- Souřadnice salonu: doplnit `souradnice` v `firma.json`, pak se automaticky objeví mapa se značkou i `geo` v JSON-LD (zatím karta s odkazem na Mapy.cz)
- PSČ, doména, `site` v `astro.config.mjs`, `Sitemap:` v `robots.txt`
- Provozovatel (jméno/IČO) na stránce Ochrana soukromí
- Souhlas zákazníků s fotkami (děti)
- Standalone `public/logo.svg` používá text s písmem Fraunces/Georgia (záložní); pro tisk převést text na křivky

# Kadeřnictví a holičství Nymburk

Jednostránkový statický web (Astro, vanilla CSS). Texty, ceny, hodiny a fotky jsou v `src/data/*.json`, takže se mění bez zásahu do komponent.

## Spuštění

```bash
npm install
npm run dev      # vývoj na http://localhost:4321
npm run validate # kontrola dat (ceník, hodiny, fotky), build ji spouští sám
npm run build    # produkční build do dist/ (při chybě v datech skončí českou hláškou)
npm run preview  # náhled buildu
npm test         # jednotkové testy (Vitest): otevřeno / zavřeno
```

## Kde co změnit

| Co | Kde |
|---|---|
| Adresa, telefon, Facebook, hodiny, text „O nás" | `src/data/firma.json` |
| Ceníky (pánský a dětský), platnost ceníku | `src/data/cenik.json` |
| Fotky v galerii, alt texty, skrytí, pořadí | `src/data/galerie.json` (soubory v `src/assets/galerie/`) |
| Služby (Pánové, Děti) | `src/data/sluzby.json` |
| SEO titulek a popis | `src/data/seo.json` |
| Logo v hlavičce (židle) | `scripts/make-logo-zidle.mjs` z `src/assets/logo-zidle.jpg` vyrobí `public/logo-zidle.webp` (120 × 120 px) |
| Logo (hřeben, favicon, og) | `scripts/make-logo.mjs` (jedna definice), pak `node scripts/make-logo.mjs` vygeneruje `public/logo.svg`, `logo-mark.svg`, `favicon.svg`, `logo-512.png`, `og.png` |
| Barvy a písma | CSS proměnné na začátku `src/styles/global.css` |
| Fonty | balíčky `@fontsource-variable/*`, hostované lokálně, žádné CDN |

### Přidání ceny / ceníku
V `cenik.json` přidejte do skupiny `sekce` s položkami `{ "nazev": "...", "cena": 250 }`. Prázdná skupina zobrazí „Ceník doplníme, zavolejte nám".

### Fotky
Nahrajte soubor do `src/assets/galerie/` a přidejte položku do `galerie.json` (`src`, `alt`, `zobrazit`, `poradi`). Fotku skryjete `"zobrazit": false`. Chybějící fotka nebo prázdný `alt` shodí build s českou hláškou, takže nasazená verze zůstane beze změny.

**Upozornění:** na fotkách jsou skuteční zákazníci, včetně dětí. Před zveřejněním musí mít majitelka jejich souhlas. Původní fotky jsou z Facebooku, tedy v menším rozlišení. Až budou vlastní, stačí je vyměnit.

## Administrace (Pages CMS)
Obsah se upravuje ve formulářích na https://app.pagescms.org (přihlášení přes GitHub). Formuláře jsou definované v `.pages.yml`, změny jdou jako commity do `main` a GitHub Actions web znovu nasadí. Postup krok za krokem: [`docs/NAVOD-pro-spravce.md`](docs/NAVOD-pro-spravce.md).

Hodiny jsou v `firma.json` jako `{ "zavreno": true/false, "od": "08:00", "do": "14:30" }` (Pages CMS neumí `null`). Data se při buildu kontrolují schématem v `src/lib/nacti-data.mjs`.

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
- Dětský ceník (zatím jen poznámka, že ceny jsou v pánském ceníku; `cenik.json`)
- Fotka salonu zvenku (`budova.jpg` v `src/assets/galerie/` nebo pole `fotoBudovy` ve `firma.json`)
- Skutečný text „O nás" a fotky salonu (`firma.json`)
- Ověřit platnost pánského ceníku (platnost od 1. 3. 2025)
- PSČ, doména, `site` v `astro.config.mjs`, `Sitemap:` v `robots.txt`
- Provozovatel (jméno/IČO) na stránce Ochrana soukromí
- Souhlas zákazníků s fotkami (děti)
- Standalone `public/logo.svg` používá text s písmem Fraunces/Georgia (záložní); pro tisk převést text na křivky

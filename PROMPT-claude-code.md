# Zadání pro Claude Code: web Kadeřnictví a holičství Nymburk

Postav hotový jednostránkový web (česky) pro místní kadeřnictví a holičství. Pracuj ve složce projektu, kde už je podsložka `img/` s fotkami z Facebooku. Nejdřív mi stručně shrň plán a až potom stav. Neptej se na věci, které jsou níže rozhodnuté.

## 0. CLAUDE.md – sdílená paměť projektu (povinné)

V kořeni projektu je soubor `CLAUDE.md` s aktuálním stavem projektu. Pracuje s ním Claude Code i další asistenti (např. Claude v chatu), takže musí být vždy pravdivý.

- **Na začátku každé session** přečti `CLAUDE.md` celý a řiď se jím (rozhodnutí, fakta, TODO).
- **Během práce** zapisuj do sekce „Stav" a „Rozhodnutí" vše podstatné: co je hotové, co se změnilo a proč, co zbývá.
- **Na konci každé session** (a po každé větší změně) aktualizuj `CLAUDE.md`: stav, nové/odškrtnuté `TODO`, otevřené otázky a jeden řádek do „Deníku změn" (datum, co se změnilo). Pokud se změní fakt nebo rozhodnutí, oprav ho tam, ne jen připiš.
- Pokud kód nebo uživatel `CLAUDE.md` odporuje, upozorni mě a dohodněte se, ne tiše přepisuj.
- Do `CLAUDE.md` nikdy nedávej hesla, tokeny ani osobní údaje zákazníků (repozitář bude veřejný).
- `CLAUDE.md` drž stručný a čitelný (do cca 200 řádků), detaily patří do `README.md` a `docs/`.

## 1. Fakta o provozovně (jediný zdroj pravdy)

| Údaj | Hodnota |
|---|---|
| Název | Kadeřnictví a holičství Nymburk |
| Adresa | Zbožská 664/4, Nymburk |
| Telefon | 603 242 505 (odkaz `tel:+420603242505`) |
| Otevírací doba | Po 8:00–14:30 · Út 8:00–16:30 · St 8:00–14:30 · Čt 8:00–16:30 · Pá 8:00–14:00 · So, Ne zavřeno (víkend zatím nepotvrzen) |
| Facebook | https://www.facebook.com/profile.php?id=100057433419981 |
| Klientela | Dámy, pánové, děti |
| Objednávání | Pouze telefonicky. Žádný rezervační systém. |

Nic dalšího si nevymýšlej (rok založení, jména zaměstnanců, ocenění, recenze, počet let praxe). Co chybí, označ viditelně `TODO` v kódu i v `README`.

## 2. Technologie

- Astro (statický výstup), vanilla CSS s CSS proměnnými, minimum JS (vanilla). Žádný velký framework.
- Obsah v souborech `src/data/` (`firma.json`, `cenik.json`, `galerie.json`), aby šly texty, ceny a fotky měnit bez zásahu do komponent.
- Nasazení na Cloudflare Pages nebo Netlify (připrav konfiguraci a popiš postup v `README`).
- Bez trackerů a bez externích fontů z CDN. Fonty si stáhni a hostuj lokálně (`@font-face`, `font-display: swap`).

## 3. Vzhled – směr A „Salvěj & krém", ale s vlastním charakterem

Nechci web, který na první pohled vypadá jako další AI šablona. Světlý, klidný a moderní zůstává, ale s konkrétními, lokálními a „ručními" detaily.

Barvy (CSS proměnné):

- `--krem: #F3EFE6` (pozadí, na něm jemná papírová textura/šum do 3 % opacity)
- `--salvej: #4F6B57` (hlavní akcent, tlačítka)
- `--salvej-svetla: #CDD8C9` (plochy, štítky)
- `--uhel: #2B2A27` (text)
- `--zlata: #C9A36B` (linky, rámečky, drobné detaily)

Žádné fialové ani modrofialové přechody, žádné gradientní „blob" pozadí, žádný glassmorphism.

Písma:

- Nadpisy: mírně retro, „měkký" serif s charakterem (např. **Fraunces** s osou SOFT nebo **Young Serif**). Nepoužívej Cormorant ani Playfair.
- Text: čistý moderní sans, ale **ne Inter** ani Roboto (např. **Hanken Grotesk** nebo **Instrument Sans**).
- Fonty hostuj lokálně. Zdůvodni mi na konci výběr jedné věty.

### Co web odlišuje od typických AI webů (závazné)

1. **Ceník jako vytištěný ceník.** Reálný pánský ceník salonu má krémový papír, zlatý ozdobný rámeček s rohy, zlatý serif nadpis a nůžky s hřebenem. Sekci Ceník udělej v tomto duchu (rámeček v `--zlata`, ozdobné rohy v SVG, dotted leaders mezi názvem a cenou), ne jako běžnou tabulku. Je to místní, autentický detail.
2. **Nestejná mřížka.** Hero je asymetrické (text vlevo, 2–3 fotky v různé velikosti a mírně posunuté, ne dokonale zarovnaná koláž). Galerie má jiný layout než zbytek: „fotky na stěně" s mírným natočením (max ±2°) a nestejnými velikostmi, na mobilu jedna sloupec s kratším horizontálním posunem. Sekce nesmí být tři stejné karty s ikonou nad sebou.
3. **Ručně kreslené ikony.** Vlastní jednoduché čárové SVG (hřeben, nůžky, břitva, kartáč) s mírně nepravidelným tahem, ne sady typu Lucide/Heroicons. Použij je u služeb a v oddělovačích.
4. **CTA s charakterem.** Tlačítko „Zavolat" při hoveru/focusu „cvakne" jako nůžky (jemná animace dvou čepelí v SVG ikoně). Respektuj `prefers-reduced-motion`.
5. **Pohyb střídmě.** Jemný scroll-reveal (posun 12–16 px + fade) a ta jedna animace tlačítka. Nic víc.
6. **Hlas textů.** Česky, přirozeně a lidsky, bez generických frází typu „Vítejte u nás", „Naše služby", „Spolehlivý partner". Krátké věty. Konkrétní věci (ulice, hodiny, co děláme). Když neznáš skutečný fakt, nech `TODO`.
7. **Nepoužívat:** emoji jako ikony, stock fotky s pózujícími lidmi, centrované hero s velkým gradientem, kartičky se stejným stínem, nadpisy typu „Proč si vybrat nás?", falešné recenze a počítadla.
8. Whitespace ano, ale ne sterilní „template" vzduch. Hierarchie jasná: nadpis, podnadpis, jedna akce.

## 4. Logo

Vybraná varianta: **horizontální logo**. Vlevo značka (nůžky nad hřebenem, barva `--uhel` a `--salvej`), zlatá svislá linka, vpravo nápis „Kadeřnictví & holičství *Nymburk*" (serif, slovo „Nymburk" kurzívou v `--salvej`).

- Podle přiloženého `navrh-loga.html` (varianta 2) vytvoř čisté SVG: `public/logo.svg` (horizontální), `public/logo-mark.svg` (jen značka), `public/favicon.svg` a PNG 512 px pro sdílení.
- Hřeben barberský: jemné zuby vlevo, hrubší vpravo. Nůžky nad ním, otevřené.
- Nápis převeď na křivky nebo použij stejné písmo jako nadpisy webu, aby logo ladilo.
- Logo drž v jednom souboru, ať ho lze snadno vyměnit.

## 5. Struktura stránky

1. **Hlavička (sticky):** logo, menu (Služby, Ceník, O nás, Galerie, Kontakt), vpravo telefon. Na mobilu hamburger menu.
2. **Hero:** velký nadpis, např. „Péče o vlasy, která sedí.", podnadpis „Dámy, pánové i děti · Zbožská 664/4", tlačítko **Zavolat** a štítek „Dnes otevřeno do 14:30" / „Dnes zavřeno". Vpravo koláž 2–3 fotek v zaoblených rámech.
3. **Služby:** 3 karty (Dámy, Pánové, Děti), u každé 3–4 řádky popisu. Texty ber jen z ceníku a obecně, bez nepravdivých tvrzení.
4. **Ceník:** záložky nebo harmoniky Pánské / Dámské / Dětské. Pánský ceník viz sekce 7. U dámského a dětského dej `TODO` a text „Ceník doplníme, zavolejte nám na 603 242 505." Nevymýšlej ceny.
5. **O nás:** 2–3 věty (placeholder označený `TODO`) a jedna fotka.
6. **Galerie:** mřížka 6–9 fotek s lightboxem (klávesnice, Esc, přístupnost).
7. **Otevírací doba:** tabulka s dnešním dnem zvýrazněným.
8. **Kontakt:** adresa, telefon (tlačítko Zavolat), odkaz na Facebook, mapa (Mapy.cz nebo OpenStreetMap iframe s `loading="lazy"`; Google Maps nepoužívat kvůli cookies).
9. **Patička:** název, adresa, telefon, odkaz na ochranu soukromí (jednoduchá stránka, pokud web nepoužívá cookies, jen to uveď).

**Mobil je priorita:** sticky tlačítko „Zavolat 603 242 505" ve spodní části obrazovky (jen do šířky 768 px).

## 6. Funkce s ošetřením chyb

- **Otevřeno / zavřeno:** spočítej v JS podle času `Europe/Prague` (použij `Intl.DateTimeFormat`, ne čas zařízení). Data z `firma.json`. Bez JS vypiš prostě tabulku hodin. Přechody přes půlnoc a víkend ošetři, otestuj jednotkovými testy (Vitest) pro po–pá, víkend, těsně před otevřením a po zavření.
- **Galerie:** když chybí fotka, nezlom layout (skryj položku a vypiš varování při buildu).
- **Obrázky:** při buildu převeď na WebP/AVIF ve více velikostech (`srcset`), `loading="lazy"` (kromě hero), pevné rozměry proti poskakování, smysluplné `alt` texty česky.
- **Fonty:** záložní systémové fonty, ať se text zobrazí i bez načtení souborů.

## 7. Fotky a ceník

Ve složce `img/` je 11 souborů z Facebooku. Použij takto:

| Soubor začíná | Obsah | Použití |
|---|---|---|
| `487829141_` | Screenshot pánského ceníku (platnost od 1. 3. 2025) | **Nepoužívat jako fotku.** Jen zdroj pro `cenik.json` (viz níže). |
| `471597899_`, `470190008_`, `470213829_`, `120552530_`, `110568201_` | Pánské střihy | Hero a galerie |
| `108198362_` | Dámské barevné prameny | Galerie, karta Dámy |
| `84173514_`, `89774700_` | Dětské střihy | Galerie, karta Děti |
| `106531739_`, `469824062_` | Dětské barvení | Galerie, karta Děti |

Na fotkách jsou skuteční zákazníci, včetně dětí. Přidej do `README` upozornění, že majitel musí mít jejich souhlas se zveřejněním, a udělej galerii tak, aby šly fotky jednoduše skrýt v `galerie.json` (`"zobrazit": false`). Fotky jsou z FB, tedy menší rozlišení. Neupscaluj je agresivně. Až dodám vlastní, vyměním je.

**Pánský ceník (`cenik.json`), platnost od 1. 3. 2025, před spuštěním ověřit:**

VLASY:

- Klasika 225 Kč
- Klasika jen boky 165 Kč
- Klasika zaholení kontur břitvou 260 Kč
- Střih strojkem 170 Kč
- Komplet (střih + mytí + konečná úprava) 305 Kč
- Děti do 6 let 175 Kč
- Fade strojkem a vršek nůžkami 350 Kč
- Fade strojkem vršek strojkem 320 Kč
- Fade strojkem pouze boky 275 Kč
- Fade boky břitvou vršek nůžkami 420 Kč
- Fade boky břitvou vršek strojkem 375 Kč
- Fade jen boky břitvou 310 Kč
- Fade do 6 let 265 Kč
- Holení hlavy břitvou 300 Kč
- Melír 420 Kč
- Barvení vlasů 390 Kč
- Pánská trvalá 380 Kč

VOUSY:

- Zkrácení vousů strojkem 135 Kč
- Zkrácení vousů strojkem + zaholení kontur břitvou 175 Kč
- Komplet holení břitvou 250 Kč
- Barvení vousů 205 Kč

OSTATNÍ:

- Masáž hlavy 50 Kč
- Odstranění chloupků voskem (uši a nos) 95 Kč

Pod ceníkem zobraz drobně „Ceník platný od 1. 3. 2025." (pole `platnostOd` v JSON).

## 8. SEO a lokální data

- `<title>`: „Kadeřnictví a holičství Nymburk | Zbožská 664/4"; meta description do 155 znaků.
- JSON-LD `HairSalon` (název, adresa, telefon, otevírací doba, `areaServed: Nymburk`). Souřadnice nedomýšlej, nech `TODO`.
- Open Graph a Twitter karty, `sitemap.xml`, `robots.txt`, `lang="cs"`, kanonická URL (placeholder domény).
- Semantické HTML (`header`, `main`, `section`, nadpisy v logické hierarchii).

## 9. Kvalita a přijetí

- Lighthouse na mobilu: Výkon, Přístupnost, SEO a Osvědčené postupy min. 90.
- Funguje bez JS (kromě lightboxu a štítku otevřeno).
- Ovladatelné klávesnicí, viditelný focus, `prefers-reduced-motion` respektovat.
- Testuj na šířkách 360, 768, 1280 px a zkontroluj výsledek screenshoty (Playwright).
- Žádné vymyšlené údaje. Každé `TODO` vypiš na konci práce v seznamu.

## 10. Předání

- `README.md` česky: spuštění (`npm install`, `npm run dev`, `npm run build`), kde se mění texty, ceny, hodiny, fotky a logo, nasazení krok za krokem, seznam `TODO`.
- Git repozitář s rozumnými commity.
- Na konci mi napiš stručné shrnutí: co je hotové, co je potřeba doplnit (dámský a dětský ceník, o nás, odkaz na FB, souřadnice, doména, souhlasy s fotkami).

## 11. Sebekontrola na závěr

Na konci práce napiš stručně:

1. Jaký vizuální směr jsi zvolil a proč tyto fonty.
2. Čím se web liší od typických AI webů (konkrétně: ceník v rámečku, asymetrické hero, ručně kreslené ikony, nestandardní galerie, cvaknutí nůžek na tlačítku).
3. Co ještě potřebuješ dodat. Neznámé věci nevymýšlej, napiš je jako otázku.
4. Potvrď, že jsi aktualizoval `CLAUDE.md` (stav, TODO, deník změn).

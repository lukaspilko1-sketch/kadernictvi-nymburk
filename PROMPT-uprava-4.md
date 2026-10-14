# Zadání pro Claude Code: úpravy webu, kolo 4 (nadpis, hotovost, provozovatel, SEO)

Nejdřív přečti `CLAUDE.md` a po dokončení ho aktualizuj (stav, rozhodnutí, TODO, deník změn). Drž se palety „Černá, šedá & champagne", tmavě šedých CTA, klidných animací a pravidla: **obsah se mění v administraci (Pages CMS), vzhled a kód v Claude Code**.

## 0. Synchronizace (povinné)

1. `git fetch origin`, `git switch main` (pokud nejsi na `main`), `git pull`. Pracuj jen na větvi `main`.
2. **Obsah z administrace nepřepisuj.** Zachovej zejména: text „O nás" (nadpis „Pojďte dál a posaďte se" a odstavce o Poděbradech, Sadské a Lysé nad Labem), PSČ `288 02`, souřadnice `50.18828…, 15.03555…`, hodiny, ceník. Do JSON souborů v `src/data/` zasahuj jen tam, kde to tento prompt výslovně vyžaduje, a vždy nad čerstvě staženou verzí.
3. Před pushem znovu `git fetch`, případně `git pull --rebase`. **Žádný `--force`, žádný push bez mého výslovného souhlasu**, napiš mi přesný příkaz.

## 1. Nový hlavní nadpis v hero

Současný nadpis „Péče o vlasy. Pro každého. Bez objednání." nesedí, protože se dámy nestříhají. **Zachovej strukturu tří řádků a styl** (třetí řádek „Bez objednání." champagne, tučná kurzíva, bez zvýraznění). Nový text:

- řádek 1: **Střih pro pány.**
- řádek 2: **Střih pro děti.**
- řádek 3: **Bez objednání.**

Podnadpis (dva řádky, adresa se nesmí zalomit): první řádek **„Kadeřnictví a holičství v Nymburce"**, druhý **„Zbožská 664/4, Nymburk"**. Texty drž v datech (`firma.json` nebo `seo.json`, podle toho, kde už dnes jsou), ne natvrdo v komponentě. Zachovej postupný nástup a nic nezpomaluj. Zkontroluj zalomení na 320–414 px, aby se nadpis nelámal uprostřed řádku.

## 2. Platba pouze v hotovosti

- Pod nadpis sekce **Ceník** přidej krátkou větu **„Platba pouze v hotovosti."** Drobnější než nadpis, v barvě `--salvej`, s malou jemnou ikonou (ruční styl jako ostatní ikony: bankovka nebo mince), bez výrazné barvy a bez rámečku. Nad záložkami pánské/dětské.
- Text ulož do `firma.json` jako pole `platba` (výchozí „Platba pouze v hotovosti."), ať se dá měnit v administraci (`.pages.yml`, popisek „Informace o platbě (Ceník)"). Prázdné pole = věta se nezobrazí.
- Do JSON-LD přidej `paymentAccepted: "Hotovost"` (a `currenciesAccepted: "CZK"`).
- Věta se objeví i v odpovědích v sekci s častými dotazy (viz bod 4).

## 3. Provozovatel (odpovědná osoba a IČ) v Kontaktu

Provozovatel je ověřený v ARES (obchodní jméno a IČO, stav aktivní). Údaje jsou:

- jméno: **Lucie Řehořová**
- IČ: **71108271**

**Sídlo ani adresu bydliště neuváděj** (v ARES je to soukromá adresa mimo Nymburk, na webu se zobrazuje jen provozovna Zbožská 664/4). Pole `sidlo` proto **nezakládej**.

- `firma.json`: nový objekt `provozovatel` s poli `jmeno` (výchozí „Lucie Řehořová") a `ic` (výchozí „71108271", validace regexem `^\d{8}$`, prázdné povoleno, aby šlo pole případně vymazat).
- V `.pages.yml` formulář „Provozovatel" s popisky česky, s hláškou „IČ má 8 číslic".
- V sekci Kontakt pod adresu a telefon: **„Provozovatel: {jméno}, IČ {ic}"** (jemný drobný text). Zobrazí se, jen když je `jmeno` nebo `ic` vyplněno. Na stránce Soukromí uveď stejného provozovatele jako správce údajů, pokud je vyplněn. Do JSON-LD přidej `legalName` a `taxID`, jen když jsou údaje vyplněné.
- Do `CLAUDE.md` zapiš: provozovatel Lucie Řehořová, IČ 71108271 (ověřeno v ARES, bez sídla). Do TODO: „potvrdit s majitelkou, že souhlasí se zveřejněním jména a IČ na webu".

## 4. SEO pro celou stránku a okolí (okres Nymburk)

Cíl: stránka dobře odpoví na vyhledávání „kadeřnictví Nymburk", „holičství Nymburk", „pánský střih Nymburk", „dětské kadeřnictví Nymburk", „střih bez objednání Nymburk" a pokryje okolí (okres Nymburk, Poděbrady, Sadská, Lysá nad Labem a další obce). **Žádné vycpávání klíčovými slovy, žádné duplicitní „doorway" stránky pro jednotlivé obce, nevymýšlej žádná fakta** (vzdálenosti, parkování, roky praxe, jména, akce). Text musí být čitelný pro člověka.

### 4.1 Title a description (v `src/data/seo.json`)

- `title`: **Kadeřnictví a holičství Nymburk | Pánské a dětské střihy** (56 znaků)
- `description`: **Pánské a dětské kadeřnictví a holičství v Nymburce, Zbožská 664/4. Střih bez objednání, fade, úprava a holení vousů. Platba v hotovosti.** (136 znaků)
- Kontroly: jedno `<h1>` na stránce, hierarchie `h2`/`h3` bez přeskoků, `lang="cs"`, canonical, `og:` a `twitter:` odpovídají novým textům.

### 4.2 Nová sekce „Pro Nymburk a okolí" (před Kontaktem)

Text ulož do nového souboru `src/data/okoli.json` a do `.pages.yml` jako formulář „Okolí a časté dotazy", ať jde upravit v administraci. Každý údaj musí mít `required` a rozumné limity. Návrh obsahu (nic nepřidávej, jen případně typograficky uprav):

- **Nadpis (h2):** `Kadeřnictví a holičství v Nymburce i okolí`
- **Odstavec 1:** `Kadeřnictví a holičství Nymburk najdete ve Zbožské ulici. Stříháme pány i děti, bez objednání: stačí přijít v otevírací době. Děláme klasické pánské střihy, fade strojkem i břitvou, úpravu a holení vousů, melír, barvení i trvalou. Děti stříháme od těch nejmenších po školáky.`
- **Odstavec 2:** `K nám chodí zákazníci z Nymburka i okolí: z Poděbrad, Sadské, Lysé nad Labem, Milovic a dalších obcí okresu Nymburk. Platba je možná pouze v hotovosti. Aktuální otevírací dobu a změny najdete na Facebooku.`
- **Seznam obcí** (pole `obce`, `areaServed` v JSON-LD, výchozí): Nymburk, Poděbrady, Lysá nad Labem, Sadská, Milovice, Kostomlaty nad Labem, Semice, Hořátev, Kovanice (Městec Králové a Rožďalovice jsou už příliš daleko, **neuvádět**). Na stránce jako **jemná souvislá věta** („Stříháme pány a děti z Nymburka, Poděbrad, …"), ne jako hustý seznam odkazů. Seznam je potvrzený Lukášem, dá se později upravit v administraci.

### 4.3 Sekce časté dotazy (pod sekcí okolí)

Hustota nízká, 6 otázek, bez JavaScriptu (`<details>`/`<summary>` nebo prosté `h3` + odstavce, přístupné z klávesnice, klidný přechod 0,4 s, `prefers-reduced-motion`). Otázky a odpovědi (část se **generuje z dat**, aby nikdy nebyla v rozporu s webem):

1. **Musím se objednat?** Ne. Stříháme pány i děti bez objednání, stačí přijít v otevírací době (pondělí až pátek).
2. **Jaká je otevírací doba?** Generuj z `firma.hodiny` („Po 8:00–14:30, Út 8:00–16:30, …, o víkendu zavřeno"). Dodej: „Aktuální otevírací dobu a změny najdete na Facebooku." (odkaz).
3. **Stříháte i dámy?** Ne, jsme kadeřnictví a holičství pro pány a děti.
4. **Kolik stojí střih?** Generuj z `cenik.json`: „Pánská klasika stojí {cena položky Klasika} Kč. Celý ceník najdete výše." Pokud položka „Klasika" neexistuje, větu vynech.
5. **Čím mohu platit?** Platba je možná pouze v hotovosti. (Bere se z pole `platba`.)
6. **Kde vás najdu?** Zbožská 664/4, Nymburk (PSČ z `firma.adresa.psc`). Mapa a fotka vstupu jsou v sekci Kontakt (odkaz na `#kontakt`).

Pokud nejsou data pro některou odpověď k dispozici, otázku nezobrazuj. Do JSON-LD **nepřidávej `FAQPage`** (Google tento typ pro malé firmy nezobrazuje), stačí viditelný text.

### 4.4 Strukturovaná data (JSON-LD v `Base.astro`)

Rozšiř stávající `HairSalon`:

- `address`: přidej `postalCode` (z `firma.adresa.psc`, jen když je platné číslo, bez mezery nebo s mezerou podle normy), `addressRegion` „Středočeský kraj", `addressCountry` „CZ".
- `areaServed`: pole objektů `{ "@type": "City", "name": "…" }` z pole `obce` (viz 4.2).
- `paymentAccepted`, `currenciesAccepted` (viz bod 2), `legalName` a `taxID` jen když vyplněno (bod 3).
- `image`: fotka budovy z `fotoBudovy`, pokud existuje, jinak `og.png`; přidej `logo` (kulaté logo židle).
- `telephone` z dat (`firma.telefon`), ne natvrdo. `openingHoursSpecification` už se generuje z dat, zkontroluj správnost u zavřených dní.
- `priceRange` nepřidávej (nemáme ověřeno).
- `description` shodné s meta description.

### 4.5 Technické SEO

- `public/robots.txt` má zástupnou adresu (`https://TODO-uzivatel.github.io/sitemap-index.xml`). Opravuj ji **automaticky z `SITE_URL` a `BASE_PATH`** při buildu (např. generovat `robots.txt` ze stránky Astro `src/pages/robots.txt.ts`), ať nikdy nezůstane špatná adresa a po nasazení vlastní domény se změní sama. Poznámka do `CLAUDE.md`: `robots.txt` se na projektové adrese `github.io/kadernictvi-nymburk/` nevyhodnocuje, platný bude až na vlastní doméně.
- `theme-color` v `Base.astro` sjednoť s paletou (`#f5f4f2` místo `#F3EFE6`).
- **Favicon a `og.png`:** zkontroluj, jestli odpovídají novému logu (židle v kruhu, champagne rámeček). Pokud ne, navrhni sjednocení (kulatý výřez židle jako favicon v SVG/PNG 32/180/512 a `og.png` 1200 × 630 s logem a textem „Kadeřnictví a holičství Nymburk"). Před výměnou mi ukaž náhled (screenshot).
- Alt texty fotek v galerii a ve službách popisné a bez opakování klíčových slov („Pánský fade s vyholeným vzorem" je dobře, „kadeřnictví Nymburk střih pánský fade" je špatně).
- Interní odkazy: v menu a patičce odkaz na `#okoli` není nutný, ale sekce má `id="okoli"`.
- Rychlost: Lighthouse mobil min. 90 ve Výkonu, Přístupnosti, Osvědčených postupech a SEO. Fotky dál přes `<Picture>`.

## 5. Kvalita a nasazení

- `npm run validate`, `npm test`, `npm run build` musí projít. Doplň testy: validace `ic`, generování odpovědí z dat (hodiny, cena klasiky), skrytí prázdných polí (`provozovatel`, `platba`), `areaServed` z `obce`, `robots.txt` s adresou ze `SITE_URL`.
- Screenshoty na 320, 390, 768 a 1280 px: hero s novým nadpisem, Ceník s větou o hotovosti, sekce Okolí a Dotazy, Kontakt (s provozovatelem i bez něj).
- Commitni lokálně na `main`. **Nepushuj bez mého souhlasu.**
- `CLAUDE.md`: nový nadpis a podnadpis, pole `platba`, `provozovatel`, `okoli.json`, FAQ (co se generuje z dat), pravidla SEO (žádná klíčová slova do alt textů, žádné doorway stránky), TODO: provozovatel a IČ, fotka budovy, potvrzení seznamu obcí, doména.

## Hotovo, když

- Hero nadpis je „Střih pro pány. / Střih pro děti. / Bez objednání." s podnadpisem „Kadeřnictví a holičství v Nymburce" a adresou na vlastním řádku.
- Pod nadpisem Ceník je „Platba pouze v hotovosti."
- V Kontaktu je „Provozovatel: Lucie Řehořová, IČ 71108271" (bez sídla). Po vymazání polí se nezobrazí nic.
- Sekce „Kadeřnictví a holičství v Nymburce i okolí" a časté dotazy jsou na stránce a upravitelné v administraci.
- JSON-LD má adresu s PSČ, `areaServed`, hotovost a zbytek z dat.
- `robots.txt` obsahuje správnou adresu mapy webu.
- Texty z administrace (O nás, PSČ, souřadnice) jsou beze změny.
- Na konci stručně shrň změny a co ještě potřebuješ (fotka budovy, souhlas majitelky se zveřejněním jména a IČ, doména).

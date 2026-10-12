# Zadání pro Claude Code: úpravy webu, kolo 1

Nejdřív přečti `CLAUDE.md` a po dokončení ho aktualizuj (stav, rozhodnutí, TODO, deník změn). Přiložené `navrh-uprav-hero-pocitac.png` a `navrh-uprav-hero-mobil.png` jsou orientační vizuální návrh. Drž se jejich ducha, detaily doladíš sám.

## Nové rozhodnutí o značce

Hlavní výhoda salonu: **střihá se bez objednání, stačí přijít v otevírací době.** Telefon zůstává jako volitelná možnost („Zavolat"), ne jako povinnost. Výsledek musí být vidět už v první obrazovce.

## 1. Sdělení „bez objednání"

- Nadpis hero: **„Péče o vlasy. Pro každého. Bez objednání."** (tři řádky, poslední tučnou kurzívou v barvě champagne `--zlata-velky`, **bez zvýrazňovacího podkladu**).
- Odstraň všechny zmínky, že se objednává telefonicky: poznámku „Objednáváme jen telefonicky" v hero, druhý odstavec v `firma.json` → `oNas.text`, `description` v `Base.astro`, větu na stránce Soukromí, JSON-LD, `README.md` i `CLAUDE.md`.
- Nové věty (uprav styl, nic nevymýšlej): O nás: „Stačí přijít v otevírací době, objednávat se nemusíte. Kdybyste si chtěli být jistí, zavolejte." Meta description: „Kadeřnictví a holičství v Nymburku, Zbožská 664/4. Dámy, pánové i děti, bez objednání."
- Tlačítko „Zavolat" a sticky lišta na mobilu zůstávají.
- Nic dalšího neslibuj (žádné „bez čekání", „vždy"), protože čekací doba není ověřená.

## 2. Otevírací doba hned na začátku

- Pod hero vlož výrazný pás (viz návrh, **světlý**, ne tmavý): vlevo nadpis „Stačí přijít. Bez objednání." a stav „Dnes otevřeno do 14:30" / „Dnes zavřeno", vpravo sedm dlaždic Po–Ne s časy. Dnešní den zvýrazněný barvou akcentu (champagne). Zavřené dny tlumeně.
- Když je zavřeno, uveď i příští otevření („Zavřeno · otevíráme v pondělí v 8:00"). Případně rozšiř `stavDnes()` a doplň testy (po–pá, víkend, těsně před otevřením, po zavření, přechod týdne).
- **Mobil:** stav a dlaždice musí být vidět hned pod tlačítkem Zavolat, **před** fotkami. Dlaždice ve 2 řádcích (4 + 3) nebo kompaktní seznam.
- Stávající samostatnou sekci „Otevírací doba" odstraň a sjednoť zdroj dat. Menu a odkazy ukazují na pás (`#hodiny`). Do Kontaktu přidej jen stručnou poznámku.
- Štítek „Dnes zavřeno" z hero odstraň (duplicita s pásem).
- **Otevírací doba je potvrzená: otevřeno pouze pondělí až pátek, v sobotu a v neděli zavřeno.** Odstraň `TODO` a poznámku o nepotvrzeném víkendu z `firma.json` (`hodinyPoznamka`), z kódu, `README.md` i `CLAUDE.md`. Víkend zůstává `null` (zavřeno). Texty typu „otevíráme v pondělí v 8:00" po pátečním zavření musí fungovat (příští otevření přes víkend).

## 3. Větší a lehce vylepšené logo

- Hlavička: značka cca 3,7 rem (mobil 2,9 rem), nápis cca 1,3 rem a vyšší hlavička (cca 5,6 rem). Zkontroluj, že se nic nezalamuje a že sticky hlavička nezakrývá kotvy.
- V `scripts/make-logo.mjs` logo jemně dopracuj, drž variantu 2 (nůžky nad hřebenem, linka v barvě akcentu, nápis): silnější čepele nůžek s patrným ostřím, čitelnější oka, hřeben s méně a výraznějšími zuby, aby fungoval i ve 32 px (favicon). Vygeneruj nové `logo*.svg`, favicon, `logo-512.png`, `og.png` a zkontroluj čitelnost ve 3 velikostech (32, 64, 128 px).

## 4. Barvy: „Černá, šedá & champagne" (finální, vybral klient, bez zelené)

Klient vybral variantu I. Nahraď stávající zelenou **černou, šedou a champagne** (světlá zlatavá). Tlačítka výzvy k akci jsou **tmavě šedá**, champagne slouží jako akcent. Hotové proměnné a přepisy jsou v `paleta-cerna-seda-champagne.css` (orientačně, přenes je do `global.css` do proměnných a komponent) a vzhled ukazuje `navrh-cerna-seda-champagne.html`. Všechny starší palety (hořčice, růžové zlato, bordó atd.) a jejich soubory **ignoruj**, jsou překonané.

Tokeny:

- `--krem: #f5f4f2`, `--salvej` (nově středně tmavá šedá): `#4b4c50`, `--salvej-tmava` (téměř černá): `#1d1d1f`, `--salvej-svetla`: `#e5e4e1`.
- `--zlata` (nově **champagne**): `#c9ab78`, `--zlata-velky` (velký text na světlém): `#9a7c4a`, `--zlata-tmava` (malý text na světlém): `#7a6030`, `--zlata-logo` (hřeben v logu): `#a08150`, `--na-akcentu` (text na ploše champagne): `#1d1d1f`.
- Sekce: střídavě krémová a světle šedá `#e8e7e4`, galerie téměř černá `#232325` s krémovým nadpisem.

Kde je champagne:

1. **CTA tlačítka jsou tmavě šedá** (`--cta: #2e2f33`, text krémový, ikona nůžek v champagne, stín `0 3px 0 #0f0f10`). Platí pro tlačítko **Zavolat** (hero, kontakt), telefon v hlavičce (tmavá „pilulka") i dolní lištu „Zavolat 603 242 505" na mobilu (nahoře champagne linka 3 px). Při najetí myší a při focusu se tlačítko změní na champagne s tmavým textem a nůžky cvaknou stejně jako dřív.
2. Aktivní záložka ceníku a dnešní den v pásu: pozadí champagne, tmavý text.
3. Champagne zůstává v ikoně nůžek na tlačítku, v hoveru tlačítek, v nadpisu „Bez objednání.", v linkách a v logu.
4. „Bez objednání." v nadpisu: tučná kurzíva v barvě champagne (`--zlata-velky: #9a7c4a`, tmavší odstín kvůli kontrastu velkého textu ≥ 3:1), bez podkladu.
5. (viz bod 2)
6. Linky pod nadpisy, rámeček a ornamenty ceníku, špendlíky v galerii, linky nad a pod pásem.

**Pás s hodinami je světlý** (`#fbfaf9`, linky champagne, dlaždice světle šedé, dnešní den champagne), ne tmavý.

Kontrast: champagne nepoužívej jako barvu textu na světlém pozadí (použij `--zlata-tmava` pro malý a `--zlata-velky` pro velký text), na ploše champagne vždy tmavý text. Zkontroluj WCAG AA u všech kombinací (zvlášť šedou `#4b4c50` na světlém pozadí pro malý text a šedé dny „zavřeno") a výsledek zapiš do shrnutí.

Logo: **hřeben v champagne** (`--zlata-logo`, `#a08150`), nůžky téměř černé `#1d1d1f`, „Nymburk" v nápisu šedou kurzívou `--salvej`, svislá linka mezi značkou a nápisem champagne. Vzor je v `logo-mark-champagne.svg`. Přegeneruj `logo*.svg`, favicon, `logo-512.png` a `og.png` a zkontroluj čitelnost ve 32, 64 a 128 px.

## 5. Drobnosti, které jsem našel

- Galerie: u některých polaroidů je pod fotkou prázdný bílý pruh (fotka nevyplní rámeček). Sjednoť poměr stran a `object-fit: cover`.
- Služby: na desktopu zůstává pravá polovina řádků prázdná. Zhustni rozložení (např. 3 sloupce nebo užší řádky s odkazem „Ceník" ke každé skupině), ať stránka není zbytečně dlouhá.
- Mapa v Kontaktu: pokud se nenačte nebo chybí souřadnice, nezobrazuj prázdný blok. Ukaž kartu s adresou a tlačítkem „Trasa na Mapy.cz".
- Hero: sniž prázdné místo nad nadpisem a pod tlačítkem, ať je pás s hodinami vidět na běžném notebooku bez scrollu (výška okna ~800 px).

## Hotovo, když

- `npm test` a `npm run build` projdou, žádné zmínky o objednávání v `src/`, `README.md`, `CLAUDE.md`.
- Screenshoty 360 / 390 / 1280 px potvrzují, že hodiny jsou vidět v první obrazovce (na mobilu hned pod tlačítkem).
- Lighthouse (mobil) Přístupnost a SEO min. 90.
- Na konci stručně shrň změny a co ještě potřebuješ (dámský a dětský ceník).

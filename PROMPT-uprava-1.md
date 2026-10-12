# Zadání pro Claude Code: úpravy webu, kolo 1

Nejdřív přečti `CLAUDE.md` a po dokončení ho aktualizuj (stav, rozhodnutí, TODO, deník změn). Přiložené `navrh-uprav-hero-pocitac.png` a `navrh-uprav-hero-mobil.png` jsou orientační vizuální návrh. Drž se jejich ducha, detaily doladíš sám.

## Nové rozhodnutí o značce

Hlavní výhoda salonu: **střihá se bez objednání, stačí přijít v otevírací době.** Telefon zůstává jako volitelná možnost („Zavolat"), ne jako povinnost. Výsledek musí být vidět už v první obrazovce.

## 1. Sdělení „bez objednání"

- Nadpis hero: **„Péče o vlasy. Pro každého. Bez objednání."** (tři řádky, poslední kurzívou v akcentní barvě).
- Odstraň všechny zmínky, že se objednává telefonicky: poznámku „Objednáváme jen telefonicky" v hero, druhý odstavec v `firma.json` → `oNas.text`, `description` v `Base.astro`, větu na stránce Soukromí, JSON-LD, `README.md` i `CLAUDE.md`.
- Nové věty (uprav styl, nic nevymýšlej): O nás: „Stačí přijít v otevírací době, objednávat se nemusíte. Kdybyste si chtěli být jistí, zavolejte." Meta description: „Kadeřnictví a holičství v Nymburku, Zbožská 664/4. Dámy, pánové i děti, bez objednání."
- Tlačítko „Zavolat" a sticky lišta na mobilu zůstávají.
- Nic dalšího neslibuj (žádné „bez čekání", „vždy"), protože čekací doba není ověřená.

## 2. Otevírací doba hned na začátku

- Pod hero vlož výrazný pás (viz návrh, **světlý**, ne tmavý): vlevo nadpis „Stačí přijít. Bez objednání." a stav „Dnes otevřeno do 14:30" / „Dnes zavřeno", vpravo sedm dlaždic Po–Ne s časy. Dnešní den zvýrazněný barvou akcentu (růžové zlato). Zavřené dny tlumeně.
- Když je zavřeno, uveď i příští otevření („Zavřeno · otevíráme v pondělí v 8:00"). Případně rozšiř `stavDnes()` a doplň testy (po–pá, víkend, těsně před otevřením, po zavření, přechod týdne).
- **Mobil:** stav a dlaždice musí být vidět hned pod tlačítkem Zavolat, **před** fotkami. Dlaždice ve 2 řádcích (4 + 3) nebo kompaktní seznam.
- Stávající samostatnou sekci „Otevírací doba" odstraň a sjednoť zdroj dat. Menu a odkazy ukazují na pás (`#hodiny`). Do Kontaktu přidej jen stručnou poznámku.
- Štítek „Dnes zavřeno" z hero odstraň (duplicita s pásem).
- Víkend je zatím nepotvrzený. Nech `TODO` v `firma.json` a upozorni na to v shrnutí.

## 3. Větší a lehce vylepšené logo

- Hlavička: značka cca 3,7 rem (mobil 2,9 rem), nápis cca 1,3 rem a vyšší hlavička (cca 5,6 rem). Zkontroluj, že se nic nezalamuje a že sticky hlavička nezakrývá kotvy.
- V `scripts/make-logo.mjs` logo jemně dopracuj, drž variantu 2 (nůžky nad hřebenem, zlatá linka, nápis): silnější čepele nůžek s patrným ostřím, čitelnější oka, hřeben s méně a výraznějšími zuby, aby fungoval i ve 32 px (favicon). Vygeneruj nové `logo*.svg`, favicon, `logo-512.png`, `og.png` a zkontroluj čitelnost ve 3 velikostech (32, 64, 128 px).

## 4. Barvy: „Šedomodrá & růžové zlato" (schváleno, bez zelené)

Zelená se majiteli nelíbí. Nahraď ji **šedomodrou** a **růžovým zlatem** (varianta H z barevných návrhů). Růžové zlato má být vidět na více místech, hlavně u výzvy k akci. Hotové proměnné a přepisy jsou v `paleta-sedomodra-ruzove-zlato.css` (orientačně, přenes je do `global.css` do proměnných a komponent) a vzhled ukazuje `navrh-sedomodra-ruzove-zlato.html`. Starší soubory s hořčicí (`paleta-horcice.css`, `navrh-horcice.html`) a ostatní barevné varianty **ignoruj**, jsou překonané.

Tokeny:

- `--krem: #f4f2f1`, `--salvej` (nově šedomodrá): `#5d6e80`, `--salvej-tmava`: `#3b4856`, `--salvej-svetla`: `#e4e2e1`.
- `--zlata` (nově **růžové zlato**): `#c98a73`, `--zlata-tmava` (pro text na světlém): `#8a5545`, `--na-akcentu` (text na ploše růžového zlata): `#1f2630`.
- Sekce: světlé střídavě krémová a světle šedá `#e7e4e2`, galerie tmavá šedomodrá `#2e3641` s krémovým nadpisem.

Kde je růžové zlato:

1. Tlačítko **Zavolat** (hero, kontakt): pozadí růžové zlato, tmavý text, nůžky cvaknou stejně jako dřív.
2. Telefon v hlavičce jako „pilulka" v růžovém zlatě.
3. Dolní lišta „Zavolat 603 242 505" na mobilu.
4. „Bez objednání." v nadpisu: tučná kurzíva s „zvýrazňovačem" v růžovém zlatě pod textem.
5. Dnešní den v pásu s hodinami a aktivní záložka ceníku.
6. Linky pod nadpisy, rámeček a ornamenty ceníku, špendlíky v galerii, linky nad a pod pásem.

**Pás s hodinami je světlý** (`#fbfaf9`, linky v růžovém zlatě, dlaždice světle šedé, dnešní den v růžovém zlatě), ne tmavý.

Kontrast: růžové zlato nepoužívej jako barvu textu na světlém pozadí (použij `--zlata-tmava`), na ploše růžového zlata vždy tmavý text. Zkontroluj WCAG AA u všech kombinací (zvlášť šedomodrá `#5d6e80` na krémovém pozadí pro malý text, v případě potřeby použij `--salvej-tmava`) a výsledek zapiš do shrnutí.

Logo: hřeben a značka v šedomodré `--salvej`, nůžky tmavé, linka mezi značkou a nápisem v růžovém zlatě. Přegeneruj `logo*.svg`, favicon, `logo-512.png` a `og.png`.

## 5. Drobnosti, které jsem našel

- Galerie: u některých polaroidů je pod fotkou prázdný bílý pruh (fotka nevyplní rámeček). Sjednoť poměr stran a `object-fit: cover`.
- Služby: na desktopu zůstává pravá polovina řádků prázdná. Zhustni rozložení (např. 3 sloupce nebo užší řádky s odkazem „Ceník" ke každé skupině), ať stránka není zbytečně dlouhá.
- Mapa v Kontaktu: pokud se nenačte nebo chybí souřadnice, nezobrazuj prázdný blok. Ukaž kartu s adresou a tlačítkem „Trasa na Mapy.cz".
- Hero: sniž prázdné místo nad nadpisem a pod tlačítkem, ať je pás s hodinami vidět na běžném notebooku bez scrollu (výška okna ~800 px).

## Hotovo, když

- `npm test` a `npm run build` projdou, žádné zmínky o objednávání v `src/`, `README.md`, `CLAUDE.md`.
- Screenshoty 360 / 390 / 1280 px potvrzují, že hodiny jsou vidět v první obrazovce (na mobilu hned pod tlačítkem).
- Lighthouse (mobil) Přístupnost a SEO min. 90.
- Na konci stručně shrň změny a co ještě potřebuješ (potvrzení víkendových hodin, dámský a dětský ceník).

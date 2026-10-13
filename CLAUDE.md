# CLAUDE.md – Kadeřnictví a holičství Nymburk (web)

Sdílená paměť projektu. Čti na začátku každé session, aktualizuj na konci. Bez hesel, tokenů a osobních údajů zákazníků (repozitář bude veřejný).

## Projekt
Jednostránkový, mobile-first web (česky) pro kadeřnictví a holičství v Nymburce. Správce webu: Lukáš (vlastní GitHub účet a repozitář). Majitelka salonu zatím nespravuje nic.

## Fakta o provozovně (zdroj pravdy)
- Název: Kadeřnictví a holičství Nymburk
- Adresa: Zbožská 664/4, Nymburk
- Telefon: 603 242 505 (`tel:+420603242505`)
- Hodiny: Po 8–14:30, Út 8–16:30, St 8–14:30, Čt 8–16:30, Pá 8–14, So+Ne zavřeno (POTVRZENO 2026-10-12: otevřeno jen Po–Pá)
- Facebook: https://www.facebook.com/profile.php?id=100057433419981
- Klientela: dámy, pánové, děti. Stříhá se **bez objednání**, stačí přijít v otevírací době (telefon jen volitelně), žádný rezervační systém.
- Doména: zatím žádná (placeholder).

## Rozhodnutí
- Technologie: Astro (statický), vanilla CSS, data v `src/data/*.json`. Hosting: GitHub Pages (veřejný repozitář).
- Vzhled: směr A „Salvěj & krém" (krém #F3EFE6, šalvěj #4F6B57, světlá šalvěj #CDD8C9, uhel #2B2A27, zlatá #C9A36B). Nadpisy měkký retro serif (Fraunces / Young Serif), text Hanken Grotesk / Instrument Sans. Ne Inter, ne fialové přechody.
- Odlišnost od AI webů: ceník jako vytištěný ceník se zlatým rámečkem, asymetrické hero, ručně kreslené ikony, galerie „fotky na stěně", cvaknutí nůžek na CTA.
- Logo: varianta 2 (horizontální: nůžky nad barberským hřebenem + nápis „Kadeřnictví & holičství *Nymburk*"). Návrh v `navrh-loga.html` a `logo-varianta-2.svg`, čisté SVG vytvoří Claude Code.
- Admin: Pages CMS (GitHub login) + GitHub Actions deploy. Záložně vlastní mini-admin přes GitHub API. Žádné PHP/.htaccess (GitHub Pages je statický). Zatím spravuje Lukáš přes svůj účet, majitelka později jako collaborator.
- (2026-10-11) Hlavní výhoda salonu: **stříhání bez objednání**. Hero nadpis „Péče o vlasy. Pro každého. Bez objednání." Telefon zůstává jen jako volitelné „Zavolat". Otevírací doba má být v první obrazovce (pás pod hero). Barvy sytější, logo větší. Zadání v `PROMPT-uprava-1.md`.
- (2026-10-11) Zelená se majiteli nelíbí. Připraveno 5 barevných variant (A bordó, B námořnická, C terakota, D uhel a měď, E čokoláda), viz `barevne-varianty.html`. Čeká na výběr. Do té doby nemění barvy v kódu.
- (2026-10-11) ~~Barvy: Břidlice & hořčice~~ (PŘEKONÁNO, viz níže).  Hořčice `#dba52a` na CTA Zavolat, telefonu v hlavičce, mobilní liště, zvýraznění „Bez objednání", dnešním dni, aktivní záložce. Pás s hodinami **světlý**. Tokeny v `paleta-horcice.css`, náhled `navrh-horcice.html`, zadání `PROMPT-uprava-1.md` (sekce 4). Starší výběry barev jsou překonané.
- (2026-10-11) ~~Barvy: Šedomodrá & růžové zlato~~ (PŘEKONÁNO)  (varianta H, zelená pryč). Růžové zlato `#c98a73` na CTA Zavolat, telefonu v hlavičce, mobilní liště, zvýraznění „Bez objednání", dnešním dni, aktivní záložce. Šedomodrá `#5d6e80`, tmavá `#3b4856`, krém `#f4f2f1`. Pás s hodinami **světlý**. Tokeny v `paleta-sedomodra-ruzove-zlato.css`, náhled `navrh-sedomodra-ruzove-zlato.html`, zadání `PROMPT-uprava-1.md` (sekce 4). Soubory s hořčicí a starší barevné varianty ignorovat.
- (2026-10-12) **Barvy FINÁLNÍ (vybral klient): „Černá, šedá & champagne"** (varianta I, zelená pryč). Champagne `#c9ab78` na CTA Zavolat, telefonu v hlavičce, mobilní liště, dnešním dni a aktivní záložce; „Bez objednání." v nadpisu champagne `#9a7c4a` (bez podkladu); hřeben v logu champagne `#a08150`, nůžky téměř černé. Šedá `#4b4c50`, černá `#1d1d1f`, krém `#f5f4f2`. Pás s hodinami **světlý**, galerie téměř černá. Tokeny v `paleta-cerna-seda-champagne.css`, náhled `navrh-cerna-seda-champagne.html`, logo `logo-mark-champagne.svg`, zadání `PROMPT-uprava-1.md` (sekce 4). Všechny starší palety a jejich soubory ignorovat.
- (2026-10-12) Upřesnění k finální paletě: **CTA tlačítka tmavě šedá** `#2e2f33` (Zavolat, telefon v hlavičce, mobilní lišta), ikona nůžek a hover v champagne. Otevírací doba **potvrzena: jen Po–Pá**, víkend zavřeno. Zapsáno v `PROMPT-uprava-1.md`.
- (2026-10-12) Barvy a tlačítka potvrzeny uživatelem. Dámský a dětský ceník zatím k dispozici není: na webu zůstává „Ceník doplníme" a doplní se, až ho klient dodá (`src/data/cenik.json`).
- (2026-10-12) Web je nasazený na GitHub Pages: https://lukaspilko1-sketch.github.io/kadernictvi-nymburk/ (repozitář pod účtem `lukaspilko1-sketch`, název `kadernictvi-nymburk`). Živá verze je zatím **stará** (hero „Péče o vlasy, která sedí.", „Objednáváme jen telefonicky", bez pásu s hodinami). `PROMPT-uprava-1.md` zatím nepromítnut do nasazení. Pánský ceník ponechat, klient dodá aktuální. Čeká se na texty a vlastní fotky, proto brzy nastavit admin (`PROMPT-admin-panel.md`).
- (2026-10-12) **Kolo 2 (`PROMPT-uprava-2.md`) provedeno v kódu:**
  - Hlavička: vlastní ikona Facebooku (`FbIkona.astro`, tmavá, při hoveru champagne, 44×44 px, nové okno). Desktop vlevo od telefonu, mobil vedle hamburgeru; pod 360 px se schová z hlavičky a je v menu.
  - Hero: podnadpis ve dvou řádcích („Dámy, pánové i děti" / „Zbožská 664/4, Nymburk", adresa `nowrap`). Pás s hodinami: věta s odkazem na Facebook a `text-wrap: balance` v nadpisu.
  - Název salonu v mobilní hlavičce: `clamp(1.05rem, 4.8vw, 1.25rem)`, 1. řádek „Kadeřnictví & holičství" (`.logo-radek`, nowrap), 2. řádek jen „Nymburk" (`display: block`). Při nedostatku místa se zmenšuje značka (2,6 rem pod 390 px), ne písmo. Ověřeno 320–414 px.
  - O nás: nadpis „Pojďte dál, posaďte se", text je v `firma.json` (`oNas.nadpis`, `oNas.text`), je to návrh k odsouhlasení majitelkou. Správně „v Nymburce" (6. pád) všude, 1. pád „Nymburk" jen v názvu a adrese.
  - Animace (pravidla): jen `opacity`/`transform`/`translate`/`scale`, pomalé (reveal 1,1 s, `cubic-bezier(0.22,0.61,0.36,1)`, posun 22 px, skupiny po 150 ms, max. 6 kroků), hero nástup postupně, fotky v hero se jemně vznášejí (±4 px, 9–11,5 s), cvaknutí nůžek 1,1 s, puntík „otevřeno" pulzuje 3 s. `prefers-reduced-motion` = žádný pohyb, bez JS je vše viditelné.

## Soubory ve složce
- `PROMPT-claude-code.md` – zadání pro stavbu webu
- `PROMPT-admin-panel.md` – zadání pro administraci (spustit až po hotovém webu)
- `navrh-kadernictvi-nymburk.html` – návrh směrů, loga, wireframe (zastaralé loga, platí směr A)
- `navrh-loga.html`, `logo-varianta-2.svg` – loga
- `img/` – 11 fotek z Facebooku (soubor `487829141_...` je screenshot pánského ceníku, ne do galerie)

## Stav
- [x] Směr A schválen, logo varianta 2 vybráno
- [x] Prompt pro web a pro admin hotové
- [x] Web postaven Claude Code (Astro, `src/`, testy, README, deploy workflow); vizuálně zkontrolován na 360/1280 px v prohlížeči, Lighthouse zatím neměřen
- [x] Úpravy kolo 1 (`PROMPT-uprava-1.md`) hotové a nasazené; Lighthouse mobil: výkon 91, přístupnost 100, postupy 100, SEO 100
- [x] Úpravy kolo 2 (`PROMPT-uprava-2.md`) provedeny v kódu a commitnuty lokálně, zatím NEPUSHNUTO (čeká na souhlas); Lighthouse mobil lokálně: výkon 90–91, přístupnost 100, postupy 100, SEO 100
- [ ] Admin panel (Pages CMS) nastaven
- [ ] Nasazení na GitHub Pages (workflow `.github/workflows/deploy.yml` připraven, repozitář a Pages zapnout)

## Struktura kódu
- `src/data/` firma, cenik, galerie (JSON) · `src/lib/otevreno.ts` (+ `tests/`) · `src/pages/index.astro` (celý web) · `src/styles/global.css` · `scripts/make-logo.mjs` (generuje logo do `public/`) · fotky v `src/assets/photos/` (kopie z `img/`, ceník `487829…` se nepoužívá).
- Detaily a TODO seznam: `README.md`.

## TODO / chybí
- Dámský a dětský ceník
- Text „O nás" a skutečné fotky salonu
- Doména
- Ověřit platnost pánského ceníku (platnost od 1. 3. 2025)
- Souhlas zákazníků s fotkami (jsou na nich i děti)
- PSČ, provozovatel na stránce Soukromí
- Logo.svg převést text na křivky (pro tisk); Lighthouse znovu změřit na ostré adrese

## Otevřené otázky
- Prompt web uváděl Cloudflare/Netlify, platí novější rozhodnutí GitHub Pages (tady použito).
- Nasazení pod `/<repo>/` vyžaduje `BASE_PATH` (nastaveno ve workflow).
- Doména (vlastní zatím není, běží na github.io)
- Kdy a zda dát majitelce přístup do administrace

## Deník změn
- 2026-10-11 – Založen projekt, schválen směr A, vybráno logo 2, napsány prompty (web, admin), založen CLAUDE.md.
- 2026-10-11 – Postaven web: hero, služby, ceník v rámečku (záložky), O nás, galerie s lightboxem, hodiny, kontakt, soukromí; testy otevřeno/zavřeno; logo skript; README; GitHub Actions deploy.
- 2026-10-11 – Prohlídka webu: navrženy úpravy kolo 1 (bez objednání, pás s hodinami, větší logo, sytější barvy), viz `PROMPT-uprava-1.md`.
- 2026-10-11 – Navrženy barevné varianty bez zelené (`barevne-varianty.html`).
- 2026-10-11 – Vybrána paleta Břidlice & hořčice, pás s hodinami světlý. Zadání přepsáno v `PROMPT-uprava-1.md`.
- 2026-10-11 – Finální paleta změněna na Šedomodrá & růžové zlato (H). Zadání upraveno v `PROMPT-uprava-1.md`.
- 2026-10-11 – Upřesnění: „Bez objednání." v nadpisu v barvě růžového zlata (`#b36b54`, bez zvýrazňovacího podkladu), hřeben v logu v růžovém zlatě (`logo-mark-ruzove-zlato.svg`). Zapsáno v `PROMPT-uprava-1.md`.
- 2026-10-12 – Klient vybral finální paletu Černá, šedá & champagne (I). `PROMPT-uprava-1.md` přepsán.
- 2026-10-12 – CTA tlačítka tmavě šedá, potvrzena otevírací doba Po–Pá (víkend zavřeno).
- 2026-10-12 – Barvy potvrzeny, dámský a dětský ceník zatím chybí. Další krok: spustit `PROMPT-uprava-1.md`, pak admin a nasazení.
- 2026-10-12 – Zjištěno: web je na GitHub Pages (stará verze). Ceník ponechat do dodání aktuálního. Další: úpravy 1, pak admin.
- 2026-10-12 – Provedeny úpravy kolo 1: „Bez objednání“ v hero, světlý pás s hodinami pod hero (na mobilu před fotkami), příští otevření v `stavDnes()` (+4 testy), větší logo i hlavička, nové logo (silnější nůžky, hřeben se 7+4 zuby), paleta Černá, šedá & champagne, CTA tmavě šedá, služby ve 3 sloupcích, galerie bez bílých pruhů, mapa jen se souřadnicemi (jinak karta s Mapy.cz), odstraněny zmínky o objednávání a nepotvrzeném víkendu.
- 2026-10-12 – Doplněny souřadnice salonu (50.1809147 N, 15.2305108 E): mapa OSM se značkou a `geo` v JSON-LD. Dámský a dětský ceník klient dodá později.
- 2026-10-12 – Připraven `PROMPT-uprava-2.md` (kolo 2): Facebook v hlavičce, adresa v hero na vlastním řádku, odkaz na FB v pásu s hodinami, „Nymburku“ → „Nymburce“, větší mobilní název (2. řádek jen „Nymburk“), nový text O nás (návrh, schválí majitelka), pomalejší klidné animace. Kontrola: živá verze odpovídá složce. Pozn.: lokální větev `master`, workflow se spouští na `main`; bez souhlasu nepushovat.
- 2026-10-12 – Provedeno kolo 2: Facebook v hlavičce a v pásu s hodinami, adresa v hero na vlastním řádku, „Nymburce", větší dvouřádkový název v mobilní hlavičce, nový text O nás (návrh), pomalé klidné animace. Commit lokálně, bez pushe.
- 2026-10-13 – Ceník: dámské = „Cena podle domluvy.“, dětské = odkaz na pánský ceník (děti do 6 let); pole `poznamka` v `cenik.json`. Hlavička: „Nymburk“ v logu vždy na 2. řádku i na PC, barva champagne (`--zlata` #c9ab78). Neověřeno buildem, necommitnuto.

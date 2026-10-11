# CLAUDE.md – Kadeřnictví a holičství Nymburk (web)

Sdílená paměť projektu. Čti na začátku každé session, aktualizuj na konci. Bez hesel, tokenů a osobních údajů zákazníků (repozitář bude veřejný).

## Projekt
Jednostránkový, mobile-first web (česky) pro kadeřnictví a holičství v Nymburku. Správce webu: Lukáš (vlastní GitHub účet a repozitář). Majitelka salonu zatím nespravuje nic.

## Fakta o provozovně (zdroj pravdy)
- Název: Kadeřnictví a holičství Nymburk
- Adresa: Zbožská 664/4, Nymburk
- Telefon: 603 242 505 (`tel:+420603242505`)
- Hodiny: Po 8–14:30, Út 8–16:30, St 8–14:30, Čt 8–16:30, Pá 8–14, So+Ne zavřeno (víkend nepotvrzen)
- Facebook: https://www.facebook.com/profile.php?id=100057433419981
- Klientela: dámy, pánové, děti. Objednávání jen telefonem, bez rezervačního systému.
- Doména: zatím žádná (placeholder).

## Rozhodnutí
- Technologie: Astro (statický), vanilla CSS, data v `src/data/*.json`. Hosting: GitHub Pages (veřejný repozitář).
- Vzhled: směr A „Salvěj & krém" (krém #F3EFE6, šalvěj #4F6B57, světlá šalvěj #CDD8C9, uhel #2B2A27, zlatá #C9A36B). Nadpisy měkký retro serif (Fraunces / Young Serif), text Hanken Grotesk / Instrument Sans. Ne Inter, ne fialové přechody.
- Odlišnost od AI webů: ceník jako vytištěný ceník se zlatým rámečkem, asymetrické hero, ručně kreslené ikony, galerie „fotky na stěně", cvaknutí nůžek na CTA.
- Logo: varianta 2 (horizontální: nůžky nad barberským hřebenem + nápis „Kadeřnictví & holičství *Nymburk*"). Návrh v `navrh-loga.html` a `logo-varianta-2.svg`, čisté SVG vytvoří Claude Code.
- Admin: Pages CMS (GitHub login) + GitHub Actions deploy. Záložně vlastní mini-admin přes GitHub API. Žádné PHP/.htaccess (GitHub Pages je statický). Zatím spravuje Lukáš přes svůj účet, majitelka později jako collaborator.

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
- [ ] Admin panel (Pages CMS) nastaven
- [ ] Nasazení na GitHub Pages (workflow `.github/workflows/deploy.yml` připraven, repozitář a Pages zapnout)

## Struktura kódu
- `src/data/` firma, cenik, galerie (JSON) · `src/lib/otevreno.ts` (+ `tests/`) · `src/pages/index.astro` (celý web) · `src/styles/global.css` · `scripts/make-logo.mjs` (generuje logo do `public/`) · fotky v `src/assets/photos/` (kopie z `img/`, ceník `487829…` se nepoužívá).
- Detaily a TODO seznam: `README.md`.

## TODO / chybí
- Dámský a dětský ceník
- Text „O nás" a skutečné fotky salonu
- Souřadnice pro JSON-LD, doména
- Ověřit platnost pánského ceníku (platnost od 1. 3. 2025) a víkendové hodiny
- Souhlas zákazníků s fotkami (jsou na nich i děti)
- Souřadnice (JSON-LD a značka v mapě), PSČ, provozovatel na stránce Soukromí
- Změřit Lighthouse po nasazení; logo.svg převést text na křivky (pro tisk)

## Otevřené otázky
- Prompt web uváděl Cloudflare/Netlify, platí novější rozhodnutí GitHub Pages (tady použito).
- Nasazení pod `/<repo>/` vyžaduje `BASE_PATH` (nastaveno ve workflow).
- Název repozitáře a doména
- Kdy a zda dát majitelce přístup do administrace

## Deník změn
- 2026-10-11 – Založen projekt, schválen směr A, vybráno logo 2, napsány prompty (web, admin), založen CLAUDE.md.
- 2026-10-11 – Postaven web: hero, služby, ceník v rámečku (záložky), O nás, galerie s lightboxem, hodiny, kontakt, soukromí; testy otevřeno/zavřeno; logo skript; README; GitHub Actions deploy.

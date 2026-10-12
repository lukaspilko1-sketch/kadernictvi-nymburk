# Zadání pro Claude Code: úpravy webu, kolo 2

Nejdřív přečti `CLAUDE.md` a po dokončení ho aktualizuj (stav, rozhodnutí, TODO, deník změn). Kolo 1 (`PROMPT-uprava-1.md`) je hotové a nasazené, nic z něj nevracej. Drž se stávající palety „Černá, šedá & champagne" a tmavě šedých CTA tlačítek.

## 1. Facebook v hlavičce

- Přidej do horní hlavičky ikonu Facebooku s odkazem na `firma.facebook` (z `src/data/firma.json`). Otevírá se v novém okně (`target="_blank" rel="noopener noreferrer"`).
- Použij jednoduché vlastní SVG písmeno „f" v kruhu nebo zaobleném čtverci. **Nepoužívej oficiální modrou barvu Facebooku**, drž paletu: ikona tmavá (`--uhel`), při hoveru a focusu champagne (`--zlata`) s pomalým přechodem.
- Desktop: ikona vlevo vedle telefonního tlačítka. Mobil: ikona vedle hamburger menu. Klikací plocha min. 44 × 44 px, `aria-label="Facebook salonu, otevře se v novém okně"`, viditelný focus.
- Na šířkách pod cca 360 px, kde by se hlavička přeplnila, ikonu z hlavičky skryj a nech ji v otevřeném menu (a v sekci Kontakt, kde odkaz už je).

## 2. Hero: adresa na vlastní řádek

- Podnadpis v hero rozděl na dva řádky: první **„Dámy, pánové i děti"**, druhý **„Zbožská 664/4, Nymburk"**. Bez oddělovací tečky „·".
- Adresa se nesmí zalomit uvnitř (`white-space: nowrap` na řádku s adresou), ani na mobilu.

## 3. Pás s hodinami: odkaz na Facebook

- Pod dlaždice dnů (nebo vedle stavu „Dnes zavřeno · …") přidej krátkou větu s odkazem: **„Aktuální otevírací dobu a změny najdete na Facebooku."** Slovo „Facebooku" je odkaz (jako výše, nové okno) s malou ikonou „f".
- Věta je menší, šedá (`--salvej`), nesmí zvětšit pás o víc než jeden řádek na desktopu. Na mobilu se smí zalomit.
- Nadpis pásu „Stačí přijít. Bez objednání." na desktopu zalamuje nešikovně („Bez / objednání."). Použij `text-wrap: balance` nebo vhodnou `max-width`, aby se zalomil po tečce.

## 4. „Nymburku" → „Nymburce"

- Změň všude, kde je 6. pád („v Nymburku"), na „v Nymburce". Název „Nymburk" (1. pád: logo, nadpis, adresa, `<title>`) zůstává.
- Projdi celý repozitář (`grep -rni "nymburk"`): `src/data/firma.json` (O nás), `src/layouts/Base.astro` (description, `og:description`, `twitter:description`, JSON-LD), `src/pages/*.astro` (včetně Soukromí), `README.md`, `CLAUDE.md`, alt texty, testy. Zkontroluj i jiné pády („do Nymburka" ponech, je správně).
- Po změně znovu `npm test` a `npm run build`.

## 5. Mobilní hlavička: větší název

- Na mobilu zvětši název „Kadeřnictví & holičství Nymburk" v hlavičce (nyní cca 0,95 rem) na cca 1,1–1,2 rem (např. `clamp(1.05rem, 4.8vw, 1.25rem)`).
- **První řádek musí zůstat celý „Kadeřnictví & holičství" a druhý řádek jen „Nymburk".** Zajisti to značkou, ne náhodou zalomením: první část do `<span class="logo-radek">` s `white-space: nowrap`, „Nymburk" jako blokový prvek na mobilu (`display: block`), na desktopu zůstává vše na jednom řádku.
- Pokud se při zvětšení na úzkých telefonech nevejde, zmenši značku (hřeben) na cca 2,6 rem a mezery, ne písmo. Ověř šířky 320, 360, 375, 390 a 414 px, žádné přetečení, hamburger i ikona Facebooku musí zůstat vedle.

## 6. Text v sekci „O nás"

Cíl: přátelský, jednoduchý text pro obyčejné lidi. V salonu pracuje několik kolegyň, jsou příjemné, vyjdou vstříc a rády si se zákazníky popovídají. **Nevymýšlej další fakta** (žádný rok založení, počet let praxe, jména, ocenění, „rodinný podnik" apod.). Použij tento text (uprav jen typografii):

Nadpis (místo „O nás" zachovej `id="o-nas"` a menu): **Pojďte dál, posaďte se**

> Přijďte, jak jste zvyklí, a řekněte, jak to chcete mít. Objednávat se nemusíte a nemusíte nic složitě vysvětlovat.
>
> V salonu vás obslouží několik kolegyň, které jsou příjemné a rády vám vyjdou vstříc. Když si nejste jistí, poradí. Když chcete jen zkrátit, zkrátí. A když máte chuť si popovídat, rády si při práci poklábosí.
>
> Najdete nás v Nymburce ve Zbožské ulici. Stříháme dámy, pány i děti.

- Ulož text do `src/data/firma.json` (`oNas.nadpis`, `oNas.text` jako pole odstavců), nic natvrdo v komponentě. Aktualizuj `oNas.TODO` na „Text je návrh, majitelka ho může upravit."
- Odstavce se čtou pohodlně (max. cca 60 znaků na řádek, řádkování ~1,7).

## 7. Pomalejší, klidné animace

Web má působit klidně. Zpomal a zjemni pohyb, nic nesmí „skákat". Pouze `opacity` a `transform` (žádné animace rozložení), vždy s ohledem na `prefers-reduced-motion: reduce` (tam žádný pohyb) a na stav bez JS (obsah viditelný).

- **Scroll-reveal:** délka 1,0–1,2 s, `cubic-bezier(0.22, 0.61, 0.36, 1)`, posun jen cca 18–24 px. Prvky ve skupině (dlaždice dnů, karty služeb, polaroidy v galerii) odhal se zpožděním po 120–180 ms (max. 6 kroků), ne všechny najednou.
- **Hero při načtení:** postupný, pomalý nástup: štítek, tři řádky nadpisu (každý o cca 200 ms později), adresa, tlačítko, nakonec fotky (jemné zvětšení z 0,97 na 1 a zprůhlednění během cca 1,4 s).
- **Fotky v hero:** velmi jemné „vznášení" (±4 px, 9–12 s, `ease-in-out`, každá fotka s jiným zpožděním). Žádný pohyb při `prefers-reduced-motion`.
- **Hover a focus:** přechody tlačítek, menu, ikony Facebooku a fotek 0,35–0,6 s (fotky `scale(1.02)`, pomalu). Cvaknutí nůžek na tlačítku zpomal asi na 1,1 s.
- **Pás s hodinami:** zelený/jantarový puntík u „Dnes otevřeno" jemně pulzuje (cca 3 s), u „Dnes zavřeno" nepulzuje.
- Nezhoršit výkon: žádné těžké filtry, `will-change` jen krátce nebo vůbec. Lighthouse (mobil) Výkon, Přístupnost a SEO min. 90.

## 8. Nasazení a kontrola

- Commitni lokálně se srozumitelnou zprávou. **Nepushuj bez mého výslovného souhlasu.** Poznámka: lokální větev je `master`, ale workflow `.github/workflows/deploy.yml` se spouští na `main`. Před pushem ověř, kam se pushuje (`git branch -a`, `git remote -v`), a napiš mi přesný příkaz (např. `git push origin master:main`). Až potvrdím, pushni.
- Screenshoty na 320, 360, 390, 768 a 1280 px a krátké shrnutí na konci.
- Zapiš do `CLAUDE.md`: Facebook v hlavičce, rozložení hero, nový text „O nás" (včetně „Nymburce"), pravidlo pro mobilní hlavičku, zásady animací.

## Hotovo, když

- `npm test` a `npm run build` projdou.
- V repozitáři není „v Nymburku" (grep).
- Na mobilu je název ve dvou řádcích (druhý jen „Nymburk"), je větší než dřív a nic nepřetéká od 320 px.
- Hero ukazuje adresu na vlastním řádku, pás s hodinami odkaz na Facebook, hlavička ikonu Facebooku.
- Na konci stručně shrň změny a co ještě potřebuješ (aktuální ceník, dámský a dětský ceník, vlastní fotky, případné schválení textu „O nás" majitelkou).

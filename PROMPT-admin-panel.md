# Zadání pro Claude Code: úpravy obsahu webu bez programování (GitHub Pages)

Spusť až po dokončení webu podle `PROMPT-claude-code.md`. Web je v Astro, statický a poběží na **GitHub Pages**. Web zatím spravuje vývojář (Lukáš) přes svůj GitHub účet, repozitář je jeho. Později má majitelka salonu (netechnický uživatel) umět sama měnit texty, ceník, otevírací dobu a fotky, takže administraci připrav hned tak, aby se jí dal později jen přidat přístup k repozitáři (GitHub collaborator), bez předělávání.

## 0. CLAUDE.md – sdílená paměť projektu (povinné)

V kořeni projektu je soubor `CLAUDE.md` s aktuálním stavem projektu. Pracuje s ním Claude Code i další asistenti (např. Claude v chatu), takže musí být vždy pravdivý.

- **Na začátku každé session** přečti `CLAUDE.md` celý a řiď se jím (rozhodnutí, fakta, TODO).
- **Během práce** zapisuj do sekce „Stav" a „Rozhodnutí" vše podstatné: co je hotové, co se změnilo a proč, co zbývá.
- **Na konci každé session** (a po každé větší změně) aktualizuj `CLAUDE.md`: stav, nové/odškrtnuté `TODO`, otevřené otázky a jeden řádek do „Deníku změn" (datum, co se změnilo). Pokud se změní fakt nebo rozhodnutí, oprav ho tam, ne jen připiš.
- Pokud kód nebo uživatel `CLAUDE.md` odporuje, upozorni mě a dohodněte se, ne tiše přepisuj.
- Do `CLAUDE.md` nikdy nedávej hesla, tokeny ani osobní údaje zákazníků (repozitář bude veřejný).
- `CLAUDE.md` drž stručný a čitelný (do cca 200 řádků), detaily patří do `README.md` a `docs/`.

## Důležité omezení

GitHub Pages je čistě statický hosting. **Žádné PHP, žádný `.htaccess`, žádné `save.php`/`upload.php`, žádné Basic Auth.** Cokoli, co by potřebovalo vlastní server, nepoužívej. Úpravy proto musí fungovat tak, že se změna uloží jako commit do repozitáře a GitHub Actions web znovu sestaví a nasadí (cca 1–2 minuty).

## 1. Analýza

Projdi hotový web a `src/data/` (`firma.json`, `cenik.json`, `galerie.json`). Vypiš mi:

- Co je editovatelný obsah (kontakt, otevírací doba, ceník, texty služeb, „O nás", galerie, SEO texty).
- Co zůstane pevně v kódu (layout, styly, animace, logo, navigace).
- Co v datech chybí nebo je `TODO`.

Přidej pouze sekce, které web skutečně má. Nic nevymýšlej.

## 2. Datový model

- Veškerý editovatelný obsah drž v `src/data/*.json` (nebo `.yml`), nic z toho nebude natvrdo v komponentách.
- Ceník: pole skupin (`Pánské`, `Dámské`, `Dětské`), v nich položky `nazev`, `cena`, `poznamka`, plus `platnostOd`. Cena jako číslo, formátování („225 Kč") dělá web.
- Otevírací doba: pro každý den `od`, `do` nebo `zavreno: true`. Štítek „Dnes otevřeno" se počítá z těchto dat.
- Galerie: `src` (cesta v `src/assets/galerie/`), `alt`, `zobrazit` (true/false), `poradi`.
- Při buildu validuj data (např. Zod schéma v Astro Content Collections). Když je chyba (chybí cena, špatný čas, neexistující fotka), **build selže s čitelnou českou hláškou** a stará verze webu zůstane online beze změny. Tím nejde web editací rozbít.

## 3. Rozhraní pro úpravy (admin)

Doporučené řešení: **Pages CMS** (pagescms.org), webové rozhraní, ke kterému se majitelka přihlásí svým GitHub účtem a edituje formuláře. Změny se zapisují přímo jako commity do repozitáře.

1. Přidej do kořene repozitáře `.pages.yml` s formuláři pro: Kontakt a hodiny, Ceník (opakující se položky), Služby a texty, Galerie (nahrání fotek do `src/assets/galerie/`), SEO (title, description).
2. Názvy polí a popisky ve formulářích **česky** a srozumitelně (např. „Cena v Kč", „Skrýt fotku").
3. **Ověř si aktuální dokumentaci** na https://pagescms.org/docs a typy polí, které umí (zejména práci s JSON soubory, opakující se položky a nahrávání médií). Pokud něco nepodporuje, uprav datový model (např. YAML nebo Markdown soubory místo JSON) a napiš mi, co jsi změnil a proč.
4. Pokud by Pages CMS nešel použít, navrhni a po mém souhlasu udělej záložní variantu: jednoduchá stránka `/admin/` v čistém JS, která přes GitHub REST API (Contents API) zapisuje změny a nahrává fotky. Přihlášení pomocí fine-grained tokenu s oprávněním **jen k tomuto repozitáři** a jen `Contents: read/write`, token uložený pouze v prohlížeči (`localStorage`) a nikdy v repozitáři. Na stránce `/admin/` nesmí být žádný tajný údaj.

## 4. Nasazení (GitHub Actions)

- Workflow `.github/workflows/deploy.yml`: při pushi do `main` spustí `npm ci`, `npm run build` a nasadí `dist/` na GitHub Pages (oficiální `actions/configure-pages`, `upload-pages-artifact`, `deploy-pages`).
- Před buildem spusť validaci dat a testy z hlavního promptu.
- Nastav správné `site` a `base` v `astro.config.mjs`. Připrav to pro vlastní doménu (soubor `public/CNAME` jako placeholder, vlastní doména se doplní později).
- Pozn.: bezplatné GitHub Pages obvykle vyžadují veřejný repozitář. Do repozitáře proto **nikdy** neukládej hesla, tokeny ani osobní údaje zákazníků.

## 5. Fotky

- Nahrané fotky se při buildu optimalizují (WebP/AVIF, více velikostí). Přesto doporuč v návodu max. cca 3 MB na fotku.
- V návodu uveď: nenahrávat fotky, na kterých jsou zákazníci, bez jejich souhlasu. Zákazníky v galerii lze skrýt přepínačem „Skrýt fotku".

## 6. Návod pro majitelku

Vytvoř `docs/NAVOD-pro-majitelku.md` česky, krátce a bez technického žargonu:

1. Jak se přihlásit.
2. Jak změnit otevírací dobu, cenu, přidat položku do ceníku.
3. Jak přidat a skrýt fotku.
4. Kdy se změna objeví na webu (po 1–2 minutách) a co dělat, když ne.
5. Co dělat, když se objeví chyba (kam napsat, jak vrátit poslední změnu přes historii commitů).

A samostatně `docs/NAVOD-pro-spravce.md` (pro mě): jak zřídit repozitář pod mým účtem, GitHub Pages, jak později přidat majitelku jako collaboratora, vlastní doménu, jak vrátit změny.

## 7. Kvalita

- Web musí fungovat i bez JS stejně jako dřív. Admin ho nesmí zpomalit (admin je mimo web, nebo na `/admin/` jen záložní varianta).
- Otestuj scénáře: změna ceny, nová položka, nová fotka, skrytá fotka, špatně zadaný čas (build musí selhat srozumitelně).
- Žádné vymyšlené údaje, nové `TODO` vypiš.

## 8. Závěrečné shrnutí

Na konci stručně napiš: které sekce jsou editovatelné, co zůstalo pevně v kódu, jaké řešení administrace jsi použil a proč, jak to otestovat, a **co ještě potřebuješ dodat** (název repozitáře, doména, případně GitHub účet majitelky později).
5. Potvrď, že jsi aktualizoval `CLAUDE.md`.

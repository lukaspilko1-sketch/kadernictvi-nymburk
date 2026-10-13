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

## Aktuální stav webu (platí místo starších předpokladů)

- **Správce je jen Lukáš** (vlastník repozitáře). Majitelka salonu GitHub nemá a nejspíš mít nebude, změny jí bude dělat Lukáš (podle jejích zpráv/telefonu). Proto: **nevytvářej návod pro majitelku**, nepočítej s collaboratory a nic nepřizpůsobuj netechnickému uživateli. Admin má být pro Lukáše rychlý a bezpečný (validace, srozumitelné české hlášky, nejde jím web rozbít). Pokud by se to v budoucnu změnilo, stačí přidat účet jako collaboratora, bez předělávání.
- **Galerie se nastavuje hned**: nahrání fotek přes admin do `src/assets/galerie/`, pole `alt` (povinné), `zobrazit` (skrýt fotku), `poradi`, případně popisek. Zkontroluj, jak galerii vykresluje stávající kód a `src/data/galerie.json`, a admin přizpůsob tomu (stávající fotky z Facebooku musí zůstat funkční). Při buildu se fotky optimalizují. Doporuč v návodu max. cca 3 MB na fotku a upozorni na souhlas zákazníků s fotkou (děti!).

- Web je hotový a nasazený, repozitář `lukaspilko1-sketch/kadernictvi-nymburk`. Nasazuje se **jen z větve `main`**, lokální větev je `master`. Před pushem ověř větve a nepushuj bez mého výslovného souhlasu; napiš mi přesný příkaz (např. `git push origin master:main`). Případně navrhni sjednocení na `main`.
- Data už existují a **nepřepisuj jejich strukturu zbytečně**: `src/data/firma.json` (kontakt, hodiny jako `{od, do}` nebo `null` pro zavřeno, souřadnice, `oNas.nadpis` a `oNas.text` jako pole odstavců), `src/data/cenik.json` (`skupiny` → `sekce` → `polozky` s `nazev`, `cena`; u skupiny volitelná `poznamka`; `platnostOd`), `src/data/galerie.json`. Pokud formulář Pages CMS něco z toho neumí (např. `null` u víkendu), uprav datový model **i kód, testy a build tak, aby web fungoval stejně**, a napiš mi, co jsi změnil.
- Ceník: pánský platí od 1. 3. 2025 (čeká na aktualizaci). Dámský má jen `poznamka` „Cena podle domluvy.", dětský `poznamka` „Ceny pro děti do 6 let najdete v pánském ceníku." a prázdné `sekce`. Majitelka musí v administraci umět **přidat sekce a položky do dámského a dětského ceníku**; jakmile je `sekce` neprázdná, web zobrazí ceník místo poznámky.
- Text „O nás" je návrh, bude se upravovat v administraci. Formulář: nadpis + odstavce.
- Hodiny: formát `HH:MM`; validace musí odmítnout špatný čas a `do` dřívější než `od`. Pás s hodinami i stav „Dnes otevřeno/zavřeno" se počítají z těchto dat.
- Vzhled (barvy, rozložení, animace) zůstává v kódu a admin ho nemění. Nesahej na paletu „Černá, šedá & champagne".
- Doména a PSČ zatím nejsou (`TODO`), neměň je.

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

Vytvoř jen `docs/NAVOD-pro-spravce.md` (pro Lukáše), česky a stručně, s číslovanými kroky:

1. Jak se přihlásit do administrace.
2. Jak změnit otevírací dobu, cenu, přidat položku nebo sekci do ceníku (včetně dámského a dětského).
3. Jak upravit texty (O nás, služby, SEO).
4. Jak přidat, přeřadit a skrýt fotku v galerii.
5. Kdy se změna objeví na webu (po 1–2 minutách), jak zkontrolovat běh v záložce Actions a co dělat, když build selže.
6. Jak vrátit poslední změnu přes historii commitů.
7. Doména (`public/CNAME`), případné přidání dalšího editora jako collaboratora.

## 7. Kvalita

- Web musí fungovat i bez JS stejně jako dřív. Admin ho nesmí zpomalit (admin je mimo web, nebo na `/admin/` jen záložní varianta).
- Otestuj scénáře: změna ceny, nová položka, nová fotka, skrytá fotka, špatně zadaný čas (build musí selhat srozumitelně).
- Žádné vymyšlené údaje, nové `TODO` vypiš.

## 8. Závěrečné shrnutí

Na konci stručně napiš: které sekce jsou editovatelné, co zůstalo pevně v kódu, jaké řešení administrace jsi použil a proč, jak to otestovat, a **co ještě potřebuješ dodat** (název repozitáře, doména, případně GitHub účet majitelky později).
5. Potvrď, že jsi aktualizoval `CLAUDE.md`.

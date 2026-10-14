# Návod pro správce webu

Pro Lukáše (vlastník repozitáře `lukaspilko1-sketch/kadernictvi-nymburk`). Obsah webu se upravuje ve formulářích **Pages CMS**. Každé uložení je commit do větve `main`, GitHub Actions web sestaví a nasadí. Vzhled (barvy, rozložení, animace, logo) v administraci není, ten je v kódu.

## 1. Přihlášení do administrace

1. Otevřete https://app.pagescms.org a přihlaste se přes GitHub (účet `lukaspilko1-sketch`).
2. Při prvním přihlášení povolte aplikaci Pages CMS přístup k repozitáři `kadernictvi-nymburk` (stačí jen tento jeden).
3. Vyberte repozitář a větev **main**. V levém menu uvidíte: *Kontakt, hodiny a O nás*, *Ceník*, *Služby*, *Galerie*, *SEO* a *Fotky* (nahrané soubory).

Formuláře se řídí souborem `.pages.yml`. Pokud se menu nezobrazí, zkontrolujte, že jste na větvi `main` a že `.pages.yml` v ní je.

## 2. Otevírací doba a ceník

**Otevírací doba:** *Kontakt, hodiny a O nás → Otevírací doba*. U každého dne zadejte „Otevíráme od“ a „Zavíráme v“ ve tvaru `HH:MM` (např. `08:30`). Když je zavřeno, zaškrtněte **Zavřeno**. Pás s hodinami i štítek „Dnes otevřeno“ se přepočítají sami.

**Změna ceny:** *Ceník → Skupiny → Pánské → sekce (např. Vlasy) → položka → Cena v Kč*. Jen číslo, např. `240`. Slovo „Kč“ doplní web. Nahoře případně změňte „Ceník platný od“.

**Nová položka:** v sekci pod *Položky* klikněte na přidání, vyplňte název a cenu (volitelně poznámku, např. „dlouhé vlasy +50 Kč“).

**Nová sekce (i v dětském ceníku):** u skupiny *Dětské* (nebo *Pánské*) klikněte v *Sekce ceníku* na přidání, zadejte název sekce a přidejte položky. Jakmile má skupina aspoň jednu sekci, web zobrazí ceník místo poznámky („Ceny pro děti do 6 let najdete v pánském ceníku.“). Poznámku u skupiny lze změnit v poli *Poznámka*. Sekce musí mít aspoň jednu položku, jinak build selže.

Skupiny (pánské a dětské) nepřidávejte ani nemažte.

## 3. Texty: O nás, služby, SEO

- **O nás:** *Kontakt, hodiny a O nás → Sekce „O nás“*: nadpis a odstavce (každý zvlášť).
- **Služby:** *Služby*: název, popis, fotka a popis fotky u Pánové a Děti.
- **SEO:** *SEO*: titulek (max. 70 znaků) a popis (max. 160 znaků), které se zobrazí ve vyhledávání.
- Kontakt (adresa, telefon, Facebook, souřadnice) je ve stejném formuláři jako hodiny. Telefon zadejte jako 9 číslic. Doménu a PSČ zatím neměňte, jsou `TODO`.

## 4. Galerie: přidat, přeřadit, skrýt fotku

1. *Galerie → Fotky v galerii → přidat položku*. Klikněte na pole **Fotka**, nahrajte soubor (jpg, png, webp; **max. cca 3 MB**, web si ji při buildu sám zmenší a převede na WebP/AVIF) nebo vyberte už nahraný.
2. Vyplňte **Popis fotky** (povinný, krátce co je na fotce) a **Pořadí** (menší číslo se zobrazí dřív).
3. **Skrýt fotku:** vypněte *Zobrazit na webu*. Fotka zůstane v repozitáři, jen se nezobrazí.
4. **Přeřadit:** změňte číslo v poli *Pořadí*.
5. **Smazat fotku úplně:** nejdřív smažte její položku v galerii, pak soubor v sekci *Fotky*. Soubor, který používá galerie nebo služby, nemažte, build by selhal.

**Souhlas zákazníků:** nenahrávejte fotky, na kterých jsou zákazníci, bez jejich souhlasu. Platí to hlavně pro děti. V případě pochybností fotku skryjte přepínačem *Zobrazit na webu*.

Fotky v hero (úvod) a „O nás“ jsou pevně v kódu a berou se z téže složky (`panske-4.jpg`, `detske-1.jpg`, `panske-5.jpg`, `panske-1.jpg`). Tyto soubory nemažte ani nepřejmenovávejte.

**Fotka salonu zvenku (Kontakt):** *Kontakt, hodiny a O nás → Fotka salonu zvenku*. Nahrajte vlastní fotku budovy (ne snímek ze Street View nebo Mapy.cz, ty nejsou volně použitelné). Zobrazí se vedle mapy. Když pole nevyplníte, ale v galerii (sekce *Fotky*) je soubor `budova.jpg`, použije se ten. Bez fotky se mapa zobrazí přes celou šířku.

## 5. Kdy se změna objeví a co dělat při chybě

1. Po uložení v administraci počkejte **1–2 minuty**.
2. Průběh uvidíte na GitHubu v záložce **Actions** (https://github.com/lukaspilko1-sketch/kadernictvi-nymburk/actions), běh „Deploy na GitHub Pages“. Zelená značka = nasazeno, červený křížek = selhalo.
3. Když build selže, **web na internetu zůstává ve staré verzi** (nic se nerozbije). Otevřete neúspěšný běh → krok *Kontrola dat* a přečtěte českou hlášku, např.:
   `src/data/firma.json › hodiny › po › od: Špatný čas „8:30h“. Zadejte ho jako HH:MM…`
4. Opravte uvedené pole v administraci (nebo přímo v souboru) a uložte, spustí se nový běh.
5. Data můžete zkontrolovat i lokálně: `npm run validate` (build to dělá automaticky před sestavením).

## 6. Vrácení poslední změny

1. Na GitHubu otevřete repozitář → **Commits** (nebo tlačítko *History* u souboru).
2. Najděte commit „Administrace: upraveno …“, který chcete vrátit, a klikněte na něj.
3. Tlačítko **… → Revert** vytvoří nový commit, který změnu vrátí. Potvrďte (Create pull request → Merge, případně přímo do `main`). Web se znovu nasadí za 1–2 minuty.
4. Lokálně: `git revert <hash>` a `git push origin master:main` (větev `main` je ta, která se nasazuje).

## 7. Doména a další editor

- **Vlastní doména:** (1) v *Settings → Pages → Custom domain* zadejte doménu, (2) v DNS nastavte `CNAME` na `lukaspilko1-sketch.github.io`, (3) v `.github/workflows/deploy.yml` nastavte `SITE_URL` na novou doménu a smažte `BASE_PATH`, (4) upravte `Sitemap:` v `public/robots.txt` a doplňte `domena` ve `firma.json`. Soubor `public/CNAME.priklad` ukazuje tvar souboru `public/CNAME` (jen jeden řádek s doménou). Přejmenujte ho na `CNAME` až ve chvíli, kdy doménu máte.
- **Další editor:** *Settings → Collaborators → Add people* v repozitáři na GitHubu, zadat jeho GitHub účet s rolí *Write*. Ten se pak přihlásí do Pages CMS stejně (bod 1). Nic dalšího se předělávat nemusí.
- **Bezpečnost:** do repozitáře nikdy neukládejte hesla, tokeny ani osobní údaje zákazníků. Repozitář je veřejný.

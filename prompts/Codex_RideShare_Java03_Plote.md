# PROMPT PËR CODEX CLI — RIDE SHARE · JAVA 3 (01.10.2026)

## Roli dhe objektivi
Je agjent senior Next.js/TypeScript dhe Git/GitHub. **Ekzekuto realisht** detyrën universitare "Ushtrimet 3 · RideShare — Nga tri ekrane në letër te tri faqe që punojnë", jo vetëm një plan. Përfundo implementimin, dokumentimin, verifikimet, `commit`/`push` dhe **dorëzimin Java 3 në GitHub Issues**, në masën që lejojnë mjetet/autentikimi. Vazhdo punën pa pyetje të panevojshme; mos raporto si të kryer veprime që nuk i ke verifikuar.

### Identifikues të pandryshueshëm
- **Folderi lokal (Windows 10):** `C:\Users\HP\Desktop\rideshare-mobile`
- **Repository personal / URL që dorëzohet:** `https://github.com/erblinnaa/rideshare-mobile`
- **Dega e synuar:** `main` (respekto degën ekzistuese të repository-t, nëse ndryshon).
- **Udhëzimi zyrtar Java 3:** https://arbenl.github.io/lendet/2026-2027/mobile/java-03/ushtrimet.html
- **Modeli zyrtar i raportit:** https://arbenl.github.io/lendet/2026-2027/mobile/java-03/java-03-model.md
- **Udhëzimi i dorëzimit:** https://arbenl.github.io/lendet/2026-2027/mobile/dorezimet.html
- **Formulari i dorëzimit:** https://github.com/arbenl/arbenl-mobile-assignments-2025/issues/new?template=mobile-submission.yml
- **Repository i profesorit (vetëm Issue; ASNJË push):** `arbenl/arbenl-mobile-assignments-2025`

## Faza 1 — Auditimi dhe lidhja e sigurt me GitHub
1. Shko te folderi lokal; ekzekuto `pwd`/`cd`, shiko përmbajtjen, `git status`, `git remote -v`, `git branch -vv`, dhe vendndodhjen e `package.json`, `README.md`, `java-02.md`, `skica.png/jpg`. Kontrollo `git --version`, `node -v`, `npm -v`, `gh --version`, `gh auth status`. Nëse mungon Node/npm/Git/GitHub CLI, provo zgjidhjen minimale zyrtare; mos prish konfigurimet ekzistuese. Nëse autentikimi kërkon ndërhyrje njerëzore, jep vetëm hapin e saktë të identifikimit.
2. **Mos e fshi, formato, riinicializo ose mbishkruaj punën ekzistuese.** Para sinkronizimit ruaj çdo ndryshim lokal të paregjistruar në mënyrë të rikuperueshme. Mos përdor `git reset --hard`, `git clean -fd`, `push --force`, `rebase` destruktiv ose fshirje skedarësh pa nevojë. Mos krijo repository tjetër në GitHub.
3. Syno `origin = https://github.com/erblinnaa/rideshare-mobile.git`. Nëse folderi është Git repo, kontrollo remote dhe `fetch`/sinkronizo pa humbur ndryshimet. Nëse nuk është Git repo ose ka histori të papërputhshme me remote, përdor një strategji të sigurt (p.sh. klono repository-n ekzistues në vend të përkohshëm dhe integro **pa humbje** skedarët lokalë). Mos bashko histori të palidhura verbërisht; dokumento zgjidhjen. Mos ndrysho Git global config; nëse duhet autor i commit-it, kontrollo identitetin e llogarisë së autentikuar dhe përdor konfigurim lokal të saktë.
4. Verifiko që përdoruesi GitHub i autentikuar ka të drejtë `push` në `erblinnaa/rideshare-mobile`, që repo është publik dhe që dega aktive lidhet me remote e duhur. Nëse mungon autorizimi, përfundo punën lokalisht dhe jep hapat e saktë për autentikim/`push`; **mos përdor llogari tjetër**.
5. Ruaj `java-02.md`, skicën dhe çdo kod/dokument ekzistues. Nëse mungojnë, mos sajo se janë bërë; Java 3 duhet të përfundohet pavarësisht tyre. Zgjedh strukturën ekzistuese të projektit; `package.json` lejohet në rrënjë ose `aplikacioni/`. Nëse nuk ekziston Next.js, krijo një aplikacion **Next.js + App Router + TypeScript**, preferimisht brenda `aplikacioni/`, pa prekur README/dokumentet e rrënjës. Mos krijo projekte të dyfishta.

## Faza 2 — Implemento kërkesat e Javës 3
Puno sipas materialit zyrtar, me **të dhëna fiktive dhe pa databazë, autentikim, pagesa apo rezervim real**. Nëse gjen kod më të avancuar nga një javë tjetër, mos e degrado ose fshi; izolo rrjedhën demonstruese të Javës 3 dhe ruaj përputhshmërinë.

Krijo/përshtat këta skedarë relativisht ndaj rrënjës së aplikacionit (nëse projekti nuk përdor `src/`, përshtat shtigjet në përputhje me arkitekturën ekzistuese):

```text
src/lib/udhetimet.ts
src/components/KartaUdhetimi.tsx
src/app/page.tsx
src/app/udhetimi/[id]/page.tsx
src/app/udhetimi/[id]/kerkesa/page.tsx
src/app/udhetimi/[id]/not-found.tsx
src/app/globals.css
```

### Të dhënat e vetme burimore
Përdor tipin `Udhetim` me `id: string`, `nisja`, `destinacioni`, `ora`, `vendtakimi`, `vende: number`. Krijo **pikërisht tre** udhëtime fiktive:

| ID | Nisja | Destinacioni | Ora | Vendtakimi | Vende |
|---|---|---|---|---|---|
| 1 | Prishtinë | AAB | 08:00 | Stacioni i autobusëve | 2 |
| 2 | Fushë Kosovë | AAB | 08:15 | Te stacioni kryesor | 1 |
| 3 | Lipjan | AAB | 07:45 | Qendra e qytetit | 0 |

Eksporto `udhetimet` dhe `gjejUdhetimin(id)`. ID-të duhet të mbeten të qëndrueshme; shmang kopjimin e të dhënave në shumë faqe.

### Funksionaliteti i domosdoshëm
1. **Lista `/`:** titulli "RideShare · Udhëtimet për AAB", saktësisht 3 karta nga `KartaUdhetimi`, secila me nisjen, destinacionin, orën, vendet e lira dhe lidhjen "Shiko detajet"; komponent `.tsx` realisht i ripërdorshëm.
2. **Detajet `/udhetimi/[id]`:** lexon ID-në dinamike nga App Router (përshtat tipizimin e `params` sipas versionit të instaluar të Next.js), shfaq nisjen/destinacionin, orën, vendtakimin, numrin e vendeve dhe "← Kthehu te lista". `/udhetimi/2` duhet të shfaqë **"Te stacioni kryesor"**.
3. **Kërkesa `/udhetimi/[id]/kerkesa`:** për 1 dhe 2, "Kërko vend" çon në faqe me titull **"Simulim: Në pritje"**, shpjegon se kërkesa nuk i është dërguar shoferit dhe ka lidhje kthimi te detajet. **Mos krijo apo ruaj rezervim real.**
4. **Pa vende:** për ID 3, në detaje shfaq një buton **të çaktivizuar** "Nuk ka vende të lira"; nuk lejohet rrjedha e kërkesës së suksesshme as duke hapur URL-në e kërkesës drejtpërdrejt.
5. **ID e pavlefshme:** `/udhetimi/99` duhet të kthejë faqe 404 me tekst **"Udhëtimi nuk u gjet"** dhe lidhje "Kthehu te lista". Trajto edhe kërkesën për ID të panjohur.
6. **Përshtatja mobile:** ekran 375px pa horizontal scroll, tekst i lexueshëm, kontrast adekuat, prekje/lidhje të aksesueshme (rreth 44px për kontrollet kryesore), stil konsistent dhe pamje e pastër. `layout.tsx` dhe importi CSS duhet të ruhen; mos shto varësi UI të panevojshme.
7. Përdor `next/link`, TypeScript strict sa lejon projekti, HTML semantik, `key` të qëndrueshme, kufijtë server/client të saktë; pa warning-e TypeScript/React ose import paths të prishura.

## Faza 3 — Testet dhe raporti i detyrës
1. Instalo vetëm varësitë e nevojshme në folderin ku ndodhet `package.json`; përdor package manager dhe lockfile ekzistues. Nis aplikacionin dhe provo realisht (nëse mjetet lokale e mundësojnë) këto rrjedha:
   - **Prova 1:** `/` shfaq saktësisht tre udhëtime; në viewport 375px nuk ka lëvizje horizontale.
   - **Prova 2:** karta 2 hap `/udhetimi/2`, tregon "Te stacioni kryesor"; për `/udhetimi/3` veprimi është `disabled`; `/udhetimi/99` shfaq 404 të personalizuar dhe kthimi funksionon.
   - **Prova 3:** "Kërko vend" nga ID 2 shfaq "Simulim: Në pritje"; kthimi te detajet dhe lista funksionon; nuk kryhet rezervim real.
2. Ekzekuto **`npm run build`**, `npm run lint`/`npx eslint .` nëse konfigurimi ekziston, `npx tsc --noEmit` dhe testet ekzistuese. Nëse ka Playwright/browser testim të disponueshëm, kontrollo edhe rrjedhat në browser/telefon të simuluar. Rregullo defektet dhe riprovo deri në sukses; mos shpik rezultate.
3. Shkarko modelin origjinal **`java-03-model.md`** nga URL zyrtare dhe ruaje raportin e plotësuar si **`java-03.md` në rrënjën e repository-t pranë `README.md`**, jo brenda `aplikacioni/`. Ndiq **të gjitha rubrikat e modelit**, jo një template të improvizuar. Përshkruaj shkurt tri provat dhe rezultatet **faktike**. Asnjë `[PLOTËSO]`, boshllëk, përmbajtje imagjinare ose `java-03.md.txt`.
4. **Transparenca akademike:** deklaro përdorimin e Codex/AI aty ku e kërkon modeli. Dallo provat automatike/nga agjenti prej **testimit me koleg**. Nëse prova në çift nuk është kryer, shkruaj "Testimi me koleg: nuk është kryer ende" dhe jep udhëzimet konkrete për ta bërë, pa deklaruar gënjeshtër. Skanimi i QR-së bëhet personalisht dhe nuk llogaritet si provë e kodit. Pa të dhëna personale, indeks studenti, email privat, token-e ose `.env` në dokumentet publike.
5. Përditëso `README.md` minimalisht me mënyrën e nisjes (`cd aplikacioni` nëse nevojitet, `npm install`, `npm run dev`), rrugët dhe kufirin e simulimit, duke ruajtur përmbajtjen ekzistuese.

## Faza 4 — Git, commit dhe push te repository personal
1. Kontrollo `.gitignore`: `node_modules/`, `.next/`, `.env*` dhe sekretet të mos shkojnë në Git; nëse ka shembull konfigurimi, publikohen vetëm vlera fiktive. Verifiko `git diff --check`, `git status`, skedarët që do të ngarkohen dhe që `java-03.md` gjendet **në root**.
2. Sinkronizo sigurt ndryshimet e fundit të remote dhe zgjidh konfliktet pa humbje. `git add` vetëm skedarët e përshtatshëm. Bëj commit me mesazhin **`Java 3: kartat dhe faqet RideShare`**; nëse ka tashmë commit identik, mos krijo duplikat. Bëj `git push` në degën e duhur të repository-t personal `erblinnaa/rideshare-mobile`.
3. Verifiko **online**, jo vetëm lokalisht, që remote përmban commit-in, `java-03.md`, `package.json`, `page.tsx`, `KartaUdhetimi.tsx`, rrugët `/udhetimi/[id]`, `/udhetimi/[id]/kerkesa` dhe `not-found.tsx`. Ruaj SHA e commit-it dhe URL-në publike të repository-t. **Asnjë push te repository i profesorit.**

## Faza 5 — DORËZO JAVA 3 NË GITHUB ISSUES
Kjo fazë është pjesë **e detyrueshme** e punës, jo vetëm udhëzim teorik. Vepro në llogarinë GitHub të autorizuar të projektit.

1. Kontrollo në repository-n e profesorit nëse nga **e njëjta llogari** ekziston tashmë një Issue për **Java 3** me `https://github.com/erblinnaa/rideshare-mobile`. Kërko edhe te Issues të mbyllura. **Mos krijo dorëzim të dyfishtë.**
2. Nëse nuk ekziston, hap formularin zyrtar:
   `https://github.com/arbenl/arbenl-mobile-assignments-2025/issues/new?template=mobile-submission.yml`
   - Te fusha **Java** zgjidh **Java 3**.
   - Te **Linku i punës në GitHub** vendos vetëm **`https://github.com/erblinnaa/rideshare-mobile`**.
   - Kliko **Submit new issue / Create**. Përdor automatizim browser-i nëse disponohet; përndryshe `gh`/GitHub API vetëm nëse mund të riprodhosh saktësisht strukturën e formularit pas leximit të `.github/ISSUE_TEMPLATE/mobile-submission.yml` (titujt dhe fushat), pa hamendësuar formatin e kërkuar nga kontrolluesi. Nëse nevojitet login/2FA, kërko vetëm atë veprim nga përdoruesi.
3. Regjistro **URL-në dhe numrin e Issue-së** të krijuar. Kontrollo komentet e Issue-së për raportin automatik, pa krijuar dorëzim tjetër. Synimi është **5/5 kontrolle teknike**:
   - `java-03.md` pranë README, pa `[PLOTËSO]`;
   - projekt Next.js me `package.json` në rrënjë ose `aplikacioni/`;
   - rezultat i dokumentuar për të tria provat;
   - faqja kryesore, detajet dhe kërkesa;
   - të paktën një komponent `.tsx` në `components/`.
4. Nëse raporti tregon ❌, identifiko shkakun real, korrigjo skedarët, kryej `commit` + `push`, pastaj te **i njëjti Issue** posto **vetëm** komentin `rikontrollo`. Verifiko raportin e ri. Mos shpik statusin "5/5" kur nuk është kthyer raporti. Nëse verifikimi automatik vonohet, regjistro URL-në dhe statusin "raporti në pritje".
5. Nëse nuk ke qasje të shkruash Issue për shkak të autorizimit ose kufizimit të mjeteve, **mos pretendo se e dorëzove**. Jep linkun e formularit, vlerat e sakta të të dy fushave dhe përshkruaj qartë hapin e mbetur manual. Përpiqu të përfundosh çdo hap tjetër që është i realizueshëm.

## Raporti final që dua nga ti (Codex)
Përfundo vetëm pasi të kesh bërë përpjekjen reale për të gjitha fazat. Përgjigju në shqip, me këtë strukturë:

1. **Kodi:** çfarë u implementua dhe ku ndodhet `package.json`.
2. **Testet:** tabelë `Prova 1/2/3`, TypeScript, lint, build — `PASS / FAIL / NUK U EKZEKUTUA` me shpjegim faktik.
3. **Git:** statusi, remote, emri i degës, commit SHA, `push` i verifikuar ose bllokuesi konkret.
4. **GitHub:** linku i repository-t dhe provë që skedarët shihen online.
5. **Dorëzimi:** URL e Issue-së Java 3, numri i Issue-së, rezultati real `X/5` ose "në pritje / jo i dorëzuar" me arsyen.
6. **Veprimet manuale të mbetura:** vetëm ato që kërkojnë personin (p.sh. login/2FA, provë me koleg, skanimi i QR-së).

**Kriteri i përfundimit:** aplikacioni funksionon sipas Javës 3, raporti është i plotësuar me prova reale, kodi dhe raporti janë bërë push te repository personal, dorëzimi Java 3 ekziston si Issue te profesori dhe raporti automatik është kontrolluar. Nuk kërkohet publikim në Vercel, databazë Neon apo funksionalitet nga java të mëvonshme.

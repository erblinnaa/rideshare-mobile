# RideShare — Java 3

## 1. Përmbledhje

Java 3 e kthen rrjedhën e RideShare nga skica në tri faqe funksionale
Next.js: listën e udhëtimeve, detajet e një udhëtimi dhe simulimin e një
kërkese në pritje.

Të dhënat janë fiktive dhe ruhen vetëm në aplikacioni/lib/udhetimet.ts.
Nuk përdoren databazë, autentikim, pagesa ose rezervime reale.

## 2. Të dhënat dhe faqet

Burimi ka saktësisht tri udhëtime:

| ID | Nisja | Destinacioni | Ora | Vendtakimi | Vende |
|---|---|---|---|---|---:|
| 1 | Prishtinë | AAB | 08:00 | Stacioni i autobusëve | 2 |
| 2 | Fushë Kosovë | AAB | 08:15 | Te stacioni kryesor | 1 |
| 3 | Lipjan | AAB | 07:45 | Qendra e qytetit | 0 |

Rrugët e implementuara janë:

- / — listë me tri karta të ripërdorshme nga components/KartaUdhetimi.tsx.
- /udhetimi/[id] — detajet, vendtakimi, vendet dhe veprimi i kërkesës.
- /udhetimi/[id]/kerkesa — statusi “Simulim: Në pritje” vetëm për ID 1 dhe 2.
- /udhetimi/[id]/not-found — “Udhëtimi nuk u gjet” me kthim te lista.

Për ID 3 shfaqet butoni i çaktivizuar “Nuk ka vende të lira”. Hapja direkte
e rrugës së kërkesës për ID 3 ose për një ID të panjohur kthen 404.

## 3. Provat

### Prova 1 — Lista dhe përshtatja mobile

Kontrolli i serverit production për / ktheu HTTP 200 dhe titullin
“RideShare · Udhëtimet për AAB”. HTML-ja statike e gjeneruar përmban
saktësisht tri lidhje të dukshme “Shiko detajet”. CSS-ja përdor gjerësi
relative, box-sizing: border-box dhe overflow-x: hidden.

Kontrolli me browser real në viewport 375px nuk është kryer, sepse projekti
nuk ka Playwright ose një browser-test harness të instaluar.

### Prova 2 — Detajet, pa vende dhe 404

- /udhetimi/2 ktheu HTTP 200 dhe shfaq “Te stacioni kryesor”.
- /udhetimi/3 ktheu HTTP 200 dhe HTML-ja statike përmban butonin e çaktivizuar
  “Nuk ka vende të lira”.
- /udhetimi/99 ktheu HTTP 404; payload-i i App Router përmban faqen custom
  “Udhëtimi nuk u gjet” dhe lidhjen “Kthehu te lista”.

Klikimi manual i lidhjeve në browser nuk është kryer në këtë mjedis.

### Prova 3 — Kërkesa në pritje

/udhetimi/2/kerkesa ktheu HTTP 200 dhe shfaq “Simulim: Në pritje”,
si dhe tekstin që kërkesa nuk i është dërguar shoferit dhe nuk ruhet
rezervim real. /udhetimi/3/kerkesa dhe /udhetimi/99/kerkesa kthyen
HTTP 404.

## 4. Verifikimet teknike

- npm.cmd run lint — PASS.
- npx.cmd tsc --noEmit — PASS.
- npm.cmd run build — PASS.
- Serveri production u nis me npm.cmd run start dhe rrugët u kontrolluan me
  kërkesa HTTP lokale.

## 5. Prova me koleg

Testimi me koleg: nuk është kryer ende.

Udhëzimi për provën: një student hap listën dhe luan rolin e udhëtarit, ndërsa
kolegu kontrollon si shofer detajet e udhëtimit. Duhet të provohen rrjedha e
kërkesës për ID 2, rasti pa vende për ID 3 dhe kthimi te lista në një pajisje
mobile. Të shënohet çdo paqartësi pas provës.

## 6. Ndihma nga AI dhe kufijtë

U përdor Codex/AI për implementimin e komponentëve, rrugëve, stilimit dhe
kontrolleve teknike. Kodi dhe rezultatet u kontrolluan lokalisht me lint,
TypeScript, build dhe HTTP. Raporti nuk pretendon testim me koleg ose skanim
QR-je.

Ndryshimet janë lënë vetëm lokalisht sipas kërkesës për këtë detyrë; nuk është
bërë commit ose push.

## 7. Kufiri i simulimit

“Kërko vend” vetëm hap faqen demonstruese “Simulim: Në pritje”. Nuk dërgon
kërkesë te shoferi, nuk krijon rezervim dhe nuk ruan të dhëna.

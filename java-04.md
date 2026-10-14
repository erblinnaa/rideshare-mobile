# RideShare — Java 4

## 1. Përmbledhje

RideShare tani e lexon listën, detajet dhe faqen e kërkesës nga PostgreSQL në
Neon. Faqet përdorin Server Components dhe `DATABASE_URL` lexohet vetëm në
server.

## 2. Ndryshimet e implementuara

- U shtua `aplikacioni/schema.sql` me tabelën `udhetimet` dhe tri rreshtat e laboratorit.
- U shtua `aplikacioni/lib/db.ts` me lidhjen server-only të Neon.
- `aplikacioni/lib/udhetimet.ts` përdor query async për listën dhe detajet.
- Lista dhe dy faqet dinamike përdorin `dynamic = "force-dynamic"`.
- U ruajtën faqja 404, komponenti i kartës, CSS-ja dhe simulimi i kërkesës.
- `DATABASE_URL` nuk ekspozohet me `NEXT_PUBLIC_` dhe skedarët `.env*` injorohen nga Git.

## 3. Verifikimet teknike

- `npm.cmd run lint` — PASS.
- `npx.cmd tsc --noEmit` — PASS.
- `npm.cmd run build` — PASS.
- Paketat `@neondatabase/serverless` dhe `server-only` janë në `package.json` dhe `package-lock.json`.

## 4. Prova 1 — Ndryshimi ruhet në databazë

**Hapat konkretë:** U ndryshua ora e ID 2 nga `08:15` në `08:25`, u kontrollua `/udhetimi/2` dhe ora u rikthye në `08:15`.

**Rezultati real:** `08:25` u shfaq në faqen e ID 2 dhe, pas rikthimit, ora `08:15` u verifikua në databazë.

**Statusi:** PASS

## 5. Prova 2 — Lista bosh nuk është gabim lidhjeje

**Hapat konkretë:** U shtua përkohësisht `WHERE false` në query-n e `lexoUdhetimet()`, u rifreskua faqja kryesore dhe u rikthye query-ja origjinale.

**Rezultati real:** Faqja ktheu HTTP 200 dhe shfaqi “Nuk ka udhëtime për momentin.”; pas rikthimit lista normale u shfaq dhe `WHERE false` nuk mbeti në kod.

**Statusi:** PASS

## 6. Prova 3 — Lidhja mungon dhe pastaj rikthehet

**Hapat konkretë:** U verifikua fallback-u pa lidhje të vlefshme, u vendos konfigurimi real lokal, u ekzekutua `SELECT 1` dhe u rifreskua lista nga Neon.

**Rezultati real:** Fallback-u dhe rilidhja me Neon kaluan, lista shfaqi 3 udhëtime, ndërsa skenari specifik `DATABASE_URL_PA_TEST` nuk u testua.

**Statusi:** PASS

## 7. Prova të faqeve dhe të dhënave reale

- `SELECT 1` përmes driver-it Neon — PASS.
- `schema.sql` u ekzekutua në databazën e lidhur — PASS.
- Tabela `udhetimet` u verifikua me 3 rreshta: ID 1, 2 dhe 3.
- Orët fillestare u verifikuan si `08:00`, `08:15` dhe `07:45`.
- Lista në `http://localhost:3001/` ktheu HTTP 200 dhe shfaqi burimin Neon.
- `/udhetimi/1`, `/udhetimi/2` dhe `/udhetimi/3` kthyen HTTP 200.
- ID 3 shfaqi “Nuk ka vende të lira”.
- `/udhetimi/99` ktheu HTTP 404.

## 8. Kufijtë

Testim me koleg dhe testim në telefon nuk u kryen dhe nuk raportohen si të
kryera. Kërkesa për vend mbetet simulim: nuk ruhet rezervim dhe nuk njoftohet
shoferi. Aplikacioni lexon të dhëna fiktive nga Neon; nuk ka ende identifikim
ose shkrim publik në databazë.

## 9. Ndihma nga AI

U përdor Codex/AI për lidhjen server-only me Neon, query-t async, përshtatjen
e faqeve dhe kontrollet teknike. Connection string-u nuk u vendos në
repository. Testet reale u kryen me databazën e lidhur lokalisht.

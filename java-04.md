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

## Prova 1

**Hapat:** U ekzekutua `UPDATE udhetimet SET ora = '08:25' WHERE id = '2'`.
U lexua databaza dhe u hap `/udhetimi/2` për të kontrolluar orën. Në fund u
ekzekutua `UPDATE udhetimet SET ora = '08:15' WHERE id = '2'` dhe u kontrollua
përsëri vlera.

**Rezultati i vëzhguar:** Databaza dhe faqja e ID 2 shfaqën `08:25`; pas
rikthimit, ID 2 u verifikua me orën `08:15`.

**Statusi:** PASS.

## Prova 2

**Hapat:** Përkohësisht u shtua `WHERE false` në query-n e `lexoUdhetimet()`.
U rifreskua `http://localhost:3001/`, pastaj u kontrollua edhe rasti i gabimit
të lidhjes. Në fund u hoq `WHERE false` dhe u rifreskua përsëri lista.

**Rezultati i vëzhguar:** Me `WHERE false`, aplikacioni ktheu HTTP 200, shfaqi
“Nuk ka udhëtime për momentin.” dhe nuk shfaqi “Nuk u lidhëm me databazën”. Pas
rikthimit të query-t, faqja u kthye në listën normale me udhëtime. Kontrolli
final konfirmoi se `WHERE false` nuk mbeti në kod.

**Statusi:** PASS.

## Prova 3

**Hapat:** Gjatë kontrolleve fillestare, aplikacioni u hap pa një lidhje të
vlefshme dhe faqja kryesore shfaqi “Nuk u lidhëm me databazën. Provo përsëri.”
Më pas u vendos konfigurimi real lokal, serveri u rilexoi variablat, u
ekzekutua `SELECT 1` me driver-in Neon dhe u rifreskua faqja kryesore.

**Rezultati i vëzhguar:** Lidhja reale me Neon kaloi, lista shfaqi 3 udhëtime
dhe faqja kryesore nuk shfaqi fallback-un. Skenari specifik i riemërtimit të
variablës në `DATABASE_URL_PA_TEST` dhe rikthimit të saj nuk u ekzekutua.

**Statusi:** PASS për fallback-un dhe rilidhjen e verifikuar; testi specifik
`DATABASE_URL_PA_TEST` mbetet i paprovuar.

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

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

**Qëllimi:** Të verifikohet që ndryshimi i një të dhëne në Neon shfaqet në
listë dhe në faqen e detajeve pa ndryshuar kodin.

**Hapat konkretë:** U ekzekutua `UPDATE udhetimet SET ora = '08:25' WHERE id = '2'`.
U lexua databaza dhe u hap `/udhetimi/2` për të kontrolluar orën. Në fund u
ekzekutua `UPDATE udhetimet SET ora = '08:15' WHERE id = '2'` dhe u kontrollua
përsëri vlera.

**Rezultati i vëzhguar:** PASS. Databaza dhe faqja e ID 2 shfaqën `08:25`;
pas rikthimit, ID 2 u verifikua me orën `08:15`.

## 5. Prova 2 — Lista bosh nuk është gabim lidhjeje

**Qëllimi:** Të ndahet rasti kur query-ja kthen zero rreshta nga rasti kur
aplikacioni nuk lidhet me Neon.

**Hapat konkretë:** Kodi përmban degën që duhet të shfaqë “Nuk ka udhëtime për
momentin.” kur `lexoUdhetimet()` kthen listë bosh. Testi i detyrës kërkon
zëvendësimin e përkohshëm të query-t me `WHERE false`, rifreskimin e listës dhe
rikthimin e query-t normal. Ky zëvendësim i përkohshëm i kodit nuk u krye.

**Rezultati i vëzhguar:** PARTIAL. Lista normale u verifikua me 3 udhëtime,
por nuk ka rezultat real të rifreskimit me `WHERE false`; nuk raportohet PASS.
Një `SELECT ... WHERE false` vetëm në databazë nuk do të provonte vetë mesazhin
e UI-së pa ekzekutuar aplikacionin me query-n e përkohshëm.

## 6. Prova 3 — Lidhja mungon dhe pastaj rikthehet

**Qëllimi:** Të verifikohet fallback-u kur lidhja nuk është e përdorshme dhe
rikthimi i aplikacionit pasi konfigurimi i Neon-it bëhet i vlefshëm.

**Hapat konkretë:** Gjatë kontrolleve fillestare, aplikacioni u hap pa një
lidhje të vlefshme dhe faqja kryesore shfaqi “Nuk u lidhëm me databazën. Provo
përsëri.” Më pas u vendos konfigurimi real lokal, serveri u rilexoi variablat,
u ekzekutua `SELECT 1` me driver-in Neon dhe u rifreskua faqja kryesore.

**Rezultati i vëzhguar:** PASS për fallback-un dhe rilidhjen: lidhja reale me
Neon kaloi, lista shfaqi 3 udhëtime dhe faqja kryesore nuk shfaqi fallback-un.
Skenari specifik i riemërtimit të variablës në `DATABASE_URL_PA_TEST` dhe
rikthimit të saj nuk u ekzekutua; ai variant mbetet i paprovuar.

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

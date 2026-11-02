# RideShare — Java 7

## 1. Përmbledhje

Java 7 e zhvillon skenarin e RideShare nga simulimi i statusit në një kërkesë reale për vend. Arta hyn me GitHub, zgjedh një udhëtim, dërgon kërkesën dhe e sheh statusin te “Kërkesat e mia”.

Kërkesa ruhet në Neon me statusin fillestar ne_pritje dhe lidhet me përdoruesin e autentikuar. Në këtë version nuk është implementuar veprimi i shoferit për ta pranuar ose refuzuar kërkesën.

## 2. Rasti im

Kodi personal: **P7-770**
GitHub: **erblinnaa**

Rasti zyrtar: **I PAVERIFIKUAR** — faqja zyrtare dhe modeli nuk ishin të
arritshme gjatë përgatitjes së këtij versioni. Nuk po shpik numrin ose titullin
e Rastit 1–5. Ky seksion duhet plotësuar me numrin dhe titullin zyrtar pasi të
merret teksti i lëndës.

## 3. Skenari i Artës

1. Arta hap faqen e kërkesës për udhëtimin ID 2.
2. Aplikacioni kërkon hyrjen me GitHub.
3. Pas hyrjes, Arta kthehet te konfirmimi i udhëtimit.
4. Udhëtimi është Fushë Kosovë → AAB, me orën 08:25 dhe 1 vend të lirë, sipas vëzhgimit në aplikacion.
5. Arta klikon “Konfirmo kërkesën”.
6. Aplikacioni shfaq “Në pritje”.
7. Arta e sheh kërkesën te “Kërkesat e mia”.

Ora 08:25 është vëzhgim i testimit. Disa skedarë SQL përmbajnë 08:15 si vlerë fillestare ose dokumentuese. Nuk u ndryshuan Neon-i ose SQL-të për ta barazuar këtë vlerë.

## 4. Kodi personal P7

**Statusi: I PAVERIFIKUAR.** Kodi P7 nuk mund të merret nga gjeneratori zyrtar nga ky mjedis. Nuk vendoset vlerë e supozuar. Studenti duhet ta marrë nga gjeneratori zyrtar për llogarinë erblinnaa dhe ta plotësojë këtu me përshkrimin përkatës.

## 5. Parashikimi

Ky nuk pretendohet si tekst historik i shkruar para implementimit. Është formulim retrospektiv i dokumentuar tani; nuk ka evidencë që parashikimi fillestar është shkruar pa AI.

Parashikimi: përdoruesi pa sesion duhet të hyjë me GitHub dhe të kthehet te udhëtimi i zgjedhur. Pas konfirmimit, kërkesa duhet të ruhet në Neon me status ne_pritje, të lidhet me identitetin nga sesioni dhe të shfaqet te “Kërkesat e mia”. Kërkesa aktive e dytë duhet të ndalohet dhe udhëtimi me zero vende duhet të shfaqë “Nuk ka vende të lira”.

## 6. Dy probleme

### 1. Kërkesa ishte vetëm simulim

Faqja shfaqte “Në pritje”, por nuk ruante kërkesë reale në Neon.

#### Korrigjimi (arsyeja)

U krijuan tabela kerkesat, Server Action-i për krijimin dhe funksionet për
leximin nga Neon, sepse statusi i mëparshëm ishte vetëm simulim. Statusi
fillestar i ruajtur është ne_pritje.

Skedari: aplikacioni/lib/kerkesat.ts

### 2. Statusi shfaqej pa autentikim

Faqja mund të hapej pa hyrje dhe të shfaqte status statik pa pronar të verifikuar.

#### Korrigjimi (arsyeja)

Faqja kërkon GitHub dhe përdor callback-un për kthimin te udhëtimi, sepse
statusi duhej të lidhej me një përdorues real. udhetar_id merret vetëm nga
sesioni server-side dhe jo nga formulari.

## 7. Implementimi

U implementuan tabela kerkesat, krijimi dhe leximi real i kërkesave, faqja e konfirmimit dhe faqja “Kërkesat e mia”. Indeksi unik lejon vetëm një kërkesë aktive për përdorues dhe udhëtim. Numri vende nuk zvogëlohet dhe kërkesa nuk pranohet automatikisht. Veprimi i shoferit për pranuar/refuzuar nuk është implementuar.

## 8. Skedarët e ndryshuar dhe arsyeja

Skedarët e ndryshuar në commit-in Java 7 janë:

- aplikacioni/app/kerkesa/page.tsx — faqja dhe leximi i “Kërkesat e mia”;
- aplikacioni/app/page.tsx — etiketimi Java 7 dhe përshkrimi i burimit;
- aplikacioni/app/udhetimi/[id]/kerkesa/actions.ts — Server Action për ruajtjen;
- aplikacioni/app/udhetimi/[id]/kerkesa/page.tsx — autentikimi, konfirmimi, statusi dhe pa-vendet;
- aplikacioni/components/AuthVeprimet.tsx — lidhja e navigimit me “Kërkesat”;
- aplikacioni/lib/kerkesat.ts — krijimi, kontrolli dhe leximi i kërkesave;
- aplikacioni/schema-java07.sql — tabela, lidhjet referenciale dhe indeksi unik;
- java-07.md — dokumentimi i implementimit, provave dhe kufizimeve.

## 9. Provat reale

### Prova 1 — Hyrja me GitHub dhe kthimi te udhëtimi

**Statusi: PASS**

#### Hapat

1. U hap faqja e kërkesës për ID 2 pa sesion.
2. U klikua “Kyçu me GitHub”.
3. Pas hyrjes u kontrollua faqja e kthimit.

#### Pritshmëria

Përdoruesi pa sesion duhet të hyjë me GitHub dhe të kthehet te udhëtimi i zgjedhur.

#### Vëzhgimi

Hyrja funksionoi dhe u hap faqja e konfirmimit për ID 2. Udhëtimi u vëzhgua Fushë Kosovë → AAB, 08:25, me 1 vend të lirë.

### Prova 2 — Krijimi dhe ruajtja e kërkesës

**Statusi: PASS**

#### Hapat

1. U klikua “Konfirmo kërkesën” për ID 2.
2. U kontrolluan mesazhi dhe statusi në aplikacion.
3. U kontrollua në Neon kërkesa për ID 2.
4. U hap “Kërkesat e mia”.

#### Pritshmëria

Kërkesa duhet të ruhet në Neon me statusin ne_pritje dhe të shfaqet te “Kërkesat e mia”.

#### Vëzhgimi

Kërkesa u ruajt në Neon me status ne_pritje; u verifikua një kërkesë për ID 2. Faqja shfaqi kërkesën dhe statusin.

### Prova 3 — Kërkesa e dyfishtë dhe udhëtimi pa vende

**Statusi: PASS**

#### Hapat

1. U hap përsëri kërkesa ekzistuese për ID 2.
2. U kontrollua nëse shfaqej konfirmim i dytë.
3. U hap drejtpërdrejt /udhetimi/3/kerkesa.
4. U kontrollua mesazhi për vendet.

#### Pritshmëria

Kërkesa aktive e dytë duhet të ndalohet. Udhëtimi me zero vende duhet të refuzohet.

#### Vëzhgimi

Kërkesa ekzistuese u njoh dhe nuk u ofrua konfirmim i dytë. Për ID 3, Lipjan → AAB, me 0 vende, u shfaq “Nuk ka vende të lira”.

## 10. Ndihma nga AI

ChatGPT dhe Codex u përdorën për analizën e kërkesave, analizën dhe implementimin e rrjedhës Next.js, Server Action-it dhe Neon-it, rishikimin e kodit dhe historisë Git, analizën e rezultateve të testimit dhe përgatitjen e këtij raporti. Përdorimi i AI nuk fshihet. Rezultatet e hyrjes dhe Neon-it janë rezultate të testimit të raportuar në aplikacion; AI nuk pretendohet si dëshmitar i tyre dhe demonstrimi me koleg nuk pretendohet i kryer.

## 11. Ndryshimi i ri

Ndryshimi i ri ishte kalimi nga statusi statik/simulimi në hyrje me GitHub dhe
ruajtje reale në Neon. Formulari dërgon identifikuesin e udhëtimit, ndërsa
identiteti merret nga sesioni server-side.

## 12. Kufizimet e testimit

Testimi me koleg nuk është konfirmuar dhe nuk paraqitet si i kryer. Nuk është provuar miratimi/refuzimi nga shoferi, testimi në telefon real, production ose mjedis tjetër nga Chrome dhe Neon-i i përdorur.

## 13. Commit-et Para dhe Pas

Commit-et janë në të njëjtin repository, në historinë e main, dhe Para është paraardhës i Pas:

- **Para:** [4f75773b669bc7e21d7fd718e5c4e96e2e36c82f](https://github.com/erblinnaa/rideshare-mobile/commit/4f75773b669bc7e21d7fd718e5c4e96e2e36c82f)
- **Pas:** [c5d2bcc54aef1dad6c91bd49627a784117958943](https://github.com/erblinnaa/rideshare-mobile/commit/c5d2bcc54aef1dad6c91bd49627a784117958943)

Verifikimi lokal tregoi se c5d2bcc është commit-i aktual i main dhe 4f75773 është në historinë para tij.

## 14. Ora 08:25 dhe SQL-i

Ora 08:25 është vëzhguar gjatë testimit në aplikacion. Disa SQL të versionuara, përfshirë seed-in ose komentin e Java 5, përmbajnë 08:15 si vlerë fillestare/dokumentuese. Nuk u ndryshuan të dhënat e Neon-it ose skedarët SQL vetëm për ta barazuar orën.

## 15. Përfundim

Java 7 kalon nga simulimi te kërkesa reale: hyrje me GitHub, ruajtje në Neon me ne_pritje, shfaqje te “Kërkesat e mia”, ndalim i kërkesave aktive të dyfishta dhe refuzim i udhëtimeve pa vende.

Raporti dokumenton tri prova me hapa, pritshmëri dhe vëzhgime, dy probleme me korrigjimet, skedarët e ndryshuar, përdorimin e AI-së, kufizimet dhe lidhjet Para/Pas. Rasti zyrtar 1–5 dhe kodi P7 mbeten të paverifikuara për shkak të mungesës së aksesit te burimi dhe gjeneratori zyrtar.

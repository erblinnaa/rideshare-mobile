# RideShare — Java 7

## Rasti im

GitHub: erblinnaa
Kodi: P7-770
Skenari i zgjedhur (numri dhe titulli, nga Rastet 1–5): Rasti 2 · Pa vende
ID i udhëtimit në projektin tim: 3
Të dhënat fiktive të rastit: I PAVERIFIKUAR — nuk po shtoj të dhëna të tjera të gjeneratorit P7 pa verifikim të drejtpërdrejtë.

## Parashikimi

Ky nuk pretendohet si tekst historik i shkruar para implementimit. Është formulim retrospektiv i dokumentuar tani; nuk ka evidencë që parashikimi fillestar është shkruar pa AI.

Parashikimi: përdoruesi pa sesion duhet të hyjë me GitHub dhe të kthehet te udhëtimi i zgjedhur. Pas konfirmimit, kërkesa duhet të ruhet në Neon me status ne_pritje, të lidhet me identitetin nga sesioni dhe të shfaqet te “Kërkesat e mia”. Kërkesa aktive e dytë duhet të ndalohet dhe udhëtimi me zero vende duhet të shfaqë “Nuk ka vende të lira”.

## Dy probleme

1. Kërkesa ishte vetëm simulim: faqja shfaqte “Në pritje”, por nuk ruante kërkesë reale në Neon.
2. Statusi shfaqej pa autentikim: faqja mund të hapej pa hyrje dhe të shfaqte status statik pa pronar të verifikuar.

## Korrigjimi

Skedari: aplikacioni/lib/kerkesat.ts

U krijuan tabelat dhe funksionet për krijimin, kontrollin dhe leximin real të kërkesave nga Neon, sepse statusi i mëparshëm ishte vetëm simulim. Statusi fillestar i ruajtur është ne_pritje.

Për problemin e autentikimit, faqja kërkon GitHub dhe përdor callback-un për kthimin te udhëtimi. `udhetar_id` merret vetëm nga sesioni server-side dhe jo nga formulari, në mënyrë që statusi të lidhet me përdoruesin real.

## Versionet

Para: https://github.com/erblinnaa/rideshare-mobile/commit/4f75773b669bc7e21d7fd718e5c4e96e2e36c82f
Pas: https://github.com/erblinnaa/rideshare-mobile/commit/c5d2bcc54aef1dad6c91bd49627a784117958943

## Provat që bëra

### Prova 1

Hapat: U hap faqja e kërkesës për ID 2 pa sesion; u klikua “Kyçu me GitHub”; pas hyrjes u kontrollua faqja e kthimit.

Pritshmëria: Përdoruesi pa sesion duhet të hyjë me GitHub dhe të kthehet te udhëtimi i zgjedhur.

Vëzhgimi: Hyrja funksionoi dhe u hap faqja e konfirmimit për ID 2. Udhëtimi u vëzhgua Fushë Kosovë → AAB, 08:25, me 1 vend të lirë.

### Prova 2

Hapat: U klikua “Konfirmo kërkesën” për ID 2; u kontrolluan mesazhi dhe statusi në aplikacion; u kontrollua në Neon kërkesa për ID 2; u hap “Kërkesat e mia”.

Pritshmëria: Kërkesa duhet të ruhet në Neon me statusin ne_pritje dhe të shfaqet te “Kërkesat e mia”.

Vëzhgimi: Kërkesa u ruajt në Neon me status ne_pritje; u verifikua një kërkesë për ID 2. Faqja shfaqi kërkesën dhe statusin.

### Prova 3

Hapat: U hap përsëri kërkesa ekzistuese për ID 2; u kontrollua nëse shfaqej konfirmim i dytë; u hap drejtpërdrejt `/udhetimi/3/kerkesa`; u kontrollua mesazhi për vendet.

Pritshmëria: Kërkesa aktive e dytë duhet të ndalohet. Udhëtimi me zero vende duhet të refuzohet.

Vëzhgimi: Kërkesa ekzistuese u njoh dhe nuk u ofrua konfirmim i dytë. Për ID 3, Lipjan → AAB, me 0 vende, u shfaq “Nuk ka vende të lira”.

## Ndryshimi i ri

Ndryshimi i ri ishte kalimi nga statusi statik/simulimi në hyrje me GitHub dhe ruajtje reale në Neon. Formulari dërgon identifikuesin e udhëtimit, ndërsa identiteti merret nga sesioni server-side.

## Ndihma nga AI

ChatGPT dhe Codex u përdorën për analizën e kërkesave, analizën dhe implementimin e rrjedhës Next.js, Server Action-it dhe Neon-it, rishikimin e kodit dhe historisë Git, analizën e rezultateve të testimit dhe përgatitjen e këtij raporti. Përdorimi i AI nuk fshihet. Rezultatet e hyrjes dhe Neon-it janë rezultate të testimit të raportuar në aplikacion; AI nuk pretendohet si dëshmitar i tyre dhe demonstrimi me koleg nuk pretendohet i kryer.

## Skenari i Artës

1. Arta hap faqen e kërkesës për udhëtimin ID 2.
2. Aplikacioni kërkon hyrjen me GitHub.
3. Pas hyrjes, Arta kthehet te konfirmimi i udhëtimit.
4. Udhëtimi është Fushë Kosovë → AAB, me orën 08:25 dhe 1 vend të lirë, sipas vëzhgimit në aplikacion.
5. Arta klikon “Konfirmo kërkesën”.
6. Aplikacioni shfaq “Në pritje”.
7. Arta e sheh kërkesën te “Kërkesat e mia”.

## Implementimi

U implementuan tabelat `kerkesat`, krijimi dhe leximi real i kërkesave, faqja e konfirmimit dhe faqja “Kërkesat e mia”. Indeksi unik lejon vetëm një kërkesë aktive për përdorues dhe udhëtim. Numri i vendeve nuk zvogëlohet dhe kërkesa nuk pranohet automatikisht. Veprimi i shoferit për pranuar/refuzuar nuk është implementuar.

## Skedarët e ndryshuar dhe arsyeja

Skedarët e ndryshuar në commit-in Java 7 janë:

- `aplikacioni/app/kerkesa/page.tsx` — faqja dhe leximi i “Kërkesat e mia”;
- `aplikacioni/app/page.tsx` — etiketimi Java 7 dhe përshkrimi i burimit;
- `aplikacioni/app/udhetimi/[id]/kerkesa/actions.ts` — Server Action për ruajtjen;
- `aplikacioni/app/udhetimi/[id]/kerkesa/page.tsx` — autentikimi, konfirmimi, statusi dhe pa-vendet;
- `aplikacioni/components/AuthVeprimet.tsx` — lidhja e navigimit me “Kërkesat”;
- `aplikacioni/lib/kerkesat.ts` — krijimi, kontrolli dhe leximi i kërkesave;
- `aplikacioni/schema-java07.sql` — tabela, lidhjet referenciale dhe indeksi unik;
- `java-07.md` — dokumentimi i implementimit, provave dhe kufizimeve.

## Kufizimet e testimit

Testimi me koleg nuk është konfirmuar dhe nuk paraqitet si i kryer. Nuk është provuar miratimi/refuzimi nga shoferi, testimi në telefon real, production ose mjedis tjetër nga Chrome dhe Neon-i i përdorur.

## Ora 08:25 dhe SQL-i

Ora 08:25 është vëzhguar gjatë testimit në aplikacion. Disa skedarë SQL të versionuar, përfshirë seed-in ose komentin e Java 5, përmbajnë 08:15 si vlerë fillestare/dokumentuese. Nuk u ndryshuan të dhënat e Neon-it ose skedarët SQL vetëm për ta barazuar orën.

## Përfundim

Java 7 kalon nga simulimi te kërkesa reale: hyrje me GitHub, ruajtje në Neon me ne_pritje, shfaqje te “Kërkesat e mia”, ndalim i kërkesave aktive të dyfishta dhe refuzim i udhëtimeve pa vende.

Raporti dokumenton tri prova me hapa, pritshmëri dhe vëzhgime, dy probleme me korrigjimet, skedarët e ndryshuar, përdorimin e AI-së, kufizimet dhe lidhjet Para/Pas. Demonstrimi me koleg dhe miratimi/refuzimi nga shoferi nuk janë konfirmuar si të kryera.

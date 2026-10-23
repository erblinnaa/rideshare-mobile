# RideShare — Java 7

## 1. Përmbledhje

Java 7 e përfundon skenarin e MVP-së së RideShare: Arta hyn me GitHub,
zgjedh një udhëtim, kërkon një vend dhe e sheh statusin e kërkesës së saj.

Kërkesa nuk është më simulim. Ajo ruhet në Neon me statusin fillestar
`ne_pritje` dhe lidhet me përdoruesin e autentikuar.

## 2. Skenari i Artës

Rrjedha e demonstruar ishte:

1. Arta hap faqen e kërkesës për udhëtimin me ID 2.
2. Aplikacioni e kërkon hyrjen me GitHub.
3. Pas hyrjes, Arta kthehet te konfirmimi i udhëtimit të zgjedhur.
4. Udhëtimi është Fushë Kosovë → AAB, në orën `08:25`, me 1 vend të lirë.
5. Arta klikon “Konfirmo kërkesën”.
6. Aplikacioni shfaq statusin “Në pritje”.
7. Arta e sheh kërkesën edhe te faqja “Kërkesat e mia”.

## 3. Implementimi i MVP-së

U shtua tabela `kerkesat` me:

- `id` si identifikues i kërkesës;
- `udhetim_id` që referon `udhetimet.id`;
- `udhetar_id` që referon `profilet.github_id`;
- `status` me vlerat `ne_pritje`, `pranuar`, `refuzuar` ose `anuluar`;
- `created_at` dhe `updated_at`.

Kërkesa krijohet nga një Server Action. Identiteti nuk merret nga formulari,
por vetëm nga sesioni server-side i GitHub OAuth. `session.user.id` përputhet
me `profilet.github_id`.

U shtuan:

- `aplikacioni/lib/kerkesat.ts` për krijimin dhe leximin e kërkesave;
- `app/udhetimi/[id]/kerkesa/actions.ts` për ruajtjen e kërkesës;
- faqja reale `/udhetimi/[id]/kerkesa`;
- faqja `/kerkesa` për “Kërkesat e mia”.

Indeksi unik lejon vetëm një kërkesë aktive (`ne_pritje` ose `pranuar`) për
të njëjtin përdorues dhe të njëjtin udhëtim.

Numri `vende` nuk zvogëlohet kur kërkesa krijohet. Kërkesa mbetet në pritje dhe
nuk pranohet automatikisht.

## 4. Dy problemet e identifikuara dhe korrigjimet

### Problemi 1 — Kërkesa ishte vetëm simulim

Më parë faqja shfaqte statusin “Në pritje”, por nuk ruante asgjë në Neon.

**Korrigjimi:** u krijua tabela `kerkesat`, Server Action-i dhe leximi real nga
Neon. Statusi i ruajtur është `ne_pritje`.

### Problemi 2 — Statusi shfaqej edhe pa autentikim

Më parë faqja e kërkesës mund të hapej pa hyrje dhe shfaqte një status statik,
pa e lidhur kërkesën me ndonjë përdorues.

**Korrigjimi:** faqja kërkon hyrje me GitHub, e kthen përdoruesin te udhëtimi i
zgjedhur dhe përdor vetëm identitetin nga sesioni server-side.

## 5. Siguria dhe lejet

- Përdoruesi pa sesion nuk mund të krijojë kërkesë.
- `udhetar_id` merret nga sesioni dhe nuk besohet nga klienti.
- Serveri kontrollon që udhëtimi ekziston.
- Serveri kontrollon që ka vende të lira.
- Indeksi unik mbron nga kërkesat aktive të dyfishta.
- Statusi fillestar është gjithmonë `ne_pritje`.
- Service Worker-i i Java 6 nuk ruan kërkesa POST ose të dhëna private.
- Kërkesa nuk e ndryshon numrin e vendeve.

Në këtë version është implementuar krijimi dhe leximi i kërkesës. Nuk është
implementuar ende një veprim i shoferit për ta ndryshuar statusin në `pranuar`
ose `refuzuar`; prandaj asnjë status nuk pretendohet si i ndryshuar gjatë
provave.

## 6. Provat reale

### Prova 1 — Hyrja dhe zgjedhja e udhëtimit

**Statusi: PASS**

**Çfarë pritej:** Përdoruesi pa sesion duhet të kërkohet të hyjë me GitHub dhe,
pas hyrjes, duhet të kthehet te udhëtimi që kishte zgjedhur.

**Çfarë ndodhi realisht:** Faqja e kërkesës fillimisht kërkoi hyrje. Pas klikimit
“Kyçu me GitHub”, u hap faqja e konfirmimit për udhëtimin me ID 2.

Udhëtimi ishte Fushë Kosovë → AAB, në orën `08:25`, me 1 vend të lirë.

### Prova 2 — Krijimi dhe ruajtja e kërkesës

**Statusi: PASS**

**Çfarë pritej:** Pas konfirmimit, kërkesa duhet të ruhet në Neon me statusin
`ne_pritje` dhe përdoruesi duhet ta shohë në “Kërkesat e mia”.

**Çfarë ndodhi realisht:** Pas klikimit “Konfirmo kërkesën”, u shfaq statusi
“Në pritje” dhe mesazhi i ruajtjes me sukses. Në Neon u verifikua rreshti i
kërkesës për udhëtimin me ID 2 me status `ne_pritje`. Faqja “Kërkesat e mia”
shfaqi kërkesën, statusin dhe kohën e krijimit.

### Prova 3 — Kërkesa e dyfishtë dhe udhëtimi pa vende

**Statusi: PASS**

**Çfarë pritej:** Një përdorues me kërkesë aktive nuk duhet të mund të krijojë
një kërkesë të dytë për të njëjtin udhëtim. Një udhëtim me zero vende duhet të
refuzohet.

**Çfarë ndodhi realisht:** Pas hapjes së statusit, kërkesa ekzistuese u njoh dhe
nuk u shfaq mundësia për konfirmim të ri. Në Neon u verifikua se për përdoruesin
dhe udhëtimin me ID 2 ekzistonte vetëm një kërkesë.

Udhëtimi me ID 3, Lipjan → AAB, kishte 0 vende dhe shfaqi “Nuk ka vende të
lira”. I njëjti rezultat u shfaq edhe pas hyrjes direkte në
`/udhetimi/3/kerkesa`.

## 7. Teste që nuk janë kryer

Nuk janë pretenduar si të kryera:

- testimi në telefon real;
- testimi me një koleg tjetër;
- ndryshimi i statusit nga një shofer në `pranuar` ose `refuzuar`;
- testimi në production ose në një mjedis tjetër nga Chrome dhe Neon-i i
  përdorur për këtë projekt.

## 8. Shpjegimi 2-minutësh

“RideShare është një aplikacion për gjetjen dhe kërkimin e vendeve në udhëtime.
Në këtë skenar, Arta hap një udhëtim nga Fushë Kosova për në AAB. Nëse nuk është
e kyçur, aplikacioni e dërgon te hyrja me GitHub dhe pas hyrjes e kthen te
udhëtimi që kishte zgjedhur.

Udhëtimi me ID 2 kishte orën 08:25 dhe një vend të lirë. Arta klikon
‘Konfirmo kërkesën’ dhe kërkesa ruhet në Neon me statusin ‘Në pritje’. Kërkesa
lidhet me udhëtimin përmes `udhetim_id` dhe me Artën përmes `udhetar_id`, i cili
merret nga `session.user.id` i GitHub OAuth dhe përputhet me
`profilet.github_id`.

Arta mund ta shohë kërkesën te faqja ‘Kërkesat e mia’, bashkë me statusin dhe
orën e krijimit. Nëse provon ta kërkojë përsëri të njëjtin udhëtim, indeksi unik
dhe kontrolli server-side e ndalojnë kërkesën e dyfishtë. Për udhëtimin me ID 3,
ku nuk ka vende, aplikacioni shfaq ‘Nuk ka vende të lira’.

Kërkesa nuk e zvogëlon automatikisht numrin e vendeve dhe nuk pranohet
automatikisht. Në këtë version statusi fillestar është vetëm ‘Në pritje’. Roli
`shofer` ekziston nga Java 5 dhe kontrollon ndryshimin e orës së udhëtimit, por
ndryshimi i statusit të kërkesës nga shoferi nuk është pjesë e këtij MVP-je.”

## 9. Përfundim

Skenari i Artës u realizua nga hyrja me GitHub deri te ruajtja dhe shfaqja e
statusit të kërkesës. U korrigjuan simulimi i vjetër dhe mungesa e autentikimit
në faqen e kërkesës. Funksionalitetet e Java 4, Java 5 dhe Java 6 u ruajtën.

Nuk është bërë `git commit` ose `git push`.

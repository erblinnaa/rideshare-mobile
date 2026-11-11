# RideShare — Java 8

## Çfarë ndërtova

Shtova komponentin klient `aplikacioni/components/Vendtakim.tsx` për zgjedhjen lokale të vendtakimit. Komponenti mban veçmas tekstin që po shkruhet dhe vendtakimin e konfirmuar, kontrollon tekstin me `trim()` dhe përdor Geolocation API vetëm pas klikimit. Vendndodhja shfaq vetëm suksesin dhe saktësinë në metra; koordinatat nuk shfaqen ose ruhen.

Komponenti përdoret te faqja reale e detajeve të udhëtimit dhe te faqja e pavarur `/java-08-test`, e cila përdor të dhëna lokale pa login ose Neon.

## Provat që bëra

### Prova 1: Leja nuk kërkohet sapo hapet faqja.

Hapat: Hapa faqen e testimit pa klikuar butonin e vendndodhjes. Më pas, në testimin manual, klikova për të lejuar vendndodhjen.

Pritshmëria: Faqja duhet të hapet pa kërkuar leje menjëherë; pas klikimit duhet të përfundojë me sukses dhe të shfaqë saktësinë.

Vëzhgimi: Faqja u hap pa kërkesë të menjëhershme për leje. Pas pranimit u shfaq mesazhi i suksesit me saktësi `160 m`. Nuk u dokumentuan koordinata ose adresë reale.

### Prova 2: Refuzimi i lejes nuk e bllokon përdoruesin.

Hapat: Refuzova lejen e vendndodhjes, pastaj përdora fushën manuale për të futur dhe konfirmuar një vendtakim. Provova gjithashtu fushën bosh me vetëm hapësira.

Pritshmëria: Pas refuzimit duhet të shfaqet “Leja u refuzua. Shkruaj vendtakimin vetë.”, pritja duhet të përfundojë dhe vendtakimi manual duhet të funksionojë. Teksti bosh nuk duhet të konfirmohet.

Vëzhgimi: Refuzimi u trajtua dhe u shfaq mesazhi për përdorimin manual. Vendtakimi manual u konfirmua me sukses. Teksti bosh u refuzua; vendtakimi i konfirmuar nuk u zëvendësua. Timeout-i është implementuar, por prova e tij në browser nuk është përfunduar.

### Prova 3: Dëshmitë në GitHub nuk tregojnë adresën time reale.

Hapat: Kontrollova skedarët e rinj dhe kërkova koordinata ose adresa reale të futura në kod, raport dhe konfigurim. Kontrollova gjithashtu që faqja e testimit përdor komponentin real me të dhëna lokale.

Pritshmëria: Repository duhet të përmbajë vetëm sjelljen e geolocation dhe saktësinë e kthyer nga pajisja/testi; koordinatat reale nuk duhet të ruhen ose publikohen.

Vëzhgimi: Në ndryshimet e Java 8 nuk u shtuan koordinata reale, adresa reale ose sekrete. U përdor vetëm saktësia `160 m` si rezultat i testimit; koordinatat nuk u regjistruan. Publikimi i këtij versioni në GitHub nuk është kryer ende.

## Ku gjendet puna

- `aplikacioni/components/Vendtakim.tsx` — komponenti i përbashkët klient për vendtakimin;
- `aplikacioni/app/udhetimi/[id]/page.tsx` — integrimi te detajet reale;
- `aplikacioni/app/java-08-test/page.tsx` — faqe prove pa Neon dhe login;
- `mobile-week08.json` — konfigurimi i faqes `/java-08-test`;
- `java-08.md` — ky raport.

Faqja nuk është publikuar në Vercel.

## Çfarë mbetet për përmirësim

Mbetet të përfundohet prova e timeout-it në browser dhe të verifikohet prova automatike e plotë e Java 8 pas publikimit. Testimi në telefon real nuk deklarohet këtu, sepse nuk është verifikuar në këtë raport.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)

Codex u përdor për analizën e arkitekturës Next.js, leximin e udhëzimeve dhe test-runner-it, implementimin e komponentit, integrimin, CSS-in dhe raportin. Verifikova strukturën e repository-t, `data-testid`, HTTP 200 të faqes së testimit, lint-in, TypeScript check dhe build-in. Testet manuale të dokumentuara më sipër janë rezultatet e kryera në aplikacion; nuk pretendoj prova të tjera interaktive ose testim në telefon.

## Prova me një hyrje të re

Hyrja që provova: Ndryshimi i tekstit pa e konfirmuar.

- Hyrja që provova: vendtakim i ri i shkruar në fushë, pa klikuar për konfirmim;
- Parashikimi im para klikimit: vendtakimi i konfirmuar duhet të mbetet i pandryshuar;
- Çfarë pashë realisht: teksti i ri mbeti vetëm draft dhe vendtakimi i konfirmuar nuk ndryshoi;
- Skedari dhe funksioni që e shpjegojnë: `aplikacioni/components/Vendtakim.tsx`, `konfirmoVendtakimin`;
- Çfarë kuptova ose korrigjova: drafti dhe vendtakimi i konfirmuar janë dy gjendje të ndara dhe vlera pastrohet me `trim()`.

Këtë pjesë duhet ta shpjegoj dhe ta demonstroj në klasë.

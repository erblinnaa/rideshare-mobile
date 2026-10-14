import Link from "next/link";

import KartaUdhetimi from "@/components/KartaUdhetimi";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[];

  try {
    udhetimet = await lexoUdhetimet();
  } catch {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">RIDE SHARE · DATABASE</p>
          <h1>RideShare</h1>
          <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
          <Link className="button button--primary" href="/">
            Provo përsëri
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">RIDE SHARE · JAVA 4</p>
        <h1>RideShare · Udhëtimet për AAB</h1>
        <p className="intro">
          Zgjidh një udhëtim dhe shiko detajet para se të kërkosh një vend.
        </p>
      </header>

      <section aria-labelledby="lista-udhetimeve">
        <h2 id="lista-udhetimeve" className="section-title">
          Udhëtime të disponueshme
        </h2>
        {udhetimet.length === 0 ? (
          <p>Nuk ka udhëtime për momentin.</p>
        ) : (
          <div className="trip-list">
            {udhetimet.map((udhetim) => (
              <KartaUdhetimi key={udhetim.id} udhetim={udhetim} />
            ))}
          </div>
        )}
      </section>

      <p className="simulation-note">
        Burimi: Neon · të dhëna fiktive për ushtrime. Nuk kryhet rezervim real.
      </p>
    </main>
  );
}

import KartaUdhetimi from "@/components/KartaUdhetimi";
import { udhetimet } from "@/lib/udhetimet";

export default function Home() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">RIDE SHARE · JAVA 3</p>
        <h1>RideShare · Udhëtimet për AAB</h1>
        <p className="intro">
          Zgjidh një udhëtim dhe shiko detajet para se të kërkosh një vend.
        </p>
      </header>

      <section aria-labelledby="lista-udhetimeve">
        <h2 id="lista-udhetimeve" className="section-title">
          Udhëtime të disponueshme
        </h2>
        <div className="trip-list">
          {udhetimet.map((udhetim) => (
            <KartaUdhetimi key={udhetim.id} udhetim={udhetim} />
          ))}
        </div>
      </section>

      <p className="simulation-note">
        Ky është një simulim me të dhëna fiktive. Nuk kryhet rezervim real.
      </p>
    </main>
  );
}

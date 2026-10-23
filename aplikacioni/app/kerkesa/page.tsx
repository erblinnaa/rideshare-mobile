import Link from "next/link";
import { getServerSession } from "next-auth/next";

import Hyrja from "@/components/Hyrja";
import { authOptions } from "@/lib/auth";
import {
  lexoKerkesatEMia,
  type StatusiKerkeses,
} from "@/lib/kerkesat";

export const dynamic = "force-dynamic";

const statuset: Record<StatusiKerkeses, string> = {
  ne_pritje: "Në pritje",
  pranuar: "Pranuar",
  refuzuar: "Refuzuar",
  anuluar: "Anuluar",
};

const klasatStatusit: Record<StatusiKerkeses, string> = {
  ne_pritje: "status-badge--pending",
  pranuar: "status-badge--accepted",
  refuzuar: "status-badge--rejected",
  anuluar: "status-badge--rejected",
};

export default async function KerkesatEMiaPage() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch {
    session = null;
  }

  if (!session?.user) {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">RIDE SHARE · KËRKESAT</p>
          <h1>Kyçu për të parë kërkesat</h1>
          <p>Kërkesat shfaqen vetëm për profilin tënd të GitHub-it.</p>
          <Hyrja callbackUrl="/kerkesa" />
        </div>
      </main>
    );
  }

  let kerkesat;
  try {
    kerkesat = await lexoKerkesatEMia();
  } catch {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">RIDE SHARE · DATABASE</p>
          <h1>Kërkesat nuk u lexuan</h1>
          <p role="alert">Kontrollo Neon dhe provo përsëri.</p>
          <Link className="button button--primary" href="/kerkesa">
            Provo përsëri
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">RIDE SHARE · KËRKESAT E MIA</p>
        <h1>Kërkesat e mia</h1>
        <p className="intro">
          Këtu shfaqen vetëm kërkesat e lidhura me llogarinë tënde.
        </p>
      </header>

      {kerkesat.length === 0 ? (
        <div className="empty-state">
          <h2>Nuk ke ende kërkesa.</h2>
          <p>Zgjidh një udhëtim nga lista dhe kërko një vend.</p>
          <Link className="button button--primary" href="/">
            Shiko udhëtimet
          </Link>
        </div>
      ) : (
        <div className="panel-grid">
          {kerkesat.map((kerkesa) => (
            <article className="panel-card" key={kerkesa.id}>
              <p className="eyebrow">UDHËTIMI {kerkesa.udhetim_id}</p>
              <h2>
                {kerkesa.nisja} <span aria-hidden="true">→</span>{" "}
                {kerkesa.destinacioni}
              </h2>
              <p className="panel-card__meta">
                Ora: <strong>{kerkesa.ora}</strong> · Vendtakimi:{" "}
                <strong>{kerkesa.vendtakimi}</strong>
              </p>
              <p className="panel-card__meta">
                Statusi:{" "}
                <span
                  className={`status-badge ${klasatStatusit[kerkesa.status]}`}
                >
                  {statuset[kerkesa.status]}
                </span>
              </p>
              <p className="panel-card__meta">
                Krijuar më: {new Date(kerkesa.created_at).toLocaleString("sq-AL")}
              </p>
              <Link
                className="button button--secondary"
                href={`/udhetimi/${kerkesa.udhetim_id}/kerkesa`}
              >
                Shiko statusin
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

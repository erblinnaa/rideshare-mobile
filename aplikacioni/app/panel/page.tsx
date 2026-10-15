
import Link from "next/link";
import { getServerSession } from "next-auth/next";

import AuthVeprimet from "@/components/AuthVeprimet";
import { authOptions } from "@/lib/auth";
import { profiliIm } from "@/lib/lejet";
import { type Profil } from "@/lib/profilet";
import {
  lexoUdhetimetEShoferit,
  type UdhetimIShoferit,
} from "@/lib/udhetimet";

import { ruajOren } from "./actions";

export const dynamic = "force-dynamic";

type PanelPageProps = {
  searchParams: Promise<{ m?: string }>;
};

const mesazhet: Record<string, string> = {
  hyr: "Hyr në llogari para se të ndryshosh udhëtimin.",
  ndaluar: "Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.",
  fushe:
    "Shkruaj një orë të vlefshme, p.sh. 08:25. ID duhet të jetë 1, 2 ose 3.",
  ruajtur: "Ora u ruajt me sukses. Kontrollo listën dhe detajet.",
  databaza:
    "Nuk u lidhëm me databazën. Kontrollo Neon dhe provo përsëri.",
};

export default async function PanelPage({
  searchParams,
}: PanelPageProps) {
  let session;

  try {
    session = await getServerSession(authOptions);
  } catch {
    session = null;
  }

  if (!session?.user) {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">RIDE SHARE · PANELI</p>
          <h1>Kyçu për të vazhduar</h1>
          <p>
            Paneli përdor sesionin e GitHub-it dhe rolin nga Neon.
          </p>
          <AuthVeprimet user={null} />
        </div>
      </main>
    );
  }

  let profil: Profil | null;
  let udhetimet: UdhetimIShoferit[] = [];
  const { m } = await searchParams;

  try {
    profil = await profiliIm();

    if (!profil) {
      throw new Error("Profili nuk u gjet.");
    }

    if (profil.roli === "shofer") {
      udhetimet = await lexoUdhetimetEShoferit(
        profil.github_id,
      );
    }
  } catch {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">RIDE SHARE · DATABASE</p>
          <h1>Schema Java 5 nuk është gati</h1>
          <p>
            Ekzekuto schema-java05.sql në Neon SQL Editor
            dhe provo përsëri.
          </p>
          <Link className="button button--primary" href="/panel">
            Provo përsëri
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">RIDE SHARE · PANELI</p>
        <h1>Profili dhe udhëtimet</h1>
        <p className="intro">
          Profili dhe lejet lexohen nga Neon; forma nuk e
          përcakton rolin.
        </p>
      </header>

      {m && mesazhet[m] ? (
        <p role="status">{mesazhet[m]}</p>
      ) : null}

      <div className="panel-grid">
        <section className="panel-card" aria-labelledby="profili">
          <h2 id="profili">Profili në Neon</h2>

          <p className="panel-card__meta">
            Emri: <strong>{profil.emri}</strong>
          </p>

          <p className="panel-card__meta">
            GitHub ID: <code>{profil.github_id}</code>
          </p>

          <p className="panel-card__meta">
            Roli: <strong>{profil.roli}</strong>
          </p>
        </section>

        {profil.roli === "shofer" ? (
          <section
            className="panel-card"
            aria-labelledby="udhetimet"
          >
            <h2 id="udhetimet">Udhëtimet e mia</h2>

            {udhetimet.length === 0 ? (
              <p className="panel-empty">
                Nuk ka udhëtime të caktuara për këtë GitHub ID.
              </p>
            ) : (
              <div className="panel-grid">
                {udhetimet.map((udhetim) => (
                  <article
                    className="panel-card"
                    key={udhetim.id}
                  >
                    <h3>
                      ID {udhetim.id}: {udhetim.nisja} →{" "}
                      {udhetim.destinacioni}
                    </h3>

                    <p className="panel-card__meta">
                      Ora aktuale:{" "}
                      <strong>{udhetim.ora}</strong>
                    </p>

                    <form action={ruajOren}>
                      <input
                        type="hidden"
                        name="udhetimId"
                        value={udhetim.id}
                      />

                      <label htmlFor={`ora-${udhetim.id}`}>
                        Ora e re
                      </label>

                      <input
                        id={`ora-${udhetim.id}`}
                        name="ora"
                        type="time"
                        defaultValue={udhetim.ora}
                        required
                      />

                      <button
                        className="button button--primary"
                        type="submit"
                      >
                        Ruaj orën
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section
            className="panel-card"
            aria-labelledby="udhetar"
          >
            <h2 id="udhetar">Roli udhetar</h2>

            <p className="panel-empty">
              Profili i ri fillon si udhetar. Vetëm një profil
              me rolin shofer mund të ndryshojë orën e një
              udhëtimi.
            </p>
          </section>
        )}
      </div>

      <p className="simulation-note">
        <Link href="/">Kthehu te lista e udhëtimeve</Link>
      </p>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { gjejUdhetimin, type Udhetim } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

type KerkesaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KerkesaPage({ params }: KerkesaPageProps) {
  const { id } = await params;
  let udhetim: Udhetim | undefined;

  try {
    udhetim = await gjejUdhetimin(id);
  } catch {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">RIDE SHARE · DATABASE</p>
          <h1>RideShare</h1>
          <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
          <Link className="button button--primary" href="/">
            Kthehu te lista
          </Link>
        </div>
      </main>
    );
  }

  if (!udhetim) notFound();

  return (
    <main className="page-shell page-shell--narrow">
      {udhetim.vende > 0 ? (
        <div className="status-card">
          <span className="status-badge">Në pritje</span>
          <p className="eyebrow">KËRKESA PËR UDHËTIMIN</p>
          <h1>Simulim: Në pritje</h1>
          <p>
            Kërkesa për udhëtimin nga <strong>{udhetim.nisja}</strong> në{" "}
            <strong>{udhetim.destinacioni}</strong> është pjesë e simulimit të
            Java 4.
          </p>
          <p className="simulation-note">
            Kërkesa nuk ruhet si rezervim real. Ndryshimi i orës bëhet nga
            shoferi në panelin e Java 5.
          </p>
          <div className="action-row">
            <Link
              className="button button--primary"
              href={`/udhetimi/${udhetim.id}`}
            >
              Kthehu te detajet
            </Link>
            <Link className="text-link" href="/">
              Kthehu te lista
            </Link>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <h1>Nuk ka vende të lira.</h1>
          <Link className="button button--primary" href={`/udhetimi/${id}`}>
            Kthehu te detajet
          </Link>
        </div>
      )}
    </main>
  );
}

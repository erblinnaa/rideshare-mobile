import Link from "next/link";
import { notFound } from "next/navigation";

import { gjejUdhetimin, type Udhetim } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

type DetajetUdhetimitProps = {
  params: Promise<{ id: string }>;
};

export default async function DetajetUdhetimit({
  params,
}: DetajetUdhetimitProps) {
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

  const kaVende = udhetim.vende > 0;

  return (
    <main className="page-shell page-shell--narrow">
      <Link className="back-link" href="/">
        ← Kthehu te lista
      </Link>

      <div className="detail-card">
        <p className="eyebrow">DETAJET E UDHËTIMIT</p>
        <h1>
          {udhetim.nisja} <span aria-hidden="true">→</span>{" "}
          {udhetim.destinacioni}
        </h1>
        <p className="detail-time">Nisja në {udhetim.ora}</p>

        <dl className="detail-facts">
          <div>
            <dt>Vendtakimi</dt>
            <dd>{udhetim.vendtakimi}</dd>
          </div>
          <div>
            <dt>Vende të lira</dt>
            <dd>{udhetim.vende}</dd>
          </div>
        </dl>

        {kaVende ? (
          <Link
            className="button button--primary"
            href={`/udhetimi/${udhetim.id}/kerkesa`}
          >
            Kërko vend
          </Link>
        ) : (
          <button className="button button--disabled" type="button" disabled>
            Nuk ka vende të lira
          </button>
        )}
      </div>
    </main>
  );
}

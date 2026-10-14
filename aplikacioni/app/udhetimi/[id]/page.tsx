import Link from "next/link";
import { notFound } from "next/navigation";

import { gjejUdhetimin, udhetimet } from "@/lib/udhetimet";

export function generateStaticParams() {
  return udhetimet.map((udhetim) => ({ id: udhetim.id }));
}

type DetajetUdhetimitProps = {
  params: Promise<{ id: string }>;
};

export default async function DetajetUdhetimit({
  params,
}: DetajetUdhetimitProps) {
  const { id } = await params;
  const udhetim = gjejUdhetimin(id);

  if (!udhetim) {
    notFound();
  }

  const kaVende = udhetim.vende > 0;

  return (
    <main className="page-shell page-shell--narrow">
      <Link className="back-link" href="/">
        ← Kthehu te lista
      </Link>

      <div className="detail-card">
        <p className="eyebrow">DETAJET E UDHËTIMIT</p>
        <h1>
          {udhetim.nisja} <span aria-hidden="true">→</span> {udhetim.destinacioni}
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
            href={"/udhetimi/" + udhetim.id + "/kerkesa"}
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

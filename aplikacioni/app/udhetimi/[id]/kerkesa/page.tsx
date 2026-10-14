import Link from "next/link";
import { notFound } from "next/navigation";

import { gjejUdhetimin, udhetimet } from "@/lib/udhetimet";

export function generateStaticParams() {
  return udhetimet
    .filter((udhetim) => udhetim.vende > 0)
    .map((udhetim) => ({ id: udhetim.id }));
}

type KerkesaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function KerkesaPage({ params }: KerkesaPageProps) {
  const { id } = await params;
  const udhetim = gjejUdhetimin(id);

  if (!udhetim || udhetim.vende === 0) {
    notFound();
  }

  return (
    <main className="page-shell page-shell--narrow">
      <div className="status-card">
        <span className="status-badge">Në pritje</span>
        <p className="eyebrow">KËRKESA PËR UDHËTIMIN</p>
        <h1>Simulim: Në pritje</h1>
        <p>
          Kërkesa për udhëtimin nga <strong>{udhetim.nisja}</strong> në{" "}
          <strong>{udhetim.destinacioni}</strong> është vetëm pjesë e këtij
          simulimi.
        </p>
        <p className="simulation-note">
          Kërkesa nuk i është dërguar shoferit dhe nuk u ruajt rezervim real.
        </p>
        <div className="action-row">
          <Link
            className="button button--primary"
            href={"/udhetimi/" + udhetim.id}
          >
            Kthehu te detajet
          </Link>
          <Link className="text-link" href="/">
            Kthehu te lista
          </Link>
        </div>
      </div>
    </main>
  );
}

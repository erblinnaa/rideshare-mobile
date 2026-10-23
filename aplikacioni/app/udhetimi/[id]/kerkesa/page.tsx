import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";

import Hyrja from "@/components/Hyrja";
import { authOptions } from "@/lib/auth";
import {
  gjejKerkesenPerUdhetar,
  type Kerkese,
  type StatusiKerkeses,
} from "@/lib/kerkesat";
import { gjejUdhetimin, type Udhetim } from "@/lib/udhetimet";

import { dergoKerkesen } from "./actions";

export const dynamic = "force-dynamic";

type KerkesaPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ m?: string }>;
};

const mesazhet: Record<string, string> = {
  krijuar: "Kërkesa u ruajt me sukses dhe është në pritje.",
  ekziston: "Ke tashmë një kërkesë aktive për këtë udhëtim.",
  pa_vende: "Ky udhëtim nuk ka vende të lira.",
  udhetim_mungon: "Udhëtimi nuk u gjet.",
  fushe: "Udhëtimi i zgjedhur nuk është valid.",
  databaza: "Kërkesa nuk u ruajt. Provo përsëri.",
};

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

function statusiKerkeses(kerkesa: Kerkese) {
  return (
    <span className={`status-badge ${klasatStatusit[kerkesa.status]}`}>
      {statuset[kerkesa.status]}
    </span>
  );
}

export default async function KerkesaPage({
  params,
  searchParams,
}: KerkesaPageProps) {
  const { id } = await params;
  const { m } = await searchParams;
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
          <Link className="button button--primary" href={`/udhetimi/${id}`}>
            Kthehu te detajet
          </Link>
        </div>
      </main>
    );
  }

  if (!udhetim) notFound();

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
          <p className="eyebrow">KËRKESË REALE PËR VEND</p>
          <h1>Kyçu për të kërkuar vend</h1>
          <p>
            Hyr me GitHub që kërkesa të lidhet me profilin tënd dhe të mund ta
            shohësh statusin edhe pas rifreskimit.
          </p>
          <Hyrja callbackUrl={`/udhetimi/${encodeURIComponent(id)}/kerkesa`} />
          <p className="simulation-note">
            <Link href={`/udhetimi/${id}`}>Kthehu te detajet</Link>
          </p>
        </div>
      </main>
    );
  }

  let kerkesa: Kerkese | null = null;
  let gabimDatabaze = false;

  try {
    kerkesa = await gjejKerkesenPerUdhetar(id);
  } catch {
    gabimDatabaze = true;
  }

  if (gabimDatabaze) {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <p className="eyebrow">RIDE SHARE · DATABASE</p>
          <h1>Kërkesa nuk u lexua</h1>
          <p role="alert">Kontrollo Neon dhe provo përsëri.</p>
          <Link className="button button--primary" href={`/udhetimi/${id}/kerkesa`}>
            Provo përsëri
          </Link>
        </div>
      </main>
    );
  }

  if (kerkesa) {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="status-card">
          <p className="eyebrow">KËRKESA PËR UDHËTIMIN</p>
          {statusiKerkeses(kerkesa)}
          <h1>{statuset[kerkesa.status]}</h1>
          <p>
            Kërkesa jote për udhëtimin nga <strong>{udhetim.nisja}</strong> në{" "}
            <strong>{udhetim.destinacioni}</strong> është ruajtur në Neon.
          </p>
          {m && mesazhet[m] ? <p role="status">{mesazhet[m]}</p> : null}
          <p className="simulation-note">
            Vendet nuk u zvogëluan. Kërkesa nuk u pranua automatikisht.
          </p>
          <div className="action-row">
            <Link className="button button--primary" href="/kerkesa">
              Kërkesat e mia
            </Link>
            <Link className="text-link" href={`/udhetimi/${id}`}>
              Kthehu te detajet
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (udhetim.vende <= 0) {
    return (
      <main className="page-shell page-shell--narrow">
        <div className="empty-state">
          <h1>Nuk ka vende të lira.</h1>
          <Link className="button button--primary" href={`/udhetimi/${id}`}>
            Kthehu te detajet
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell page-shell--narrow">
      <div className="status-card">
        <p className="eyebrow">KËRKESË REALE PËR VEND</p>
        <h1>
          {udhetim.nisja} <span aria-hidden="true">→</span>{" "}
          {udhetim.destinacioni}
        </h1>
        <p>
          Po kërkon vend për nisjen në <strong>{udhetim.ora}</strong>, te{" "}
          <strong>{udhetim.vendtakimi}</strong>.
        </p>
        {m && mesazhet[m] ? <p role="status">{mesazhet[m]}</p> : null}
        <form action={dergoKerkesen}>
          <input type="hidden" name="udhetimId" value={udhetim.id} />
          <button className="button button--primary" type="submit">
            Konfirmo kërkesën
          </button>
        </form>
        <p className="simulation-note">
          Kërkesa ruhet si <strong>Në pritje</strong>. Vendet nuk zvogëlohen dhe
          shoferi nuk e pranon automatikisht.
        </p>
        <div className="action-row">
          <Link className="text-link" href={`/udhetimi/${id}`}>
            Kthehu te detajet
          </Link>
          <Link className="text-link" href="/kerkesa">
            Kërkesat e mia
          </Link>
        </div>
      </div>
    </main>
  );
}

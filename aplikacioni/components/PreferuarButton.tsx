"use client";

import Link from "next/link";
import { useState } from "react";

import { ruajUdhetiminTePreferuarat } from "@/app/actions/favoritet";

type PreferuarButtonProps = {
  udhetimId: string;
  initiallyRuajtur: boolean;
  iAutentikuar: boolean;
  gabimFillestar?: boolean;
};

function mesazhiPerRezultatin(
  rezultati: Awaited<ReturnType<typeof ruajUdhetiminTePreferuarat>>,
) {
  if (rezultati === "hyr") {
    return "Duhet të kyçesh para se ta ruash udhëtimin.";
  }

  if (rezultati === "udhetim_mungon") {
    return "Ky udhëtim nuk ekziston më. Rifresko faqen dhe provo përsëri.";
  }

  if (rezultati === "fushe") {
    return "Nuk u gjet udhëtimi për t'u ruajtur.";
  }

  return "Ruajtja nuk u krye. Kontrollo lidhjen dhe provo përsëri.";
}

export default function PreferuarButton({
  udhetimId,
  initiallyRuajtur,
  iAutentikuar,
  gabimFillestar = false,
}: PreferuarButtonProps) {
  const [ruajtur, setRuajtur] = useState(initiallyRuajtur);
  const [poRuhet, setPoRuhet] = useState(false);
  const [gabimi, setGabimi] = useState(
    gabimFillestar
      ? "Gjendja e të preferuarave nuk u lexua. Provo përsëri."
      : "",
  );
  async function ruaj() {
    if (poRuhet || ruajtur || !iAutentikuar) return;

    const gjendjaMePare = ruajtur;
    setRuajtur(true);
    setPoRuhet(true);
    setGabimi("");

    try {
      const rezultati = await ruajUdhetiminTePreferuarat(
        udhetimId,
      );

      if (rezultati !== "ruajtur" && rezultati !== "ekziston") {
        setRuajtur(gjendjaMePare);
        setGabimi(mesazhiPerRezultatin(rezultati));
      }
    } catch {
      setRuajtur(gjendjaMePare);
      setGabimi("Ruajtja nuk u krye. Provo përsëri.");
    } finally {
      setPoRuhet(false);
    }
  }

  const gjendja = poRuhet ? "saving" : ruajtur ? "saved" : "idle";
  const etiketa = poRuhet
    ? "Po ruajmë…"
    : ruajtur
      ? "U ruajt te të preferuarat"
      : "Ruaj udhëtimin te të preferuarat";

  return (
    <section className="favorite-control" aria-labelledby="favorite-title">
      <div>
        <p className="favorite-control__eyebrow">TË PREFERUARAT</p>
        <h2 id="favorite-title">Ruaje këtë udhëtim</h2>
      </div>

      <button
        className="button button--secondary favorite-control__button"
        data-state={gjendja}
        data-testid="save-favorite"
        type="button"
        onClick={() => void ruaj()}
        disabled={!iAutentikuar || poRuhet || ruajtur}
        aria-pressed={ruajtur}
        aria-busy={poRuhet}
        aria-describedby="favorite-status"
      >
        {etiketa}
      </button>

      <p
        className="favorite-control__status"
        id="favorite-status"
        role={gabimi ? "alert" : "status"}
        aria-live="polite"
      >
        {gabimi ||
          (iAutentikuar
            ? ruajtur
              ? "Ky udhëtim është ruajtur në llogarinë tënde."
              : "Ruajtja lidhet me llogarinë tënde GitHub."
            : "Kyçu për ta ruajtur udhëtimin në llogarinë tënde.")}
      </p>

      {!iAutentikuar ? (
        <Link className="text-link" href="/panel">
          Kyçu për të vazhduar
        </Link>
      ) : null}

      {gabimi ? (
        <button
          className="button button--small button--secondary favorite-control__retry"
          type="button"
          onClick={() => void ruaj()}
          disabled={poRuhet}
        >
          Provo përsëri
        </button>
      ) : null}

    </section>
  );
}

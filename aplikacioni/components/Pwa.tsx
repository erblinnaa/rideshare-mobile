"use client";

import { useEffect } from "react";

const PUBLIC_CACHE = "rideshare-public-v1";
const LIST_URL = "/api/udhetimet";

type UdhetimPublik = {
  id: string;
  nisja: string;
  destinacioni: string;
  ora: string;
  vendtakimi: string;
  vende: number;
};

function eshteUdhetimPublik(value: unknown): value is UdhetimPublik {
  if (!value || typeof value !== "object") return false;

  const udhetim = value as Partial<UdhetimPublik>;

  return (
    typeof udhetim.id === "string" &&
    typeof udhetim.nisja === "string" &&
    typeof udhetim.destinacioni === "string" &&
    typeof udhetim.ora === "string" &&
    typeof udhetim.vendtakimi === "string" &&
    typeof udhetim.vende === "number"
  );
}

async function ruajListenPublike() {
  const response = await fetch(LIST_URL, {
    cache: "no-store",
    credentials: "omit",
  });

  if (!response.ok) return;

  const payload: unknown = await response.json();
  if (!Array.isArray(payload) || !payload.every(eshteUdhetimPublik)) {
    return;
  }

  const lista: UdhetimPublik[] = payload.map(
    ({ id, nisja, destinacioni, ora, vendtakimi, vende }) => ({
      id,
      nisja,
      destinacioni,
      ora,
      vendtakimi,
      vende,
    }),
  );

  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "X-RideShare-Saved-At": new Date().toISOString(),
    "X-RideShare-Source": "network",
  });

  const cache = await caches.open(PUBLIC_CACHE);
  await cache.put(
    LIST_URL,
    new Response(JSON.stringify(lista), {
      status: 200,
      headers,
    }),
  );
}

export default function Pwa() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("caches" in window)) {
      return;
    }

    const nisPwa = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // PWA-ja mbetet opsionale; aplikacioni kryesor vazhdon të funksionojë.
      }

      try {
        await ruajListenPublike();
      } catch {
        // Lista ruhet vetëm kur endpoint-i publik është i arritshëm.
      }
    };

    void nisPwa();
  }, []);

  return null;
}

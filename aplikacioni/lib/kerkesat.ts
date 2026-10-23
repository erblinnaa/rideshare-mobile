import "server-only";

import { getSql } from "./db";
import { profiliIm } from "./lejet";

export type StatusiKerkeses =
  | "ne_pritje"
  | "pranuar"
  | "refuzuar"
  | "anuluar";

export type Kerkese = {
  id: string;
  udhetim_id: string;
  udhetar_id: string;
  status: StatusiKerkeses;
  created_at: string;
  updated_at: string;
};

export type KerkeseMeUdhetim = Kerkese & {
  nisja: string;
  destinacioni: string;
  ora: string;
  vendtakimi: string;
};

export type RezultatiKerkeses =
  | "krijuar"
  | "ekziston"
  | "hyr"
  | "fushe"
  | "udhetim_mungon"
  | "pa_vende";

function eshteShkeljeUnike(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }

  return error.code === "23505";
}

export async function krijoKerkese(
  udhetimId: string,
): Promise<RezultatiKerkeses> {
  const profil = await profiliIm();
  if (!profil) return "hyr";

  const id = udhetimId.trim();
  if (!id) return "fushe";

  const sql = getSql();
  const udhetimet = await sql`
    SELECT id, vende
    FROM udhetimet
    WHERE id = ${id}
  `;

  if (udhetimet.length === 0) return "udhetim_mungon";
  if (Number(udhetimet[0].vende) <= 0) return "pa_vende";

  const ekzistuese = await sql`
    SELECT id::text AS id, udhetim_id, udhetar_id, status,
           created_at::text AS created_at,
           updated_at::text AS updated_at
    FROM kerkesat
    WHERE udhetim_id = ${id}
      AND udhetar_id = ${profil.github_id}
      AND status IN ('ne_pritje', 'pranuar')
    ORDER BY created_at DESC
    LIMIT 1
  `;

  if (ekzistuese.length > 0) return "ekziston";

  try {
    await sql`
      INSERT INTO kerkesat (udhetim_id, udhetar_id, status)
      VALUES (${id}, ${profil.github_id}, 'ne_pritje')
    `;
  } catch (error) {
    if (!eshteShkeljeUnike(error)) throw error;
    return "ekziston";
  }

  return "krijuar";
}

export async function gjejKerkesenPerUdhetar(
  udhetimId: string,
): Promise<Kerkese | null> {
  const profil = await profiliIm();
  if (!profil) return null;

  const id = udhetimId.trim();
  if (!id) return null;

  const sql = getSql();
  const rows = await sql`
    SELECT id::text AS id, udhetim_id, udhetar_id, status,
           created_at::text AS created_at,
           updated_at::text AS updated_at
    FROM kerkesat
    WHERE udhetim_id = ${id}
      AND udhetar_id = ${profil.github_id}
      AND status IN ('ne_pritje', 'pranuar')
    ORDER BY created_at DESC
    LIMIT 1
  `;

  return (rows[0] as Kerkese | undefined) ?? null;
}

export async function lexoKerkesatEMia(): Promise<KerkeseMeUdhetim[]> {
  const profil = await profiliIm();
  if (!profil) return [];

  const sql = getSql();
  const rows = await sql`
    SELECT
      k.id::text AS id,
      k.udhetim_id,
      k.udhetar_id,
      k.status,
      k.created_at::text AS created_at,
      k.updated_at::text AS updated_at,
      u.nisja,
      u.destinacioni,
      u.ora,
      u.vendtakimi
    FROM kerkesat AS k
    INNER JOIN udhetimet AS u ON u.id = k.udhetim_id
    WHERE k.udhetar_id = ${profil.github_id}
    ORDER BY k.created_at DESC
  `;

  return rows as KerkeseMeUdhetim[];
}

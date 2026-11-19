import "server-only";

import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth";
import { getSql } from "./db";

export type RezultatiPreferuar =
  | "ruajtur"
  | "ekziston"
  | "hyr"
  | "fushe"
  | "udhetim_mungon"
  | "databaza";

export async function eshteUdhetimiPreferuar(
  udhetimId: string,
  githubId: string,
): Promise<boolean> {
  const id = udhetimId.trim();
  if (!id || !githubId) return false;

  const sql = getSql();
  const rows = await sql`
    SELECT 1
    FROM udhetimet_favoritet
    WHERE github_id = ${githubId}
      AND udhetim_id = ${id}
    LIMIT 1
  `;

  return rows.length > 0;
}

export async function ruajUdhetiminPreferuar(
  udhetimId: string,
): Promise<RezultatiPreferuar> {
  const session = await getServerSession(authOptions);
  const githubId = session?.user?.id;

  if (!githubId) return "hyr";

  const id = udhetimId.trim();
  if (!id) return "fushe";

  try {
    const sql = getSql();
    const udhetimet = await sql`
      SELECT id
      FROM udhetimet
      WHERE id = ${id}
      LIMIT 1
    `;

    if (udhetimet.length === 0) return "udhetim_mungon";

    const rows = await sql`
      INSERT INTO udhetimet_favoritet (github_id, udhetim_id)
      VALUES (${githubId}, ${id})
      ON CONFLICT (github_id, udhetim_id) DO NOTHING
      RETURNING udhetim_id
    `;

    return rows.length > 0 ? "ruajtur" : "ekziston";
  } catch {
    return "databaza";
  }
}

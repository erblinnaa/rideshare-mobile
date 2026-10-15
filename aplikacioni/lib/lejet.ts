import "server-only";

import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth";
import { getSql } from "./db";
import { gjejProfilin, type Profil } from "./profilet";

function eshteIdEValid(id: string) {
  return /^[123]$/.test(id);
}

function eshteOreEValide(ora: string) {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(ora);
}

async function sesioniVerifikuar() {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? session : null;
}

export async function profiliIm(): Promise<Profil | null> {
  const session = await sesioniVerifikuar();
  if (!session) return null;
  const profil = await gjejProfilin(session.user.id);

  if (profil) return profil;

  const sql = getSql();
  const rows = await sql`
    INSERT INTO profilet (github_id, emri, email, image, roli)
    VALUES (
      ${session.user.id},
      ${session.user.name ?? "Përdorues GitHub"},
      ${session.user.email ?? null},
      ${session.user.image ?? null},
      'udhetar'
    )
    ON CONFLICT (github_id) DO NOTHING
    RETURNING github_id, emri, roli, email, image
  `;

  if (rows[0]) return rows[0] as Profil;

  const profilPasInsertimit = await gjejProfilin(session.user.id);
  if (!profilPasInsertimit) {
    throw new Error("Profili nuk u krijua në Neon.");
  }

  return profilPasInsertimit;
}

export async function ndryshoOren(id: string, ora: string) {
  const profil = await profiliIm();
  if (!profil) return "hyr" as const;
  if (profil.roli !== "shofer") return "ndaluar" as const;

  if (!eshteIdEValid(id)) {
    return "fushe" as const;
  }

  if (!eshteOreEValide(ora)) {
    return "fushe" as const;
  }

  const sql = getSql();
  const rows = await sql`
    UPDATE udhetimet AS u
    SET ora = ${ora}
    FROM profilet AS p
    WHERE u.id = ${id}
      AND u.shofer_id = p.github_id
      AND p.github_id = ${profil.github_id}
      AND p.roli = 'shofer'
    RETURNING u.id, u.ora
  `;

  if (rows.length === 0) {
    return "ndaluar" as const;
  }

  return "ruajtur" as const;
}

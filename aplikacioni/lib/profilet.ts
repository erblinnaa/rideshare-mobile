import "server-only";

import { getSql } from "./db";

export type Roli = "udhetar" | "shofer";

export type Profil = {
  github_id: string;
  emri: string;
  roli: Roli;
  email: string | null;
  image: string | null;
};

export type ProfilInput = {
  github_id: string;
  emri: string;
  email: string | null;
  image: string | null;
};

export async function ruajProfilin(input: ProfilInput): Promise<Profil> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO profilet (github_id, emri, email, image)
    VALUES (${input.github_id}, ${input.emri}, ${input.email}, ${input.image})
    ON CONFLICT (github_id) DO UPDATE SET
      emri = EXCLUDED.emri,
      email = EXCLUDED.email,
      image = EXCLUDED.image,
      updated_at = NOW()
    RETURNING github_id, emri, roli, email, image
  `;

  return rows[0] as Profil;
}

export async function gjejProfilin(githubId: string): Promise<Profil | undefined> {
  const sql = getSql();
  const rows = await sql`
    SELECT github_id, emri, roli, email, image
    FROM profilet
    WHERE github_id = ${githubId}
  `;

  return rows[0] as Profil | undefined;
}

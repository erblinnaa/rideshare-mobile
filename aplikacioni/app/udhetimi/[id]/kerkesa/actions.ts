"use server";

import { redirect } from "next/navigation";

import { krijoKerkese, type RezultatiKerkeses } from "@/lib/kerkesat";

export async function dergoKerkesen(formData: FormData) {
  const id = String(formData.get("udhetimId") ?? "").trim();
  let rezultat: RezultatiKerkeses | "databaza";

  try {
    rezultat = await krijoKerkese(id);
  } catch {
    rezultat = "databaza";
  }

  redirect(
    `/udhetimi/${encodeURIComponent(id)}/kerkesa?m=${rezultat}`,
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { ndryshoOren } from "@/lib/lejet";

export async function ruajOren(formData: FormData) {
  const id = String(formData.get("udhetimId") ?? formData.get("id") ?? "");
  const ora = String(formData.get("ora") ?? "");

  let mesazh: Awaited<ReturnType<typeof ndryshoOren>> | "databaza";
  try {
    mesazh = await ndryshoOren(id, ora);
  } catch {
    mesazh = "databaza";
  }

  if (mesazh === "ruajtur") {
    revalidatePath("/");
    revalidatePath(`/udhetimi/${id}`);
    revalidatePath("/panel");
  }

  redirect(`/panel?m=${mesazh}`);
}

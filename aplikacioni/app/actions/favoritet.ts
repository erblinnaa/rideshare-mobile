"use server";

import {
  ruajUdhetiminPreferuar,
  type RezultatiPreferuar,
} from "@/lib/favoritet";

export async function ruajUdhetiminTePreferuarat(
  udhetimId: string,
): Promise<RezultatiPreferuar> {
  try {
    return await ruajUdhetiminPreferuar(udhetimId);
  } catch {
    return "databaza";
  }
}

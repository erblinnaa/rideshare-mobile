import Link from "next/link";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";

import AuthVeprimet from "./AuthVeprimet";

export default async function AuthNav() {
  let session = null;

  try {
    session = await getServerSession(authOptions);
  } catch {
    // Konfigurimi i OAuth-it bëhet në .env.local dhe në GitHub manualisht.
  }

  return (
    <nav className="site-nav" aria-label="Navigimi kryesor">
      <Link className="brand-link" href="/">
        RideShare
      </Link>
      <AuthVeprimet user={session?.user ?? null} />
    </nav>
  );
}

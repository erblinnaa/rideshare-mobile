
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import Hyrja from "./Hyrja";

type AuthVeprimetProps = {
  user: {
    name?: string | null;
    email?: string | null;
    role: "udhetar" | "shofer";
  } | null;
};

export default function AuthVeprimet({ user }: AuthVeprimetProps) {
  if (!user) {
    return <Hyrja callbackUrl="/panel" />;
  }

  return (
    <div className="auth-actions">
      <span className="auth-user">
        {user.name ?? user.email ?? "Përdorues"} · {user.role}
      </span>

      <Link className="text-link text-link--compact" href="/panel">
        Paneli
      </Link>

      <button
        className="button button--small button--secondary"
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Dil
      </button>
    </div>
  );
}

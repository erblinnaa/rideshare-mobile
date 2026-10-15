
"use client";

import { signIn } from "next-auth/react";

type HyrjaProps = {
  callbackUrl?: string;
};

export default function Hyrja({
  callbackUrl = "/panel",
}: HyrjaProps) {
  return (
    <button
      className="button button--small button--primary"
      type="button"
      onClick={() => signIn("github", { callbackUrl })}
    >
      Kyçu me GitHub
    </button>
  );
}

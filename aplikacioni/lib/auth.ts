import "server-only";

import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

import { gjejProfilin, ruajProfilin } from "./profilet";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 2 * 60 * 60,
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.id) return false;

      await ruajProfilin({
        github_id: user.id,
        emri: user.name ?? "Përdorues GitHub",
        email: user.email ?? null,
        image: user.image ?? null,
      });

      return true;
    },
    async jwt({ token, user }) {
      const githubId = user?.id ?? token.sub;
      if (!githubId) return token;

      const profil = await gjejProfilin(githubId);
      if (profil) {
        token.sub = profil.github_id;
        token.role = profil.roli;
        token.name = profil.emri;
        token.email = profil.email;
        token.picture = profil.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? "udhetar";
      }

      return session;
    },
  },
};

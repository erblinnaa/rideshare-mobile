import type { Metadata } from "next";

import AuthNav from "@/components/AuthNav";
import Pwa from "@/components/Pwa";

import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare · Udhëtimet për AAB",
  description: "Simulim i rrjedhës së udhëtimeve për RideShare.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <body>
        <AuthNav />
        <Pwa />
        {children}
      </body>
    </html>
  );
}

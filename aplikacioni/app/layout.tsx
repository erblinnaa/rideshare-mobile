import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "RideShare · Udhëtimet për AAB",
  description: "Simulim i rrjedhës së udhëtimeve për RideShare.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}

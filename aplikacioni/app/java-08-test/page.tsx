import Vendtakim from "@/components/Vendtakim";

export const dynamic = "force-dynamic";

export default function Java08TestPage() {
  return (
    <main className="page-shell page-shell--narrow">
      <div className="detail-card">
        <p className="eyebrow">JAVA 8 · FAQJA E PROVËS</p>
        <h1>Vendtakimi në RideShare</h1>
        <p className="intro">
          Kjo faqe përdor të dhëna fiktive dhe nuk kërkon login ose Neon.
        </p>
        <Vendtakim />
      </div>
    </main>
  );
}

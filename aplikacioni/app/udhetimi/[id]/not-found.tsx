import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell page-shell--narrow">
      <div className="empty-state">
        <p className="eyebrow">404 · RIDE SHARE</p>
        <h1>Udhëtimi nuk u gjet</h1>
        <p>Ky udhëtim nuk ekziston në listën e simulimit.</p>
        <Link className="button button--primary" href="/">
          Kthehu te lista
        </Link>
      </div>
    </main>
  );
}

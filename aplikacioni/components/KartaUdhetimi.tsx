import Link from "next/link";

import type { Udhetim } from "@/lib/udhetimet";

type KartaUdhetimiProps = {
  udhetim: Udhetim;
};

export default function KartaUdhetimi({ udhetim }: KartaUdhetimiProps) {
  return (
    <article className="trip-card">
      <div className="trip-card__topline">
        <span className="trip-card__route">
          {udhetim.nisja} <span aria-hidden="true">→</span> {udhetim.destinacioni}
        </span>
        <span className="trip-card__time">{udhetim.ora}</span>
      </div>

      <dl className="trip-card__facts">
        <div>
          <dt>Vende të lira</dt>
          <dd className={udhetim.vende === 0 ? "is-full" : ""}>
            {udhetim.vende === 0 ? "Nuk ka vende" : udhetim.vende}
          </dd>
        </div>
        <div>
          <dt>Vendtakimi</dt>
          <dd>{udhetim.vendtakimi}</dd>
        </div>
      </dl>

      <Link className="button button--secondary" href={"/udhetimi/" + udhetim.id}>
        Shiko detajet
      </Link>
    </article>
  );
}

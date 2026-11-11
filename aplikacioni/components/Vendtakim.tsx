"use client";

import { useState } from "react";

type LocationState =
  | "idle"
  | "loading"
  | "success"
  | "denied"
  | "timeout"
  | "unavailable";

function mesazhiPerGabimin(code: number) {
  if (code === 1) return "Leja u refuzua. Shkruaj vendtakimin vetë.";
  if (code === 2) {
    return "Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.";
  }
  if (code === 3) return "Koha mbaroi. Shkruaj vendtakimin vetë.";
  return "Nuk u lexua vendndodhja. Shkruaj vendtakimin vetë.";
}

export default function Vendtakim() {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabimi, setGabimi] = useState("");
  const [locationState, setLocationState] = useState<LocationState>("idle");
  const [locationMessage, setLocationMessage] = useState(
    "Shtyp butonin për të kërkuar vendndodhjen.",
  );
  const [accuracy, setAccuracy] = useState<number | null>(null);

  function konfirmoVendtakimin() {
    const vlera = teksti.trim();

    if (!vlera) {
      setGabimi("Shkruaj një vendtakim para konfirmimit.");
      return;
    }

    setVendtakimi(vlera);
    setGabimi("");
  }

  function kerkoVendndodhjen() {
    setLocationState("loading");
    setLocationMessage("Po kërkojmë vendndodhjen…");
    setAccuracy(null);

    if (!navigator.geolocation) {
      setLocationState("unavailable");
      setLocationMessage(
        "Vendndodhja nuk mbështetet. Shkruaj vendtakimin vetë.",
      );
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationState("success");
          setLocationMessage("Pozicioni u mor.");
          setAccuracy(position.coords.accuracy);
        },
        (error) => {
          const state: LocationState =
            error.code === 1
              ? "denied"
              : error.code === 3
                ? "timeout"
                : "unavailable";

          setLocationState(state);
          setLocationMessage(mesazhiPerGabimin(error.code));
        },
        { timeout: 10000 },
      );
    } catch {
      setLocationState("unavailable");
      setLocationMessage(
        "Vendndodhja nuk mbështetet. Shkruaj vendtakimin vetë.",
      );
    }
  }

  return (
    <section className="meeting-picker" aria-labelledby="meeting-picker-title">
      <p className="eyebrow">JAVA 8 · VENDTAKIMI</p>
      <h2 id="meeting-picker-title">Zgjidh vendtakimin</h2>
      <p className="meeting-picker__intro">
        Zgjidh një pikë të qartë për t&apos;u takuar. Kjo zgjedhje ruhet vetëm në
        ekranin tënd.
      </p>

      <div className="meeting-picker__manual">
        <label htmlFor="meeting-input">Shkruaj vendtakimin</label>
        <div className="meeting-picker__input-row">
          <input
            id="meeting-input"
            data-testid="meeting-input"
            value={teksti}
            onChange={(event) => {
              setTeksti(event.target.value);
              if (event.target.value.trim()) setGabimi("");
            }}
            placeholder="p.sh. Biblioteka"
            autoComplete="off"
          />
          <button
            className="button button--primary"
            data-testid="confirm-meeting"
            type="button"
            onClick={konfirmoVendtakimin}
          >
            Konfirmo në telefon
          </button>
        </div>
        <p
          className="meeting-picker__error"
          data-testid="meeting-error"
          role="alert"
          aria-live="polite"
        >
          {gabimi || "\u00a0"}
        </p>
      </div>

      <div className="meeting-picker__location">
        <button
          className="button button--secondary"
          data-testid="locate-me"
          type="button"
          onClick={kerkoVendndodhjen}
          disabled={locationState === "loading"}
        >
          Përdor vendndodhjen time
        </button>
        <p
          className="meeting-picker__status"
          data-testid="location-status"
          data-state={locationState}
          role="status"
          aria-live="polite"
        >
          {locationMessage}
        </p>
        <p className="meeting-picker__accuracy" data-testid="location-accuracy">
          {accuracy === null ? "\u00a0" : `Saktësia: ${Math.round(accuracy)} m`}
        </p>
      </div>

      <div className="meeting-picker__confirmed">
        <span>Vendtakimi i konfirmuar</span>
        <p data-testid="confirmed-meeting">
          {vendtakimi || "Ende nuk është konfirmuar."}
        </p>
      </div>
    </section>
  );
}

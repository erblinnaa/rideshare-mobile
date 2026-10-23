-- RideShare Java 7
-- Migrimi për kërkesat reale për vend.
-- Ky skedar vetëm krijon strukturën e re; nuk fshin ose ndryshon të dhënat ekzistuese.

CREATE TABLE IF NOT EXISTS kerkesat (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  udhetim_id TEXT NOT NULL,
  udhetar_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ne_pritje'
    CHECK (status IN ('ne_pritje', 'pranuar', 'refuzuar', 'anuluar')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT kerkesat_udhetim_fk
    FOREIGN KEY (udhetim_id)
    REFERENCES udhetimet(id)
    ON DELETE RESTRICT,

  CONSTRAINT kerkesat_udhetar_fk
    FOREIGN KEY (udhetar_id)
    REFERENCES profilet(github_id)
    ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS kerkesat_udhetim_idx
  ON kerkesat (udhetim_id, created_at DESC);

CREATE INDEX IF NOT EXISTS kerkesat_udhetar_idx
  ON kerkesat (udhetar_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS kerkesat_active_unique_idx
  ON kerkesat (udhetim_id, udhetar_id)
  WHERE status IN ('ne_pritje', 'pranuar');

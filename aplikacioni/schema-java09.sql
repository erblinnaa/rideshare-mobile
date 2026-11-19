-- RideShare Java 9
-- Migrimi për udhëtimet e preferuara; ekzekutohet manualisht në Neon SQL Editor.
-- Ky skedar krijon vetëm strukturën e re dhe nuk ndryshon të dhënat ekzistuese.

CREATE TABLE IF NOT EXISTS udhetimet_favoritet (
  github_id TEXT NOT NULL,
  udhetim_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT udhetimet_favoritet_pk
    PRIMARY KEY (github_id, udhetim_id),

  CONSTRAINT udhetimet_favoritet_user_fk
    FOREIGN KEY (github_id)
    REFERENCES profilet(github_id)
    ON DELETE CASCADE,

  CONSTRAINT udhetimet_favoritet_trip_fk
    FOREIGN KEY (udhetim_id)
    REFERENCES udhetimet(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS udhetimet_favoritet_user_idx
  ON udhetimet_favoritet (github_id, created_at DESC);

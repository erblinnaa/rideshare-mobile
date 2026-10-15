-- RideShare Java 5
-- Ekzekutojeni pasi të jetë ekzekutuar schema.sql në Neon SQL Editor.
-- Ky migrim nuk fshin udhëtime dhe mund të ekzekutohet përsëri.

CREATE TABLE IF NOT EXISTS profilet (
  github_id TEXT PRIMARY KEY,
  emri TEXT NOT NULL,
  roli TEXT NOT NULL DEFAULT 'udhetar'
    CHECK (roli IN ('udhetar', 'shofer')),
  email TEXT,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE udhetimet
  ADD COLUMN IF NOT EXISTS shofer_id TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'udhetimet_shofer_id_fkey'
  ) THEN
    ALTER TABLE udhetimet
      ADD CONSTRAINT udhetimet_shofer_id_fkey
      FOREIGN KEY (shofer_id) REFERENCES profilet(github_id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS udhetimet_shofer_id_idx
  ON udhetimet (shofer_id);

-- Pronari fiktiv i ID 1 nuk është llogaria e studentit.
INSERT INTO profilet (github_id, emri, roli, email)
VALUES ('DEMO-SHOFER-2', 'Shofer demonstrues 2', 'shofer', 'demo@example.test')
ON CONFLICT (github_id) DO UPDATE SET
  emri = EXCLUDED.emri,
  roli = 'shofer',
  updated_at = NOW();

UPDATE udhetimet
SET shofer_id = 'DEMO-SHOFER-2'
WHERE id = '1';

-- ID 2 lihet pa shofer. Pas OAuth-it, studenti e cakton github_id-in real.
-- Ora e ID 2 mbetet 08:15 deri sa ndryshoOren('2', '08:25') të thirret.

SELECT id, nisja, destinacioni, ora, shofer_id
FROM udhetimet
ORDER BY id;

SELECT github_id, emri, roli
FROM profilet
ORDER BY github_id;

-- Know Your Neighborhood — schema

-- All KYN tables live in the `kyn` schema so the database can be shared with
-- other side projects. search_path applies to this migration session.
CREATE SCHEMA IF NOT EXISTS kyn;
SET search_path TO kyn;

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,                 -- nullable: Google-only accounts have no password
  name          TEXT,
  google_id     TEXT UNIQUE,          -- Google subject id (sub) for OAuth accounts
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migration for already-initialized databases (CREATE TABLE IF NOT EXISTS above is a no-op there):
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;

CREATE TABLE IF NOT EXISTS stores (
  id           SERIAL PRIMARY KEY,
  name         TEXT NOT NULL,
  phone_number TEXT,
  locality     TEXT,
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id         SERIAL PRIMARY KEY,
  name       TEXT,
  email      TEXT,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

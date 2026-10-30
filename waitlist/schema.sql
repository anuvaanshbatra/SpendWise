-- Run once against your D1 database:
--   wrangler d1 execute <DB_NAME> --remote --file=waitlist/schema.sql
CREATE TABLE IF NOT EXISTS waitlist (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT    NOT NULL,
  plan       TEXT    NOT NULL DEFAULT 'copilot',
  created_at INTEGER NOT NULL,
  UNIQUE (email, plan)
);

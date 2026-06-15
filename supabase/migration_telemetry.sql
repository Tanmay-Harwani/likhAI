-- Adds per-key telemetry storage to results. Run once in the SQL Editor.
alter table public.results add column if not exists telemetry jsonb;

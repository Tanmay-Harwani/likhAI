-- likhAI security hardening. Run AFTER schema.sql.

-- 1. Make the leaderboard view respect RLS of the querying user
--    (avoids the Supabase "security definer view" warning; underlying
--    tables are publicly readable anyway, this is belt-and-suspenders)
alter view public.leaderboard set (security_invoker = true);

-- 2. Sanity constraints on results so garbage data can't be inserted
--    directly through the API (anon key is public by design, anyone
--    can sign up and call insert — these caps limit the damage)
alter table public.results
  add constraint results_wpm_sane check (wpm >= 0 and wpm <= 350),
  add constraint results_raw_sane check (raw_wpm >= 0 and raw_wpm <= 400),
  add constraint results_acc_sane check (accuracy >= 0 and accuracy <= 100),
  add constraint results_errors_sane check (errors >= 0),
  add constraint results_duration_sane check (duration_ms >= 1000 and duration_ms <= 1800000);

-- 3. Username hygiene: letters, numbers, underscore only
alter table public.profiles
  add constraint username_charset check (username ~ '^[A-Za-z0-9_]+$');

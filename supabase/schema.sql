-- likhAI Supabase schema
-- Paste this into the SQL Editor of a new Supabase project and run it.

-- 1. Profiles (one row per user, username shown on leaderboard)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null check (char_length(username) between 3 and 20),
  created_at timestamptz default now()
);

-- 2. Snippets (mirrors src/data/corpus.ts exactly)
create table public.snippets (
  id text primary key,
  domain text not null check (domain in ('stats', 'ml', 'ai', 'coding')),
  format text not null check (format in ('theory', 'python', 'sql', 'interview')),
  concept text not null,
  text text not null,
  created_at timestamptz default now()
);

-- 3. Results (one row per completed test)
create table public.results (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  snippet_id text not null references public.snippets (id),
  wpm numeric not null,
  raw_wpm numeric not null,
  accuracy numeric not null,
  errors int not null,
  duration_ms int not null,
  created_at timestamptz default now()
);

create index results_user_idx on public.results (user_id, created_at desc);
create index results_snippet_idx on public.results (snippet_id);

-- 4. Leaderboard view: best wpm per user, only runs with >= 95% accuracy
--    (otherwise people farm wpm by mashing through errors)
create view public.leaderboard as
select
  p.username,
  max(r.wpm) as best_wpm,
  round(avg(r.accuracy), 1) as avg_accuracy,
  count(*) as tests
from public.results r
join public.profiles p on p.id = r.user_id
where r.accuracy >= 95
group by p.username
order by best_wpm desc;

-- 5. Row level security
alter table public.profiles enable row level security;
alter table public.snippets enable row level security;
alter table public.results enable row level security;

-- Anyone can read snippets and profiles (needed for leaderboard display)
create policy "snippets are public" on public.snippets
  for select using (true);

create policy "profiles are public" on public.profiles
  for select using (true);

-- Users manage only their own profile
create policy "insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Users insert only their own results; everyone can read (leaderboard)
create policy "insert own results" on public.results
  for insert with check (auth.uid() = user_id);

create policy "results are public" on public.results
  for select using (true);

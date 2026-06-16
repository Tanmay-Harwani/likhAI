# likhAI

A MonkeyType-inspired typing trainer for ML/AI/DS/SWE professionals.
Type theory, Python, SQL, and interview answers instead of random words,
so every session builds recall, not just WPM.

## Run it

```bash
npm install
npm run dev
```

## Shortcuts

- **tab** — next snippet
- **esc** — restart current snippet
- **enter** (after finishing) — next snippet

## Architecture

- `src/engine/useTypingEngine.ts` — the core. Per-character diffing,
  WPM/raw/accuracy, and code mode: after a correct newline, leading
  indentation of the next line is auto-inserted so you never type
  whitespace runs.
- `src/data/corpus.ts` — seed content, tagged by `type` and `topic`.
  Moves to Supabase in v2.
- `src/components/` — typing area, stats bar, result card.

## Roadmap

1. Supabase: auth, per-snippet results table, larger corpus
2. Spaced repetition: resurface snippets typed slowly or with errors
3. Topic drill mode (e.g. only linear regression)
4. Content pipeline: LLM-generated snippets, human-reviewed, bulk insert

## Content pipeline (generate -> eval -> review -> publish)

1. `export GROQ_API_KEY=gsk_...` (free key at https://console.groq.com/keys)
2. `npx tsx scripts/generate-content.ts` (or scope it: `npx tsx scripts/generate-content.ts ai theory`)
   - Generates snippets from `scripts/syllabus.json`
   - Eval 1: format check (length, ASCII-only, line counts)
   - Eval 2: LLM-as-judge fact check, must score 4+/5
   - Eval 3: duplicate detection vs existing corpus (Jaccard similarity)
   - Survivors land in `content/candidates.json` as "pending"
3. Review the pending candidates, edit freely, set the good ones to "approved"
4. `npx tsx scripts/promote.ts` -> paste `supabase/seed_generated.sql` into Supabase
5. App loads snippets from the DB, so new content is live without redeploying

## Telemetry

Every run records per-key aggregates (count, errors, inter-key latency with
pauses >2s excluded) into `results.telemetry` (jsonb). The leaderboard page
shows your slowest keys and most missed keys computed across all saved runs.

// Generates supabase/seed_snippets.sql from src/data/corpus.ts
// Run: npx tsx scripts/gen-seed.ts
//
// Uses per-row dollar-quoted INSERT statements so single quotes, double quotes,
// backslashes, and newlines inside snippet text never need escaping.
// Each snippet gets a unique dollar-quote tag: $snip_N$ ... $snip_N$
import { writeFileSync } from "fs";
import { CORPUS } from "../src/data/corpus";

const esc = (s: string) => s.replace(/'/g, "''"); // only needed for non-text cols

const statements = CORPUS.map((s, i) => {
  const tag = `$snip_${i}$`;
  return [
    `insert into public.snippets (id, domain, format, concept, text) values (`,
    `  '${s.id}', '${s.domain}', '${s.format}', '${esc(s.concept)}', ${tag}${s.text}${tag}`,
    `) on conflict (id) do update set`,
    `  domain = excluded.domain,`,
    `  format = excluded.format,`,
    `  concept = excluded.concept,`,
    `  text = excluded.text;`,
  ].join("\n");
}).join("\n\n");

const sql = `-- Generated from src/data/corpus.ts. Re-run scripts/gen-seed.ts after corpus changes.
-- Uses dollar-quoting so quotes/backslashes inside snippets never cause parse errors.

${statements}
`;

writeFileSync("supabase/seed_snippets.sql", sql);
console.log(`Wrote ${CORPUS.length} snippets to supabase/seed_snippets.sql`);

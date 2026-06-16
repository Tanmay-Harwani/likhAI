
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { CORPUS } from "../src/data/corpus";

const API_KEY = process.env.GROQ_API_KEY;
const MODEL = "llama-3.3-70b-versatile";
const PER_CONCEPT = 1; // snippets per concept

interface Candidate {
  id: string;
  domain: string;
  format: string;
  concept: string;
  text: string;
  status: "pending" | "approved" | "rejected" | "promoted";
  evals: {
    formatCheck: boolean;
    factScore: number | null;
    factIssues: string[];
    duplicateOf: string | null;
  };
}

// ---------- LLM call ----------
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function callLLM(prompt: string, retries = 3): Promise<string> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (res.status === 429 && retries > 0) {
    const body = await res.text();
    const wait = Number(body.match(/try again in ([\d.]+)s/)?.[1] ?? "10") * 1000 + 500;
    console.log(`  (rate limited, waiting ${Math.round(wait / 1000)}s)`);
    await sleep(wait);
    return callLLM(prompt, retries - 1);
  }
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content;
}

function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.indexOf("[") !== -1 && cleaned.indexOf("[") < (cleaned.indexOf("{") + 1 || Infinity)
    ? cleaned.indexOf("[")
    : cleaned.indexOf("{");
  const end = Math.max(cleaned.lastIndexOf("]"), cleaned.lastIndexOf("}"));
  return JSON.parse(cleaned.slice(start, end + 1));
}

// ---------- Generation ----------
const PROSE_RULES = `
- One paragraph, 220 to 330 characters, no newlines.
- Plain ASCII only: letters, digits, spaces, and . , ; : ' " ( ) / % + - =
- NO em dashes, NO unicode quotes, NO bullet points, NO markdown.
- Spell out numbers and symbols in words or plain digits as natural English (e.g. "point zero five" or "0.05", "95 percent"), but ONLY when that specific number is actually true and relevant to THIS concept. Do not invent numeric values, accuracy figures, or hyperparameters that aren't standard, well-known facts.
- Must be factually correct and precise. A senior data scientist reading it should not wince.
- Dense with real understanding, not filler. Every sentence teaches something.`;

const CODE_RULES = `
- 5 to 10 lines of runnable, idiomatic code. Real variable names, no foo/bar.
- Plain ASCII only. Standard indentation (4 spaces python, 2 spaces sql).
- Must be syntactically correct and actually do what the concept says.
- No comments inside the code. The code itself is the lesson.`;

function genPrompt(domain: string, format: string, concept: string): string {
  const isCode = format === "python" || format === "sql";
  const style =
    format === "interview"
      ? `Write it as a model interview answer in first person ("I would..."), the way a strong candidate would say it out loud.`
      : format === "theory"
        ? `Write it as a crisp textbook-quality explanation.`
        : `Write ${format} code demonstrating the concept.`;
  return `You are writing typing practice content for likhAI, a typing trainer for ML/data science professionals. Users literally type every character, so the content must be worth burning into muscle memory.

Concept: "${concept}" (domain: ${domain}, format: ${format})
${style}

Rules:${isCode ? CODE_RULES : PROSE_RULES}

Respond with ONLY a JSON array of ${PER_CONCEPT} object(s), no markdown, no preamble:
[{"text": "..."}]`;
}

// ---------- Eval 1: format check ----------
function formatCheck(text: string, format: string): boolean {
  const isCode = format === "python" || format === "sql";
  if (!/^[\x20-\x7E\n]+$/.test(text)) return false; // printable ASCII + newline only
  if (/[\u2013\u2014]/.test(text)) return false; // no en/em dashes (redundant but explicit)
  if (isCode) {
    const lines = text.split("\n");
    return lines.length >= 3 && lines.length <= 14 && text.length >= 80 && text.length <= 450;
  }
  return !text.includes("\n") && text.length >= 180 && text.length <= 360;
}

// ---------- Eval 2: fact check (LLM as judge) ----------
async function factCheck(c: { concept: string; format: string; text: string }) {
  const prompt = `You are a strict reviewer for a data science education corpus. Evaluate this snippet about "${c.concept}" (${c.format}).

Snippet:
${c.text}

Score factual/technical correctness 1-5:
5 = flawless, 4 = correct with trivial nitpicks, 3 = mostly right but one imprecise claim, 2 = a real error, 1 = badly wrong.
For code: 5 means it runs and does what it claims.
Be harsh. This gets memorized by learners.

Respond ONLY with JSON: {"score": <1-5>, "issues": ["..."]}`;
  const raw = await callLLM(prompt);
  const parsed = extractJson(raw) as { score: number; issues: string[] };
  return { score: parsed.score, issues: parsed.issues ?? [] };
}

// ---------- Eval 3: dedupe ----------
function words(s: string): Set<string> {
  return new Set(s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2));
}
function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / (a.size + b.size - inter || 1);
}
function findDuplicate(text: string, existing: { id: string; text: string }[]): string | null {
  const w = words(text);
  for (const e of existing) {
    if (jaccard(w, words(e.text)) > 0.55) return e.id;
  }
  return null;
}

// ---------- Main ----------
function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30);
}

async function main() {
  if (!API_KEY) {
    console.error("Set GROQ_API_KEY first: export GROQ_API_KEY=gsk_... (get one at https://console.groq.com/keys)");
    process.exit(1);
  }

  const syllabus = JSON.parse(readFileSync("scripts/syllabus.json", "utf-8")) as Record<
    string,
    Record<string, string[]>
  >;

  const [onlyDomain, onlyFormat] = process.argv.slice(2);

  mkdirSync("content", { recursive: true });
  const outPath = "content/candidates.json";
  const previous: Candidate[] = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf-8")) : [];
  const candidates: Candidate[] = [...previous];
  const knownTexts = [
    ...CORPUS.map((s) => ({ id: s.id, text: s.text })),
    ...previous.map((c) => ({ id: c.id, text: c.text })),
  ];

  for (const [domain, formats] of Object.entries(syllabus)) {
    if (onlyDomain && domain !== onlyDomain) continue;
    for (const [format, concepts] of Object.entries(formats)) {
      if (onlyFormat && format !== onlyFormat) continue;
      for (const concept of concepts) {
        const id = `${domain.slice(0, 2)}-${slug(concept)}`;
        if (candidates.some((c) => c.id === id) || CORPUS.some((s) => s.id === id)) {
          console.log(`skip (exists): ${id}`);
          continue;
        }
        process.stdout.write(`generating ${domain}/${format}/${concept} ... `);
        try {
          const raw = await callLLM(genPrompt(domain, format, concept));
          const arr = extractJson(raw) as { text: string }[];
          const text = arr[0]?.text?.trim();
          if (!text) throw new Error("empty generation");

          const fmtOk = formatCheck(text, format);
          const dup = findDuplicate(text, knownTexts);
          let factScore: number | null = null;
          let factIssues: string[] = [];
          if (fmtOk && !dup) {
            const fc = await factCheck({ concept, format, text });
            factScore = fc.score;
            factIssues = fc.issues;
          }

          const passed = fmtOk && !dup && (factScore ?? 0) >= 4;
          candidates.push({
            id,
            domain,
            format,
            concept,
            text,
            status: passed ? "pending" : "rejected",
            evals: { formatCheck: fmtOk, factScore, factIssues, duplicateOf: dup },
          });
          knownTexts.push({ id, text });
          console.log(passed ? `OK (fact ${factScore}/5)` : `REJECTED (fmt:${fmtOk} dup:${dup ?? "no"} fact:${factScore})`);
        } catch (err) {
          console.log(`ERROR: ${(err as Error).message}`);
        }
        writeFileSync(outPath, JSON.stringify(candidates, null, 2));
        await sleep(2000); 
      }
    }
  }

  const pending = candidates.filter((c) => c.status === "pending").length;
  const rejected = candidates.filter((c) => c.status === "rejected").length;
  console.log(`\nDone. ${pending} pending your review, ${rejected} auto-rejected.`);
  console.log(`Review ${outPath}, flip good ones to "approved", then: npx tsx scripts/promote.ts`);
}

main();
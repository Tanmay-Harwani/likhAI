import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import type { Telemetry, KeyAgg } from "../engine/useTypingEngine";

interface ResultRow {
  id: number;
  wpm: number;
  accuracy: number;
  created_at: string;
  snippet_id: string;
  telemetry: Telemetry | null;
}

interface SnippetMeta {
  id: string;
  domain: string;
  format: string;
  concept: string;
}

function prettyKey(k: string) {
  if (k === " ") return "\u2423";
  if (k === "\n") return "\u23CE";
  return k;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ---- Tiny SVG line chart ----
function WpmChart({ runs }: { runs: { wpm: number; created_at: string }[] }) {
  const data = [...runs].reverse().slice(-30);
  if (data.length < 2) return null;

  const W = 600;
  const H = 120;
  const PAD = { top: 10, right: 10, bottom: 24, left: 36 };
  const IW = W - PAD.left - PAD.right;
  const IH = H - PAD.top - PAD.bottom;

  const wpms = data.map((r) => Number(r.wpm));
  const minW = Math.max(0, Math.min(...wpms) - 5);
  const maxW = Math.max(...wpms) + 5;

  const x = (i: number) => PAD.left + (i / (data.length - 1)) * IW;
  const y = (w: number) => PAD.top + IH - ((w - minW) / (maxW - minW)) * IH;

  const points = data.map((r, i) => `${x(i)},${y(Number(r.wpm))}`).join(" ");
  const area = `M ${x(0)},${y(Number(data[0].wpm))} ` +
    data.map((r, i) => `L ${x(i)},${y(Number(r.wpm))}`).join(" ") +
    ` L ${x(data.length - 1)},${PAD.top + IH} L ${x(0)},${PAD.top + IH} Z`;

  const avgWpm = Math.round(wpms.reduce((a, b) => a + b, 0) / wpms.length);
  const ticks = [minW, Math.round((minW + maxW) / 2), maxW];

  return (
    <div className="mt-4">
      <div className="text-dim text-xs uppercase tracking-widest mb-2">wpm over time (last {data.length} runs)</div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: 140 }}>
        <line x1={PAD.left} y1={y(avgWpm)} x2={PAD.left + IW} y2={y(avgWpm)}
          stroke="#566270" strokeWidth="1" strokeDasharray="4 3" />
        <path d={area} fill="#e8a33d" fillOpacity="0.08" />
        <polyline points={points} fill="none" stroke="#e8a33d" strokeWidth="2" strokeLinejoin="round" />
        {data.map((r, i) => (
          <circle key={i} cx={x(i)} cy={y(Number(r.wpm))} r="3" fill="#e8a33d" />
        ))}
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.left - 4} y1={y(t)} x2={PAD.left} y2={y(t)} stroke="#566270" strokeWidth="1" />
            <text x={PAD.left - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#566270">{Math.round(t)}</text>
          </g>
        ))}
        <text x={x(0)} y={H - 4} textAnchor="middle" fontSize="10" fill="#566270">{fmt(data[0].created_at)}</text>
        <text x={x(data.length - 1)} y={H - 4} textAnchor="middle" fontSize="10" fill="#566270">{fmt(data[data.length - 1].created_at)}</text>
      </svg>
    </div>
  );
}

function Breakdown({ results, snippets }: { results: ResultRow[]; snippets: SnippetMeta[] }) {
  const map = Object.fromEntries(snippets.map((s) => [s.id, s]));
  const byDomain: Record<string, { wpms: number[]; accs: number[] }> = {};
  const byFormat: Record<string, { wpms: number[]; accs: number[] }> = {};

  for (const r of results) {
    const s = map[r.snippet_id];
    if (!s) continue;
    const d = (byDomain[s.domain] ??= { wpms: [], accs: [] });
    d.wpms.push(Number(r.wpm));
    d.accs.push(Number(r.accuracy));
    const f = (byFormat[s.format] ??= { wpms: [], accs: [] });
    f.wpms.push(Number(r.wpm));
    f.accs.push(Number(r.accuracy));
  }

  const rowsFrom = (obj: typeof byDomain) =>
    Object.entries(obj).map(([k, v]) => ({
      label: k,
      avg: Math.round(v.wpms.reduce((a, b) => a + b, 0) / v.wpms.length),
      acc: Math.round((v.accs.reduce((a, b) => a + b, 0) / v.accs.length) * 10) / 10,
      n: v.wpms.length,
    })).sort((a, b) => b.avg - a.avg);

  const domainRows = rowsFrom(byDomain);
  const formatRows = rowsFrom(byFormat);
  if (domainRows.length === 0) return null;

  const maxAvg = Math.max(...domainRows.map((r) => r.avg), ...formatRows.map((r) => r.avg));

  function Table({ rows, title }: { rows: typeof domainRows; title: string }) {
    return (
      <div className="flex-1 min-w-[200px]">
        <div className="text-dim text-xs uppercase tracking-widest mb-2">{title}</div>
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-fg">{r.label}</span>
                <span className="text-saffron font-bold">{r.avg} wpm</span>
              </div>
              <div className="h-1.5 bg-edge rounded-full overflow-hidden">
                <div className="h-full bg-saffron rounded-full" style={{ width: `${(r.avg / maxAvg) * 100}%` }} />
              </div>
              <div className="text-dim text-[10px] mt-0.5">{r.acc}% acc · {r.n} runs</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="text-dim text-xs uppercase tracking-widest mb-3">performance breakdown</div>
      <div className="flex gap-10 flex-wrap">
        <Table rows={domainRows} title="by domain" />
        <Table rows={formatRows} title="by format" />
      </div>
    </div>
  );
}

function RecentRuns({ results, snippets }: { results: ResultRow[]; snippets: SnippetMeta[] }) {
  const map = Object.fromEntries(snippets.map((s) => [s.id, s]));
  const recent = results.slice(0, 8);
  return (
    <div className="mt-8">
      <div className="text-dim text-xs uppercase tracking-widest mb-2">recent runs</div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-dim text-left">
            <th className="py-1.5 font-normal">snippet</th>
            <th className="py-1.5 font-normal text-right">wpm</th>
            <th className="py-1.5 font-normal text-right">acc</th>
            <th className="py-1.5 font-normal text-right">when</th>
          </tr>
        </thead>
        <tbody>
          {recent.map((r) => {
            const s = map[r.snippet_id];
            return (
              <tr key={r.id} className="border-t border-edge">
                <td className="py-1.5 text-fg">
                  {s ? <span>{s.concept}<span className="text-dim ml-2">{s.domain}/{s.format}</span></span> : <span className="text-dim">{r.snippet_id}</span>}
                </td>
                <td className="py-1.5 text-right text-saffron font-bold">{r.wpm}</td>
                <td className="py-1.5 text-right text-dim">{r.accuracy}%</td>
                <td className="py-1.5 text-right text-dim">{fmt(r.created_at)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Profile() {
  const { user, profile } = useAuth();
  const [mine, setMine] = useState<ResultRow[] | null>(null);
  const [snippets, setSnippets] = useState<SnippetMeta[]>([]);

  useEffect(() => {
    supabase.from("snippets").select("id, domain, format, concept").then(({ data }) => {
      if (data) setSnippets(data as SnippetMeta[]);
    });
  }, []);

  useEffect(() => {
    if (!user) { setMine(null); return; }
    supabase
      .from("results")
      .select("id, wpm, accuracy, created_at, snippet_id, telemetry")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setMine((data as ResultRow[]) ?? []));
  }, [user]);

  if (!user) return <p className="text-dim text-sm font-mono">Sign in to view your stats.</p>;
  if (!mine) return <p className="text-dim text-sm font-mono">Loading…</p>;
  if (mine.length === 0) return <p className="text-dim text-sm font-mono">No tests saved yet. Finish a snippet to see your stats here.</p>;

  const best = Math.max(...mine.map((r) => Number(r.wpm)));
  const avg = Math.round(mine.reduce((a, r) => a + Number(r.wpm), 0) / mine.length);
  const avgAcc = Math.round((mine.reduce((a, r) => a + Number(r.accuracy), 0) / mine.length) * 10) / 10;

  const merged: Record<string, KeyAgg> = {};
  for (const r of mine) {
    const keys = r.telemetry?.keys;
    if (!keys) continue;
    for (const [k, a] of Object.entries(keys)) {
      const m = (merged[k] ??= { n: 0, err: 0, ms: 0, msN: 0 });
      m.n += a.n; m.err += a.err; m.ms += a.ms; m.msN += a.msN;
    }
  }
  const entries = Object.entries(merged);
  const slowest = entries.filter(([, a]) => a.msN >= 8)
    .map(([k, a]) => ({ k, avgMs: Math.round(a.ms / a.msN) }))
    .sort((x, y) => y.avgMs - x.avgMs).slice(0, 8);
  const missed = entries.filter(([, a]) => a.n >= 5 && a.err > 0)
    .map(([k, a]) => ({ k, rate: Math.round((a.err / a.n) * 100) }))
    .sort((x, y) => y.rate - x.rate).slice(0, 8);

  return (
    <div className="font-mono">
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-saffron text-xl">{profile?.username ?? "you"}</h2>
        <span className="text-dim text-xs">{mine.length} tests completed</span>
      </div>

      {/* Headline numbers */}
      <div className="flex gap-10 text-sm flex-wrap">
        {[
          { label: "best wpm", val: best, color: "text-saffron" },
          { label: "avg wpm", val: avg, color: "text-fg" },
          { label: "avg acc", val: `${avgAcc}%`, color: "text-fg" },
          { label: "tests", val: mine.length, color: "text-fg" },
        ].map(({ label, val, color }) => (
          <div key={label}>
            <div className="text-dim text-xs uppercase tracking-widest">{label}</div>
            <div className={`${color} text-3xl font-bold`}>{val}</div>
          </div>
        ))}
      </div>

      <WpmChart runs={mine} />
      <Breakdown results={mine} snippets={snippets} />

      {(slowest.length > 0 || missed.length > 0) && (
        <div className="flex gap-12 mt-8 flex-wrap">
          {slowest.length > 0 && (
            <div>
              <div className="text-dim text-xs uppercase tracking-widest mb-2">slowest keys</div>
              <div className="flex gap-2 flex-wrap">
                {slowest.map(({ k, avgMs }) => (
                  <div key={k} className="border border-edge rounded px-2 py-1 text-center min-w-[2.5rem]">
                    <div className="text-fg text-base">{prettyKey(k)}</div>
                    <div className="text-dim text-[10px]">{avgMs}ms</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {missed.length > 0 && (
            <div>
              <div className="text-dim text-xs uppercase tracking-widest mb-2">most missed</div>
              <div className="flex gap-2 flex-wrap">
                {missed.map(({ k, rate }) => (
                  <div key={k} className="border border-edge rounded px-2 py-1 text-center min-w-[2.5rem]">
                    <div className="text-error text-base">{prettyKey(k)}</div>
                    <div className="text-dim text-[10px]">{rate}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <RecentRuns results={mine} snippets={snippets} />
    </div>
  );
}

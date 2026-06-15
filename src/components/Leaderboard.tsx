import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";
import type { Telemetry, KeyAgg } from "../engine/useTypingEngine";

interface BoardRow {
  username: string;
  best_wpm: number;
  avg_accuracy: number;
  tests: number;
}

interface ResultRow {
  wpm: number;
  accuracy: number;
  created_at: string;
  telemetry: Telemetry | null;
}

function prettyKey(k: string) {
  if (k === " ") return "\u2423"; // visible space
  if (k === "\n") return "\u23CE"; // return arrow
  return k;
}

export function Leaderboard() {
  const { user, profile } = useAuth();
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [mine, setMine] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("leaderboard")
      .select("*")
      .limit(50)
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows((data as BoardRow[]) ?? []);
      });
  }, []);

  useEffect(() => {
    if (!user) {
      setMine(null);
      return;
    }
    supabase
      .from("results")
      .select("wpm, accuracy, created_at, telemetry")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setMine((data as ResultRow[]) ?? []));
  }, [user]);

  const best = mine && mine.length ? Math.max(...mine.map((r) => Number(r.wpm))) : 0;
  const avg = mine && mine.length ? Math.round(mine.reduce((a, r) => a + Number(r.wpm), 0) / mine.length) : 0;
  const avgAcc =
    mine && mine.length ? Math.round((mine.reduce((a, r) => a + Number(r.accuracy), 0) / mine.length) * 10) / 10 : 0;

  // Merge per-key telemetry across all saved results
  const merged: Record<string, KeyAgg> = {};
  for (const r of mine ?? []) {
    const keys = r.telemetry?.keys;
    if (!keys) continue;
    for (const [k, a] of Object.entries(keys)) {
      const m = (merged[k] ??= { n: 0, err: 0, ms: 0, msN: 0 });
      m.n += a.n;
      m.err += a.err;
      m.ms += a.ms;
      m.msN += a.msN;
    }
  }
  const entries = Object.entries(merged);
  const slowest = entries
    .filter(([, a]) => a.msN >= 8)
    .map(([k, a]) => ({ k, avgMs: Math.round(a.ms / a.msN) }))
    .sort((x, y) => y.avgMs - x.avgMs)
    .slice(0, 8);
  const missed = entries
    .filter(([, a]) => a.n >= 5 && a.err > 0)
    .map(([k, a]) => ({ k, rate: Math.round((a.err / a.n) * 100) }))
    .sort((x, y) => y.rate - x.rate)
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-8 font-mono">
      <section>
        <h2 className="text-saffron text-lg mb-3">your stats</h2>
        {!user ? (
          <p className="text-dim text-sm">Sign in to track your results.</p>
        ) : !mine ? (
          <p className="text-dim text-sm">Loading…</p>
        ) : mine.length === 0 ? (
          <p className="text-dim text-sm">No tests saved yet. Finish a snippet while signed in.</p>
        ) : (
          <>
            <div className="flex gap-10 text-sm flex-wrap">
              <div>
                <div className="text-dim text-xs uppercase tracking-widest">best wpm</div>
                <div className="text-saffron text-3xl font-bold">{best}</div>
              </div>
              <div>
                <div className="text-dim text-xs uppercase tracking-widest">avg wpm</div>
                <div className="text-fg text-3xl font-bold">{avg}</div>
              </div>
              <div>
                <div className="text-dim text-xs uppercase tracking-widest">avg acc</div>
                <div className="text-fg text-3xl font-bold">{avgAcc}%</div>
              </div>
              <div>
                <div className="text-dim text-xs uppercase tracking-widest">tests</div>
                <div className="text-fg text-3xl font-bold">{mine.length}</div>
              </div>
            </div>

            {(slowest.length > 0 || missed.length > 0) && (
              <div className="flex gap-12 mt-6 flex-wrap">
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
          </>
        )}
      </section>

      <section>
        <h2 className="text-saffron text-lg mb-3">leaderboard</h2>
        <p className="text-dim text-xs mb-3">Best WPM per user. Only runs with 95%+ accuracy count.</p>
        {error ? (
          <p className="text-error text-sm">{error}</p>
        ) : !rows ? (
          <p className="text-dim text-sm">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-dim text-sm">Empty. Be the first.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-dim text-xs uppercase tracking-widest text-left">
                <th className="py-2 w-12">#</th>
                <th className="py-2">user</th>
                <th className="py-2 text-right">best wpm</th>
                <th className="py-2 text-right">avg acc</th>
                <th className="py-2 text-right">tests</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.username}
                  className={`border-t border-edge ${profile?.username === r.username ? "text-saffron" : "text-fg"}`}
                >
                  <td className="py-2 text-dim">{i + 1}</td>
                  <td className="py-2">{r.username}</td>
                  <td className="py-2 text-right font-bold">{r.best_wpm}</td>
                  <td className="py-2 text-right">{r.avg_accuracy}%</td>
                  <td className="py-2 text-right text-dim">{r.tests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

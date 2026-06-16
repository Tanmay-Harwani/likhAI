import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../auth/AuthContext";

interface BoardRow {
  username: string;
  best_wpm: number;
  avg_accuracy: number;
  tests: number;
}

export function Leaderboard() {
  const { profile } = useAuth();
  const [rows, setRows] = useState<BoardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("leaderboard").select("*").limit(50).then(({ data, error }) => {
      if (error) setError(error.message);
      else setRows((data as BoardRow[]) ?? []);
    });
  }, []);

  return (
    <div className="font-mono">
      <h2 className="text-saffron text-xl mb-1">leaderboard</h2>
      <p className="text-dim text-xs mb-4">Best WPM per user. Only runs with 95%+ accuracy count.</p>
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
              <tr key={r.username}
                className={`border-t border-edge ${profile?.username === r.username ? "text-saffron" : "text-fg"}`}>
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
    </div>
  );
}

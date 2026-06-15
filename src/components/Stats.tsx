import type { EngineStats } from "../engine/useTypingEngine";

function fmtTime(ms: number) {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function StatsBar({ stats, live }: { stats: EngineStats; live: boolean }) {
  return (
    <div className="flex items-baseline gap-6 font-mono text-sm text-dim">
      <span>
        <span className={live ? "text-saffron" : ""}>{stats.wpm}</span> wpm
      </span>
      <span>{stats.accuracy}% acc</span>
      <span>{fmtTime(stats.elapsedMs)}</span>
      <span className="ml-auto">{Math.round(stats.progress * 100)}%</span>
    </div>
  );
}

export function ResultCard({ stats, onNext, onRetry }: { stats: EngineStats; onNext: () => void; onRetry: () => void }) {
  return (
    <div className="border border-edge bg-surface rounded-lg p-8 font-mono">
      <div className="flex items-end gap-10">
        <div>
          <div className="text-dim text-xs uppercase tracking-widest mb-1">wpm</div>
          <div className="text-saffron text-6xl font-bold leading-none">{stats.wpm}</div>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm pb-1">
          <div>
            <span className="text-dim">raw </span>
            <span className="text-fg">{stats.rawWpm}</span>
          </div>
          <div>
            <span className="text-dim">acc </span>
            <span className="text-fg">{stats.accuracy}%</span>
          </div>
          <div>
            <span className="text-dim">errors </span>
            <span className={stats.errors > 0 ? "text-error" : "text-fg"}>{stats.errors}</span>
          </div>
          <div>
            <span className="text-dim">time </span>
            <span className="text-fg">{fmtTime(stats.elapsedMs)}</span>
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-3 text-sm">
        <button
          onClick={onNext}
          className="px-4 py-2 rounded bg-saffron text-ink font-medium hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          Next snippet (enter)
        </button>
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded border border-edge text-dim hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          Retry (esc)
        </button>
      </div>
    </div>
  );
}

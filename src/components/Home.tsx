import { useEffect, useState } from "react";

const WORD = "likhAI";

export function Home({ onStart, onBoard }: { onStart: () => void; onBoard: () => void }) {
  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [count, setCount] = useState(reduced ? WORD.length : 0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= WORD.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 260);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div className="flex flex-col items-center justify-center gap-8 text-center font-mono py-16">
      <h1 className="text-6xl sm:text-7xl font-bold tracking-tight" aria-label="likhAI">
        {WORD.split("").map((ch, i) => (
          <span key={i} className="relative">
            {i === count && count < WORD.length && (
              <span className="text-saffron blink absolute -left-[3px]" aria-hidden="true">▌</span>
            )}
            <span className={`${i < 4 ? "text-saffron" : "text-fg"} ${i < count ? "" : "invisible"}`}>
              {ch}
            </span>
          </span>
        ))}
      </h1>

      <p className="text-dim text-base max-w-md leading-relaxed">
        Typing practice where every snippet is real ML, stats, AI, and coding knowledge. Build
        speed and recall at the same time.
      </p>

      <div className="flex gap-3 text-sm">
        <button
          onClick={onStart}
          className="px-6 py-3 rounded bg-saffron text-ink font-medium hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          Start typing
        </button>
        <button
          onClick={onBoard}
          className="px-6 py-3 rounded border border-edge text-dim hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron"
        >
          Leaderboard
        </button>
      </div>

      <div className="text-dim/60 text-xs">theory · python · sql · interview answers</div>
    </div>
  );
}

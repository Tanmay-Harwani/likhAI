import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface EngineStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  elapsedMs: number;
  progress: number;
}

export interface KeyAgg {
  n: number; // times this character was expected
  err: number; // times it was mistyped
  ms: number; // summed inter-key latency on presses for this char
  msN: number; // how many latency samples
}

export interface Telemetry {
  keys: Record<string, KeyAgg>;
}

/**
 * Core typing engine. Compares typed input against a target string,
 * character by character. Handles code snippets too: after a correctly
 * typed newline, leading indentation of the next line is auto-inserted
 * so the user never types whitespace runs.
 *
 * Also records per-character telemetry (error counts and inter-key
 * latency, aggregated by expected character) for analytics.
 */
export function useTypingEngine(target: string) {
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const keystrokes = useRef({ total: 0, incorrect: 0 });
  const telemetry = useRef<{ lastT: number | null; keys: Record<string, KeyAgg> }>({
    lastT: null,
    keys: {},
  });
  const [, setTick] = useState(0); // forces re-render for live WPM

  const finished = finishedAt !== null;
  const started = startedAt !== null;

  const reset = useCallback(() => {
    setTyped("");
    setStartedAt(null);
    setFinishedAt(null);
    keystrokes.current = { total: 0, incorrect: 0 };
    telemetry.current = { lastT: null, keys: {} };
  }, []);

  useEffect(() => {
    reset();
  }, [target, reset]);

  useEffect(() => {
    if (!started || finished) return;
    const id = setInterval(() => setTick((t) => t + 1), 500);
    return () => clearInterval(id);
  }, [started, finished]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (finished) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key;

      if (key === "Backspace") {
        e.preventDefault();
        setTyped((t) => t.slice(0, -1));
        return;
      }

      let char: string | null = null;
      if (key === "Enter") char = "\n";
      else if (key.length === 1) char = key;
      if (char === null) return;

      e.preventDefault();

      const pos = typed.length;
      if (pos >= target.length) return;

      if (!started) setStartedAt(Date.now());

      const expected = target[pos];
      const correct = expected === char;

      keystrokes.current.total += 1;
      if (!correct) keystrokes.current.incorrect += 1;

      // Telemetry: aggregate by expected character
      const now = performance.now();
      const agg = (telemetry.current.keys[expected] ??= { n: 0, err: 0, ms: 0, msN: 0 });
      agg.n += 1;
      if (!correct) agg.err += 1;
      if (telemetry.current.lastT !== null) {
        const d = now - telemetry.current.lastT;
        // ignore long pauses (thinking, tab-away) so latency stays meaningful
        if (d > 0 && d < 2000) {
          agg.ms += d;
          agg.msN += 1;
        }
      }
      telemetry.current.lastT = now;

      let next = typed + char;

      // Auto-skip indentation after a correct newline (code mode)
      if (char === "\n" && expected === "\n") {
        let i = pos + 1;
        while (i < target.length && (target[i] === " " || target[i] === "\t")) {
          next += target[i];
          i++;
        }
      }

      if (next.length >= target.length) setFinishedAt(Date.now());
      setTyped(next);
    },
    [finished, started, typed, target]
  );

  const getTelemetry = useCallback((): Telemetry => ({ keys: telemetry.current.keys }), []);

  const stats: EngineStats = useMemo(() => {
    const end = finishedAt ?? Date.now();
    const elapsedMs = started && startedAt ? end - startedAt : 0;
    const minutes = Math.max(elapsedMs / 60000, 1e-6);

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) correct++;
    }
    const errors = typed.length - correct;

    const wpm = started ? Math.round(correct / 5 / minutes) : 0;
    const rawWpm = started ? Math.round(typed.length / 5 / minutes) : 0;
    const accuracy = keystrokes.current.total
      ? Math.round((1 - keystrokes.current.incorrect / keystrokes.current.total) * 1000) / 10
      : 100;

    return {
      wpm,
      rawWpm,
      accuracy,
      errors,
      elapsedMs,
      progress: target.length ? typed.length / target.length : 0,
    };
  }, [typed, target, started, startedAt, finishedAt]);

  return { typed, started, finished, stats, handleKey, reset, getTelemetry };
}

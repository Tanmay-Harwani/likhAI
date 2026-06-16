import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CORPUS, DOMAINS, FORMATS, type Domain, type Format, type Snippet } from "./data/corpus";
import { useTypingEngine } from "./engine/useTypingEngine";
import { TypingArea } from "./components/TypingArea";
import { StatsBar, ResultCard } from "./components/Stats";
import { AuthPanel } from "./components/AuthPanel";
import { Leaderboard } from "./components/Leaderboard";
import { Home } from "./components/Home";
import { useAuth } from "./auth/AuthContext";
import { supabase } from "./lib/supabase";

type DomainFilter = Domain | "all";
type FormatFilter = Format | "all";
type View = "home" | "type" | "board";

function pickRandom(pool: Snippet[], excludeId?: string): Snippet {
  const candidates = pool.length > 1 ? pool.filter((s) => s.id !== excludeId) : pool;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export default function App() {
  const { user, profile, signOut } = useAuth();
  const [view, setView] = useState<View>("home");
  const [authOpen, setAuthOpen] = useState(false);
  const [domain, setDomain] = useState<DomainFilter>("all");
  const [format, setFormat] = useState<FormatFilter>("all");

  // Auto-close the auth panel once the user is fully signed in (has a profile).
  // Keeps it open during the username-claim step where !profile is true.
  useEffect(() => {
    if (user && profile) setAuthOpen(false);
  }, [user, profile]);

  // Corpus: bundled seed by default, live Supabase snippets when available.
  // This is what makes the content pipeline -> DB -> app loop work without
  // redeploying the frontend for every new snippet.
  const [corpus, setCorpus] = useState<Snippet[]>(CORPUS);
  useEffect(() => {
    supabase
      .from("snippets")
      .select("id, domain, format, concept, text")
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setCorpus(data as Snippet[]);
      });
  }, []);

  const pool = useMemo(() => {
    const filtered = corpus.filter(
      (s) => (domain === "all" || s.domain === domain) && (format === "all" || s.format === format)
    );
    return filtered.length > 0 ? filtered : corpus;
  }, [corpus, domain, format]);

  const emptyCombo = useMemo(
    () =>
      corpus.filter(
        (s) => (domain === "all" || s.domain === domain) && (format === "all" || s.format === format)
      ).length === 0,
    [corpus, domain, format]
  );

  const [snippet, setSnippet] = useState<Snippet>(() => pickRandom(CORPUS));

  const { typed, started, finished, stats, handleKey, reset, getTelemetry } = useTypingEngine(
    snippet.text
  );

  const nextSnippet = useCallback(() => {
    setSnippet((cur) => pickRandom(pool, cur.id));
  }, [pool]);

  useEffect(() => {
    setSnippet(pickRandom(pool));
  }, [pool]);

  // Save the result + telemetry once per finished run (signed-in users only)
  const savedRef = useRef(false);
  useEffect(() => {
    if (!finished) {
      savedRef.current = false;
      return;
    }
    if (savedRef.current || !user) return;
    savedRef.current = true;
    supabase
      .from("results")
      .insert({
        user_id: user.id,
        snippet_id: snippet.id,
        wpm: stats.wpm,
        raw_wpm: stats.rawWpm,
        accuracy: stats.accuracy,
        errors: stats.errors,
        duration_ms: stats.elapsedMs,
        telemetry: getTelemetry(),
      })
      .then(({ error }) => {
        if (error) console.warn("Failed to save result:", error.message);
      });
  }, [finished, user, snippet.id, stats, getTelemetry]);

  // Global keyboard routing. Ignores form fields; engine only on type view.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      if (view !== "type") return;
      if (e.key === "Tab") {
        e.preventDefault();
        nextSnippet();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        reset();
        return;
      }
      if (finished && e.key === "Enter") {
        e.preventDefault();
        nextSnippet();
        return;
      }
      handleKey(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey, finished, nextSnippet, reset, view]);

  const isProse = snippet.format === "theory" || snippet.format === "interview";
  const navBtn = (active: boolean) =>
    `px-3 py-1 rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
      active ? "text-saffron bg-surface" : "text-dim hover:text-fg"
    }`;

  return (
    <div className="min-h-screen bg-ink text-fg flex flex-col">
      <header className="max-w-[85%] w-full mx-auto px-6 pt-10 flex items-baseline gap-3 font-mono relative">
        <button
          onClick={() => setView("home")}
          className="text-2xl font-bold tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-saffron rounded"
          aria-label="likhAI home"
        >
          <span className="text-saffron">likh</span>AI
        </button>
        <nav className="ml-auto flex items-center gap-1 text-sm">
          <button className={navBtn(view === "type")} onClick={() => setView("type")}>
            type
          </button>
          <button className={navBtn(view === "board")} onClick={() => setView("board")}>
            leaderboard
          </button>
          {user && profile ? (
            <>
              <span className="text-saffron px-2">{profile.username}</span>
              <button className="text-dim hover:text-fg px-2" onClick={() => signOut()}>
                sign out
              </button>
            </>
          ) : (
            <button className={navBtn(authOpen)} onClick={() => setAuthOpen((v) => !v)}>
              sign in
            </button>
          )}
        </nav>
        {(authOpen || (user && !profile)) && (
          <div className="absolute right-6 top-full mt-2 z-50">
            <AuthPanel onClose={() => setAuthOpen(false)} />
          </div>
        )}
      </header>

      <main className="max-w-[85%] w-full mx-auto px-6 flex-1 flex flex-col gap-6 pt-[18vh] pb-12">
        {view === "home" && <Home onStart={() => setView("type")} onBoard={() => setView("board")} />}

        {view === "board" && <Leaderboard />}

        {view === "type" && (
          <>
            <div className="flex flex-col gap-1 font-mono text-sm">
              <div className="flex items-center gap-2 flex-wrap" aria-label="Filters">
                {DOMAINS.map((d) => (
                  <button key={d.id} onClick={() => setDomain(d.id)} className={navBtn(domain === d.id)}>
                    {d.label}
                  </button>
                ))}
                <span className="text-edge px-2">|</span>
                {FORMATS.map((f) => (
                  <button key={f.id} onClick={() => setFormat(f.id)} className={navBtn(format === f.id)}>
                    {f.label}
                  </button>
                ))}
              </div>
              {emptyCombo && (
                <span className="text-error text-xs pt-1">
                  No snippets for this combo yet, showing everything instead.
                </span>
              )}
            </div>

            <StatsBar stats={stats} live={started && !finished} />

            <div className="flex items-baseline gap-3">
              <h2 className="font-mono text-saffron text-lg font-medium">{snippet.concept}</h2>
              <span className="font-mono text-xs text-dim">
                {snippet.domain} / {snippet.format}
              </span>
            </div>

            {finished ? (
              <ResultCard stats={stats} onNext={nextSnippet} onRetry={reset} />
            ) : (
              <TypingArea target={snippet.text} typed={typed} finished={finished} justify={isProse} />
            )}
          </>
        )}
      </main>

      <footer className="max-w-[85%] w-full mx-auto px-6 pb-8 font-mono text-xs text-dim">
        {view === "type" && (
          <>
            tab — next snippet · esc — restart · start typing to begin
            {!user && <span> · sign in to save results</span>}
          </>
        )}
      </footer>
    </div>
  );
}

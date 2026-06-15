import { useState } from "react";
import { useAuth } from "../auth/AuthContext";

const inputCls =
  "bg-ink border border-edge rounded px-3 py-2 text-fg text-sm font-mono w-full focus:outline-none focus:border-saffron placeholder:text-dim/60";

export function AuthPanel({ onClose }: { onClose: () => void }) {
  const { user, profile, signIn, signUp, claimUsername } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<string | null>, successNotice?: string) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    const err = await fn();
    setBusy(false);
    if (err) setError(err);
    else if (successNotice) setNotice(successNotice);
  };

  // Signed in but no username yet -> claim it
  if (user && !profile) {
    return (
      <div className="border border-edge bg-surface rounded-lg p-5 font-mono text-sm max-w-sm">
        <div className="text-fg mb-3">Pick a username for the leaderboard</div>
        <input
          className={inputCls}
          placeholder="username (3-20 chars)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={20}
        />
        {error && <div className="text-error text-xs mt-2">{error}</div>}
        <button
          onClick={() => run(() => claimUsername(username))}
          disabled={busy}
          className="mt-3 px-4 py-2 rounded bg-saffron text-ink font-medium hover:brightness-110 disabled:opacity-50"
        >
          Claim
        </button>
      </div>
    );
  }

  if (user && profile) {
    return (
      <div className="border border-edge bg-surface rounded-lg p-5 font-mono text-sm max-w-sm">
        <div className="text-fg">
          Signed in as <span className="text-saffron">{profile.username}</span>
        </div>
        <button onClick={onClose} className="mt-3 px-4 py-2 rounded border border-edge text-dim hover:text-fg">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="border border-edge bg-surface rounded-lg p-5 font-mono text-sm max-w-sm flex flex-col gap-3">
      <div className="text-fg">Sign in to save results and rank on the leaderboard</div>
      <input
        className={inputCls}
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <input
        className={inputCls}
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      {error && <div className="text-error text-xs">{error}</div>}
      {notice && <div className="text-saffron text-xs">{notice}</div>}
      <div className="flex gap-2">
        <button
          onClick={() => run(() => signIn(email, password))}
          disabled={busy}
          className="px-4 py-2 rounded bg-saffron text-ink font-medium hover:brightness-110 disabled:opacity-50"
        >
          Sign in
        </button>
        <button
          onClick={() =>
            run(
              () => signUp(email, password),
              "Account created. If nothing happens, check your email for a confirmation link, then sign in."
            )
          }
          disabled={busy}
          className="px-4 py-2 rounded border border-edge text-dim hover:text-fg disabled:opacity-50"
        >
          Create account
        </button>
        <button onClick={onClose} className="ml-auto px-3 py-2 text-dim hover:text-fg">
          ×
        </button>
      </div>
    </div>
  );
}

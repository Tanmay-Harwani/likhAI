import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export interface Profile {
  id: string;
  username: string;
}

interface AuthCtx {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  claimUsername: (username: string) => Promise<string | null>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Load (or clear) the profile whenever the session changes
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      setProfile(null);
      return;
    }
    supabase
      .from("profiles")
      .select("id, username")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => setProfile(data ?? null));
  }, [session]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? error.message : null;
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    return error ? error.message : null;
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const claimUsername = useCallback(
    async (username: string) => {
      const userId = session?.user?.id;
      if (!userId) return "Not signed in.";
      const clean = username.trim();
      if (clean.length < 3 || clean.length > 20) return "Username must be 3-20 characters.";
      const { error } = await supabase.from("profiles").insert({ id: userId, username: clean });
      if (error) {
        return error.code === "23505" ? "Username already taken." : error.message;
      }
      setProfile({ id: userId, username: clean });
      return null;
    },
    [session]
  );

  return (
    <Ctx.Provider
      value={{ user: session?.user ?? null, profile, loading, signIn, signUp, signOut, claimUsername }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

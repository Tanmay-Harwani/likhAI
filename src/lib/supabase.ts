import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  console.warn("Supabase env vars missing. Auth and leaderboard are disabled.");
}

export const supabase = createClient(url ?? "", anonKey ?? "");

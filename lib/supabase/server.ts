import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ServerClientOptions = {
  /** Use service role only in trusted server routes — never ship to the browser. */
  serviceRole?: boolean;
};

/**
 * Server Supabase client (RSC, Route Handlers, Server Actions).
 * Prefer the anon key for public reads; service role only for admin paths.
 */
export function createServerClient(
  opts: ServerClientOptions = {}
): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = opts.serviceRole
    ? process.env.SUPABASE_SERVICE_ROLE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      opts.serviceRole
        ? "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
        : "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

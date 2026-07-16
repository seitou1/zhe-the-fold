import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type ServerClientOptions = {
  /** Use service role only in trusted server routes — never ship to the browser. */
  serviceRole?: boolean;
};

function isPlaceholderUrl(url: string) {
  return (
    !url ||
    url.includes("YOUR_PROJECT") ||
    url.includes("placeholder") ||
    url === "https://YOUR_PROJECT.supabase.co"
  );
}

/**
 * Server Supabase client when env is configured.
 * Returns null if keys are missing/placeholder so craft fallback can run.
 */
export function tryCreateServerClient(
  opts: ServerClientOptions = {}
): SupabaseClient | null {
  // Trim — Vercel/TextEdit often leave trailing newlines or spaces
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const key = (
    opts.serviceRole
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key || isPlaceholderUrl(url)) return null;

  // New publishable keys (sb_publishable_…) are not JWTs. Avoid forcing
  // them into Authorization the way legacy anon JWTs expect.
  const isLegacyJwt = key.startsWith("eyJ");

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: isLegacyJwt
      ? undefined
      : {
          headers: {
            apikey: key,
          },
        },
  });
}

/**
 * Server Supabase client (RSC, Route Handlers, Server Actions).
 * Prefer the anon key for public reads; service role only for admin paths.
 * @throws if env is missing — use tryCreateServerClient for optional reads.
 */
export function createServerClient(
  opts: ServerClientOptions = {}
): SupabaseClient {
  const client = tryCreateServerClient(opts);
  if (!client) {
    throw new Error(
      opts.serviceRole
        ? "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
        : "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
  return client;
}

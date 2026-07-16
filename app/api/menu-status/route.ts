import { getMenuItemsWithSource } from "@/lib/data/menu";
import { normalizeSupabaseUrl } from "@/lib/supabase/server";

/**
 * Diagnostic: is the menu coming from Supabase or static fallback?
 * Open /api/menu-status on local or live (no secrets returned).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { items, source, reason, errorCode, rawRowCount } =
    await getMenuItemsWithSource();
  const pork = items.find((i) => i.id === "pork");
  const first = items[0];

  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const url = normalizeSupabaseUrl(rawUrl);
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

  // Project ref from URL only (safe) — compare to Supabase dashboard URL
  let projectRef: string | null = null;
  try {
    projectRef = url ? new URL(url).hostname.split(".")[0] ?? null : null;
  } catch {
    projectRef = null;
  }

  // Raw REST probe — surfaces RLS / 401 / missing table without secrets
  let rest: {
    httpStatus: number | null;
    bodyPreview: string | null;
    requestPath: string | null;
  } = { httpStatus: null, bodyPreview: null, requestPath: null };

  if (url && key) {
    try {
      // Legacy JWT anon keys need Bearer; new sb_publishable_ keys prefer apikey only.
      const headers: Record<string, string> = { apikey: key };
      if (key.startsWith("eyJ")) {
        headers.Authorization = `Bearer ${key}`;
      }
      const requestPath = `${url}/rest/v1/menu_items?select=id,price,published&limit=3`;
      const res = await fetch(requestPath, {
        headers,
        cache: "no-store",
      });
      const text = await res.text();
      rest = {
        httpStatus: res.status,
        bodyPreview: text.slice(0, 240),
        requestPath: `${url}/rest/v1/menu_items`,
      };
    } catch (e) {
      rest = {
        httpStatus: null,
        bodyPreview: e instanceof Error ? e.message : "fetch_failed",
        requestPath: `${url}/rest/v1/menu_items`,
      };
    }
  }

  return Response.json({
    source,
    reason: reason ?? null,
    errorCode: errorCode ?? null,
    rawRowCount: rawRowCount ?? null,
    count: items.length,
    porkPrice: pork?.price ?? null,
    firstItem: first
      ? { id: first.id, en: first.en, price: first.price }
      : null,
    env: {
      hasUrl: Boolean(url),
      hasAnonKey: Boolean(key),
      urlLooksPlaceholder: url.includes("YOUR_PROJECT"),
      projectRef,
      anonKeyPrefix: key.slice(0, 14),
      // true if someone pasted …/rest/v1 into the env var
      rawUrlHadRestPath: /\/rest\/v1/i.test(rawUrl),
    },
    rest,
  });
}

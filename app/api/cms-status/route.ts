import { getMenuItemsWithSource } from "@/lib/data/menu";
import { getSiteOpsWithSource } from "@/lib/data/site";
import { getStoryChaptersWithSource } from "@/lib/data/story";
import { normalizeSupabaseUrl } from "@/lib/supabase/server";

/**
 * CMS health — menu, story, site_settings sources (no secrets).
 * Open /api/cms-status on local or live.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const [menu, story, siteOps] = await Promise.all([
    getMenuItemsWithSource(),
    getStoryChaptersWithSource(),
    getSiteOpsWithSource(),
  ]);

  const rawUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
  const url = normalizeSupabaseUrl(rawUrl);
  let projectRef: string | null = null;
  try {
    projectRef = url ? new URL(url).hostname.split(".")[0] ?? null : null;
  } catch {
    projectRef = null;
  }

  return Response.json({
    menu: {
      source: menu.source,
      reason: menu.reason ?? null,
      count: menu.items.length,
      porkPrice: menu.items.find((i) => i.id === "pork")?.price ?? null,
    },
    story: {
      source: story.source,
      reason: story.reason ?? null,
      count: story.chapters.length,
      labels: story.chapters.map((c) => c.label),
    },
    site: {
      source: siteOps.source,
      reason: siteOps.reason ?? null,
      heroLine: siteOps.ops.heroLine,
      telephoneDisplay: siteOps.ops.telephoneDisplay,
    },
    env: {
      hasUrl: Boolean(url),
      hasAnonKey: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
      ),
      projectRef,
      rawUrlHadRestPath: /\/rest\/v1/i.test(rawUrl),
    },
  });
}

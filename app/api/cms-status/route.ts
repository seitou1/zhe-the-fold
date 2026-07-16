import { getMenuItemsWithSource } from "@/lib/data/menu";
import { getSiteOpsWithSource } from "@/lib/data/site";
import { getStoryChaptersWithSource } from "@/lib/data/story";
import { normalizeSupabaseUrl } from "@/lib/supabase/server";

/**
 * CMS health — menu, story, split site tables (no secrets).
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
      slices: siteOps.slices ?? null,
      heroLine: siteOps.ops.heroLine,
      telephoneDisplay: siteOps.ops.telephoneDisplay,
      actions: {
        directions: siteOps.ops.actionDirections,
        call: siteOps.ops.actionCall,
        reserve: siteOps.ops.actionReserve,
        reserveNav: siteOps.ops.actionReserveNav,
      },
      brand: siteOps.ops.name,
      nav: [
        siteOps.ops.navStory,
        siteOps.ops.navMenu,
        siteOps.ops.navVisit,
      ],
      hours: {
        timeZone: siteOps.ops.hours.timeZone,
        closedWeekdays: siteOps.ops.hours.closedWeekdays,
        note: siteOps.ops.hours.note,
        periodCount: siteOps.ops.hours.periods.length,
        periods: siteOps.ops.hours.periods,
      },
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

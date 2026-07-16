/**
 * Full site ops CMS — Supabase site_settings or static lib/site.ts.
 */

import { cache } from "react";
import {
  siteOpsFromStaticFallback,
  type HoursConfig,
  type HoursPeriod,
  type SiteOps,
} from "@/lib/data/site-static";
import { tryCreateServerClient } from "@/lib/supabase/server";

export type {
  HoursConfig,
  HoursPeriod,
  KitchenCopy,
  SiteOps,
} from "@/lib/data/site-types";
export type SiteSource = "supabase" | "static";

export { siteOpsFromStaticFallback };
export {
  opsAddressLines,
  opsHomeAriaLabel,
  opsMapsUrl,
  opsNavItems,
  opsReserveMailto,
  opsSiteTitle,
  opsTelHref,
} from "@/lib/data/site-helpers";

type Row = Record<string, unknown>;

function str(row: Row, key: string, fallback: string): string {
  const v = row[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

function parseHours(row: Row, fallback: HoursConfig): HoursConfig {
  const periodsRaw = row.hours_periods;
  let periods = fallback.periods;
  if (typeof periodsRaw === "string" && periodsRaw.trim()) {
    try {
      const parsed = JSON.parse(periodsRaw) as HoursPeriod[];
      if (Array.isArray(parsed) && parsed.length) periods = parsed;
    } catch {
      /* keep fallback */
    }
  } else if (Array.isArray(periodsRaw) && periodsRaw.length) {
    periods = periodsRaw as HoursPeriod[];
  }

  const closedRaw = row.hours_closed_weekdays;
  let closedWeekdays = fallback.closedWeekdays;
  if (typeof closedRaw === "string" && closedRaw.trim()) {
    closedWeekdays = closedRaw
      .split(/[,|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (Array.isArray(closedRaw)) {
    closedWeekdays = (closedRaw as string[]).map(String);
  }

  return {
    timeZone: str(row, "hours_timezone", fallback.timeZone),
    closedWeekdays,
    note: str(row, "hours_note", fallback.note),
    periods,
  };
}

function rowToOps(row: Row): SiteOps {
  const f = siteOpsFromStaticFallback();
  return {
    name: str(row, "brand_name", f.name),
    nameCn: str(row, "brand_name_cn", f.nameCn),
    shortName: str(row, "brand_short", f.shortName),
    city: str(row, "city", f.city),
    description: str(row, "seo_description", f.description),
    titleSuffix: str(row, "seo_title_suffix", f.titleSuffix),

    email: str(row, "email", f.email),
    telephone: str(row, "telephone", f.telephone),
    telephoneDisplay: str(row, "telephone_display", f.telephoneDisplay),
    address: {
      streetAddress: str(row, "street_address", f.address.streetAddress),
      addressLocality: str(row, "address_locality", f.address.addressLocality),
      addressRegion: str(row, "address_region", f.address.addressRegion),
      postalCode: str(row, "postal_code", f.address.postalCode),
      addressCountry: str(row, "address_country", f.address.addressCountry),
    },
    mapsQuery: str(row, "maps_query", f.mapsQuery),
    reserveSubject: str(row, "reserve_subject", f.reserveSubject),

    heroLine: str(row, "hero_line", f.heroLine),
    menuNote: str(row, "menu_note", f.menuNote),

    instagram: str(row, "instagram_url", f.instagram),
    instagramLabel: str(row, "instagram_label", f.instagramLabel),

    serviceKicker: str(row, "service_kicker", f.serviceKicker),
    modeTableLabel: str(row, "mode_table_label", f.modeTableLabel),
    modeTakeoutLabel: str(row, "mode_takeout_label", f.modeTakeoutLabel),
    tableDetail: str(row, "table_detail", f.tableDetail),
    takeoutDetail: str(row, "takeout_detail", f.takeoutDetail),

    actionDirections: str(row, "action_directions", f.actionDirections),
    actionCall: str(row, "action_call", f.actionCall),
    actionReserve: str(row, "action_reserve", f.actionReserve),
    actionReserveNav: str(row, "action_reserve_nav", f.actionReserveNav),

    visitFindUs: str(row, "visit_find_us", f.visitFindUs),
    visitHoursLabel: str(row, "visit_hours_label", f.visitHoursLabel),

    sectionStoryEn: str(row, "section_story_en", f.sectionStoryEn),
    sectionStoryCn: str(row, "section_story_cn", f.sectionStoryCn),
    sectionMenuEn: str(row, "section_menu_en", f.sectionMenuEn),
    sectionMenuCn: str(row, "section_menu_cn", f.sectionMenuCn),
    sectionVisitEn: str(row, "section_visit_en", f.sectionVisitEn),
    sectionVisitCn: str(row, "section_visit_cn", f.sectionVisitCn),
    storyChaptersAria: str(row, "story_chapters_aria", f.storyChaptersAria),
    dishesAria: str(row, "dishes_aria", f.dishesAria),

    navStory: str(row, "nav_story", f.navStory),
    navMenu: str(row, "nav_menu", f.navMenu),
    navVisit: str(row, "nav_visit", f.navVisit),
    navPrimaryAria: str(row, "nav_primary_aria", f.navPrimaryAria),

    menuMetaHouse: str(row, "menu_meta_house", f.menuMetaHouse),
    menuMetaShellfish: str(row, "menu_meta_shellfish", f.menuMetaShellfish),

    footerTag: str(row, "footer_tag", f.footerTag),
    footerRights: str(row, "footer_rights", f.footerRights),
    skipToMenu: str(row, "skip_to_menu", f.skipToMenu),
    skipToMenuHref: str(row, "skip_to_menu_href", f.skipToMenuHref),
    homeAriaSuffix: str(row, "home_aria_suffix", f.homeAriaSuffix),

    hours: parseHours(row, f.hours),
    kitchen: {
      open: str(row, "kitchen_open", f.kitchen.open),
      until: str(row, "kitchen_until", f.kitchen.until),
      opens: str(row, "kitchen_opens", f.kitchen.opens),
      seeVisit: str(row, "kitchen_see_visit", f.kitchen.seeVisit),
      closedPrefix: str(row, "kitchen_closed_prefix", f.kitchen.closedPrefix),
      daily: str(row, "kitchen_daily", f.kitchen.daily),
      easternTime: str(row, "kitchen_eastern", f.kitchen.easternTime),
      titleOpenPrefix: str(row, "kitchen_title_open", f.kitchen.titleOpenPrefix),
      titleClosedPrefix: str(
        row,
        "kitchen_title_closed",
        f.kitchen.titleClosedPrefix
      ),
    },
  };
}

async function fetchSiteOpsUncached(): Promise<{
  ops: SiteOps;
  source: SiteSource;
  reason?: string;
}> {
  const fallback = siteOpsFromStaticFallback();
  const client = tryCreateServerClient();
  if (!client) {
    return { ops: fallback, source: "static", reason: "no_client" };
  }

  try {
    const { data, error } = await client
      .from("site_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    if (error) {
      console.warn("[site] Supabase read failed:", error.message);
      return {
        ops: fallback,
        source: "static",
        reason: `supabase_error: ${error.message}`,
      };
    }

    if (!data) {
      return {
        ops: fallback,
        source: "static",
        reason: "supabase_empty",
      };
    }

    return {
      ops: rowToOps(data as Row),
      source: "supabase",
      reason: "ok",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[site] unexpected:", err);
    return {
      ops: fallback,
      source: "static",
      reason: `unexpected: ${message}`,
    };
  }
}

export const getSiteOpsWithSource = cache(fetchSiteOpsUncached);

export const getSiteOps = cache(async (): Promise<SiteOps> => {
  const { ops } = await getSiteOpsWithSource();
  return ops;
});

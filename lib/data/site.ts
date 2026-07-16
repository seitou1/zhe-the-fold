/**
 * Site ops CMS — merges site_hours + site_contact + site_copy.
 * Falls back to static lib/site.ts per slice if a table is missing/empty.
 * Legacy site_settings still used only if split tables are all unavailable.
 */

import { cache } from "react";
import { siteOpsFromStaticFallback } from "@/lib/data/site-static";
import type {
  HoursConfig,
  HoursPeriod,
  KitchenCopy,
  SiteOps,
} from "@/lib/data/site-types";
import { tryCreateServerClient } from "@/lib/supabase/server";

export type {
  HoursConfig,
  HoursPeriod,
  KitchenCopy,
  SiteOps,
} from "@/lib/data/site-types";

export type SiteSource = "supabase" | "static" | "mixed";
export type SliceSource = "supabase" | "static";

export { siteOpsFromStaticFallback };

type Row = Record<string, unknown>;

function str(row: Row | null | undefined, key: string, fallback: string): string {
  if (!row) return fallback;
  const v = row[key];
  if (typeof v === "string" && v.trim()) return v.trim();
  return fallback;
}

function parseClosedWeekdays(raw: unknown, fallback: string[]): string[] {
  if (typeof raw === "string" && raw.trim()) {
    return raw
      .split(/[,|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(raw)) return raw.map(String);
  return fallback;
}

function parsePeriods(raw: unknown, fallback: HoursPeriod[]): HoursPeriod[] {
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as HoursPeriod[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      /* keep fallback */
    }
  }
  if (Array.isArray(raw) && raw.length) return raw as HoursPeriod[];
  return fallback;
}

function hoursFromRow(row: Row | null, fallback: HoursConfig): HoursConfig {
  if (!row) return fallback;
  return {
    timeZone: str(row, "timezone", fallback.timeZone),
    closedWeekdays: parseClosedWeekdays(
      row.closed_weekdays,
      fallback.closedWeekdays
    ),
    note: str(row, "note", fallback.note),
    periods: parsePeriods(row.periods, fallback.periods),
  };
}

function kitchenFromRow(row: Row | null, fallback: KitchenCopy): KitchenCopy {
  if (!row) return fallback;
  return {
    open: str(row, "kitchen_open", fallback.open),
    until: str(row, "kitchen_until", fallback.until),
    opens: str(row, "kitchen_opens", fallback.opens),
    seeVisit: str(row, "kitchen_see_visit", fallback.seeVisit),
    closedPrefix: str(row, "kitchen_closed_prefix", fallback.closedPrefix),
    daily: str(row, "kitchen_daily", fallback.daily),
    easternTime: str(row, "kitchen_eastern", fallback.easternTime),
    titleOpenPrefix: str(row, "kitchen_title_open", fallback.titleOpenPrefix),
    titleClosedPrefix: str(
      row,
      "kitchen_title_closed",
      fallback.titleClosedPrefix
    ),
  };
}

function mergeOps(
  fallback: SiteOps,
  hoursRow: Row | null,
  contactRow: Row | null,
  copyRow: Row | null
): SiteOps {
  const c = contactRow;
  const p = copyRow;
  return {
    name: str(p, "brand_name", fallback.name),
    nameCn: str(p, "brand_name_cn", fallback.nameCn),
    shortName: str(p, "brand_short", fallback.shortName),
    city: str(p, "city", fallback.city),
    description: str(p, "seo_description", fallback.description),
    titleSuffix: str(p, "seo_title_suffix", fallback.titleSuffix),

    email: str(c, "email", fallback.email),
    telephone: str(c, "telephone", fallback.telephone),
    telephoneDisplay: str(c, "telephone_display", fallback.telephoneDisplay),
    address: {
      streetAddress: str(c, "street_address", fallback.address.streetAddress),
      addressLocality: str(
        c,
        "address_locality",
        fallback.address.addressLocality
      ),
      addressRegion: str(c, "address_region", fallback.address.addressRegion),
      postalCode: str(c, "postal_code", fallback.address.postalCode),
      addressCountry: str(
        c,
        "address_country",
        fallback.address.addressCountry
      ),
    },
    mapsQuery: str(c, "maps_query", fallback.mapsQuery),
    reserveSubject: str(c, "reserve_subject", fallback.reserveSubject),

    heroLine: str(p, "hero_line", fallback.heroLine),
    menuNote: str(p, "menu_note", fallback.menuNote),

    instagram: str(c, "instagram_url", fallback.instagram),
    instagramLabel: str(c, "instagram_label", fallback.instagramLabel),

    serviceKicker: str(p, "service_kicker", fallback.serviceKicker),
    modeTableLabel: str(p, "mode_table_label", fallback.modeTableLabel),
    modeTakeoutLabel: str(p, "mode_takeout_label", fallback.modeTakeoutLabel),
    tableDetail: str(p, "table_detail", fallback.tableDetail),
    takeoutDetail: str(p, "takeout_detail", fallback.takeoutDetail),

    actionDirections: str(p, "action_directions", fallback.actionDirections),
    actionCall: str(p, "action_call", fallback.actionCall),
    actionReserve: str(p, "action_reserve", fallback.actionReserve),
    actionReserveNav: str(p, "action_reserve_nav", fallback.actionReserveNav),

    visitFindUs: str(p, "visit_find_us", fallback.visitFindUs),
    visitHoursLabel: str(p, "visit_hours_label", fallback.visitHoursLabel),

    sectionStoryEn: str(p, "section_story_en", fallback.sectionStoryEn),
    sectionStoryCn: str(p, "section_story_cn", fallback.sectionStoryCn),
    sectionMenuEn: str(p, "section_menu_en", fallback.sectionMenuEn),
    sectionMenuCn: str(p, "section_menu_cn", fallback.sectionMenuCn),
    sectionVisitEn: str(p, "section_visit_en", fallback.sectionVisitEn),
    sectionVisitCn: str(p, "section_visit_cn", fallback.sectionVisitCn),
    storyChaptersAria: fallback.storyChaptersAria,
    dishesAria: fallback.dishesAria,

    navStory: str(p, "nav_story", fallback.navStory),
    navMenu: str(p, "nav_menu", fallback.navMenu),
    navVisit: str(p, "nav_visit", fallback.navVisit),
    navPrimaryAria: fallback.navPrimaryAria,

    menuMetaHouse: str(p, "menu_meta_house", fallback.menuMetaHouse),
    menuMetaShellfish: str(p, "menu_meta_shellfish", fallback.menuMetaShellfish),

    footerTag: str(p, "footer_tag", fallback.footerTag),
    footerRights: str(p, "footer_rights", fallback.footerRights),
    skipToMenu: str(p, "skip_to_menu", fallback.skipToMenu),
    skipToMenuHref: fallback.skipToMenuHref,
    homeAriaSuffix: fallback.homeAriaSuffix,

    hours: hoursFromRow(hoursRow, fallback.hours),
    kitchen: kitchenFromRow(hoursRow, fallback.kitchen),
  };
}

/** Legacy single-row site_settings (pre-split). */
function legacyRowToOps(row: Row): SiteOps {
  const f = siteOpsFromStaticFallback();
  const hoursFallback = f.hours;
  const hours: HoursConfig = {
    timeZone: str(row, "hours_timezone", hoursFallback.timeZone),
    closedWeekdays: parseClosedWeekdays(
      row.hours_closed_weekdays,
      hoursFallback.closedWeekdays
    ),
    note: str(row, "hours_note", hoursFallback.note),
    periods: parsePeriods(row.hours_periods, hoursFallback.periods),
  };
  return {
    ...mergeOps(f, null, row, row),
    hours,
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

async function fetchSlice(
  client: NonNullable<ReturnType<typeof tryCreateServerClient>>,
  table: string
): Promise<{ row: Row | null; source: SliceSource; reason?: string }> {
  try {
    const { data, error } = await client
      .from(table)
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (error) {
      return {
        row: null,
        source: "static",
        reason: `${table}: ${error.message}`,
      };
    }
    if (!data) {
      return { row: null, source: "static", reason: `${table}: empty` };
    }
    return { row: data as Row, source: "supabase" };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { row: null, source: "static", reason: `${table}: ${message}` };
  }
}

async function fetchSiteOpsUncached(): Promise<{
  ops: SiteOps;
  source: SiteSource;
  reason?: string;
  slices?: {
    hours: SliceSource;
    contact: SliceSource;
    copy: SliceSource;
  };
}> {
  const fallback = siteOpsFromStaticFallback();
  const client = tryCreateServerClient();
  if (!client) {
    return { ops: fallback, source: "static", reason: "no_client" };
  }

  try {
    const [hours, contact, copy] = await Promise.all([
      fetchSlice(client, "site_hours"),
      fetchSlice(client, "site_contact"),
      fetchSlice(client, "site_copy"),
    ]);

    const anySplit =
      hours.source === "supabase" ||
      contact.source === "supabase" ||
      copy.source === "supabase";

    if (anySplit) {
      const ops = mergeOps(fallback, hours.row, contact.row, copy.row);
      const all =
        hours.source === "supabase" &&
        contact.source === "supabase" &&
        copy.source === "supabase";
      return {
        ops,
        source: all ? "supabase" : "mixed",
        reason: all
          ? "ok"
          : [hours.reason, contact.reason, copy.reason]
              .filter(Boolean)
              .join("; ") || "partial",
        slices: {
          hours: hours.source,
          contact: contact.source,
          copy: copy.source,
        },
      };
    }

    // Split tables missing — try legacy site_settings
    const legacy = await fetchSlice(client, "site_settings");
    if (legacy.row) {
      return {
        ops: legacyRowToOps(legacy.row),
        source: "supabase",
        reason: "legacy_site_settings",
        slices: {
          hours: "static",
          contact: "supabase",
          copy: "supabase",
        },
      };
    }

    return {
      ops: fallback,
      source: "static",
      reason:
        [hours.reason, contact.reason, copy.reason, legacy.reason]
          .filter(Boolean)
          .join("; ") || "empty",
      slices: {
        hours: "static",
        contact: "static",
        copy: "static",
      },
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

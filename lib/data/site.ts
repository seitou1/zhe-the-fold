/**
 * Site ops (contact / NAP / visit hybrid strings).
 * Supabase site_settings row, else lib/site.ts.
 */

import { site } from "@/lib/site";
import { tryCreateServerClient } from "@/lib/supabase/server";

export type SiteSource = "supabase" | "static";

/** Guest-facing ops fields that Table Editor can change. */
export type SiteOps = {
  email: string;
  telephone: string;
  telephoneDisplay: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  mapsQuery: string;
  reserveSubject: string;
  heroLine: string;
  menuNote: string;
  instagram: string;
  instagramLabel: string;
  serviceKicker: string;
  tableDetail: string;
  takeoutDetail: string;
};

type SiteSettingsRow = {
  email: string;
  telephone: string;
  telephone_display: string;
  street_address: string;
  address_locality: string;
  address_region: string;
  postal_code: string;
  address_country: string;
  maps_query: string;
  reserve_subject: string;
  hero_line: string;
  menu_note: string;
  instagram_url: string;
  instagram_label: string;
  service_kicker: string;
  table_detail: string;
  takeout_detail: string;
};

export function siteOpsFromStatic(): SiteOps {
  const table = site.service.modes.find((m) => m.id === "table");
  const takeout = site.service.modes.find((m) => m.id === "takeout");
  return {
    email: site.email,
    telephone: site.telephone,
    telephoneDisplay: site.telephoneDisplay,
    address: {
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      postalCode: site.address.postalCode,
      addressCountry: site.address.addressCountry,
    },
    mapsQuery: site.mapsQuery,
    reserveSubject: site.reserveSubject,
    heroLine: site.heroLine,
    menuNote: site.menu.note,
    instagram: site.social.instagram,
    instagramLabel: site.social.instagramLabel,
    serviceKicker: site.service.kicker,
    tableDetail: table?.detail ?? "",
    takeoutDetail: takeout?.detail ?? "",
  };
}

function rowToOps(row: SiteSettingsRow): SiteOps {
  return {
    email: row.email,
    telephone: row.telephone,
    telephoneDisplay: row.telephone_display,
    address: {
      streetAddress: row.street_address,
      addressLocality: row.address_locality,
      addressRegion: row.address_region,
      postalCode: row.postal_code,
      addressCountry: row.address_country,
    },
    mapsQuery: row.maps_query,
    reserveSubject: row.reserve_subject,
    heroLine: row.hero_line,
    menuNote: row.menu_note,
    instagram: row.instagram_url,
    instagramLabel: row.instagram_label,
    serviceKicker: row.service_kicker,
    tableDetail: row.table_detail,
    takeoutDetail: row.takeout_detail,
  };
}

export function opsAddressLines(ops: SiteOps): string[] {
  const a = ops.address;
  return [
    a.streetAddress,
    `${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`,
  ];
}

export function opsMapsUrl(ops: SiteOps): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ops.mapsQuery
  )}`;
}

export function opsTelHref(ops: SiteOps): string {
  return `tel:${ops.telephone}`;
}

export function opsReserveMailto(ops: SiteOps): string {
  const subject = encodeURIComponent(ops.reserveSubject);
  return `mailto:${ops.email}?subject=${subject}`;
}

export async function getSiteOps(): Promise<SiteOps> {
  const { ops } = await getSiteOpsWithSource();
  return ops;
}

export async function getSiteOpsWithSource(): Promise<{
  ops: SiteOps;
  source: SiteSource;
  reason?: string;
}> {
  const fallback = siteOpsFromStatic();
  const client = tryCreateServerClient();
  if (!client) {
    return { ops: fallback, source: "static", reason: "no_client" };
  }

  try {
    const { data, error } = await client
      .from("site_settings")
      .select(
        "email, telephone, telephone_display, street_address, address_locality, address_region, postal_code, address_country, maps_query, reserve_subject, hero_line, menu_note, instagram_url, instagram_label, service_kicker, table_detail, takeout_detail"
      )
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
      ops: rowToOps(data as SiteSettingsRow),
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

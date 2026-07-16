/**
 * Menu data access — Supabase when configured, else static lib/menu.ts.
 * Components never talk to Supabase directly.
 */

import {
  MENU_CATEGORY_ORDER,
  MENU_ITEMS,
  type MenuCategory,
  type MenuItem,
} from "@/lib/menu";
import { tryCreateServerClient } from "@/lib/supabase/server";

export type MenuSource = "supabase" | "static";

type MenuItemRow = {
  id: string;
  category: string;
  cat_label: string;
  en: string;
  rail: string;
  cn: string;
  description: string;
  price: string;
  popular: boolean | null;
  tags: string[] | null;
  image: string;
  position: string | null;
  position_mobile: string | null;
  sort_order: number | null;
};

function isMenuCategory(v: string): v is MenuCategory {
  return (MENU_CATEGORY_ORDER as readonly string[]).includes(v);
}

function rowToItem(row: MenuItemRow): MenuItem | null {
  if (!isMenuCategory(row.category)) return null;
  return {
    id: row.id,
    category: row.category,
    catLabel: row.cat_label,
    en: row.en,
    rail: row.rail,
    cn: row.cn,
    desc: row.description,
    price: row.price,
    popular: Boolean(row.popular) || undefined,
    tags: row.tags ?? [],
    image: row.image,
    position: row.position ?? undefined,
    positionMobile: row.position_mobile ?? undefined,
  };
}

function sortByChapter(items: MenuItem[]): MenuItem[] {
  const rank = new Map(MENU_CATEGORY_ORDER.map((c, i) => [c, i]));
  return [...items].sort((a, b) => {
    const ca = rank.get(a.category) ?? 99;
    const cb = rank.get(b.category) ?? 99;
    return ca - cb;
  });
}

/**
 * Published menu dishes for the site.
 * Falls back to MENU_ITEMS if Supabase is unset, errors, or returns empty.
 */
export async function getMenuItems(): Promise<MenuItem[]> {
  const { items } = await getMenuItemsWithSource();
  return items;
}

export type MenuFetchMeta = {
  items: MenuItem[];
  source: MenuSource;
  /** Why static was used — safe for diagnostics (no secrets). */
  reason?: string;
  /** Supabase error code when present */
  errorCode?: string;
  rawRowCount?: number;
};

export async function getMenuItemsWithSource(): Promise<MenuFetchMeta> {
  const client = tryCreateServerClient();
  if (!client) {
    return {
      items: MENU_ITEMS,
      source: "static",
      reason: "no_client_missing_or_placeholder_env",
    };
  }

  try {
    const { data, error } = await client
      .from("menu_items")
      .select(
        "id, category, cat_label, en, rail, cn, description, price, popular, tags, image, position, position_mobile, sort_order"
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn(
        "[menu] Supabase read failed, using static fallback:",
        error.message
      );
      return {
        items: MENU_ITEMS,
        source: "static",
        reason: `supabase_error: ${error.message}`,
        errorCode: error.code,
      };
    }

    if (!data?.length) {
      console.warn("[menu] Supabase empty, using static fallback");
      return {
        items: MENU_ITEMS,
        source: "static",
        reason: "supabase_empty_no_published_rows",
        rawRowCount: 0,
      };
    }

    const items = sortByChapter(
      data
        .map((row) => rowToItem(row as MenuItemRow))
        .filter((item): item is MenuItem => item !== null)
    );

    if (!items.length) {
      console.warn("[menu] Supabase rows invalid, using static fallback");
      return {
        items: MENU_ITEMS,
        source: "static",
        reason: "supabase_rows_failed_validation",
        rawRowCount: data.length,
      };
    }

    return {
      items,
      source: "supabase",
      reason: "ok",
      rawRowCount: data.length,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      "[menu] Supabase unexpected error, using static fallback:",
      err
    );
    return {
      items: MENU_ITEMS,
      source: "static",
      reason: `unexpected: ${message}`,
    };
  }
}

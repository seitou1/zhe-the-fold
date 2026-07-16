import { getMenuItemsWithSource } from "@/lib/data/menu";

/**
 * Diagnostic: is the menu coming from Supabase or static fallback?
 * Open /api/menu-status on local or live (no secrets returned).
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const { items, source } = await getMenuItemsWithSource();
  const pork = items.find((i) => i.id === "pork");

  return Response.json({
    source,
    count: items.length,
    porkPrice: pork?.price ?? null,
    env: {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
      hasAnonKey: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
      urlLooksPlaceholder: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("YOUR_PROJECT")
      ),
    },
  });
}

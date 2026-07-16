/**
 * Story data access — Supabase when configured, else static lib/story.ts.
 */

import { STORY_CHAPTERS, type StoryChapter } from "@/lib/story";
import { tryCreateServerClient } from "@/lib/supabase/server";

export type StorySource = "supabase" | "static";

type StoryRow = {
  id: string;
  label: string;
  short: string;
  body: string;
  image: string;
  position: string | null;
  position_mobile: string | null;
  sort_order: number | null;
};

function rowToChapter(row: StoryRow): StoryChapter {
  return {
    id: row.id,
    label: row.label,
    short: row.short,
    body: row.body,
    image: row.image,
    position: row.position ?? "center 42%",
    positionMobile: row.position_mobile ?? undefined,
  };
}

export async function getStoryChapters(): Promise<StoryChapter[]> {
  const { chapters } = await getStoryChaptersWithSource();
  return chapters;
}

export async function getStoryChaptersWithSource(): Promise<{
  chapters: StoryChapter[];
  source: StorySource;
  reason?: string;
}> {
  const client = tryCreateServerClient();
  if (!client) {
    return {
      chapters: STORY_CHAPTERS,
      source: "static",
      reason: "no_client",
    };
  }

  try {
    const { data, error } = await client
      .from("story_chapters")
      .select(
        "id, label, short, body, image, position, position_mobile, sort_order"
      )
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[story] Supabase read failed:", error.message);
      return {
        chapters: STORY_CHAPTERS,
        source: "static",
        reason: `supabase_error: ${error.message}`,
      };
    }

    if (!data?.length) {
      return {
        chapters: STORY_CHAPTERS,
        source: "static",
        reason: "supabase_empty",
      };
    }

    return {
      chapters: data.map((row) => rowToChapter(row as StoryRow)),
      source: "supabase",
      reason: "ok",
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[story] unexpected:", err);
    return {
      chapters: STORY_CHAPTERS,
      source: "static",
      reason: `unexpected: ${message}`,
    };
  }
}

/**
 * Story chapters SSOT — place-first labels, craft-archive stills.
 * Images: village / fold / city (restored from Zhe-The-Fold-Website).
 *
 * Wall crops: `position` = desktop; `positionMobile` = phone cover.
 */

export type StoryChapter = {
  id: string;
  label: string;
  short: string;
  body: string;
  image: string;
  /** object-position for desktop / wide panels */
  position: string;
  /** object-position for phone portrait cover */
  positionMobile?: string;
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "house",
    label: "House",
    short: "House",
    body: "A small dumpling room in New York. Steam on the glass, a few tables, bags at the counter. Sit for a plate, or take the same fold home.",
    /* Craft: prep table / dough (story-village) */
    image: "/assets/story-village.webp",
    position: "42% 48%",
    positionMobile: "center 45%",
  },
  {
    id: "hands",
    label: "Hands",
    short: "Hands",
    body: "Each crease is a little uneven. That is how you know a hand was here. Not a machine. Not a rush.",
    /* Craft: hands folding (story-fold) */
    image: "/assets/story-fold.webp",
    position: "50% 42%",
    positionMobile: "center 40%",
  },
  {
    id: "night",
    label: "Night",
    short: "Night",
    body: "Lanterns on, kitchen open. Walk in for a table, or call for a bag. Same hands either way.",
    /* Craft: night storefront (story-city) */
    image: "/assets/story-city.webp",
    position: "42% 40%",
    positionMobile: "center 38%",
  },
];

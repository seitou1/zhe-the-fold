/**
 * Story chapters SSOT — place-first arc (not genealogy).
 * Job: desire the room → prove the hand → invite the night.
 * Hybrid is felt in the House frame; one quiet line max in copy.
 * Image film: warm tungsten, steam, wood, real people when place is the beat.
 */

export type StoryChapter = {
  id: string;
  label: string;
  short: string;
  body: string;
  image: string;
  position: string;
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "house",
    label: "House",
    short: "House",
    body: "A small dumpling room in New York—steam on the glass, a few tables, bags at the counter. Sit for a plate, or take the same fold home.",
    image: "/assets/story-room.webp",
    position: "48% 42%",
  },
  {
    id: "hands",
    label: "Hands",
    short: "Hands",
    body: "Each crease is a little uneven. That’s how you know a hand was here—not a machine, not a rush.",
    image: "/assets/story-fold.webp",
    position: "50% 42%",
  },
  {
    id: "night",
    label: "Night",
    short: "Night",
    body: "Lanterns on, kitchen open. Walk in for a table, or call for a bag—the same hands either way.",
    image: "/assets/storefront.webp",
    position: "50% 36%",
  },
];

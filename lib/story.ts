/**
 * Story chapters SSOT — place-first arc (not genealogy).
 * Job: desire the room → prove the hand → invite the night.
 * Hybrid is felt in the House frame; plain guest voice, no em dashes.
 * Film: warm tungsten, steam, wood, people when place is the beat.
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
    body: "A small dumpling room in New York. Steam on the glass, a few tables, bags at the counter. Sit for a plate, or take the same fold home.",
    image: "/assets/story-house.webp",
    position: "45% 48%",
  },
  {
    id: "hands",
    label: "Hands",
    short: "Hands",
    body: "Each crease is a little uneven. That is how you know a hand was here. Not a machine. Not a rush.",
    image: "/assets/story-hands.webp",
    position: "50% 45%",
  },
  {
    id: "night",
    label: "Night",
    short: "Night",
    body: "Lanterns on, kitchen open. Walk in for a table, or call for a bag. Same hands either way.",
    image: "/assets/story-night.webp",
    position: "55% 42%",
  },
];

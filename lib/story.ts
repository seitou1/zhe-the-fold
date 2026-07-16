/**
 * Story chapters SSOT — place-first arc (not genealogy).
 * Job: desire the room → prove the hand → invite the night.
 *
 * Wall crops: `position` = desktop landscape panel.
 * `positionMobile` = tall phone cover crop (must frame the subject —
 * arbitrary % values look random on 9:19 screens).
 */

export type StoryChapter = {
  id: string;
  label: string;
  short: string;
  body: string;
  image: string;
  /** object-position for desktop / wide panels */
  position: string;
  /** object-position for phone portrait cover (defaults to center 42%) */
  positionMobile?: string;
};

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: "house",
    label: "House",
    short: "House",
    body: "A small dumpling room in New York. Steam on the glass, a few tables, bags at the counter. Sit for a plate, or take the same fold home.",
    image: "/assets/story-house.webp",
    /* Wide: full dual-window. Phone: lock into left diner pane, not the mullion. */
    position: "center 42%",
    positionMobile: "22% 52%",
  },
  {
    id: "hands",
    label: "Hands",
    short: "Hands",
    body: "Each crease is a little uneven. That is how you know a hand was here. Not a machine. Not a rush.",
    image: "/assets/story-hands.webp",
    position: "center 40%",
    positionMobile: "center 42%",
  },
  {
    id: "night",
    label: "Night",
    short: "Night",
    body: "Lanterns on, kitchen open. Walk in for a table, or call for a bag. Same hands either way.",
    image: "/assets/story-night.webp",
    position: "center 40%",
    positionMobile: "center 40%",
  },
];

export function storyWallPosition(
  chapter: Pick<StoryChapter, "position" | "positionMobile">,
  mobile: boolean
): string {
  if (mobile && chapter.positionMobile) return chapter.positionMobile;
  return chapter.position;
}

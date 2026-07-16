/**
 * Story chapters SSOT — from static data.js STORY_CHAPTERS.
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
    id: "village",
    label: "One · Village",
    short: "Village",
    body: "Lin Meihua grew up outside Harbin—third-generation dumpling maker. At the stove she learned more than ratios: her grandmother’s unhurried rhythm of the pleat.",
    image: "/assets/story-village.webp",
    position: "42% 48%",
  },
  {
    id: "city",
    label: "Two · City",
    short: "City",
    body: "New York winters met her flour. A quiet shop in the city, where the same hands fold for strangers as they once folded for family.",
    image: "/assets/story-city.webp",
    position: "42% 40%",
  },
  {
    id: "fold",
    label: "Three · Fold",
    short: "Fold",
    body: "Each dumpling keeps a small imperfection—the mark of the hand that made it. That is the fold. That is 褶.",
    image: "/assets/story-fold.webp",
    position: "50% 42%",
  },
];

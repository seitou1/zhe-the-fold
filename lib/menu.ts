/**
 * Menu SSOT — dishes, chapters, list meta labels.
 * Paths under /public/assets (craft asset layout).
 * Chrome titles / menu note live on site.sections.menu + site.menu.
 */

import { site } from "@/lib/site";


export type MenuCategory = "classic" | "seasonal" | "plant";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  catLabel: string;
  en: string;
  rail: string;
  cn: string;
  desc: string;
  price: string;
  popular?: boolean;
  tags: string[];
  image: string;
  position?: string;
  positionMobile?: string;
};

export const MENU_CATEGORY_ORDER: MenuCategory[] = [
  "classic",
  "seasonal",
  "plant",
];

/** Chapter labels for sectioned full menu (browse first; no hide-by-filter). */
export const MENU_CHAPTERS: { id: MenuCategory; label: string }[] = [
  { id: "classic", label: "Classic" },
  { id: "seasonal", label: "Seasonal" },
  { id: "plant", label: "Plant-based" },
];

/**
 * Wall crops for square dish stills under object-fit: cover.
 * Desktop: slight low bias for ledger. Phone: center the plate
 * (tall cover + bottom-origin scale used to randomly crop food).
 */
const WALL_POS = "center 52%";
const WALL_POS_MOBILE = "center 48%";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "pork",
    category: "classic",
    catLabel: "Classic",
    en: "Pork & Napa Cabbage",
    rail: "Pork & Cabbage",
    cn: "猪肉白菜褶",
    desc: "Soft pork, sweet napa. The house classic, familiar as home.",
    price: "$14",
    popular: true,
    tags: ["pork"],
    image: "/assets/dish-pork.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
  {
    id: "beef",
    category: "classic",
    catLabel: "Classic",
    en: "Beef & Scallion",
    rail: "Beef & Scallion",
    cn: "牛肉大葱褶",
    desc: "Northern heartiness in a thin skin. Bright scallion, quiet soy.",
    price: "$16",
    tags: ["beef"],
    image: "/assets/dish-beef.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
  {
    id: "shrimp",
    category: "classic",
    catLabel: "Classic",
    en: "Shrimp & Chive",
    rail: "Shrimp & Chive",
    cn: "虾仁韭菜褶",
    desc: "Sweet shrimp and fragrant chive, sealed with uneven creases.",
    price: "$18",
    popular: true,
    tags: ["shellfish"],
    image: "/assets/dish-shrimp.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
  {
    id: "bamboo",
    category: "seasonal",
    catLabel: "Seasonal",
    en: "Bamboo Shoot & Pork",
    rail: "Bamboo & Pork",
    cn: "春笋鲜肉褶",
    desc: "Crisp spring bamboo meeting slow-cooked pork.",
    price: "$17",
    tags: ["pork", "seasonal"],
    image: "/assets/dish-bamboo.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
  {
    id: "crab",
    category: "seasonal",
    catLabel: "Seasonal",
    en: "Crab Roe",
    rail: "Crab Roe",
    cn: "蟹粉小笼褶",
    desc: "Delicate crab roe and broth that warms the palm first.",
    price: "$22",
    tags: ["shellfish", "seasonal"],
    image: "/assets/dish-crab.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
  {
    id: "chestnut",
    category: "seasonal",
    catLabel: "Seasonal",
    en: "Chestnut & Chicken",
    rail: "Chestnut & Chicken",
    cn: "栗子鸡肉褶",
    desc: "Autumn chestnuts and tender chicken. Earth and steam.",
    price: "$16",
    tags: ["poultry", "seasonal"],
    image: "/assets/dish-chestnut.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
  {
    id: "mushroom",
    category: "plant",
    catLabel: "Plant-based",
    en: "Mushroom & Greens",
    rail: "Mushroom & Greens",
    cn: "香菇青菜褶",
    desc: "Wood-ear depth and garden greens, folded without hurry.",
    price: "$13",
    popular: true,
    tags: ["plant"],
    image: "/assets/dish-mushroom.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
  {
    id: "tofu",
    category: "plant",
    catLabel: "Plant-based",
    en: "Tofu & Daikon",
    rail: "Tofu & Daikon",
    cn: "豆腐萝卜褶",
    desc: "Silken tofu and mild daikon. Clean and quiet.",
    price: "$12",
    tags: ["plant"],
    image: "/assets/dish-tofu.webp",
    position: WALL_POS,
    positionMobile: WALL_POS_MOBILE,
  },
];

export function listTitle(item: MenuItem): string {
  return (item.rail || item.en).trim();
}

export function listMeta(
  item: MenuItem,
  labels: { house: string; shellfish: string } = {
    house: site.menu.meta.house,
    shellfish: site.menu.meta.shellfish,
  }
): string {
  const bits: string[] = [];
  if (item.popular) bits.push(labels.house);
  if (item.tags.includes("shellfish")) bits.push(labels.shellfish);
  return bits.join(" \u00b7 ");
}

export type MenuGroup = {
  category: MenuCategory;
  label: string;
  items: MenuItem[];
};

export function groupMenuItems(items: MenuItem[] = MENU_ITEMS): MenuGroup[] {
  return MENU_CATEGORY_ORDER.map((category) => {
    const groupItems = items.filter((i) => i.category === category);
    const chapter = MENU_CHAPTERS.find((c) => c.id === category);
    return {
      category,
      label: chapter?.label || groupItems[0]?.catLabel || category,
      items: groupItems,
    };
  }).filter((g) => g.items.length > 0);
}

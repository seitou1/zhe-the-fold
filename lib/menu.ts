/**
 * Menu SSOT — from Zhe-The-Fold-Website/data.js MENU_ITEMS.
 * Paths under /public/assets (craft asset layout).
 */

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

export const MENU_FILTERS: { id: "all" | MenuCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "classic", label: "Classic" },
  { id: "seasonal", label: "Seasonal" },
  { id: "plant", label: "Plant" },
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "pork",
    category: "classic",
    catLabel: "Classic",
    en: "Pork & Napa Cabbage",
    rail: "Pork & Cabbage",
    cn: "猪肉白菜褶",
    desc: "Soft pork, sweet napa—the house classic, familiar as home.",
    price: "$14",
    popular: true,
    tags: ["pork"],
    image: "/assets/dish-pork.webp",
    position: "center 68%",
    positionMobile: "center 72%",
  },
  {
    id: "beef",
    category: "classic",
    catLabel: "Classic",
    en: "Beef & Scallion",
    rail: "Beef & Scallion",
    cn: "牛肉大葱褶",
    desc: "Northern heartiness in a thin skin—bright scallion, quiet soy.",
    price: "$16",
    tags: ["beef"],
    image: "/assets/dish-beef.webp",
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
  },
  {
    id: "chestnut",
    category: "seasonal",
    catLabel: "Seasonal",
    en: "Chestnut & Chicken",
    rail: "Chestnut & Chicken",
    cn: "栗子鸡肉褶",
    desc: "Autumn chestnuts and tender chicken—earth and steam.",
    price: "$16",
    tags: ["poultry", "seasonal"],
    image: "/assets/dish-chestnut.webp",
  },
  {
    id: "mushroom",
    category: "plant",
    catLabel: "Plant",
    en: "Mushroom & Greens",
    rail: "Mushroom & Greens",
    cn: "香菇青菜褶",
    desc: "Wood-ear depth and garden greens, folded without hurry.",
    price: "$13",
    popular: true,
    tags: ["plant"],
    image: "/assets/dish-mushroom.webp",
    position: "center 62%",
    positionMobile: "center 70%",
  },
  {
    id: "tofu",
    category: "plant",
    catLabel: "Plant",
    en: "Tofu & Daikon",
    rail: "Tofu & Daikon",
    cn: "豆腐萝卜褶",
    desc: "Silken tofu and mild daikon—clean and quiet.",
    price: "$12",
    tags: ["plant"],
    image: "/assets/dish-tofu.webp",
    position: "center 58%",
    positionMobile: "center 65%",
  },
];

export function listTitle(item: MenuItem): string {
  return (item.rail || item.en).trim();
}

export function listMeta(item: MenuItem): string {
  const bits: string[] = [];
  if (item.popular) bits.push("House");
  if (item.tags.includes("shellfish")) bits.push("Shellfish");
  return bits.join(" · ");
}

export type MenuGroup = {
  category: MenuCategory;
  label: string;
  items: MenuItem[];
};

export function groupMenuItems(items: MenuItem[] = MENU_ITEMS): MenuGroup[] {
  return MENU_CATEGORY_ORDER.map((category) => {
    const groupItems = items.filter((i) => i.category === category);
    return {
      category,
      label: groupItems[0]?.catLabel || category,
      items: groupItems,
    };
  }).filter((g) => g.items.length > 0);
}

export function filterMenuItems(
  filter: "all" | MenuCategory,
  items: MenuItem[] = MENU_ITEMS
): MenuItem[] {
  if (filter === "all") return items;
  return items.filter((i) => i.category === filter);
}

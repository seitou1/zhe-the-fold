/**
 * Menu SSOT — ported from Zhe-The-Fold-Website/data.js MENU_ITEMS.
 * Edit dishes here only (until Supabase later).
 */

export type MenuCategory = "classic" | "seasonal" | "plant";

export type MenuItem = {
  id: string;
  category: MenuCategory;
  catLabel: string;
  /** Full English name */
  en: string;
  /** Short list title (preferred in the ledger) */
  rail: string;
  cn: string;
  desc: string;
  price: string;
  popular?: boolean;
  tags: string[];
  image?: string;
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
  },
];

/** List title — short rail name when set */
export function listTitle(item: MenuItem): string {
  return (item.rail || item.en).trim();
}

/**
 * Meta under the name — only what title/group don't already say.
 * House mark + shellfish allergen (same rule as static ledger).
 */
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

/** Group dishes for “All” view — Classic → Seasonal → Plant */
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

/** Brand + marketing SSOT — no secrets. */

export const site = {
  name: "Zhe · The Fold",
  nameCn: "褶",
  shortName: "Zhe",
  tagline: "Handmade Chinese dumplings in New York.",
  description:
    "Handmade Chinese dumplings in New York. Every fold holds the mark of a hand.",
  city: "New York City",
  email: "hello@zhethefold.com",
  reserveSubject: "Reservation · Zhe",
  nav: [
    { href: "#story", label: "Story" },
    { href: "#menu", label: "Menu" },
    { href: "#visit", label: "Visit" },
  ],
  sections: {
    story: {
      en: "Origins",
      cn: "起源",
      body: "Third-generation hands. A quiet shop in the city. Each dumpling keeps a small imperfection—the mark of the fold.",
    },
    menu: {
      en: "The Menu",
      cn: "菜单",
      body: "Classic, seasonal, and plant folds. Steamed or pan-seared. About eight per order.",
    },
    visit: {
      en: "Visit",
      cn: "到店",
      body: "Walk-ins welcome. Sample hours until real NAP is wired. Reserve by email for now.",
    },
  },
} as const;

export function reserveMailto() {
  const subject = encodeURIComponent(site.reserveSubject);
  return `mailto:${site.email}?subject=${subject}`;
}

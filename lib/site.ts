/**
 * Brand + marketing SSOT — no secrets.
 * Ported from the static demo (Zhe-The-Fold-Website/data.js).
 * Original site is separate and untouched.
 */

export const site = {
  name: "Zhe · The Fold",
  nameCn: "褶",
  shortName: "Zhe",
  /** Meta / SEO description */
  description:
    "Handmade Chinese dumplings in New York. Every fold holds the mark of a hand.",
  /** Hero tagline — matches original, not the long SEO line */
  heroTagline: "Folded by hand. Served without hurry.",
  city: "New York City",
  email: "hello@zhethefold.com",
  reserveSubject: "Reservation · Zhe",
  telephone: "+12125550100",
  telephoneDisplay: "(212) 555-0100",
  address: {
    streetAddress: "200 Sample Street, Floor 1",
    addressLocality: "New York",
    addressRegion: "NY",
    postalCode: "10013",
    addressCountry: "US",
  },
  mapsQuery: "200 Sample Street New York NY 10013",
  access: "Walk-ins welcome · near Canal St",
  /**
   * Open badge + Visit hours.
   * Days: Sun Mon Tue Wed Thu Fri Sat (en-US short from Intl).
   */
  hours: {
    timeZone: "America/New_York",
    closedWeekdays: ["Mon"] as string[],
    note: "Closed Mondays",
    periods: [
      {
        days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        open: "11:30",
        close: "14:30",
      },
      {
        days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        open: "17:00",
        close: "21:00",
      },
    ],
  },
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

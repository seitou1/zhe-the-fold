/**
 * Brand + marketing + chrome SSOT — no secrets.
 * Every guest-facing string, path, and label used by panels should live here
 * (or in lib/menu · story · hours which read from here). Components only compose.
 */

export const site = {
  name: "Zhe · The Fold",
  nameCn: "褶",
  shortName: "Zhe",
  city: "New York City",

  /** Meta / SEO */
  description:
    "Handmade Chinese dumplings in New York. A small hybrid room for the table or takeout. Every fold holds the mark of a hand.",
  seo: {
    titleSuffix: "Handmade Dumplings in New York",
    locale: "en_US",
    themeColor: "#12100e",
  },

  /**
   * Hero orient line — plain product, not poetry.
   * Answers: what + format (hybrid: sit-in + take home).
   */
  // \u00b7 = middle dot (avoids file-encoding mojibake as Â·)
  heroLine: "Handmade dumplings \u00b7 table & takeout",

  email: "hello@zhethefold.com",
  reserveSubject: "Table \u00b7 Zhe",
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

  social: {
    instagram: "https://instagram.com/zhe.thefold",
    instagramLabel: "Instagram",
  },

  /** Media paths + accessible labels (hero / visit walls) */
  media: {
    heroPoster: "/assets/hero-dumplings.webp",
    heroVideo: "/assets/hero-loop.mp4",
    heroVideoMobile: "/assets/hero-loop-sm.mp4",
    heroVideoLabel: "Handmade dumplings on worn ceramic at Zhe · The Fold",
    storefrontPoster: "/assets/storefront.webp",
    storefrontVideo: "/assets/storefront-loop.mp4",
    storefrontVideoMobile: "/assets/storefront-loop-sm.mp4",
    storefrontVideoLabel:
      "Zhe · The Fold storefront — small dumpling room at street level",
  },

  /**
   * Hybrid service model — Visit Join us + action labels.
   * SSOT so hero / Visit / nav stay aligned.
   */
  service: {
    format: "hybrid" as const,
    kicker: "Join us",
    modes: [
      {
        id: "table",
        label: "Table",
        detail: "Walk-ins welcome \u00b7 reserve for 4+",
      },
      {
        id: "takeout",
        label: "Takeout",
        detail: "Call ahead or walk up \u00b7 no delivery",
      },
    ],
    /** Bottom Visit CTAs + nav reserve chip — also editable via site_settings */
    actions: {
      directions: "Directions",
      takeout: "Call",
      table: "Reserve",
      reserveNav: "Reserve",
    },
    /** Aria suffixes for Visit actions */
    aria: {
      takeoutCall: "call",
      tableEmail: "email for a reservation",
    },
  },

  /** Visit fact kickers (pair with service.kicker) */
  visit: {
    findUs: "Find us",
    hours: "Hours",
    actionsAria: "Visit actions",
    socialAria: "Social",
  },

  /** Menu panel chrome (titles live in sections.menu; dishes in lib/menu) */
  menu: {
    dishesAria: "Dishes",
    note: "Steamed or pan-seared \u00b7 About eight per order \u00b7 Table or take home \u00b7 Share allergies",
    meta: {
      house: "House",
      shellfish: "Shellfish",
    },
  },

  /** Kitchen open-chip + Visit hours copy fragments */
  kitchen: {
    open: "Open",
    until: "until",
    opens: "opens",
    seeVisit: "see Visit",
    closedPrefix: "Closed",
    daily: "Daily",
    easternTime: "Eastern time",
    titleOpenPrefix: "Kitchen open until",
    titleClosedPrefix: "Kitchen",
  },

  /**
   * Open badge + Visit hours schedule.
   * Days: Sun Mon Tue Wed Thu Fri Sat (en-US short from Intl).
   * NAP above is sample until launch — site stays noindex.
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

  /** Panel titles — story chapter bodies in lib/story */
  sections: {
    story: {
      en: "The house",
      cn: "小店",
      chaptersAria: "Story chapters",
    },
    menu: {
      en: "The Menu",
      cn: "菜单",
    },
    visit: {
      en: "Visit",
      cn: "造访",
    },
  },

  /** Site chrome copy */
  ui: {
    skipToMenu: "Skip to menu",
    skipToMenuHref: "#menu",
    navPrimaryAria: "Primary",
    homeAriaSuffix: "home",
    footerTag: "The imperfect pleats are the point",
    footerRights: "All rights reserved.",
  },
} as const;

export function reserveMailto() {
  const subject = encodeURIComponent(site.reserveSubject);
  return `mailto:${site.email}?subject=${subject}`;
}

export function mapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    site.mapsQuery
  )}`;
}

export function telHref() {
  return `tel:${site.telephone}`;
}

export function formatAddressLines(): string[] {
  const a = site.address;
  return [
    a.streetAddress,
    `${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`,
  ];
}

export function siteTitleDefault(): string {
  return `${site.name} | ${site.seo.titleSuffix}`;
}

export function homeAriaLabel(): string {
  return `${site.name} ${site.ui.homeAriaSuffix}`;
}

/** Full-viewport panel ids in scroll order (nav hrefs + hero). */
export function panelIds(): readonly string[] {
  return ["hero", ...site.nav.map((item) => item.href.replace(/^#/, ""))];
}

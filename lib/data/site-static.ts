/**
 * Static SiteOps from lib/site.ts — safe for client + server.
 */

import { site } from "@/lib/site";
import type { HoursConfig, KitchenCopy, SiteOps } from "@/lib/data/site-types";

export type { HoursConfig, KitchenCopy, SiteOps } from "@/lib/data/site-types";

export function siteOpsFromStaticFallback(): SiteOps {
  const table = site.service.modes.find((m) => m.id === "table");
  const takeout = site.service.modes.find((m) => m.id === "takeout");
  return {
    name: site.name,
    nameCn: site.nameCn,
    shortName: site.shortName,
    city: site.city,
    description: site.description,
    titleSuffix: site.seo.titleSuffix,

    email: site.email,
    telephone: site.telephone,
    telephoneDisplay: site.telephoneDisplay,
    address: {
      streetAddress: site.address.streetAddress,
      addressLocality: site.address.addressLocality,
      addressRegion: site.address.addressRegion,
      postalCode: site.address.postalCode,
      addressCountry: site.address.addressCountry,
    },
    mapsQuery: site.mapsQuery,
    reserveSubject: site.reserveSubject,

    heroLine: site.heroLine,
    menuNote: site.menu.note,

    instagram: site.social.instagram,
    instagramLabel: site.social.instagramLabel,

    serviceKicker: site.service.kicker,
    modeTableLabel: table?.label ?? "Table",
    modeTakeoutLabel: takeout?.label ?? "Takeout",
    tableDetail: table?.detail ?? "",
    takeoutDetail: takeout?.detail ?? "",

    actionDirections: site.service.actions.directions,
    actionCall: site.service.actions.takeout,
    actionReserve: site.service.actions.table,
    actionReserveNav: site.service.actions.reserveNav,

    visitFindUs: site.visit.findUs,
    visitHoursLabel: site.visit.hours,

    sectionStoryEn: site.sections.story.en,
    sectionStoryCn: site.sections.story.cn,
    sectionMenuEn: site.sections.menu.en,
    sectionMenuCn: site.sections.menu.cn,
    sectionVisitEn: site.sections.visit.en,
    sectionVisitCn: site.sections.visit.cn,
    storyChaptersAria: site.sections.story.chaptersAria,
    dishesAria: site.menu.dishesAria,

    navStory: site.nav[0]?.label ?? "Story",
    navMenu: site.nav[1]?.label ?? "Menu",
    navVisit: site.nav[2]?.label ?? "Visit",
    navPrimaryAria: site.ui.navPrimaryAria,

    menuMetaHouse: site.menu.meta.house,
    menuMetaShellfish: site.menu.meta.shellfish,

    footerTag: site.ui.footerTag,
    footerRights: site.ui.footerRights,
    skipToMenu: site.ui.skipToMenu,
    skipToMenuHref: site.ui.skipToMenuHref,
    homeAriaSuffix: site.ui.homeAriaSuffix,

    hours: {
      timeZone: site.hours.timeZone,
      closedWeekdays: [...site.hours.closedWeekdays],
      note: site.hours.note,
      periods: site.hours.periods.map((p) => ({
        days: [...p.days],
        open: p.open,
        close: p.close,
      })),
    } satisfies HoursConfig,
    kitchen: { ...site.kitchen } satisfies KitchenCopy,
  };
}

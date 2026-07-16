export type HoursPeriod = {
  days: string[];
  open: string;
  close: string;
};

export type HoursConfig = {
  timeZone: string;
  closedWeekdays: string[];
  note: string;
  periods: HoursPeriod[];
};

export type KitchenCopy = {
  open: string;
  until: string;
  opens: string;
  seeVisit: string;
  closedPrefix: string;
  daily: string;
  easternTime: string;
  titleOpenPrefix: string;
  titleClosedPrefix: string;
};

/** All guest-facing site chrome + ops editable from Table Editor. */
export type SiteOps = {
  name: string;
  nameCn: string;
  shortName: string;
  city: string;
  description: string;
  titleSuffix: string;

  email: string;
  telephone: string;
  telephoneDisplay: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  mapsQuery: string;
  reserveSubject: string;

  heroLine: string;
  menuNote: string;

  instagram: string;
  instagramLabel: string;

  serviceKicker: string;
  modeTableLabel: string;
  modeTakeoutLabel: string;
  tableDetail: string;
  takeoutDetail: string;

  actionDirections: string;
  actionCall: string;
  actionReserve: string;
  actionReserveNav: string;

  visitFindUs: string;
  visitHoursLabel: string;

  sectionStoryEn: string;
  sectionStoryCn: string;
  sectionMenuEn: string;
  sectionMenuCn: string;
  sectionVisitEn: string;
  sectionVisitCn: string;
  storyChaptersAria: string;
  dishesAria: string;

  navStory: string;
  navMenu: string;
  navVisit: string;
  navPrimaryAria: string;

  menuMetaHouse: string;
  menuMetaShellfish: string;

  footerTag: string;
  footerRights: string;
  skipToMenu: string;
  skipToMenuHref: string;
  homeAriaSuffix: string;

  hours: HoursConfig;
  kitchen: KitchenCopy;
};

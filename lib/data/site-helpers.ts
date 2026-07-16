import type { SiteOps } from "@/lib/data/site-types";

export function opsAddressLines(ops: SiteOps): string[] {
  const a = ops.address;
  return [
    a.streetAddress,
    `${a.addressLocality}, ${a.addressRegion} ${a.postalCode}`,
  ];
}

export function opsMapsUrl(ops: SiteOps): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    ops.mapsQuery
  )}`;
}

export function opsTelHref(ops: SiteOps): string {
  return `tel:${ops.telephone}`;
}

export function opsReserveMailto(ops: SiteOps): string {
  const subject = encodeURIComponent(ops.reserveSubject);
  return `mailto:${ops.email}?subject=${subject}`;
}

export function opsHomeAriaLabel(ops: SiteOps): string {
  return `${ops.name} ${ops.homeAriaSuffix}`;
}

export function opsSiteTitle(ops: SiteOps): string {
  return `${ops.name} | ${ops.titleSuffix}`;
}

export function opsNavItems(ops: SiteOps): { href: string; label: string }[] {
  return [
    { href: "#story", label: ops.navStory },
    { href: "#menu", label: ops.navMenu },
    { href: "#visit", label: ops.navVisit },
  ];
}

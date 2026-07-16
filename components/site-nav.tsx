"use client";

import { OpenChip } from "@/components/open-chip";
import { useSiteOps } from "@/components/site-ops-provider";
import {
  opsHomeAriaLabel,
  opsNavItems,
  opsReserveMailto,
} from "@/lib/data/site-helpers";

/** Logo · kitchen status · Story Menu Visit · Reserve */
export function SiteNav() {
  const ops = useSiteOps();
  const nav = opsNavItems(ops);

  return (
    <header className="nav" id="nav">
      <a
        href="#hero"
        className="nav-logo"
        aria-label={opsHomeAriaLabel(ops)}
      >
        <span className="logo-cn" aria-hidden="true">
          {ops.nameCn}
        </span>
        <span className="logo-en">{ops.shortName}</span>
      </a>

      <OpenChip />

      <nav
        className="nav-links"
        id="navLinks"
        aria-label={ops.navPrimaryAria}
      >
        {nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a className="nav-reserve" href={opsReserveMailto(ops)}>
          {ops.actionReserveNav}
        </a>
      </nav>
    </header>
  );
}

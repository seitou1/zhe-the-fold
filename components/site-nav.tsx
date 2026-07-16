import { OpenChip } from "@/components/open-chip";
import { homeAriaLabel, reserveMailto, site } from "@/lib/site";

/** Logo · kitchen status · Story Menu Visit · Table */
export function SiteNav() {
  return (
    <header className="nav" id="nav">
      <a href="#hero" className="nav-logo" aria-label={homeAriaLabel()}>
        <span className="logo-cn" aria-hidden="true">
          {site.nameCn}
        </span>
        <span className="logo-en">{site.shortName}</span>
      </a>

      <OpenChip />

      <nav className="nav-links" id="navLinks" aria-label={site.ui.navPrimaryAria}>
        {site.nav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
        <a className="nav-reserve" href={reserveMailto()}>
          {site.service.actions.reserveNav}
        </a>
      </nav>
    </header>
  );
}

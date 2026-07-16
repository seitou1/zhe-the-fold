import { HashLink } from "@/components/hash-link";
import { OpenChip } from "@/components/open-chip";
import { reserveMailto, site } from "@/lib/site";

/**
 * Fixed nav — pointer-events only on real controls so the bar never
 * steals taps from content underneath (common mobile bug).
 */
export function SiteHeader() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Solid-ish bar so links stay readable; gradient only as fade below bar */}
      <div className="border-b border-cream/10 bg-void/95 backdrop-blur-md supports-[backdrop-filter]:bg-void/85">
        <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-2 px-[var(--stage-x)] py-2.5 sm:gap-4 sm:py-3.5">
          <HashLink
            href="#hero"
            className="flex min-h-11 min-w-0 shrink-0 items-center gap-2 text-cream no-underline"
            aria-label={`${site.name} home`}
          >
            <span
              className="font-display text-xl leading-none tracking-wide sm:text-[1.35rem]"
              lang="zh-Hans"
              aria-hidden
            >
              {site.nameCn}
            </span>
            <span className="font-display text-base italic tracking-wide text-cream/95 sm:text-lg">
              {site.shortName}
            </span>
          </HashLink>

          {/* Desktop: open chip in the middle */}
          <div className="hidden min-w-0 flex-1 justify-center sm:flex">
            <OpenChip />
          </div>

          <nav aria-label="Primary" className="min-w-0">
            <ul className="flex items-center gap-0.5 font-ui text-[0.8rem] tracking-[0.05em] text-cream/90 sm:gap-1 sm:text-[0.88rem]">
              {site.nav.map((item) => (
                <li key={item.href} className="shrink-0">
                  <HashLink
                    href={item.href}
                    className="inline-flex min-h-11 items-center px-2.5 py-2 transition-colors hover:text-cream active:text-wheat sm:px-3"
                  >
                    {item.label}
                  </HashLink>
                </li>
              ))}
              <li className="shrink-0">
                <a
                  href={reserveMailto()}
                  className="inline-flex min-h-11 items-center px-2.5 py-2 text-wheat transition-colors hover:text-cream active:opacity-80 sm:px-3"
                >
                  Reserve
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Fade under bar — must not capture taps */}
      <div
        className="pointer-events-none h-6 bg-gradient-to-b from-void/80 to-transparent"
        aria-hidden
      />
    </header>
  );
}

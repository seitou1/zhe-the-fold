import Link from "next/link";
import { OpenChip } from "@/components/open-chip";
import { reserveMailto, site } from "@/lib/site";

/**
 * Matches original nav grammar:
 *   [褶 Zhe]  ·  [Open / opens …]  ·  [Story Menu Visit Reserve]
 * Not a generic marketing bar.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-gradient-to-b from-void/90 via-void/55 to-transparent">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-3 px-[var(--stage-x)] py-3.5 sm:gap-4 sm:py-4">
        <Link
          href="/#hero"
          className="flex min-w-0 items-baseline gap-2 text-cream no-underline"
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
        </Link>

        {/* Center: kitchen status (original open/close chip) */}
        <div className="flex justify-center">
          <OpenChip />
        </div>

        <nav aria-label="Primary" className="justify-self-end">
          <ul className="flex max-w-[58vw] items-center gap-3 overflow-x-auto font-ui text-[0.78rem] tracking-[0.06em] text-cream/90 sm:max-w-none sm:gap-5 sm:text-[0.88rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {site.nav.map((item) => (
              <li key={item.href} className="shrink-0">
                <a
                  href={item.href}
                  className="border-b border-transparent py-1 transition-colors hover:border-wheat/50 hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="shrink-0">
              <a
                href={reserveMailto()}
                className="border-b border-wheat/40 py-1 text-wheat transition-colors hover:border-wheat hover:text-cream"
              >
                Reserve
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

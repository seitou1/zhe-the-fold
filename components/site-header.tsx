import { HashLink } from "@/components/hash-link";
import { OpenChip } from "@/components/open-chip";
import { reserveMailto, site } from "@/lib/site";

/**
 * Fixed nav bar only — no full-screen hit target.
 * Interactive row uses pointer-events-auto; outer shell does not expand.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-cream/10 bg-void/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-[var(--stage-x)]">
          <HashLink
            href="#hero"
            className="flex h-14 min-w-0 shrink-0 items-center gap-2 text-cream no-underline"
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

          <div className="hidden min-w-0 flex-1 justify-center sm:flex">
            <OpenChip />
          </div>

          <nav aria-label="Primary" className="min-w-0">
            <ul className="flex h-14 items-center font-ui text-[0.8rem] tracking-[0.05em] text-cream/90 sm:text-[0.88rem]">
              {site.nav.map((item) => (
                <li key={item.href} className="shrink-0">
                  <HashLink
                    href={item.href}
                    className="inline-flex h-14 items-center px-2.5 transition-colors hover:text-cream active:text-wheat sm:px-3"
                  >
                    {item.label}
                  </HashLink>
                </li>
              ))}
              <li className="shrink-0">
                <a
                  href={reserveMailto()}
                  className="inline-flex h-14 items-center px-2.5 text-wheat transition-colors hover:text-cream active:opacity-80 sm:px-3"
                >
                  Reserve
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

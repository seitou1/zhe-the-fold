import Link from "next/link";
import { reserveMailto, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-void/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-[var(--stage-x)] py-3.5">
        <Link
          href="/"
          className="group flex min-w-0 items-baseline gap-2 text-cream no-underline"
        >
          <span
            className="font-display text-xl leading-none tracking-wide"
            lang="zh-Hans"
          >
            {site.nameCn}
          </span>
          <span className="font-display text-base italic tracking-wide text-cream/95 sm:text-lg">
            {site.shortName}
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-4"
        >
          <ul className="flex max-w-[55vw] items-center gap-3 overflow-x-auto font-ui text-[0.8rem] tracking-[0.06em] text-cream/85 sm:max-w-none sm:gap-5 sm:text-[0.88rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {site.nav.map((item) => (
              <li key={item.href} className="shrink-0">
                <a
                  href={item.href}
                  className="border-b border-transparent py-1 transition-colors hover:border-wheat/60 hover:text-cream"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href={reserveMailto()}
            className="shrink-0 rounded-sm border border-wheat/50 bg-wheat/10 px-3 py-1.5 font-ui text-[0.75rem] tracking-[0.08em] text-wheat transition-colors hover:border-wheat hover:bg-wheat/15 sm:text-[0.8rem]"
          >
            Reserve
          </a>
        </nav>
      </div>
    </header>
  );
}

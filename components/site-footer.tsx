import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-[var(--stage-x)] py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-display text-lg italic text-cream">
            <span lang="zh-Hans" className="not-italic">
              {site.nameCn}
            </span>{" "}
            · {site.shortName}
          </p>
          <p className="max-w-sm font-ui text-sm leading-relaxed text-cream-soft">
            {site.tagline}
          </p>
          <p className="font-ui text-xs tracking-wide text-cream/50">
            Concept demo — sample hours &amp; address until launch.
          </p>
        </div>

        <div className="space-y-1 text-left sm:text-right">
          <a
            href={`mailto:${site.email}`}
            className="font-ui text-sm text-wheat transition-colors hover:text-cream"
          >
            {site.email}
          </a>
          <p className="font-ui text-xs text-cream/45">
            © {year} {site.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

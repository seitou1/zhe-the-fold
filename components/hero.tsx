import { reserveMailto, site } from "@/lib/site";

export function Hero() {
  return (
    <section
      className="relative flex min-h-[min(88dvh,52rem)] flex-col justify-end overflow-hidden px-[var(--stage-x)] pb-16 pt-24 sm:pb-20 sm:pt-28"
      aria-labelledby="hero-title"
    >
      {/* Soft warm atmosphere — no photo required on day one */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(166,124,82,0.18),transparent_55%),radial-gradient(ellipse_70%_50%_at_15%_80%,rgba(208,192,160,0.08),transparent_50%),linear-gradient(to_top,rgba(18,16,14)_0%,transparent_45%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <p className="mb-4 font-ui text-[0.72rem] uppercase tracking-[0.22em] text-wheat/90 sm:text-[0.78rem]">
          {site.city}
        </p>

        <h1
          id="hero-title"
          className="max-w-xl font-display text-[clamp(2.4rem,8vw,4.25rem)] font-normal leading-[1.08] tracking-tight text-cream"
        >
          <span className="block italic">{site.name}</span>
          <span
            className="mt-2 block font-display text-[clamp(1.35rem,4vw,1.85rem)] not-italic tracking-[0.12em] text-cream/80"
            lang="zh-Hans"
          >
            {site.nameCn}
          </span>
        </h1>

        <p className="mt-6 max-w-md font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
          {site.description}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
          <a
            href="#menu"
            className="inline-flex items-center justify-center rounded-sm bg-wheat px-5 py-2.5 font-ui text-sm tracking-[0.06em] text-void transition-opacity hover:opacity-90"
          >
            View menu
          </a>
          <a
            href={reserveMailto()}
            className="inline-flex items-center justify-center rounded-sm border border-cream/25 px-5 py-2.5 font-ui text-sm tracking-[0.06em] text-cream transition-colors hover:border-wheat/50 hover:text-wheat"
          >
            Reserve
          </a>
        </div>
      </div>
    </section>
  );
}

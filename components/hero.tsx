import { site } from "@/lib/site";

/**
 * Hero aligned to original static demo.
 * Media is pointer-events-none so it can never steal taps on mobile.
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Plate — decorative only; never captures pointer/touch */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/hero-dumplings.webp"
          alt=""
          className="h-full w-full object-cover object-center"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,10,8,0.82)_0%,rgba(12,10,8,0.35)_32%,transparent_58%),linear-gradient(to_right,rgba(12,10,8,0.45)_0%,transparent_42%)]" />
      </div>

      <div className="relative z-10 w-full px-[var(--stage-x)] pb-16 pt-10 sm:pb-20 sm:pt-16">
        <div className="max-w-xl">
          <p className="mb-3 font-ui text-[0.72rem] uppercase tracking-[0.22em] text-cream/85 sm:text-[0.78rem]">
            {site.city}
          </p>

          <h1
            id="hero-title"
            className="font-display font-normal leading-[1.05] tracking-tight text-cream"
          >
            <span
              className="mb-1 block text-[clamp(3.1rem,14vw,5.5rem)] tracking-[0.06em]"
              lang="zh-Hans"
              aria-hidden
            >
              {site.nameCn}
            </span>
            <span className="block text-[clamp(1.35rem,3.5vw,1.85rem)] italic">
              {site.name}
            </span>
          </h1>

          <p className="mt-5 max-w-sm font-ui text-base leading-relaxed text-cream/88 sm:text-lg">
            {site.heroTagline}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden
      >
        <div className="h-8 w-px bg-gradient-to-b from-cream/50 to-transparent" />
      </div>
    </section>
  );
}

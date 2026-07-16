import Image from "next/image";
import { site } from "@/lib/site";

/**
 * Hero aligned to original static demo:
 * full-bleed plate, bottom-left caption, no invented CTAs.
 * Reserve lives in the nav only (same as original).
 */
export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Plate */}
      <div className="absolute inset-0">
        <Image
          src="/media/hero-dumplings.webp"
          alt="Handmade dumplings on worn ceramic at Zhe · The Fold"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft hold under type — light, not a mud curtain */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,10,8,0.82)_0%,rgba(12,10,8,0.35)_32%,transparent_58%),linear-gradient(to_right,rgba(12,10,8,0.45)_0%,transparent_42%)]"
        />
      </div>

      {/* Caption — bottom-left, original hierarchy */}
      <div className="relative z-10 w-full px-[var(--stage-x)] pb-16 pt-28 sm:pb-20 sm:pt-32">
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

      {/* Quiet scroll cue — no buttons */}
      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden
      >
        <div className="h-8 w-px bg-gradient-to-b from-cream/50 to-transparent" />
      </div>
    </section>
  );
}

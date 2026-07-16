"use client";

import Image from "next/image";
import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { STORY_CHAPTERS } from "@/lib/story";
import { site } from "@/lib/site";

/**
 * Origins — three chapters from the static demo.
 * Tap Village / City / Fold (or prev/next). Photo + copy; no full snap panel yet.
 */
export function StorySection() {
  const [index, setIndex] = useState(0);
  const chapter = STORY_CHAPTERS[index];
  const n = STORY_CHAPTERS.length;

  const go = (dir: number) => {
    setIndex((i) => (i + dir + n) % n);
  };

  return (
    <section id="story" aria-labelledby="story-heading" className="scroll-mt-24">
      <SectionHeading
        id="story-heading"
        en={site.sections.story.en}
        cn={site.sections.story.cn}
      />

      {/* Chapter pills */}
      <div
        role="tablist"
        aria-label="Story chapters"
        className="mb-6 flex flex-wrap gap-2 sm:gap-3"
      >
        {STORY_CHAPTERS.map((ch, i) => {
          const on = i === index;
          return (
            <button
              key={ch.id}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setIndex(i)}
              className={`relative z-10 min-h-11 touch-manipulation rounded-sm px-3.5 py-2 font-ui text-[0.82rem] tracking-[0.08em] transition-colors sm:text-[0.85rem] ${
                on
                  ? "bg-wheat/15 text-wheat"
                  : "text-cream/55 hover:text-cream/85 active:text-cream"
              }`}
            >
              {ch.short}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
        {/* Still — not a full dual-layer wall; clear and calm */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-void sm:aspect-[16/10]">
          <Image
            key={chapter.id}
            src={chapter.image}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            style={{ objectPosition: chapter.position }}
            priority={index === 0}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-void/20"
          />
        </div>

        <div className="flex min-h-[10rem] flex-col justify-center">
          <p className="mb-3 font-ui text-[0.72rem] uppercase tracking-[0.14em] text-wheat">
            {chapter.label}
          </p>
          <p className="max-w-md font-ui text-base leading-relaxed text-cream-soft sm:text-lg">
            {chapter.body}
          </p>

          <div className="mt-6 flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              className="relative z-10 min-h-11 touch-manipulation px-3 font-ui text-sm tracking-wide text-cream/60 transition-colors hover:text-wheat active:text-wheat"
              aria-label="Previous chapter"
            >
              ← Prev
            </button>
            <span className="font-ui text-xs tabular-nums text-cream/40">
              {index + 1} / {n}
            </span>
            <button
              type="button"
              onClick={() => go(1)}
              className="relative z-10 min-h-11 touch-manipulation px-3 font-ui text-sm tracking-wide text-cream/60 transition-colors hover:text-wheat active:text-wheat"
              aria-label="Next chapter"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

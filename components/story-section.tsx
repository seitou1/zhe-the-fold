"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/section-heading";
import { STORY_CHAPTERS } from "@/lib/story";
import { site } from "@/lib/site";

/**
 * Origins — three chapters. Plain <img> + buttons (no next/image fill overlay).
 */
export function StorySection() {
  const [index, setIndex] = useState(0);
  const chapter = STORY_CHAPTERS[index];
  const n = STORY_CHAPTERS.length;

  const go = (dir: number) => {
    setIndex((i) => (i + dir + n) % n);
  };

  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="relative scroll-mt-20"
    >
      <SectionHeading
        id="story-heading"
        en={site.sections.story.en}
        cn={site.sections.story.cn}
      />

      <div
        className="mb-6 flex flex-wrap gap-2"
        aria-label="Story chapters"
      >
        {STORY_CHAPTERS.map((ch, i) => {
          const on = i === index;
          return (
            <button
              key={ch.id}
              type="button"
              aria-pressed={on}
              onClick={() => setIndex(i)}
              className={`min-h-12 rounded-sm px-4 py-3 font-ui text-[0.88rem] tracking-[0.08em] ${
                on
                  ? "bg-wheat/15 text-wheat"
                  : "text-cream/60 active:text-cream"
              }`}
            >
              {ch.short}
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
        <div className="pointer-events-none relative aspect-[4/3] overflow-hidden rounded-sm bg-void sm:aspect-[16/10]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={chapter.id}
            src={chapter.image}
            alt=""
            className="h-full w-full object-cover"
            style={{ objectPosition: chapter.position }}
            decoding="async"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-void/50 via-transparent to-void/20"
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
              className="min-h-12 px-4 font-ui text-sm tracking-wide text-cream/70 active:text-wheat"
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
              className="min-h-12 px-4 font-ui text-sm tracking-wide text-cream/70 active:text-wheat"
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

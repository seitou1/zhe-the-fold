"use client";

import { useCallback, useState } from "react";
import { STORY_CHAPTERS } from "@/lib/story";

const ChevronLeft = () => (
  <svg
    className="carousel-chevron"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M14.5 5.2 8.2 12l6.3 6.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg
    className="carousel-chevron"
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M9.5 5.2 15.8 12 9.5 18.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.15"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Origins panel — full-bleed wall + one chapter at a time */
export function StoryPanel() {
  const [index, setIndex] = useState(0);
  const n = STORY_CHAPTERS.length;
  const chapter = STORY_CHAPTERS[index];

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  return (
    <section className="story panel" id="story" data-tone="dark">
      <div className="story-wall" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={chapter.id}
          className="story-wall-img is-active"
          src={chapter.image}
          alt=""
          width={1400}
          height={787}
          style={{ objectPosition: chapter.position }}
          decoding="async"
        />
        <div className="story-wall-veil" />
      </div>

      <div className="stage story-stage">
        <header className="story-head">
          <div className="story-head-title">
            <h2>
              <span className="en">Origins</span>
              <span className="cn" lang="zh-Hans">
                由来
              </span>
            </h2>
          </div>
          <p className="story-head-lead">
            <span className="en">
              We don’t chase perfection—we honor the quiet beauty of dough that
              remembers who shaped it.
            </span>
          </p>
        </header>

        <div className="story-spotlight" aria-live="polite">
          <span className="story-label">{chapter.label}</span>
          <p className="en">{chapter.body}</p>
        </div>

        <div className="story-carousel">
          <button
            type="button"
            className="story-carousel-btn"
            onClick={() => go(-1)}
            aria-label="Previous chapter"
          >
            <ChevronLeft />
          </button>
          <div className="story-dots" role="tablist" aria-label="Story chapters">
            {STORY_CHAPTERS.map((ch, i) => (
              <button
                key={ch.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={ch.short}
                className={i === index ? "is-active" : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="story-carousel-btn"
            onClick={() => go(1)}
            aria-label="Next chapter"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

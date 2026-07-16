"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { STORY_CHAPTERS } from "@/lib/story";
import { useWallSwipe } from "@/components/use-wall-swipe";

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

/**
 * Origins — dual-buffer wall + wall-only swipe (kit: no section-level touch).
 */
export function StoryPanel() {
  const [index, setIndex] = useState(0);
  const n = STORY_CHAPTERS.length;
  const chapter = STORY_CHAPTERS[index];
  const panelRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const imgA = useRef<HTMLImageElement>(null);
  const imgB = useRef<HTMLImageElement>(null);
  const activeIsA = useRef(true);
  const indexRef = useRef(index);
  indexRef.current = index;

  const paintWall = useCallback((i: number, animate: boolean) => {
    const next = STORY_CHAPTERS[i];
    if (!next || !imgA.current || !imgB.current) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const active = activeIsA.current ? imgA.current : imgB.current;
    const idle = activeIsA.current ? imgB.current : imgA.current;

    if (!animate || reduced) {
      active.className = "story-wall-img is-active";
      idle.className = "story-wall-img is-park-right";
      active.src = next.image;
      active.style.objectPosition = next.position;
      return;
    }

    // Crossfade via dual layer: load idle, then flip active
    idle.onload = () => {
      idle.className = "story-wall-img is-active";
      active.className = "story-wall-img is-park-right";
      activeIsA.current = !activeIsA.current;
      idle.onload = null;
    };
    idle.style.objectPosition = next.position;
    if (idle.src.endsWith(next.image) || idle.getAttribute("src") === next.image) {
      idle.className = "story-wall-img is-active";
      active.className = "story-wall-img is-park-right";
      activeIsA.current = !activeIsA.current;
    } else {
      idle.src = next.image;
    }
  }, []);

  useEffect(() => {
    paintWall(index, true);
  }, [index, paintWall]);

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + n) % n);
    },
    [n]
  );

  const onPrev = useCallback(() => go(-1), [go]);
  const onNext = useCallback(() => go(1), [go]);

  // Panel-level + axis lock (stage covers wall; wall-only never fires on phone)
  useWallSwipe({
    rootRef: panelRef,
    onPrev,
    onNext,
    ignoreSelector:
      "button, a, input, .story-carousel-btn, .story-dot, .nav, .nav-links",
  });

  const first = STORY_CHAPTERS[0];

  return (
    <section
      className="story panel"
      id="story"
      data-tone="dark"
      ref={panelRef}
    >
      <div className="story-wall" ref={wallRef} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgA}
          className="story-wall-img is-active"
          src={first.image}
          alt=""
          width={1400}
          height={787}
          style={{ objectPosition: first.position }}
          decoding="async"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgB}
          className="story-wall-img is-park-right"
          src={first.image}
          alt=""
          width={1400}
          height={787}
          style={{ objectPosition: first.position }}
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
                className={`story-dot${i === index ? " is-active" : ""}`}
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

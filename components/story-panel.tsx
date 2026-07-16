"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { STORY_CHAPTERS } from "@/lib/story";
import { site } from "@/lib/site";

const SWEEP_MS = 650;
const COPY_FADE_MS = 220;
const STORY_AUTO_MS = 5600;
const STORY_USER_PAUSE_MS = 12000;

type Layer = {
  src: string;
  /** Desktop object-position */
  position: string;
  /** Phone portrait object-position */
  positionMobile: string;
  cls: string;
};

function layerFromChapter(
  chapter: (typeof STORY_CHAPTERS)[number],
  cls: string
): Layer {
  return {
    src: chapter.image,
    position: chapter.position,
    positionMobile: chapter.positionMobile || chapter.position,
    cls,
  };
}

function wallStyle(layer: Layer): CSSProperties {
  return {
    ["--story-pos" as string]: layer.position,
    ["--story-pos-m" as string]: layer.positionMobile,
  };
}

/**
 * The house — place-first carousel (House → Hands → Night):
 * dual-layer wall sweep, copy soft-fade, pips / swipe / ←→,
 * autoplay while in view (pauses after user input).
 */
export function StoryPanel() {
  const n = STORY_CHAPTERS.length;
  const first = STORY_CHAPTERS[0];

  const sectionRef = useRef<HTMLElement>(null);
  const indexRef = useRef(0);
  const reducedRef = useRef(false);
  const fadeGenRef = useRef(0);
  const previewGenRef = useRef(0);
  /** Which buffer is currently showing the active chapter */
  const activeBufRef = useRef<0 | 1>(0);
  const currentSrcRef = useRef(first.image);
  const userPausedUntilRef = useRef(0);
  const inViewRef = useRef(false);
  const autoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sweepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef<(dir: number, opts?: { fromAuto?: boolean }) => void>(
    () => {}
  );
  const preloadCache = useRef(new Map<string, Promise<string>>());

  const [index, setIndex] = useState(0);
  const [label, setLabel] = useState(first.label);
  const [body, setBody] = useState(first.body);
  const [copyFading, setCopyFading] = useState(false);
  const [layers, setLayers] = useState<[Layer, Layer]>([
    layerFromChapter(first, "story-wall-img is-active"),
    layerFromChapter(first, "story-wall-img is-park-right"),
  ]);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const preload = useCallback((src: string) => {
    if (!src) return Promise.resolve(src);
    const cache = preloadCache.current;
    if (cache.has(src)) return cache.get(src)!;
    const p = new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(src);
      img.src = src;
    });
    cache.set(src, p);
    return p;
  }, []);

  const stopAuto = useCallback(() => {
    if (autoTimerRef.current) {
      clearInterval(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }, []);

  const canAuto = useCallback(
    () =>
      inViewRef.current &&
      !reducedRef.current &&
      typeof document !== "undefined" &&
      !document.hidden &&
      n > 1,
    [n]
  );

  const startAuto = useCallback(() => {
    stopAuto();
    if (!canAuto()) return;
    autoTimerRef.current = setInterval(() => {
      if (!canAuto()) return;
      if (Date.now() < userPausedUntilRef.current) return;
      stepRef.current(1, { fromAuto: true });
    }, STORY_AUTO_MS);
  }, [canAuto, stopAuto]);

  const pauseAuto = useCallback(() => {
    userPausedUntilRef.current = Date.now() + STORY_USER_PAUSE_MS;
  }, []);

  const setWall = useCallback(
    async (
      src: string,
      position: string,
      positionMobile: string,
      dir: number,
      animate: boolean
    ) => {
      if (!src) return;
      if (src === currentSrcRef.current && animate) {
        /* Same plate — just reframe */
        const active = activeBufRef.current;
        setLayers((prev) => {
          const next: [Layer, Layer] = [...prev] as [Layer, Layer];
          next[active] = { ...next[active], position, positionMobile };
          return next;
        });
        return;
      }

      const gen = ++previewGenRef.current;
      await preload(src);
      if (gen !== previewGenRef.current) return;

      const goForward = dir >= 0;
      const reduced = reducedRef.current || !animate;
      const active = activeBufRef.current;
      const idle = (active === 0 ? 1 : 0) as 0 | 1;

      if (sweepTimerRef.current) {
        clearTimeout(sweepTimerRef.current);
        sweepTimerRef.current = null;
      }

      if (reduced) {
        setLayers((prev) => {
          const next: [Layer, Layer] = [...prev] as [Layer, Layer];
          next[idle] = {
            src,
            position,
            positionMobile,
            cls: "story-wall-img is-active",
          };
          next[active] = {
            ...next[active],
            cls: "story-wall-img is-park-right",
          };
          return next;
        });
        activeBufRef.current = idle;
        currentSrcRef.current = src;
        return;
      }

      /* 1) Park incoming off-screen on entry side */
      setLayers((prev) => {
        const next: [Layer, Layer] = [...prev] as [Layer, Layer];
        next[idle] = {
          src,
          position,
          positionMobile,
          cls: `story-wall-img ${goForward ? "is-park-right" : "is-park-left"}`,
        };
        return next;
      });

      activeBufRef.current = idle;
      currentSrcRef.current = src;
      const leaving = active;
      const entering = idle;

      /* 2) Double-rAF: paint park, then sweep both layers */
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (gen !== previewGenRef.current) return;

          setLayers((prev) => {
            const next: [Layer, Layer] = [...prev] as [Layer, Layer];
            next[leaving] = {
              ...next[leaving],
              cls: `story-wall-img ${goForward ? "is-leave-left" : "is-leave-right"}`,
            };
            next[entering] = {
              ...next[entering],
              cls: "story-wall-img is-active",
            };
            return next;
          });

          sweepTimerRef.current = setTimeout(() => {
            sweepTimerRef.current = null;
            setLayers((prev) => {
              const next: [Layer, Layer] = [...prev] as [Layer, Layer];
              /* Only park if this buffer is still the idle one */
              if (activeBufRef.current !== leaving) {
                next[leaving] = {
                  ...next[leaving],
                  cls: `story-wall-img ${goForward ? "is-park-left" : "is-park-right"}`,
                };
              }
              return next;
            });
          }, SWEEP_MS);
        });
      });
    },
    [preload]
  );

  const applyChapter = useCallback(
    (i: number, opts: { animate?: boolean; dir?: number } = {}) => {
      const chapter = STORY_CHAPTERS[i];
      if (!chapter) return;
      const from = indexRef.current;
      const animate = opts.animate !== false;
      const reduced = reducedRef.current;

      let sweepDir = opts.dir;
      if (sweepDir == null && i !== from) {
        const forward = (i - from + n) % n;
        const backward = (from - i + n) % n;
        sweepDir = forward <= backward ? 1 : -1;
      }
      if (sweepDir == null) sweepDir = 1;

      indexRef.current = i;
      setIndex(i);
      const gen = ++fadeGenRef.current;

      if (!animate || reduced) {
        if (fadeTimerRef.current) {
          clearTimeout(fadeTimerRef.current);
          fadeTimerRef.current = null;
        }
        setCopyFading(false);
        setLabel(chapter.label);
        setBody(chapter.body);
        void setWall(
          chapter.image,
          chapter.position,
          chapter.positionMobile || chapter.position,
          sweepDir,
          false
        );
        return;
      }

      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }

      setCopyFading(true);
      void setWall(
        chapter.image,
        chapter.position,
        chapter.positionMobile || chapter.position,
        sweepDir,
        true
      );

      fadeTimerRef.current = setTimeout(() => {
        fadeTimerRef.current = null;
        if (gen !== fadeGenRef.current) return;
        const ch = STORY_CHAPTERS[indexRef.current];
        if (!ch) return;
        setLabel(ch.label);
        setBody(ch.body);
        requestAnimationFrame(() => {
          if (gen !== fadeGenRef.current) return;
          setCopyFading(false);
        });
      }, COPY_FADE_MS);
    },
    [n, setWall]
  );

  const step = useCallback(
    (dir: number, opts: { fromAuto?: boolean } = {}) => {
      const next = (indexRef.current + dir + n) % n;
      applyChapter(next, { dir });
      if (!opts.fromAuto) pauseAuto();
    },
    [applyChapter, n, pauseAuto]
  );

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  /* Autoplay while The house is on screen */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
    const rootEl =
      isMobile() && document.getElementById("top")
        ? document.getElementById("top")
        : null;

    if (!("IntersectionObserver" in window)) {
      inViewRef.current = true;
      startAuto();
      return () => stopAuto();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current =
          Boolean(entry?.isIntersecting) &&
          (entry?.intersectionRatio ?? 0) > 0.25;
        if (inViewRef.current) startAuto();
        else stopAuto();
      },
      { root: rootEl, threshold: [0, 0.25, 0.5, 0.75] }
    );
    io.observe(section);

    const onVis = () => {
      if (document.hidden) stopAuto();
      else if (canAuto()) startAuto();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      stopAuto();
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (sweepTimerRef.current) clearTimeout(sweepTimerRef.current);
    };
  }, [canAuto, startAuto, stopAuto]);

  /* Horizontal swipe (original touch/pointer path) */
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let startT = 0;
    let tracking = false;
    let committed = false;
    let pointerId: number | null = null;
    let axis: null | "h" | "v" = null;
    let mode: "touch" | "mouse" | null = null;
    let docBound = false;

    const SLOP = 8;
    const SWIPE = 28;
    const FLICK_DX = 18;
    const FLICK_V = 0.35;

    const shouldIgnore = (t: EventTarget | null) => {
      if (!(t instanceof Element)) return true;
      return Boolean(
        t.closest(
          "button, a, .nav, .story-carousel, input, select, textarea"
        )
      );
    };

    const unbindDoc = () => {
      if (!docBound) return;
      docBound = false;
      document.removeEventListener("touchmove", onDocTouchMove, true);
      document.removeEventListener("touchend", onDocTouchEnd, true);
      document.removeEventListener("touchcancel", onDocTouchEnd, true);
      document.removeEventListener("pointermove", onDocPointerMove, true);
      document.removeEventListener("pointerup", onDocPointerUp, true);
      document.removeEventListener("pointercancel", onDocPointerUp, true);
    };

    const reset = () => {
      unbindDoc();
      tracking = false;
      committed = false;
      pointerId = null;
      axis = null;
      mode = null;
    };

    const fire = (dir: number) => {
      if (committed) return;
      committed = true;
      if (dir > 0) stepRef.current(1);
      else stepRef.current(-1);
    };

    const maybeLockAxis = () => {
      if (axis) return axis;
      const adx = Math.abs(lastX - startX);
      const ady = Math.abs(lastY - startY);
      if (adx < SLOP && ady < SLOP) return null;
      if (adx >= ady && adx >= SLOP) {
        axis = "h";
      } else if (ady > adx) {
        axis = "v";
        tracking = false;
        unbindDoc();
      }
      return axis;
    };

    const onMove = (x: number, y: number, e?: Event) => {
      if (!tracking) return;
      lastX = x;
      lastY = y;
      const locked = maybeLockAxis();
      if (locked === "h") {
        if (e && "cancelable" in e && (e as Event).cancelable) {
          e.preventDefault();
        }
        const dx = lastX - startX;
        if (!committed && Math.abs(dx) >= SWIPE) {
          fire(dx < 0 ? 1 : -1);
        }
      }
    };

    const onUp = () => {
      if (!tracking) {
        reset();
        return;
      }
      const dx = lastX - startX;
      const dt = Math.max(1, performance.now() - startT);
      const v = Math.abs(dx) / dt;
      if (!committed && axis === "h") {
        if (
          Math.abs(dx) >= SWIPE ||
          (Math.abs(dx) >= FLICK_DX && v >= FLICK_V)
        ) {
          fire(dx < 0 ? 1 : -1);
        }
      }
      reset();
    };

    const onDown = (
      x: number,
      y: number,
      id: number | null,
      target: EventTarget | null,
      m: "touch" | "mouse"
    ) => {
      if (shouldIgnore(target)) return false;
      tracking = true;
      committed = false;
      axis = null;
      mode = m;
      pointerId = id;
      startX = lastX = x;
      startY = lastY = y;
      startT = performance.now();
      return true;
    };

    function onDocTouchMove(e: TouchEvent) {
      if (!tracking || mode !== "touch" || !e.changedTouches?.length) return;
      const t =
        [...e.changedTouches].find((x) => x.identifier === pointerId) ||
        e.touches?.[0] ||
        e.changedTouches[0];
      if (!t) return;
      onMove(t.clientX, t.clientY, e);
    }

    function onDocTouchEnd(e: TouchEvent) {
      if (!tracking || mode !== "touch") return;
      const t = e.changedTouches
        ? [...e.changedTouches].find((x) => x.identifier === pointerId)
        : null;
      if (!t && pointerId != null && e.type === "touchend") return;
      if (t) {
        lastX = t.clientX;
        lastY = t.clientY;
      }
      onUp();
    }

    function onDocPointerMove(e: PointerEvent) {
      if (!tracking || mode !== "mouse") return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      onMove(e.clientX, e.clientY, e);
    }

    function onDocPointerUp(e: PointerEvent) {
      if (!tracking || mode !== "mouse") return;
      if (pointerId != null && e.pointerId !== pointerId) return;
      lastX = e.clientX;
      lastY = e.clientY;
      onUp();
    }

    const prefersTouch =
      "ontouchstart" in window ||
      (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0);

    const onTouchStart = (e: TouchEvent) => {
      if (!e.changedTouches?.length) return;
      if (e.touches && e.touches.length > 1) return;
      const t = e.changedTouches[0];
      if (!onDown(t.clientX, t.clientY, t.identifier, e.target, "touch")) {
        return;
      }
      if (!docBound) {
        docBound = true;
        document.addEventListener("touchmove", onDocTouchMove, {
          capture: true,
          passive: false,
        });
        document.addEventListener("touchend", onDocTouchEnd, {
          capture: true,
          passive: true,
        });
        document.addEventListener("touchcancel", onDocTouchEnd, {
          capture: true,
          passive: true,
        });
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (prefersTouch && e.pointerType !== "mouse") return;
      if (e.button !== 0) return;
      if (!onDown(e.clientX, e.clientY, e.pointerId, e.target, "mouse")) {
        return;
      }
      if (!docBound) {
        docBound = true;
        document.addEventListener("pointermove", onDocPointerMove, true);
        document.addEventListener("pointerup", onDocPointerUp, true);
        document.addEventListener("pointercancel", onDocPointerUp, true);
      }
    };

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("pointerdown", onPointerDown, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (!inViewRef.current) return;
      const t = e.target as Element | null;
      if (t?.closest?.("input, textarea, select, a, button")) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepRef.current(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepRef.current(1);
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      unbindDoc();
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="story panel"
      id="story"
      data-tone="dark"
    >
      <div className="story-wall" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={layers[0].cls}
          src={layers[0].src}
          alt=""
          width={1400}
          height={787}
          style={wallStyle(layers[0])}
          decoding="async"
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={layers[1].cls}
          src={layers[1].src}
          alt=""
          width={1400}
          height={787}
          style={wallStyle(layers[1])}
          decoding="async"
          draggable={false}
        />
      </div>

      <div className="stage story-stage">
        <header className="story-head">
          <div className="story-head-title">
            <h2>
              <span className="en">{site.sections.story.en}</span>
              <span className="cn" lang="zh-Hans">
                {site.sections.story.cn}
              </span>
            </h2>
          </div>
        </header>

        <div
          className={`story-spotlight${copyFading ? " is-fading" : ""}`}
          aria-live="polite"
        >
          <span className="story-label">{label}</span>
          <p className="en">{body}</p>
        </div>

        {/*
          Quiet chapter pips only — swipe / autoplay / ←→ do the motion.
          Chevrons removed: too much chrome for a craft house.
        */}
        <nav
          className="story-carousel"
          role="tablist"
          aria-label={site.sections.story.chaptersAria}
        >
          {STORY_CHAPTERS.map((ch, i) => (
            <button
              key={ch.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={ch.label}
              title={ch.short}
              className={`story-dot${i === index ? " is-active" : ""}`}
              onClick={() => {
                if (i !== indexRef.current) {
                  applyChapter(i);
                  pauseAuto();
                }
              }}
            >
              <span className="story-dot-label">{ch.short}</span>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}

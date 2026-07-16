"use client";

import { useEffect, useState, type RefObject } from "react";

type Options = {
  /** Full-quality source (desktop) — min 720p */
  src: string;
  /** Lighter 720p encode for narrow viewports (still ≥720p, never 540) */
  srcMobile?: string;
  /** Switch to mobile src below this width (default 900) */
  mobileMaxWidth?: number;
  /** Intersection ratio to start playback (default 0.28) */
  threshold?: number;
};

/**
 * Balanced full-bleed panel video:
 * - poster until in view
 * - load only when near/in view
 * - play while visible, pause when off-screen or tab hidden
 * - mobile uses lighter encode when provided
 * - respects prefers-reduced-motion (no video)
 */
export function usePanelVideo(
  videoRef: RefObject<HTMLVideoElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  { src, srcMobile, mobileMaxWidth = 900, threshold = 0.28 }: Options
) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const panel = panelRef.current;
    if (!video || !panel) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    /* Initial ready is false — leave poster; no sync setState in effect */
    if (reduced) {
      return;
    }

    let cancelled = false;
    let loaded = false;
    let wantPlay = false;

    const pickSrc = () => {
      const narrow = window.matchMedia(
        `(max-width: ${mobileMaxWidth}px)`
      ).matches;
      return narrow && srcMobile ? srcMobile : src;
    };

    const ensureLoaded = () => {
      if (loaded || cancelled) return;
      const next = pickSrc();
      if (video.getAttribute("src") !== next && video.currentSrc !== next) {
        video.src = next;
      }
      /* Ensure data starts flowing */
      if (video.preload !== "auto") {
        video.preload = "auto";
      }
      try {
        video.load();
      } catch {
        /* ignore */
      }
      loaded = true;
    };

    const tryPlay = () => {
      if (cancelled || !wantPlay) return;
      ensureLoaded();
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => {
          if (!cancelled) setReady(true);
        }).catch(() => {
          /* autoplay blocked — keep poster */
        });
      }
    };

    const pause = () => {
      wantPlay = false;
      if (!video.paused) video.pause();
    };

    const onCanPlay = () => {
      if (wantPlay) tryPlay();
    };

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("loadeddata", onCanPlay);

    const isMobileShell = () =>
      window.matchMedia("(max-width: 768px)").matches;
    const scrollRoot =
      isMobileShell() && document.getElementById("top")
        ? document.getElementById("top")
        : null;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        const on =
          entry.isIntersecting && entry.intersectionRatio >= threshold;
        if (on) {
          wantPlay = true;
          tryPlay();
        } else {
          /* Pause frees most decode work; keep buffer so return is smooth */
          pause();
        }
      },
      {
        root: scrollRoot,
        threshold: [0, 0.15, 0.28, 0.5, 0.75],
        /* Start loading slightly before fully on-screen */
        rootMargin: "12% 0px",
      }
    );

    io.observe(panel);

    const onVisibility = () => {
      if (document.hidden) {
        if (!video.paused) video.pause();
      } else if (wantPlay) {
        tryPlay();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("loadeddata", onCanPlay);
      pause();
    };
  }, [videoRef, panelRef, src, srcMobile, mobileMaxWidth, threshold]);

  return ready;
}

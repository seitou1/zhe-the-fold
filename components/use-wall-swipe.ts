"use client";

import { useEffect, type RefObject } from "react";

type PanelSwipeOptions = {
  /**
   * Panel root (section) — not main#top.
   * On mobile the ledger covers the wall, so wall-only listeners never fire.
   * Axis lock: horizontal = prev/next; vertical = leave alone (list/page scroll).
   */
  rootRef: RefObject<HTMLElement | null>;
  onPrev: () => void;
  onNext: () => void;
  enabled?: boolean;
  /** Don't start a gesture on these (filters, chevrons, links). */
  ignoreSelector?: string;
};

/**
 * Horizontal swipe for Story/Menu carousels.
 * Port of static bindCarouselGestures rules — wall-or-panel, never ledger-only wall.
 */
export function useWallSwipe({
  rootRef,
  onPrev,
  onNext,
  enabled = true,
  ignoreSelector = "button, a, input, select, textarea, .filter-btn, .story-carousel-btn, .story-dot, .nav, .nav-links",
}: PanelSwipeOptions) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let tracking = false;
    let axis: null | "h" | "v" = null;
    let touchId: number | null = null;
    let committed = false;
    let docBound = false;

    const SLOP = 8;
    const SWIPE = 28;

    const unbindDoc = () => {
      if (!docBound) return;
      docBound = false;
      document.removeEventListener("touchmove", onDocMove, true);
      document.removeEventListener("touchend", onDocEnd, true);
      document.removeEventListener("touchcancel", onDocEnd, true);
    };

    const reset = () => {
      unbindDoc();
      tracking = false;
      axis = null;
      touchId = null;
      committed = false;
    };

    const fire = (dir: number) => {
      if (committed) return;
      committed = true;
      if (dir > 0) onNext();
      else onPrev();
    };

    const bindDoc = () => {
      if (docBound) return;
      docBound = true;
      document.addEventListener("touchmove", onDocMove, {
        capture: true,
        passive: false,
      });
      document.addEventListener("touchend", onDocEnd, {
        capture: true,
        passive: true,
      });
      document.addEventListener("touchcancel", onDocEnd, {
        capture: true,
        passive: true,
      });
    };

    const onStart = (x: number, y: number, id: number, target: EventTarget | null) => {
      if (
        target instanceof Element &&
        ignoreSelector &&
        target.closest(ignoreSelector)
      ) {
        return false;
      }
      // Never steal from nested scrollers' chrome only — list items OK (axis lock)
      tracking = true;
      committed = false;
      axis = null;
      touchId = id;
      startX = lastX = x;
      startY = lastY = y;
      return true;
    };

    const onMove = (x: number, y: number, cancelable: boolean, prevent: () => void) => {
      if (!tracking || committed) return;
      lastX = x;
      lastY = y;
      if (axis === "v") return;

      if (!axis) {
        const adx = Math.abs(x - startX);
        const ady = Math.abs(y - startY);
        if (adx < SLOP && ady < SLOP) return;
        // Prefer horizontal when travel is at least as large as vertical
        if (adx >= ady && adx >= SLOP) {
          axis = "h";
        } else if (ady > adx) {
          axis = "v";
          tracking = false;
          unbindDoc();
          return;
        }
      }

      if (axis === "h") {
        if (cancelable) prevent();
        const dx = x - startX;
        if (Math.abs(dx) >= SWIPE) fire(dx < 0 ? 1 : -1);
      }
    };

    const onEnd = () => {
      if (tracking && !committed && axis === "h") {
        const dx = lastX - startX;
        if (Math.abs(dx) >= SWIPE * 0.7) fire(dx < 0 ? 1 : -1);
      }
      reset();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (!e.changedTouches?.length) return;
      if (e.touches && e.touches.length > 1) return;
      const t = e.changedTouches[0];
      if (!onStart(t.clientX, t.clientY, t.identifier, e.target)) return;
      bindDoc();
    };

    function onDocMove(e: TouchEvent) {
      if (!tracking || touchId == null) return;
      const t =
        [...e.changedTouches].find((x) => x.identifier === touchId) ||
        e.touches?.[0];
      if (!t) return;
      onMove(t.clientX, t.clientY, e.cancelable, () => e.preventDefault());
    }

    function onDocEnd(e: TouchEvent) {
      if (!tracking) return;
      if (touchId != null && e.changedTouches) {
        const t = [...e.changedTouches].find((x) => x.identifier === touchId);
        if (!t && e.type === "touchend") return;
      }
      onEnd();
    }

    root.addEventListener("touchstart", onTouchStart, {
      passive: true,
      capture: true,
    });

    return () => {
      root.removeEventListener("touchstart", onTouchStart, true);
      unbindDoc();
    };
  }, [rootRef, onPrev, onNext, enabled, ignoreSelector]);
}

/** @deprecated alias — same hook */
export const usePanelSwipe = useWallSwipe;

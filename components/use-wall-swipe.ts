"use client";

import { useEffect, type RefObject } from "react";

type WallSwipeOptions = {
  /** Element that receives gestures — wall only, never ledger/main */
  wallRef: RefObject<HTMLElement | null>;
  onPrev: () => void;
  onNext: () => void;
  enabled?: boolean;
  /** Ignore if touch starts inside these selectors (relative to wall; usually empty) */
  ignoreSelector?: string;
};

/**
 * Horizontal swipe on a photo wall only (static script.js lesson).
 * Left = next, right = prev. Vertical leave for page scroll.
 * Never attach to #top / .menu-ledger.
 */
export function useWallSwipe({
  wallRef,
  onPrev,
  onNext,
  enabled = true,
  ignoreSelector = "button, a, input, select, textarea",
}: WallSwipeOptions) {
  useEffect(() => {
    const root = wallRef.current;
    if (!root || !enabled) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Still allow swipe under reduced motion — it's intentional navigation

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let tracking = false;
    let axis: null | "h" | "v" = null;
    let pointerId: number | null = null;
    let committed = false;

    const SLOP = 10;
    const SWIPE = 36;

    const reset = () => {
      tracking = false;
      axis = null;
      pointerId = null;
      committed = false;
    };

    const fire = (dir: number) => {
      if (committed) return;
      committed = true;
      if (dir > 0) onNext();
      else onPrev();
    };

    const onStart = (x: number, y: number, id: number, target: EventTarget | null) => {
      if (
        target instanceof Element &&
        ignoreSelector &&
        target.closest(ignoreSelector)
      ) {
        return false;
      }
      tracking = true;
      committed = false;
      axis = null;
      pointerId = id;
      startX = lastX = x;
      startY = lastY = y;
      return true;
    };

    const onMove = (x: number, y: number, prevent: () => void) => {
      if (!tracking || committed) return;
      lastX = x;
      lastY = y;
      if (axis === "v") return;
      if (!axis) {
        const adx = Math.abs(x - startX);
        const ady = Math.abs(y - startY);
        if (adx < SLOP && ady < SLOP) return;
        if (adx >= ady && adx >= SLOP) axis = "h";
        else if (ady > adx) {
          axis = "v";
          tracking = false;
          return;
        }
      }
      if (axis === "h") {
        prevent();
        const dx = x - startX;
        if (Math.abs(dx) >= SWIPE) fire(dx < 0 ? 1 : -1);
      }
    };

    const onEnd = () => {
      if (tracking && !committed && axis === "h") {
        const dx = lastX - startX;
        if (Math.abs(dx) >= SWIPE * 0.75) fire(dx < 0 ? 1 : -1);
      }
      reset();
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.changedTouches[0];
      onStart(t.clientX, t.clientY, t.identifier, e.target);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!tracking || pointerId == null) return;
      const t = [...e.changedTouches].find((x) => x.identifier === pointerId);
      if (!t) return;
      onMove(t.clientX, t.clientY, () => {
        if (e.cancelable) e.preventDefault();
      });
    };

    const onTouchEnd = () => onEnd();

    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    root.addEventListener("touchcancel", onTouchEnd, { passive: true });

    // Desktop drag optional via pointer (mouse only)
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (!onStart(e.clientX, e.clientY, e.pointerId, e.target)) return;
      root.setPointerCapture?.(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!tracking || e.pointerId !== pointerId) return;
      onMove(e.clientX, e.clientY, () => e.preventDefault());
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      onEnd();
    };

    root.addEventListener("pointerdown", onPointerDown);
    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerup", onPointerUp);
    root.addEventListener("pointercancel", onPointerUp);

    void reduced;

    return () => {
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      root.removeEventListener("touchcancel", onTouchEnd);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerup", onPointerUp);
      root.removeEventListener("pointercancel", onPointerUp);
    };
  }, [wallRef, onPrev, onNext, enabled, ignoreSelector]);
}

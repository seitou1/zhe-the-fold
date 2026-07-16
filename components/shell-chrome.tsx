"use client";

import { useEffect } from "react";

/**
 * Mobile shell: --shell-h for iOS URL bar, past-hero nav, active section.
 * Soft snap-assist after fling so proximity snap still settles cleanly.
 */
export function ShellChrome() {
  useEffect(() => {
    let lastShellH = 0;
    let pastHeroLatch = false;
    let scrolling = false;
    let snapping = false;
    let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null;
    const hasScrollEnd =
      typeof window !== "undefined" && "onscrollend" in window;

    const isMobile = () =>
      Boolean(window.matchMedia("(max-width: 768px)").matches);

    const mainEl = () => document.getElementById("top");

    const syncMobileShell = () => {
      if (!isMobile()) {
        if (lastShellH !== 0) {
          document.documentElement.style.removeProperty("--shell-h");
          lastShellH = 0;
        }
        return;
      }
      /* Avoid reflow mid-swipe — height thrash feels like janky snap */
      if (scrolling || snapping) return;

      const vv = window.visualViewport;
      const vvH = (vv && vv.height) || 0;
      const layoutH =
        window.innerHeight || document.documentElement.clientHeight || 0;
      const h = Math.round(Math.max(vvH, layoutH));
      if (h < 80) return;
      /* Ignore small URL-bar noise */
      if (Math.abs(h - lastShellH) < 12) return;
      lastShellH = h;
      document.documentElement.style.setProperty("--shell-h", `${h}px`);
    };

    const updateNav = () => {
      const nav = document.getElementById("nav");
      const hero = document.getElementById("hero");
      if (!nav) return;
      const vh = isMobile()
        ? lastShellH ||
          window.visualViewport?.height ||
          window.innerHeight ||
          1
        : window.innerHeight || 1;

      if (hero) {
        const hb = hero.getBoundingClientRect().bottom;
        if (!pastHeroLatch && hb < vh * 0.38) pastHeroLatch = true;
        if (pastHeroLatch && hb > vh * 0.72) pastHeroLatch = false;
      }
      nav.classList.toggle("is-past-hero", pastHeroLatch);

      const mid = vh * 0.45;
      let activeId = "hero";
      for (const id of ["hero", "story", "menu", "visit"] as const) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) {
          activeId = id;
          break;
        }
      }
      nav.querySelectorAll(".nav-links a[href^='#']").forEach((a) => {
        const href = a.getAttribute("href") || "";
        a.classList.toggle("is-active", href === `#${activeId}`);
      });
    };

    /** Settle to nearest full panel after a fling (proximity snap assist). */
    const snapToNearestPanel = () => {
      if (!isMobile() || snapping) return;
      const main = mainEl();
      if (!main) return;

      const list = Array.from(
        main.querySelectorAll<HTMLElement>(":scope > .panel")
      );
      if (!list.length) return;

      const top = main.scrollTop;
      const viewH = main.clientHeight || 1;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;

      for (const p of list) {
        const dist = Math.abs(p.offsetTop - top);
        if (dist < bestDist) {
          bestDist = dist;
          best = p;
        }
      }

      if (!best) return;
      if (bestDist < 6) return;
      if (bestDist > viewH * 0.4) return;

      snapping = true;
      /* Instant settle — smooth + snap fights the finger trail on iOS */
      main.scrollTo({ top: best.offsetTop, behavior: "auto" });
      window.requestAnimationFrame(() => {
        snapping = false;
        updateNav();
      });
    };

    const onScroll = () => {
      if (snapping) return;
      scrolling = true;
      updateNav();

      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        scrolling = false;
        syncMobileShell();
        /* Safari < 17: no scrollend — settle after idle */
        if (!hasScrollEnd) {
          snapToNearestPanel();
          updateNav();
        }
      }, 160);
    };

    const onScrollEnd = () => {
      if (snapping) return;
      scrolling = false;
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      snapToNearestPanel();
      syncMobileShell();
      updateNav();
    };

    syncMobileShell();
    updateNav();

    window.addEventListener("resize", syncMobileShell, { passive: true });
    window.addEventListener("orientationchange", syncMobileShell);
    window.visualViewport?.addEventListener("resize", syncMobileShell, {
      passive: true,
    });
    window.visualViewport?.addEventListener("scroll", syncMobileShell, {
      passive: true,
    });

    const main = mainEl();
    main?.addEventListener("scroll", onScroll, { passive: true });
    main?.addEventListener("scrollend", onScrollEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", syncMobileShell);
      window.removeEventListener("orientationchange", syncMobileShell);
      window.visualViewport?.removeEventListener("resize", syncMobileShell);
      window.visualViewport?.removeEventListener("scroll", syncMobileShell);
      main?.removeEventListener("scroll", onScroll);
      main?.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("scroll", onScroll);
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
    };
  }, []);

  return null;
}

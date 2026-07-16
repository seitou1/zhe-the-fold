"use client";

import { useEffect } from "react";

const SECTION_IDS = ["hero", "story", "menu", "visit"] as const;

/**
 * Mobile shell: --shell-h for iOS URL bar, past-hero nav, active section.
 * Active section uses IntersectionObserver with main#top as root on phone
 * (same as the static craft site) so snap-scroll reliably drives .is-active.
 */
export function ShellChrome() {
  useEffect(() => {
    let lastShellH = 0;
    let pastHeroLatch = false;
    let scrolling = false;
    let scrollIdleTimer: ReturnType<typeof setTimeout> | null = null;
    let sectionObs: IntersectionObserver | null = null;

    const isMobile = () =>
      Boolean(window.matchMedia("(max-width: 768px)").matches);

    const mainEl = () => document.getElementById("top");

    const setActiveSection = (activeId: string) => {
      const nav = document.getElementById("nav");
      if (!nav) return;
      nav.querySelectorAll(".nav-links a[href^='#']").forEach((a) => {
        const href = a.getAttribute("href") || "";
        const on =
          href === `#${activeId}` ||
          (activeId === "hero" && (href === "#hero" || href === "#top"));
        a.classList.toggle("is-active", on);
      });
    };

    /**
     * Fallback mid-line pick when IO is unavailable, or for an immediate
     * sync after resize / snap settle.
     */
    const activeFromGeometry = (): string => {
      const mid =
        ((isMobile()
          ? mainEl()?.clientHeight ||
            lastShellH ||
            window.visualViewport?.height
          : window.innerHeight) || 1) * 0.45;

      let bestId: string = "hero";
      let bestDist = Infinity;

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.height < 8) continue;
        if (r.top <= mid && r.bottom > mid) return id;
        const c = (r.top + r.bottom) / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          bestId = id;
        }
      }
      return bestId;
    };

    const syncMobileShell = () => {
      if (!isMobile()) {
        if (lastShellH !== 0) {
          document.documentElement.style.removeProperty("--shell-h");
          lastShellH = 0;
        }
        return;
      }
      /* Avoid reflow mid-swipe — height thrash fights mandatory snap */
      if (scrolling) return;

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

    /** Past-hero latch only — active section is owned by the observer. */
    const updatePastHero = () => {
      const nav = document.getElementById("nav");
      const hero = document.getElementById("hero");
      if (!nav) return;

      const main = mainEl();
      const vh = isMobile()
        ? main?.clientHeight ||
          lastShellH ||
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
    };

    const bindSectionObserver = () => {
      sectionObs?.disconnect();
      sectionObs = null;

      const sections = SECTION_IDS.map((id) =>
        document.getElementById(id)
      ).filter((el): el is HTMLElement => Boolean(el));
      if (!sections.length) return;

      if (!("IntersectionObserver" in window)) {
        setActiveSection(activeFromGeometry());
        return;
      }

      const root = isMobile() ? mainEl() : null;

      sectionObs = new IntersectionObserver(
        (entries) => {
          /* Prefer the most-visible intersecting panel in this batch */
          let best: IntersectionObserverEntry | null = null;
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            if (
              !best ||
              entry.intersectionRatio > best.intersectionRatio
            ) {
              best = entry;
            }
          }
          if (!best) return;
          setActiveSection(best.target.id);
        },
        {
          root,
          /* Band through the middle of the scrollport — original craft */
          rootMargin: "-40% 0px -45% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      sections.forEach((s) => sectionObs!.observe(s));
      /* Immediate paint before first IO callback */
      setActiveSection(activeFromGeometry());
    };

    const onScroll = () => {
      scrolling = true;
      updatePastHero();
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => {
        scrolling = false;
        syncMobileShell();
        /* Safari without reliable IO mid-snap: re-sync from geometry */
        setActiveSection(activeFromGeometry());
      }, 160);
    };

    const onScrollEnd = () => {
      scrolling = false;
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      syncMobileShell();
      updatePastHero();
      setActiveSection(activeFromGeometry());
    };

    const onBreakOrResize = () => {
      syncMobileShell();
      bindSectionObserver();
      updatePastHero();
    };

    syncMobileShell();
    bindSectionObserver();
    updatePastHero();

    window.addEventListener("resize", onBreakOrResize, { passive: true });
    window.addEventListener("orientationchange", onBreakOrResize);
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

    const mq = window.matchMedia("(max-width: 768px)");
    const onMq = () => onBreakOrResize();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onMq);
    } else {
      mq.addListener(onMq);
    }

    return () => {
      window.removeEventListener("resize", onBreakOrResize);
      window.removeEventListener("orientationchange", onBreakOrResize);
      window.visualViewport?.removeEventListener("resize", syncMobileShell);
      window.visualViewport?.removeEventListener("scroll", syncMobileShell);
      main?.removeEventListener("scroll", onScroll);
      main?.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("scroll", onScroll);
      if (typeof mq.removeEventListener === "function") {
        mq.removeEventListener("change", onMq);
      } else {
        mq.removeListener(onMq);
      }
      sectionObs?.disconnect();
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
    };
  }, []);

  return null;
}

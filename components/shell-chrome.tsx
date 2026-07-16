"use client";

import { useEffect } from "react";

/**
 * Port of static script.js syncMobileShell + past-hero nav latch.
 * Keeps --shell-h correct when iOS URL bar shows/hides.
 */
export function ShellChrome() {
  useEffect(() => {
    let lastShellH = 0;
    let pastHeroLatch = false;

    const isMobile = () =>
      Boolean(window.matchMedia("(max-width: 768px)").matches);

    const syncMobileShell = () => {
      if (!isMobile()) {
        if (lastShellH !== 0) {
          document.documentElement.style.removeProperty("--shell-h");
          lastShellH = 0;
        }
        return;
      }
      const vv = window.visualViewport;
      const vvH = (vv && vv.height) || 0;
      const layoutH =
        window.innerHeight || document.documentElement.clientHeight || 0;
      const h = Math.round(Math.max(vvH, layoutH));
      if (h < 80) return;
      if (Math.abs(h - lastShellH) < 1) return;
      lastShellH = h;
      document.documentElement.style.setProperty("--shell-h", `${h}px`);
    };

    const updateNav = () => {
      const nav = document.getElementById("nav");
      const hero = document.getElementById("hero");
      if (!nav) return;
      const main = document.getElementById("top");
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

      // Active section link
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

    const onScroll = () => {
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

    const main = document.getElementById("top");
    main?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", syncMobileShell);
      window.removeEventListener("orientationchange", syncMobileShell);
      window.visualViewport?.removeEventListener("resize", syncMobileShell);
      window.visualViewport?.removeEventListener("scroll", syncMobileShell);
      main?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return null;
}

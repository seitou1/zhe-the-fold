"use client";

import { useEffect, useState } from "react";

/** Thin top progress bar — original craft chrome */
export function ScrollProgress() {
  const [t, setT] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const main = document.getElementById("top");
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      let y = 0;
      let max = 1;
      if (isMobile && main) {
        y = main.scrollTop;
        max = Math.max(main.scrollHeight - main.clientHeight, 1);
      } else {
        const root = document.scrollingElement || document.documentElement;
        y = root.scrollTop;
        max = Math.max(root.scrollHeight - window.innerHeight, 1);
      }
      setT(Math.min(1, Math.max(0, y / max)));
    };
    onScroll();
    const main = document.getElementById("top");
    main?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      main?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span
        className="scroll-progress-bar"
        style={{ transform: `scale3d(${t}, 1, 1)` }}
      />
    </div>
  );
}

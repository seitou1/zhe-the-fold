"use client";

import { useEffect, useState } from "react";
import { getKitchenStatus, type KitchenStatus } from "@/lib/hours";

/**
 * Nav open/closed chip — same idea as static site data-zhe-open-chip.
 * Client-only so “now” is the guest’s clock in Eastern kitchen TZ.
 */
export function OpenChip() {
  const [status, setStatus] = useState<KitchenStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(getKitchenStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) {
    return (
      <span
        className="hidden min-w-0 items-center gap-2 font-ui text-[0.7rem] tracking-[0.04em] text-cream/50 sm:inline-flex"
        aria-hidden
      >
        …
      </span>
    );
  }

  return (
    <span
      className={`hidden min-w-0 items-center gap-2 font-ui text-[0.7rem] tracking-[0.04em] sm:inline-flex ${
        status.open ? "text-wheat" : "text-cream/55"
      }`}
      title={status.title}
      aria-label={status.title}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
          status.open ? "bg-wheat shadow-[0_0_8px_rgba(208,192,160,0.7)]" : "bg-cream/35"
        }`}
        aria-hidden
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate">{status.state}</span>
        {status.meta ? (
          <span className="truncate text-[0.65rem] text-cream/45">{status.meta}</span>
        ) : null}
      </span>
    </span>
  );
}

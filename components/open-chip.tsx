"use client";

import { useSiteOps } from "@/components/site-ops-provider";
import { getKitchenStatus } from "@/lib/hours";

/** Original .nav-hours open/closed chip */
export function OpenChip() {
  const ops = useSiteOps();
  const status = getKitchenStatus(new Date(), ops.hours, ops.kitchen);

  return (
    <span
      className={`nav-hours ${status.open ? "is-open" : "is-closed"}`}
      aria-live="polite"
      title={status.title}
      aria-label={status.title}
    >
      <span className="nav-hours-mark" aria-hidden="true" />
      <span className="nav-hours-copy">
        <span className="nav-hours-state">{status.state}</span>
        {status.meta ? (
          <span className="nav-hours-meta" data-zhe-open-meta>
            {status.meta}
          </span>
        ) : (
          <span className="nav-hours-meta" hidden data-zhe-open-meta />
        )}
      </span>
    </span>
  );
}

import { getKitchenStatus } from "@/lib/hours";

/** Original .nav-hours open/closed chip */
export function OpenChip() {
  const status = getKitchenStatus();

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
          <span className="nav-hours-meta">{status.meta}</span>
        ) : null}
      </span>
    </span>
  );
}

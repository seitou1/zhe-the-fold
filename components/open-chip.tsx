import { getKitchenStatus } from "@/lib/hours";

/**
 * Open/closed chip — server-rendered from hours SSOT.
 * No client JS required (good enough for demo; refreshes on each navigation).
 */
export function OpenChip() {
  const status = getKitchenStatus();

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
          status.open
            ? "bg-wheat shadow-[0_0_8px_rgba(208,192,160,0.7)]"
            : "bg-cream/35"
        }`}
        aria-hidden
      />
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate">{status.state}</span>
        {status.meta ? (
          <span className="truncate text-[0.65rem] text-cream/45">
            {status.meta}
          </span>
        ) : null}
      </span>
    </span>
  );
}

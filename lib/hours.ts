import type { HoursConfig, KitchenCopy } from "@/lib/data/site-types";
import { site } from "@/lib/site";

/** Weekday short labels matching Intl en-US + static site data.js */
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type KitchenStatus = {
  open: boolean;
  /** e.g. "Open" or "opens Tue 11:30 AM" */
  state: string;
  /** e.g. "until 2:30 PM" when open */
  meta: string;
  title: string;
};

function defaultHours(): HoursConfig {
  return {
    timeZone: site.hours.timeZone,
    closedWeekdays: [...site.hours.closedWeekdays],
    note: site.hours.note,
    periods: site.hours.periods.map((p) => ({
      days: [...p.days],
      open: p.open,
      close: p.close,
    })),
  };
}

function defaultKitchen(): KitchenCopy {
  return { ...site.kitchen };
}

function parseHM(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function formatTimeEn(minutes: number): string {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const d = new Date();
  d.setHours(h24, m, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: m === 0 ? undefined : "2-digit",
  }).format(d);
}

/** Kitchen clock in hours.timeZone (NYC Eastern by default). */
function getKitchenParts(hours: HoursConfig, date = new Date()) {
  const { timeZone } = hours;
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    fmt.formatToParts(date).map((p) => [p.type, p.value])
  );
  return {
    weekday: parts.weekday || "Mon",
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function getOpenPeriod(
  hours: HoursConfig,
  weekday: string,
  minutes: number
) {
  const { closedWeekdays, periods } = hours;
  if (closedWeekdays.includes(weekday)) return null;
  for (const p of periods) {
    if (!(p.days as readonly string[]).includes(weekday)) continue;
    const start = parseHM(p.open);
    const end = parseHM(p.close);
    if (minutes >= start && minutes < end) {
      return { start, end };
    }
  }
  return null;
}

function getNextService(
  hours: HoursConfig,
  kitchen: KitchenCopy,
  weekday: string,
  minutes: number
) {
  const { closedWeekdays, periods, note } = hours;
  const k = kitchen;
  if (!periods.length) {
    return { state: note || k.seeVisit, meta: "" };
  }
  const dayIdx = WEEKDAYS.indexOf(weekday as (typeof WEEKDAYS)[number]);
  const safeIdx = dayIdx >= 0 ? dayIdx : 0;

  for (let offset = 0; offset < 8; offset++) {
    const idx = (safeIdx + offset) % 7;
    const day = WEEKDAYS[idx];
    if (closedWeekdays.includes(day)) continue;
    const dayPeriods = periods
      .filter((p) => (p.days as readonly string[]).includes(day))
      .map((p) => ({ start: parseHM(p.open), end: parseHM(p.close) }))
      .sort((a, b) => a.start - b.start);
    if (!dayPeriods.length) continue;

    if (offset === 0) {
      for (const per of dayPeriods) {
        if (minutes < per.start) {
          return {
            state: `${k.opens} ${formatTimeEn(per.start)}`,
            meta: "",
          };
        }
      }
      continue;
    }

    return {
      state: `${k.opens} ${day} ${formatTimeEn(dayPeriods[0].start)}`,
      meta: "",
    };
  }
  return { state: note || k.seeVisit, meta: "" };
}

function formatTimeDisplay(hm: string, compact = false): string {
  const mins = parseHM(hm);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const clock =
    m === 0 ? `${h12}:00` : `${h12}:${String(m).padStart(2, "0")}`;
  return compact ? clock : `${clock} ${period}`;
}

/** Static Visit panel lines (not live open/closed — chip handles that). */
export function getHoursDisplayLines(
  hours: HoursConfig = defaultHours(),
  kitchen: KitchenCopy = defaultKitchen()
): {
  days: string;
  times: string;
  note: string;
} {
  const { periods, note, closedWeekdays } = hours;
  if (!periods.length) {
    return { days: "", times: "", note: note || "" };
  }
  const daysList = [...(periods[0].days || [])];
  const dayCount = daysList.length;
  const k = kitchen;
  const days =
    dayCount === 7
      ? k.daily
      : dayCount > 0
        ? `${daysList[0]}–${daysList[dayCount - 1]}`
        : "";
  const times = periods
    .map(
      (p) =>
        `${formatTimeDisplay(p.open, true)}–${formatTimeDisplay(p.close, true)}`
    )
    .join(" \u00b7 ");
  const closedNote =
    note ||
    (closedWeekdays?.length
      ? `${k.closedPrefix} ${closedWeekdays.join(", ")}`
      : "");
  return { days, times, note: closedNote };
}

/** Pure: compute open/closed chip copy from hours SSOT + “now”. */
export function getKitchenStatus(
  date = new Date(),
  hours: HoursConfig = defaultHours(),
  kitchen: KitchenCopy = defaultKitchen()
): KitchenStatus {
  const parts = getKitchenParts(hours, date);
  const period = getOpenPeriod(hours, parts.weekday, parts.minutes);
  const open = Boolean(period);

  const k = kitchen;
  if (open && period) {
    const end = formatTimeEn(period.end);
    return {
      open: true,
      state: k.open,
      meta: `${k.until} ${end}`,
      title: `${k.titleOpenPrefix} ${end} (${k.easternTime})`,
    };
  }

  const next = getNextService(hours, kitchen, parts.weekday, parts.minutes);
  return {
    open: false,
    state: next.state,
    meta: next.meta,
    title: `${k.titleClosedPrefix} ${next.state} (${k.easternTime})`,
  };
}

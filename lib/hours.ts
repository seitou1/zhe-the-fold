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

function getHoursConfig() {
  return site.hours;
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

/** Kitchen clock in SITE.hours.timeZone (NYC Eastern by default). */
function getKitchenParts(date = new Date()) {
  const { timeZone } = getHoursConfig();
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

function getOpenPeriod(weekday: string, minutes: number) {
  const { closedWeekdays, periods } = getHoursConfig();
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

function getNextService(weekday: string, minutes: number) {
  const { closedWeekdays, periods, note } = getHoursConfig();
  if (!periods.length) {
    return { state: note || "see Visit", meta: "" };
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
          return { state: `opens ${formatTimeEn(per.start)}`, meta: "" };
        }
      }
      continue;
    }

    return {
      state: `opens ${day} ${formatTimeEn(dayPeriods[0].start)}`,
      meta: "",
    };
  }
  return { state: note || "see Visit", meta: "" };
}

/** Pure: compute open/closed chip copy from hours SSOT + “now”. */
export function getKitchenStatus(date = new Date()): KitchenStatus {
  const parts = getKitchenParts(date);
  const period = getOpenPeriod(parts.weekday, parts.minutes);
  const open = Boolean(period);

  if (open && period) {
    return {
      open: true,
      state: "Open",
      meta: `until ${formatTimeEn(period.end)}`,
      title: `Kitchen open until ${formatTimeEn(period.end)} (Eastern time)`,
    };
  }

  const next = getNextService(parts.weekday, parts.minutes);
  return {
    open: false,
    state: next.state,
    meta: next.meta,
    title: `Kitchen ${next.state} (Eastern time)`,
  };
}

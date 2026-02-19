import { DateTime } from "luxon";

export const CSUB_TZ = "America/Los_Angeles";

/**
 * Convert local LA date+time (YYYY-MM-DD + HH:mm) to UTC ISO string.
 */
export function localDateTimeToUtcIso(
  date: string,
  time: string,
  timezone: string = CSUB_TZ
): string {
  const dt = DateTime.fromFormat(`${date} ${time}`, "yyyy-MM-dd HH:mm", { zone: timezone });
  if (!dt.isValid) throw new Error("Invalid date/time format. Expected YYYY-MM-DD and HH:mm");
  return dt.toUTC().toISO()!;
}

/**
 * Given a local date "YYYY-MM-DD" in LA, return [startUtcIso, endUtcIso) for that day.
 */
export function dayBoundsUtcIso(date: string, timezone: string = CSUB_TZ): {
  startUtcIso: string;
  endUtcIso: string;
} {
  const startLocal = DateTime.fromISO(date, { zone: timezone }).startOf("day");
  if (!startLocal.isValid) throw new Error("Invalid date. Expected YYYY-MM-DD");
  const endLocal = startLocal.plus({ days: 1 });

  return {
    startUtcIso: startLocal.toUTC().toISO()!,
    endUtcIso: endLocal.toUTC().toISO()!,
  };
}

/**
 * Mon–Fri week bounds for a given "weekOf" date.
 * We anchor to Monday of that week in LA and return [monStart, nextMonStart).
 */
export function weekBoundsUtcIso(weekOf: string, timezone: string = CSUB_TZ): {
  weekStartUtcIso: string;
  weekEndUtcIso: string;
  monLocalISO: string; // local Monday date "YYYY-MM-DD"
} {
  const d = DateTime.fromISO(weekOf, { zone: timezone });
  if (!d.isValid) throw new Error("Invalid weekOf date. Expected YYYY-MM-DD");

  // Luxon: Monday=1 ... Sunday=7
  const diffToMonday = d.weekday - 1;
  const monday = d.minus({ days: diffToMonday }).startOf("day");
  const nextMonday = monday.plus({ days: 7 });

  return {
    weekStartUtcIso: monday.toUTC().toISO()!,
    weekEndUtcIso: nextMonday.toUTC().toISO()!,
    monLocalISO: monday.toISODate()!,
  };
}

/**
 * Helper: format an event time for your UI pills in LA (e.g., "10:00 AM").
 */
export function formatTimeForUI(utcIso: string, timezone: string = CSUB_TZ): string {
  return DateTime.fromISO(utcIso, { zone: "utc" }).setZone(timezone).toFormat("h:mm a");
}

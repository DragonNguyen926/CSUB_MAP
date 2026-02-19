import { supabase } from "../lib/supabaseClient";
import { CSUB_TZ, dayBoundsUtcIso, formatTimeForUI, localDateTimeToUtcIso, weekBoundsUtcIso } from "../utils/time";
import type { CreateEventInput, EventRow } from "../types/events";

function ensureLocation(input: CreateEventInput) {
  const hasBuilding = !!input.buildingId;
  const hasCoords = typeof input.latitude === "number" && typeof input.longitude === "number";
  if (!hasBuilding && !hasCoords) {
    throw new Error("Event needs a location: buildingId OR latitude+longitude.");
  }
}

/**
 * Create an event from the UI input (local date/time) and store UTC times.
 */
export async function createEvent(input: CreateEventInput): Promise<EventRow> {
  ensureLocation(input);

  const timezone = input.timezone ?? CSUB_TZ;

  const start_at = localDateTimeToUtcIso(input.startDate, input.startTime, timezone);
  const end_at = localDateTimeToUtcIso(input.endDate, input.endTime, timezone);

  if (new Date(end_at).getTime() <= new Date(start_at).getTime()) {
    throw new Error("End time must be after start time.");
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: input.title,
      category: input.category ?? "General",
      description: input.description ?? null,

      building_id: input.buildingId ?? null,
      room_detail: input.roomDetail ?? null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,

      start_at,
      end_at,
      timezone,

      status: "scheduled",
      created_by: input.createdBy ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as EventRow;
}

/**
 * Get events for one selected day tab (Mon/Tue/etc).
 * Pass local date "YYYY-MM-DD" (LA).
 */
export async function getEventsForDay(date: string, timezone: string = CSUB_TZ): Promise<{
  date: string;
  timezone: string;
  count: number;
  events: (EventRow & { startLocal: string; endLocal: string })[];
}> {
  const { startUtcIso, endUtcIso } = dayBoundsUtcIso(date, timezone);

  // overlap query: start_at < dayEnd AND end_at > dayStart
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "scheduled")
    .lt("start_at", endUtcIso)
    .gt("end_at", startUtcIso)
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as EventRow[];
  const events = rows.map((e) => ({
    ...e,
    startLocal: formatTimeForUI(e.start_at, timezone),
    endLocal: formatTimeForUI(e.end_at, timezone),
  }));

  return { date, timezone, count: events.length, events };
}

/**
 * Get week counts for Mon–Fri tabs.
 * Minimal approach: fetch all events for the week window and bucket counts on the client.
 */
export async function getWeekCounts(weekOf: string, timezone: string = CSUB_TZ): Promise<{
  weekOf: string;
  timezone: string;
  days: { date: string; dow: "Mon" | "Tue" | "Wed" | "Thu" | "Fri"; count: number }[];
}> {
  const { weekStartUtcIso, weekEndUtcIso, monLocalISO } = weekBoundsUtcIso(weekOf, timezone);

  const { data, error } = await supabase
    .from("events")
    .select("id,start_at,end_at")
    .eq("status", "scheduled")
    .lt("start_at", weekEndUtcIso)
    .gt("end_at", weekStartUtcIso);

  if (error) throw new Error(error.message);

  // Build Mon–Fri local dates
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

  const mon = new Date(monLocalISO + "T00:00:00"); // local-ish anchor; we use Luxon for true calculations below
  // We'll use Luxon to avoid JS Date timezone confusion:
  const { DateTime } = await import("luxon");
  const base = DateTime.fromISO(monLocalISO, { zone: timezone }).startOf("day");

  const dayDates = days.map((dow, i) => {
    const d = base.plus({ days: i });
    return { dow, date: d.toISODate()! };
  });

  // Bucket by overlap with each day
  const events = (data ?? []) as { id: string; start_at: string; end_at: string }[];

  const counts = dayDates.map(({ dow, date }) => {
    const { startUtcIso, endUtcIso } = dayBoundsUtcIso(date, timezone);
    const start = new Date(startUtcIso).getTime();
    const end = new Date(endUtcIso).getTime();

    const count = events.reduce((acc, ev) => {
      const evStart = new Date(ev.start_at).getTime();
      const evEnd = new Date(ev.end_at).getTime();
      const overlaps = evStart < end && evEnd > start;
      return acc + (overlaps ? 1 : 0);
    }, 0);

    return { dow, date, count };
  });

  return { weekOf, timezone, days: counts };
}

/**
 * Optional: events happening right now (useful for map overlay)
 */
export async function getActiveEvents(timezone: string = CSUB_TZ): Promise<EventRow[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "scheduled")
    .lte("start_at", now)
    .gte("end_at", now)
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as EventRow[];
}

/**
 * Cancel an event (soft delete)
 */
export async function cancelEvent(eventId: string): Promise<void> {
  const { error } = await supabase
    .from("events")
    .update({ status: "canceled" })
    .eq("id", eventId);

  if (error) throw new Error(error.message);
}

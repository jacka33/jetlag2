import { DateTime } from "luxon";
import type { CalendarEvent } from "@/app/types";

/**
 * Returns an array of CalendarEvent, one for each day spanned by the event.
 */
export default function splitMultiDayEvent(start: DateTime, end: DateTime, label: string): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  let current = start;
  while (current.startOf('day') < end.startOf('day')) {
    // End of this day (midnight)
    const dayEnd = current.endOf('day');
    events.push(createCalendarEvent(current, dayEnd, label));
    // Move to next day at 00:00
    current = dayEnd.plus({ seconds: 1 });
  }
  // Last segment (may be partial day)
  if (current < end) {
    events.push(createCalendarEvent(current, end, label));
  }
  return events;
}

function createCalendarEvent(start: DateTime, end: DateTime, label: string): CalendarEvent {
  // Clamp end to same day as start
  const dayEnd = start.endOf('day');
  const actualEnd = end > dayEnd ? dayEnd : end;
  const startRow = start.hour * 2 + (start.minute >= 30 ? 2 : 1);
  const durationMinutes = actualEnd.diff(start, "minutes").minutes;
  const span = Math.max(1, Math.ceil(durationMinutes / 30));
  return {
    label,
    gridRow: `${startRow} / span ${span}`,
    startTime: start.toFormat("HH:mm"),
    startISO: start.toISO() ?? "",
    endISO: actualEnd.toISO() ?? "",
  };
}
import { z } from "zod";
import { AirportSchema } from "./components/Form";
import type { DateTime } from "luxon";

export type Airport = z.infer<typeof AirportSchema> | null;

export type TimeDifference = { arrISO: string; offset: number } | null;

export type UsualSchedule = {
  relativeDay: number;
  day: DateTime;
  sleep: DateTime;
  wake: DateTime;
  dlmo: DateTime;
  ctn: DateTime;
};

export type CalendarEvent = {
  label: string;
  gridRow: string; // e.g. "17 / span 4"
  startTime: string; // e.g. "07:30"
  startISO: string;
  endISO: string;
}
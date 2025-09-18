import { z } from "zod";
import { AirportSchema } from "./components/form/Form";
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

export type PromptProps = {
  departure_airport: string;
  arrival_airport: string;
  timezone_difference: number;
  direction: string;
  departure_time: string;
  arrival_time: string;
  flight_duration_minutes: number;
  usual_sleep_time: string;
  usual_wake_time: string;
  dlmo: string;
  core_temp_nadir: string;
  age: number;
  dep_sunrise: string;
  dep_sunset: string;
  arr_sunrise: string;
  arr_sunset: string;
};
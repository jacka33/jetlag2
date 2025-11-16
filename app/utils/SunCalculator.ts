import SunCalc from "suncalc";
import { DateTime } from "luxon";

export function sunTimesForLocalDate(isoOrDate: string | Date, lat: number, lon: number, zone?: string) {
  // Build a DateTime representing the local date in the target zone
  let dt: DateTime;
  if (typeof isoOrDate === "string") {
    dt = DateTime.fromISO(isoOrDate, { zone }).setZone(zone || undefined, { keepLocalTime: false });
  } else {
    dt = DateTime.fromJSDate(isoOrDate).setZone(zone || undefined, { keepLocalTime: false });
  }

  // Use explicit local calendar date fields to construct local noon in the target zone
  const localNoon = DateTime.fromObject(
    { year: dt.year, month: dt.month, day: dt.day, hour: 12, minute: 0, second: 0, millisecond: 0 },
    { zone: zone || undefined }
  );

  const times = SunCalc.getTimes(localNoon.toJSDate(), lat, lon);

  // Convert SunCalc results (JS Date instants) back into ISO strings in the target zone
  const sunriseISO = DateTime.fromJSDate(times.sunrise).setZone(zone || undefined).toISO();
  const sunsetISO = DateTime.fromJSDate(times.sunset).setZone(zone || undefined).toISO();

  return {
    sunrise: sunriseISO,
    sunset: sunsetISO
  };
}
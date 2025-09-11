import { DateTime } from "luxon";

export function isValidDateTime(dateTimeStr: string, tz: string): boolean {
  const dt = DateTime.fromISO(dateTimeStr, { zone: tz });
  // Must be in the future and more than 3 days ahead
  if(dt < DateTime.now().plus({ days: 3 }).setZone(tz)) {
    return false;
  }
  return true;
}
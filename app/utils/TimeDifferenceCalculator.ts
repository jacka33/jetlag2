import { DateTime } from "luxon";
import { TimeDifference } from "../types";

export default function CalculateTimeDifference(fromTZ: string, toTZ: string, depTime: string, flightTimeMins: number): TimeDifference {
  // Parse departure time in the departure timezone
  const depDateTime = DateTime.fromISO(depTime, { zone: fromTZ });
  if (!depDateTime.isValid) {
    throw new Error("Invalid departure time");
  }
  
  // Calculate arrival time in the departure timezone
  const arrDateTimeInDepTZ = depDateTime.plus({ minutes: flightTimeMins });

  // Convert arrival time to the arrival timezone
  const arrDateTimeInArrTZ = arrDateTimeInDepTZ.setZone(toTZ);
  
  // Calculate time difference in hours
  const timeDifference = arrDateTimeInArrTZ.offset - depDateTime.offset; // in minutes
  const offset = timeDifference / 60; // convert to hours

  const arrISO = arrDateTimeInArrTZ.toISO();
  
  return {
    arrISO,
    offset
  };
}
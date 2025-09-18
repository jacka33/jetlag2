import { ChevronDoubleDownIcon, ChevronDoubleRightIcon, ChevronDoubleUpIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../redux/hooks";
import { DateTime } from "luxon";
import type { RootState } from "../redux/store";

export default function LagScoreCalculator() {

  const timeDifference = useAppSelector((state: RootState) => state.flight.timeDifference);
  const direction = useAppSelector((state: RootState) => state.flight.direction);
  const depDateTime = useAppSelector((state: RootState) => state.flight.departureDateTime);
  const flightTime = useAppSelector((state: RootState) => state.flight.time);
  const departure = useAppSelector((state: RootState) => state.flight.departure);

  
  if (!depDateTime) return null;
  const depDateTimeObj = DateTime.fromISO(depDateTime, { zone: departure?.time_zone });
  let departureTimeString;
  if (depDateTimeObj.hour < 5) {
    departureTimeString = "Early morning";
  } else if (depDateTimeObj.hour >= 5 && depDateTimeObj.hour < 12) {
    departureTimeString = "Morning";
  } else if (depDateTimeObj.hour >= 12 && depDateTimeObj.hour < 17) {
    departureTimeString = "Afternoon";
  } else if (depDateTimeObj.hour >= 17 && depDateTimeObj.hour < 21) {
    departureTimeString = "Evening";
  } else if (depDateTimeObj.hour >= 21 && depDateTimeObj.hour < 24) {
    departureTimeString = "Night";
  }
  // i think i need to use a full datetime object as the dlmo/ctn/usual sleep/wake times may be on different days
  // user will probably find it hard to sleep on departure
  // but if the flight is long and DLMO and/or usual sleep time is reached during flight,
  // sleep will be easier to achieve inflight
  // so duration of flight is a factor here
  // also need to factor in edge cases, where the user has an unusual sleep routine (i.e. 03:00 - 11:00)
  // adjust score accordingly


  const calculateScore = (
    depTimeOfDayValue: string | null,
    timeDifferenceOffset: number | undefined,
    direction: string | undefined,
    flightTime: number | undefined
  ) => {

    let score = 0;

    if (timeDifferenceOffset) {
      score += Math.min(Math.abs(timeDifferenceOffset) * 9, 70); // Max 80 points, this is the biggest factor
    }

    if (direction === "Eastbound") {
      score *= 1.2;
    } else {
      score *= 1.05;
    }

    if (flightTime !== undefined && flightTime > 480) { // more than 8 hours
      score *= 1.1;  // increase by 10%
    }

    return score.toFixed(1);
  }

  return {
    score: calculateScore(departureTimeString || null, timeDifference?.offset, direction, flightTime),
    scoreColour: "text-yellow-500",
    iconColour: "bg-yellow-500",
    comment: "Moderate jetlag",
    factors: [
      { name: "Timezone Difference", value: timeDifference && timeDifference?.offset > 0 ? `+${timeDifference?.offset} hours` : `${timeDifference?.offset} hours`, icon: ChevronUpIcon, iconColour: "text-red-500" },
      { name: "Direction", value: direction, icon: ChevronDoubleRightIcon, iconColour: "text-gray-500" },
      { name: "Departure Time", value: departureTimeString, icon: ChevronDoubleDownIcon, iconColour: "text-green-500" },
      { name: "Flight duration", value: (flightTime / 60).toFixed(1) + " hours", icon: ChevronDoubleUpIcon, iconColour: "text-red-500" },
    ],
  };
}
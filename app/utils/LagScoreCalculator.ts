import { ChevronDoubleDownIcon, ChevronDoubleRightIcon, ChevronDoubleUpIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../redux/hooks";
  import type { RootState } from "../redux/store";

export default function LagScoreCalculator() {
  // todo
  
    const timeDifference = useAppSelector((state: RootState) => state.flight.timeDifference);
    const direction = useAppSelector((state: RootState) => state.flight.direction);
    const depTime = useAppSelector((state: RootState) => state.flight.departureDateTime);
    const flightTime = useAppSelector((state: RootState) => state.flight.time);

  const depTimeOfDay = (depTime: string | null) => {
    if (!depTime) return null;
    const hour = new Date(depTime).getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  }

  return {
    score: 75,
    comment: "Moderate jetlag",
    factors: [
      { name: "Timezone Difference", value: timeDifference && timeDifference?.offset > 0 ? `+${timeDifference?.offset} hours` : `${timeDifference?.offset} hours`, icon: ChevronUpIcon, iconColour: "text-green-500" },
      { name: "Direction", value: direction, icon: ChevronDoubleRightIcon, iconColour: "text-gray-500" },
      { name: "Departure Time", value: depTimeOfDay(depTime), icon: ChevronDoubleDownIcon, iconColour: "text-green-500" },
      { name: "Flight duration", value: (flightTime/60).toFixed(1) + " hours",   icon: ChevronDoubleUpIcon, iconColour: "text-red-500" },
    ],
  };
}
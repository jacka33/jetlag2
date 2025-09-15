import { ChevronDoubleDownIcon, ChevronDoubleRightIcon, ChevronDoubleUpIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "../redux/hooks";
export default function LagScoreCalculator() {
  // todo
  const timeDifference = useAppSelector((state) => state.flight.timeDifference);
  return {
    score: 75,
    comment: "Moderate jetlag",
    factors: [
      { name: "Time Zone Difference", value: timeDifference?.offset > 0 ? `+${timeDifference.offset} hours` : `${timeDifference.offset} hours`, icon: ChevronUpIcon, iconColour: "text-green-500" },
      { name: "Flight Duration", value: "8 hours", icon: ChevronDoubleRightIcon, iconColour: "text-gray-500" },
      { name: "Departure Time", value: "Evening", icon: ChevronDoubleDownIcon, iconColour: "text-green-500" },
      { name: "Arrival Time", value: "Morning",   icon: ChevronDoubleUpIcon, iconColour: "text-red-500" },
    ],
  };
}
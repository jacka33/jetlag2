import { UsualSchedule } from "@/app/types";
import CalendarWeekView from "./calendar/CalendarWeekView";
import SleepScheduleCalculator from "@/app/utils/SleepScheduleCalculator";

interface CalendarsProps {
  hasFormData: boolean;
  usualSchedule: UsualSchedule[];
}

export default function Calendars({ hasFormData }: CalendarsProps) {

  const usualSchedule = SleepScheduleCalculator();
  return (
    <div className="w-full">
      {hasFormData ? (
        <CalendarWeekView usualSchedule={usualSchedule} />
      ) : (
        <div className="h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-300 border rounded-lg">
          <div className="text-center">
            <div className="text-2xl mb-2"></div>
            <div>Usual sleep schedule</div>
            <div className="text-sm mt-1">Submit form to generate unadjusted sleep schedule</div>
          </div>
        </div>
      )}
    </div>
  );
}
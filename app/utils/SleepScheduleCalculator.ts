import { DateTime } from "luxon";
import { useAppSelector } from "../redux/hooks";
import type { RootState } from "../redux/store";
import { UsualSchedule } from "../types";

// TODO: return two schedules - usual and adjusted
export default function SleepScheduleCalculator(): UsualSchedule[] {

  const timeDifference = useAppSelector((state: RootState) => state.flight.timeDifference);
  const direction = useAppSelector((state: RootState) => state.flight.direction);
  const depDateTime = useAppSelector((state: RootState) => state.flight.departureDateTime);
  const flightTime = useAppSelector((state: RootState) => state.flight.time);
  const departure = useAppSelector((state: RootState) => state.flight.departure);

  // Set user's routine sleep times (todo: make user configurable)
  // const depDtObj = depDateTime ? DateTime.fromISO(depDateTime, { zone: departure?.time_zone }) : null;
  const usualSleepHour = 23; // TODO: make user configurable
  const usualSleepMinute = 0;
  const usualWakeHour = 7;   // TODO: make user configurable
  const usualWakeMinute = 0;

  const usualSchedule = [];

  let i = -3; // start 3 days prior to departure

  // set usual (unadjusted) schedule for 7 days (3 before, day of, 3 after)
  for (i; i <= 3; i++) {
    // todo: may need to handle overnight sleep and add a day to the wakeTime
    const day = DateTime.fromISO(depDateTime, { zone: departure?.time_zone }).plus({ days: i });
    const sleepTime = day.set({ hour: usualSleepHour, minute: usualSleepMinute });
    const wakeTime = day.set({ hour: usualWakeHour, minute: usualWakeMinute });

    // DLMO = Dim Light Melatonin Onset
    // Approx 2 hours before usual sleep time
    // CTN = Core Temperature Nadir
    // Approx 2 hours before usual wake time
    // -
    // These values allow us to establish the user's default circadian rhythm
    const dlmo = sleepTime.minus({ hours: 2 });
    const ctn = wakeTime.minus({ hours: 2 });

    usualSchedule.push({
      relativeDay: i,
      day: day,
      sleep: sleepTime,
      wake: wakeTime,
      dlmo: dlmo,
      ctn: ctn
    });
  }
  return usualSchedule;



}
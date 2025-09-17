'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { DateTime } from 'luxon';
import ResultsStickyNav from './results/nav/ResultsStickyNav';
import Overview from './results/Overview';
import SleepScheduleCalculator from '../utils/SleepScheduleCalculator';
import Calendars from './results/Calendars';
import InsightsClient from './results/insights/InsightsClient';

export default function Results() {
  const [hasFormData, setHasFormData] = useState(false);

  const distance = useAppSelector((state) => state.flight.distance);
  const direction = useAppSelector((state) => state.flight.direction);
  const depTime = useAppSelector((state) => state.flight.departureDateTime);
  const flightTimeMins = useAppSelector((state) => state.flight.time);
  const departure = useAppSelector((state) => state.flight.departure);
  const arrival = useAppSelector((state) => state.flight.arrival);
  const timeDifference = useAppSelector((state) => state.flight.timeDifference);

  // Check if form has been submitted
  useEffect(() => {
    if (departure && arrival) {
      setHasFormData(true);
    } else {
      setHasFormData(false);
    }
  }, [departure, arrival]);

  // Extract local departure time from string
  const depLocalTime = depTime ? DateTime.fromISO(depTime).toFormat('HH:mm') : '';

  return (
    <>
      <ResultsStickyNav />
      <Overview
        hasFormData={hasFormData}
        distance={distance}
        flightTimeMins={flightTimeMins}
        direction={direction}
        timeDifference={timeDifference}
        depLocalTime={depLocalTime}
        departure={departure}
        arrival={arrival}
      />
      <Calendars hasFormData={hasFormData} usualSchedule={SleepScheduleCalculator()} />
      <InsightsClient
        departure_airport={departure?.code || ''}
        arrival_airport={arrival?.code || ''}
        timezone_difference={timeDifference ? timeDifference.offset : 0}
        direction={direction}
        departure_time={depLocalTime || ''}
        arrival_time="18:30" // placeholder
        flight_duration_minutes={flightTimeMins}
        usual_sleep_time='23:00' // placeholder
        usual_wake_time='07:00' // placeholder
        dlmo='21:00' // placeholder
        core_temp_nadir='05:00' // placeholder
        age={30} // placeholder
        dep_sunrise='06:00' // placeholder
        dep_sunset='18:00' // placeholder
        arr_sunrise='07:00' // placeholder
        arr_sunset='19:00' // placeholder
      />
    </>
  )
}
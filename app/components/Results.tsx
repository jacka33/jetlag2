'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { DateTime } from 'luxon';
import ResultsStickyNav from './results/ResultsStickyNav';
import Overview from './results/Overview';
import SleepScheduleCalculator from '../utils/SleepScheduleCalculator';
import Calendars from './results/Calendars';
import InsightsClient from './results/insights/InsightsClient';

export default function Results() {
  const [hasFormData, setHasFormData] = useState(false);

  // Redux flight state
  const distance = useAppSelector((state) => state.flight.distance);
  const direction = useAppSelector((state) => state.flight.direction);
  const depDateTime = useAppSelector((state) => state.flight.departureDateTime);
  const arrDateTime = useAppSelector((state) => state.flight.arrivalDateTime);
  const flightTimeMins = useAppSelector((state) => state.flight.time);
  const departure = useAppSelector((state) => state.flight.departure);
  const arrival = useAppSelector((state) => state.flight.arrival);
  const timeDifference = useAppSelector((state) => state.flight.timeDifference);
  const depSun = useAppSelector((state) => state.flight.depSun);
  const arrSun = useAppSelector((state) => state.flight.arrSun);
  const formSubmitted = useAppSelector((state) => state.flight.formSubmitted);

  // Redux user state
  const usualSleepTime = useAppSelector((state) => state.user.usualSleepTime);
  const usualWakeTime = useAppSelector((state) => state.user.usualWakeTime);
  const dlmo = useAppSelector((state) => state.user.dlmo);
  const ctn = useAppSelector((state) => state.user.ctn);
  // todo: calculate chronotype from sleep times
  // todo: move this logic to reducer
  // const chronotype = useAppSelector((state) => state.user.chronotype);
  const age = useAppSelector((state) => state.user.age);

  // Check if form has been submitted
  useEffect(() => {
    if (departure && arrival) {
      setHasFormData(true);
    } else {
      setHasFormData(false);
    }
  }, [departure, arrival]);

  // Extract local departure time from string
  const depLocalTime = depDateTime ? DateTime.fromISO(depDateTime).toFormat('HH:mm') : '';
  const arrLocalTime = arrDateTime ? DateTime.fromISO(arrDateTime).toFormat('HH:mm') : '';

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
      {formSubmitted && (
        <InsightsClient
          departure_airport={departure?.code || ''}
          arrival_airport={arrival?.code || ''}
          timezone_difference={timeDifference ? timeDifference.offset : 0}
          direction={direction}
          departure_time={depLocalTime || ''}
          arrival_time={arrLocalTime || ''}
          flight_duration_minutes={flightTimeMins}
          usual_sleep_time={usualSleepTime || ''}
          usual_wake_time={usualWakeTime || ''}
          dlmo={dlmo || ''}
          core_temp_nadir={ctn || ''}
          age={typeof age === 'string' ? age : (typeof age === 'number' ? String(age) : 'Unknown')}
          dep_sunrise={depSun?.sunrise ? DateTime.fromISO(depSun.sunrise).toFormat("HH:mm") : ''}
          dep_sunset={depSun?.sunset ? DateTime.fromISO(depSun.sunset).toFormat("HH:mm") : ''}
          arr_sunrise={arrSun?.sunrise ? DateTime.fromISO(arrSun.sunrise).toFormat("HH:mm") : ''}
          arr_sunset={arrSun?.sunset ? DateTime.fromISO(arrSun.sunset).toFormat("HH:mm") : ''}
        />
      )}
    </>
  )
}
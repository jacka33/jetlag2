'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { DateTime } from 'luxon';
import ResultsStickyNav from './ResultsStickyNav';
import Overview from './results/Overview';

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
    </>
  )
}
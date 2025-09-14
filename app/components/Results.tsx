'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import CalculateTimeDifference from '../utils/TimeDifferenceCalculator';
import Tooltip from './Tooltip';
import dynamic from 'next/dynamic';
import { DateTime } from 'luxon';

// Dynamically import MapboxMap to avoid SSR issues
const MapboxMap = dynamic(() => import('./MapboxMap'), { ssr: false });

export default function Results() {
  const [hasFormData, setHasFormData] = useState(false);

  const distance = useAppSelector((state) => state.flight.distance);
  const direction = useAppSelector((state) => state.flight.direction);
  const depTz = useAppSelector((state) => state.flight.departure?.time_zone);
  const arrTz = useAppSelector((state) => state.flight.arrival?.time_zone);
  const depTime = useAppSelector((state) => state.flight.departureDateTime);
  const flightTimeMins = useAppSelector((state) => state.flight.time);
  const departure = useAppSelector((state) => state.flight.departure);
  const arrival = useAppSelector((state) => state.flight.arrival);
  const depCoords = useAppSelector((state) => state.flight.depCoords);
  const arrCoords = useAppSelector((state) => state.flight.arrCoords);

  // Check if form has been submitted
  useEffect(() => {
    if (departure && arrival) {
      setHasFormData(true);
    }
  }, [departure, arrival]);

  // Calculate time difference only if all required data is available
  const timeDifference = hasFormData && depTz && arrTz && depTime
    ? CalculateTimeDifference(depTz, arrTz, depTime, flightTimeMins)
    : null;

  // Extract local departure time from string
  const depLocalTime = depTime ? DateTime.fromISO(depTime).toFormat('HH:mm') : '';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-gray-900/10 py-12 dark:border-white/10" id="results">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Jetlag schedule</h2>
        <div className="mt-1 space-y-2 text-sm/6 text-gray-600 dark:text-gray-400">
          {hasFormData ? (
            <>
              <Tooltip text="The great circle distance is the shortest distance between two points on the surface of a sphere.">
                Distance: {distance} nm (great circle distance)
              </Tooltip>
              <Tooltip text="Calculated with 480kts average groundspeed plus 10% margin. Exact time will vary based on exact routing and wind conditions.">
                Time: {(flightTimeMins / 60).toFixed(1)} hours (estimated)
              </Tooltip>
              <div>
                Direction of travel: {direction}
              </div>
              <Tooltip text={`Departing from ${departure?.code} at ${depLocalTime}. Arriving at ${timeDifference?.arrDateTimeInArrTZ.toFormat('HH:mm')} local time at ${arrival?.code}.`}>
                Time difference: {`${timeDifference?.offset > 0 ? `+${timeDifference?.offset} hours` : `${timeDifference?.offset} hours`}`}
              </Tooltip>
            </>
          ) : (
            <div className="space-y-2">
              <div>Distance: -- nm</div>
              <div>Time: -- hours</div>
              <div>Direction of travel: --</div>
              <div>Time difference: -- hours</div>
              <div className="mt-4 text-sm italic">Fill in the form above to see your flight details</div>
            </div>
          )}
        </div>
      </div>
      <div>
        {hasFormData ? (
          <MapboxMap from={depCoords} to={arrCoords} />
        ) : (
          <div className="w-full h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-300 border rounded-lg">
            <div className="text-center">
              <div className="text-2xl mb-2">✈️</div>
              <div>Flight route map</div>
              <div className="text-sm mt-1">Select airports to see route</div>
            </div>
          </div>
        )}
      </div>
    </div>

  )
}
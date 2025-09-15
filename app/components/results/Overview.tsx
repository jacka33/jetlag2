import { DateTime } from 'luxon'
import type { Airport, TimeDifference } from '../../types'
import LagScore from '../LagScore'
import MapboxMap from '../MapboxMap'
import Tooltip from '../Tooltip'

export default function Overview({ hasFormData, distance, flightTimeMins, direction, timeDifference, depLocalTime, departure, arrival }: {
  hasFormData: boolean
  distance: number
  flightTimeMins: number
  direction: string
  timeDifference: TimeDifference | null
  depLocalTime: string
  departure: Airport | undefined
  arrival: Airport | undefined
}) {

  // Extract coordinates from airport objects
  const fromCoords = departure ? [parseFloat(departure.longitude), parseFloat(departure.latitude)] : [0, 0];
  const toCoords = arrival ? [parseFloat(arrival.longitude), parseFloat(arrival.latitude)] : [0, 0];

  // get local arrival time from timeDifference.arrISO
  const arrLocalTime = timeDifference?.arrISO ? DateTime.fromISO(timeDifference.arrISO, { zone: arrival?.time_zone }).toFormat("HH:mm") : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12 border-b border-gray-900/10 py-12 dark:border-white/10" id="results">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">General overview</h2>
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
              <Tooltip text={`Departing from ${departure?.code} at ${depLocalTime}. Arriving at ${arrLocalTime} local time at ${arrival?.code}.`}>
                Time difference: {timeDifference ? `${timeDifference.offset > 0 ? `+${timeDifference.offset} hours` : `${timeDifference.offset} hours`}` : 'Calculating...'}
              </Tooltip>
              <LagScore />
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
          <MapboxMap from={fromCoords as [number, number]} to={toCoords as [number, number]} />
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
};
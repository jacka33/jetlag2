'use client';
import { useAppSelector } from '../redux/hooks';
import MapArcs from './Map';

export default function Results() {

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-gray-900/10 py-12 dark:border-white/10" id="results">
      <div>
        <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Jetlag schedule</h2>
        <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
          Distance: {useAppSelector((state) => state.flight.distance)} nm (straight line)<br />
          Time: {useAppSelector((state) => (state.flight.time / 60).toFixed(1))} hours (estimated)<br />

          Calculating....

        </p>
      </div>
      <div>
        <MapArcs from={useAppSelector((state) => (state.flight.depCoords))} to={useAppSelector((state) => (state.flight.arrCoords))} />
      </div>
    </div>

  )
}
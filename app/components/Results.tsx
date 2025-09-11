'use client';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { setDistance, setTime } from '../redux/flightSlice';

export default function Results() {
  return (
    <div className="border-b border-gray-900/10 py-12 dark:border-white/10" id="results">
      <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white">Jetlag schedule</h2>
      <p className="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">
        Distance: {useAppSelector((state) => state.flight.distance)} nm<br />
        Time: {useAppSelector((state) => (state.flight.time/60).toFixed(1))} hours<br />

        Calculating....
      </p>
    </div>
  )
}
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'
import { Airport, TimeDifference } from '../types'

import SunCalc from 'suncalc';
import { DateTime } from 'luxon';

// Define a type for the slice state
interface FlightState {
  distance: number
  time: number // in minutes
  direction: string
  departure: Airport | undefined
  arrival: Airport | undefined
  departureDateTime: string // ISO string (local time at departure airport)
  timeDifference: TimeDifference | null
  depSun: { sunrise: DateTime; sunset: DateTime } | null
  arrSun: { sunrise: DateTime; sunset: DateTime } | null
  formSubmitted: boolean
}

// Define the initial state using that type
const initialState: FlightState = {
  distance: 0,
  time: 0,
  direction: "",
  departure: undefined,
  arrival: undefined,
  departureDateTime: "", // ISO string (local time at departure airport)
  timeDifference: null,
  depSun: null,
  arrSun: null,
  formSubmitted: false
}

export const flightSlice = createSlice({
  name: 'flight',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setDistance: (state, action: PayloadAction<number>) => {
      state.distance = action.payload
    },
    setTime: (state, action: PayloadAction<number>) => {
      state.time = action.payload
    },
    setDirection: (state, action: PayloadAction<string>) => {
      state.direction = action.payload
    },
    setDeparture: (state, action: PayloadAction<Airport>) => {
      state.departure = action.payload
    },
    setArrival: (state, action: PayloadAction<Airport>) => {
      state.arrival = action.payload
    },
    setDepartureDateTime: (state, action: PayloadAction<string>) => {
      state.departureDateTime = action.payload;
      const dateObj = DateTime.fromISO(action.payload).toJSDate();
      const depLat = Number(state.departure?.latitude) || 0;
      const depLong = Number(state.departure?.longitude) || 0;
      const arrLat = Number(state.arrival?.latitude) || 0;
      const arrLong = Number(state.arrival?.longitude) || 0;
      const depSunTimes = SunCalc.getTimes(dateObj, depLat, depLong);
      const arrSunTimes = SunCalc.getTimes(dateObj, arrLat, arrLong);
      state.depSun = { sunrise: DateTime.fromJSDate(depSunTimes.sunrise), sunset: DateTime.fromJSDate(depSunTimes.sunset) };
      state.arrSun = { sunrise: DateTime.fromJSDate(arrSunTimes.sunrise), sunset: DateTime.fromJSDate(arrSunTimes.sunset) };
    },
    setTimeDifference: (state, action: PayloadAction<TimeDifference>) => {
      state.timeDifference = action.payload
    },
    setFormSubmitted: (state, action: PayloadAction<boolean>) => {
      state.formSubmitted = action.payload
    },
  },
})

export const { setDistance, setTime, setDirection, setDeparture, setArrival, setDepartureDateTime, setTimeDifference, setFormSubmitted } = flightSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectFlightDistance = (state: RootState) => state.flight.distance
export const selectFlightTime = (state: RootState) => state.flight.time
export const selectDirection = (state: RootState) => state.flight.direction
export const selectDeparture = (state: RootState) => state.flight.departure
export const selectArrival = (state: RootState) => state.flight.arrival
export const selectDepartureDateTime = (state: RootState) => state.flight.departureDateTime
export const selectTimeDifference = (state: RootState) => state.flight.timeDifference
export const selectDepSun = (state: RootState) => state.flight.depSun
export const selectArrSun = (state: RootState) => state.flight.arrSun
export const selectFormSubmitted = (state: RootState) => state.flight.formSubmitted

export default flightSlice.reducer
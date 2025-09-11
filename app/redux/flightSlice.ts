import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface FlightState {
  distance: number
  time: number // in minutes
  depCoords: [number, number] // [long, lat]
  arrCoords: [number, number] // [long, lat]
}

// Define the initial state using that type
const initialState: FlightState = {
  distance: 0,
  time: 0,
  depCoords: [0, 0],
  arrCoords: [0, 0],
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
    setDepCoords: (state, action: PayloadAction<[number, number]>) => {
      state.depCoords = action.payload
    },
    setArrCoords: (state, action: PayloadAction<[number, number]>) => {
      state.arrCoords = action.payload
    },
  },
})

export const { setDistance, setTime, setDepCoords, setArrCoords } = flightSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectFlightDistance = (state: RootState) => state.flight.distance
export const selectFlightTime = (state: RootState) => state.flight.time
export const selectDepCoords = (state: RootState) => state.flight.depCoords
export const selectArrCoords = (state: RootState) => state.flight.arrCoords

export default flightSlice.reducer
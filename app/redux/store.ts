import { configureStore } from '@reduxjs/toolkit'
import flightReducer from './flightSlice'

export const store = configureStore({
  reducer: {
    flight: flightReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {flight: FlightState}
export type AppDispatch = typeof store.dispatch
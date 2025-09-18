import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface UserState {
  usualSleepTime: string
  usualWakeTime: string
  dlmo: string
  ctn: string
  chronotype: string
  age: string
}

// Define the initial state using that type
const initialState: UserState = {
  usualSleepTime: "23:00",
  usualWakeTime: "07:00",
  dlmo: "21:00",
  ctn: "05:00",
  chronotype: "Intermediate",
  age: "Unknown"
}

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUsualSleepTime: (state, action: PayloadAction<string>) => {
      state.usualSleepTime = action.payload
    },
    setUsualWakeTime: (state, action: PayloadAction<string>) => {
      state.usualWakeTime = action.payload
    },
    setDlmo: (state, action: PayloadAction<string>) => {
      state.dlmo = action.payload
    },
    setCtn: (state, action: PayloadAction<string>) => {
      state.ctn = action.payload
    },
    setChronotype: (state, action: PayloadAction<string>) => {
      state.chronotype = action.payload
    },
    setAge: (state, action: PayloadAction<string>) => {
      state.age = action.payload
    },
  },
})

export const { setUsualSleepTime, setUsualWakeTime, setDlmo, setCtn, setChronotype, setAge } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUsualSleepTime = (state: RootState) => state.user.usualSleepTime
export const selectUsualWakeTime = (state: RootState) => state.user.usualWakeTime
export const selectDlmo = (state: RootState) => state.user.dlmo
export const selectCtn = (state: RootState) => state.user.ctn
export const selectChronotype = (state: RootState) => state.user.chronotype
export const selectAge = (state: RootState) => state.user.age

export default userSlice.reducer
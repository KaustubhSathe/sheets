import { createSlice } from '@reduxjs/toolkit'

export enum STATUS {
    SAVED,
    UNSAVED,
    SAVING
}

export const savedSlice = createSlice({
  name: 'saved',
  initialState: {
    value: STATUS.SAVED,
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = savedSlice.actions

export default savedSlice.reducer
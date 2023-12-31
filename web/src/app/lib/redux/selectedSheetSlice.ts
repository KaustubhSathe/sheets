import { createSlice } from '@reduxjs/toolkit'

export const selectedSheetSlice = createSlice({
  name: 'selectedSheet',
  initialState: {
    value: 0,
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = selectedSheetSlice.actions

export default selectedSheetSlice.reducer
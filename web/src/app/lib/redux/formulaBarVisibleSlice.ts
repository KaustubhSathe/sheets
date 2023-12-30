import { createSlice } from '@reduxjs/toolkit'

export const formulaBarVisibleSlice = createSlice({
  name: 'formulaBarVisible',
  initialState: {
    value: true,
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = formulaBarVisibleSlice.actions

export default formulaBarVisibleSlice.reducer
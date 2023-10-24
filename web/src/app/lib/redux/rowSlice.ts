import { createSlice } from '@reduxjs/toolkit'

export const rowSlice = createSlice({
  name: 'rows',
  initialState: {
    value: 100,
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = rowSlice.actions

export default rowSlice.reducer
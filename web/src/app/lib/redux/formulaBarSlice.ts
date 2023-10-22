import { createSlice } from '@reduxjs/toolkit'

export const formulaBarSlice = createSlice({
  name: 'formulabar',
  initialState: {
    value: '',
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = formulaBarSlice.actions

export default formulaBarSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

export const selectedCellSlice = createSlice({
  name: 'selectedCell',
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
export const { setValue } = selectedCellSlice.actions

export default selectedCellSlice.reducer
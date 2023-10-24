import { createSlice } from '@reduxjs/toolkit'

export const columnSlice = createSlice({
  name: 'columns',
  initialState: {
    value: 26,
  },
  reducers: {
    setValue: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = columnSlice.actions

export default columnSlice.reducer
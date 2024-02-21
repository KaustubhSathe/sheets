import { createSlice } from '@reduxjs/toolkit'

export const selectStartSlice = createSlice({
  name: 'selectStart',
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
export const { setValue } = selectStartSlice.actions

export default selectStartSlice.reducer
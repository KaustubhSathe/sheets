import { createSlice } from '@reduxjs/toolkit'

export const nameBoxSlice = createSlice({
  name: 'namebox',
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
export const { setValue } = nameBoxSlice.actions

export default nameBoxSlice.reducer
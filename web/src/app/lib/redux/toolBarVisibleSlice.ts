import { createSlice } from '@reduxjs/toolkit'

export const toolBarVisibleSlice = createSlice({
  name: 'toolBarVisible',
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
export const { setValue } = toolBarVisibleSlice.actions

export default toolBarVisibleSlice.reducer
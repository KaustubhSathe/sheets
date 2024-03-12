import { createSlice } from '@reduxjs/toolkit'

export const selectStartSlice = createSlice({
  name: 'selectStart',
  initialState: {
    value: {
      id: "A1",
      text: "",
    } as {
      id: string,
      top: number,
      bottom: number,
      left: number,
      right: number,
      text: string,
      display: string,
    },
  },
  reducers: {
    setValue: (state, action: {
      payload: {
        id: string,
        top: number,
        bottom: number,
        left: number,
        right: number,
        text: string,
        display: string,
      },
      type: string 
    }) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = selectStartSlice.actions

export default selectStartSlice.reducer
import Spreadsheet from '@/app/spreadsheets/[id]/page'
import { SpreadSheet, State } from '@/app/types/SpreadSheet'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const textFormatSlice = createSlice({
  name: 'textFormat',
  initialState: {
    value: {} as State,
  },
  reducers: {
    setValue: (state, action: PayloadAction<State>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = textFormatSlice.actions

export default textFormatSlice.reducer
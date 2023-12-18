import Spreadsheet from '@/app/spreadsheets/[id]/page'
import { SpreadSheet } from '@/app/types/SpreadSheet'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const spreadhsheetsSlice = createSlice({
  name: 'spreadsheets',
  initialState: {
    value: [] as SpreadSheet[],
  },
  reducers: {
    setValue: (state, action: PayloadAction<SpreadSheet[]>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = spreadhsheetsSlice.actions

export default spreadhsheetsSlice.reducer
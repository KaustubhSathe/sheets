import Spreadsheet from '@/app/spreadsheets/[id]/page'
import { SpreadSheet } from '@/app/types/SpreadSheet'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const totalRCSlice = createSlice({
  name: 'totalRC',
  initialState: {
    value: {
        rows: 100,
        columns: 26,
    } as {
        rows: number,
        columns: number
    },
  },
  reducers: {
    setValue: (state, action: PayloadAction<{
        rows: number,
        columns: number
    }>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = totalRCSlice.actions

export default totalRCSlice.reducer
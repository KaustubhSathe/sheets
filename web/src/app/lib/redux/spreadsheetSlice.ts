import { SpreadSheet } from '@/app/types/SpreadSheet'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const spreadhsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState: {
    value: {} as SpreadSheet,
  },
  reducers: {
    setValue: (state, action: PayloadAction<SpreadSheet>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = spreadhsheetSlice.actions

export default spreadhsheetSlice.reducer
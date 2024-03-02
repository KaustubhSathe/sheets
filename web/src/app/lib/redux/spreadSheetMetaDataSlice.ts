import { PayloadAction, createSlice } from '@reduxjs/toolkit'

export const spreadhSheetMetaDataSlice = createSlice({
  name: 'spreadSheetMetaData',
  initialState: {
    value: {} as {
      SpreadSheetID: string,
      SpreadSheetTitle: string,
      UserName: string,
      UpdatedAt: Date,
      Favorited: boolean,
      CreatedAt: Date,
      SheetsData: {
        SheetName: string,
        SheetIndex: number,
      }[],
      Versions: {
        VersionName: string,
        CreatedAt: Date
      }[]
    },
  },
  reducers: {
    setValue: (state, action: PayloadAction<{
      SpreadSheetID: string,
      SpreadSheetTitle: string,
      UserName: string,
      UpdatedAt: Date,
      Favorited: boolean,
      CreatedAt: Date,
      SheetsData: {
        SheetName: string,
        SheetIndex: number,
      }[],
      Versions: {
        VersionName: string,
        CreatedAt: Date
      }[]
    }>) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setValue } = spreadhSheetMetaDataSlice.actions

export default spreadhSheetMetaDataSlice.reducer
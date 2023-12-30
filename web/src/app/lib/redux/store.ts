import { configureStore } from '@reduxjs/toolkit'
import nameBoxReducer from './nameBoxSlice'
import formulaBarReducer from './formulaBarSlice'
import selectedCellReducer from './selectedCellSlice'
import spreadsheetsReducer from './spreadsheetsSlice'
import spreadsheetReducer from './spreadsheetSlice'
import formulaBarVisibleReducer from './formulaBarVisibleSlice'
import toolBarVisibleReducer from './toolBarVisibleSlice'
import selectedSheetReducer from './selectedSheetSlice'

const store = configureStore({
  reducer: {
    nameBox: nameBoxReducer,
    formulaBar: formulaBarReducer,
    selectedCell: selectedCellReducer,
    spreadsheets: spreadsheetsReducer,
    spreadsheet: spreadsheetReducer,
    formulaBarVisible: formulaBarVisibleReducer,
    toolBarVisible: toolBarVisibleReducer,
    selectedSheet: selectedSheetReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
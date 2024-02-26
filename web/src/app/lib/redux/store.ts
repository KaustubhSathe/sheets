import { configureStore } from '@reduxjs/toolkit'
import nameBoxReducer from './nameBoxSlice'
import formulaBarReducer from './formulaBarSlice'
import selectStartReducer from './selectStartSlice'
import spreadsheetsReducer from './spreadsheetsSlice'
import spreadSheetMetaDataReducer from './spreadSheetMetaDataSlice'
import formulaBarVisibleReducer from './formulaBarVisibleSlice'
import toolBarVisibleReducer from './toolBarVisibleSlice'
import savedReducer from './savedSlice'
import commentsReducer from './commentsSlice'
import notesReducer from './notesSlice'

const store = configureStore({
  reducer: {
    nameBox: nameBoxReducer,
    formulaBar: formulaBarReducer,
    selectStart: selectStartReducer,
    spreadsheets: spreadsheetsReducer,
    spreadSheetMetaData: spreadSheetMetaDataReducer,
    formulaBarVisible: formulaBarVisibleReducer,
    toolBarVisible: toolBarVisibleReducer,
    saved: savedReducer,
    comments: commentsReducer,
    notes: notesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
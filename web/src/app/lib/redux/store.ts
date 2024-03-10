import { configureStore } from '@reduxjs/toolkit'
import nameBoxReducer from './nameBoxSlice'
import formulaBarReducer from './formulaBarSlice'
import spreadsheetsReducer from './spreadsheetsSlice'
import selectStartReducer from './selectStartSlice'
import spreadSheetMetaDataReducer from './spreadSheetMetaDataSlice'
import formulaBarVisibleReducer from './formulaBarVisibleSlice'
import toolBarVisibleReducer from './toolBarVisibleSlice'
import savedReducer from './savedSlice'
import commentsReducer from './commentsSlice'
import notesReducer from './notesSlice'
import textFormatReducer from './textFormatSlice'

const store = configureStore({
  reducer: {
    nameBox: nameBoxReducer,
    selectStart: selectStartReducer,
    spreadsheets: spreadsheetsReducer,
    spreadSheetMetaData: spreadSheetMetaDataReducer,
    formulaBarVisible: formulaBarVisibleReducer,
    toolBarVisible: toolBarVisibleReducer,
    saved: savedReducer,
    comments: commentsReducer,
    notes: notesReducer,
    textFormat: textFormatReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
import { configureStore } from '@reduxjs/toolkit'
import nameBoxReducer from './nameBoxSlice'
import formulaBarReducer from './formulaBarSlice'
import selectedCellReducer from './selectedCellSlice'

export type NameBoxReducer = {
  nameBox: {
      value: string;
  };
}

export type FormulaBarReducer = {
  formulaBar: {
    value: string;
  };
}

export default configureStore({
  reducer: {
    nameBox: nameBoxReducer,
    formulaBar: formulaBarReducer,
    selectedCell: selectedCellReducer,
  },
})
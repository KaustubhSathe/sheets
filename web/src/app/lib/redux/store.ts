import { configureStore } from '@reduxjs/toolkit'
import nameBoxReducer from './nameBoxSlice'
import formulaBarReducer from './formulaBarSlice'
import columnReducer from './columnSlice'
import rowReducer from './rowSlice'

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

export type ColumnReducer = {
  column: {
    value: number;
  };
}

export type RowReducer = {
  row: {
    value: number;
  };
}

export default configureStore({
  reducer: {
    nameBox: nameBoxReducer,
    formulaBar: formulaBarReducer,
    column: columnReducer,
    row: rowReducer,
  },
})
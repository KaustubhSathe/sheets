'use client'

import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";
import { Provider } from 'react-redux'
import store from '../../lib/redux/store'


export default function Spreadsheet() {
    return (
        <Provider store={store}>
            <MenuBar />
            <ToolsBar />
            <FormulaBar />
            <CellsGrid />
            <SheetsBar />
        </Provider>
    )
}

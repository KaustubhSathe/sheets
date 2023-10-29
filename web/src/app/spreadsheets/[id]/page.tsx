'use client'

import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";
import { Provider } from 'react-redux'
import store from '../../lib/redux/store'
import { useRouter } from "next/navigation";

export default function Spreadsheet() {
    const router = useRouter()
    if (typeof window !== 'undefined') {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
        if (access_token === null) {
            return router.push("/")
        }
        localStorage.setItem("spreadsheet_access_token", access_token);
    }
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

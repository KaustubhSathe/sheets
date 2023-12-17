'use client'

import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";
import { Provider } from 'react-redux'
import store from '../../lib/redux/store'
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { GetSpreadSheet } from "@/app/api/spreadsheet";

export default function Spreadsheet() {
    const router = useRouter();
    let spreadsheet = useRef<(() => void) | null>(null);

    useEffect(() => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
        if (access_token === null) {
            return router.push("/")
        }
        localStorage.setItem("spreadsheet_access_token", access_token);

        GetSpreadSheet(access_token, window.location.href.split("/")[window.location.href.split("/").length - 1])
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            }).then(res => {
                spreadsheet.current = res;
                console.log(res);
            })
    }, [router]);

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

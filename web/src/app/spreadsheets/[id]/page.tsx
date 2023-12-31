'use client'

import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../lib/redux/store'
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { GetSpreadSheet } from "@/app/api/spreadsheet";
import { setValue as setSpreadSheet } from '../../lib/redux/spreadsheetSlice';
import React from "react";
import { SpreadSheet } from "@/app/types/SpreadSheet";

export default function Spreadsheet() {
    const router = useRouter();
    const dispatch = useDispatch();
    const formulaBarVisible = useSelector((state: RootState) => state.formulaBarVisible).value;
    const toolBarVisible = useSelector((state: RootState) => state.toolBarVisible).value;
    const selectedSheet = useSelector((state: RootState) => state.selectedSheet).value;
    const pathname = usePathname();

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
            }).then((res: SpreadSheet) => {
                dispatch(setSpreadSheet(res));
                if (res && res.Sheets && res.Sheets[selectedSheet - 1] && res.Sheets[selectedSheet - 1].State) {
                    for (let key in res.Sheets[selectedSheet - 1].State) {
                        const val = res.Sheets[selectedSheet - 1].State[key]
                        let elem = document.getElementById(key) as HTMLDivElement
                        if (elem) {
                            elem.innerText = val.TextContent
                        }
                    }
                }
            })
    }, [router, dispatch, selectedSheet]);

    return (
        <>
            <MenuBar />
            {toolBarVisible && <ToolsBar />}
            {formulaBarVisible && <FormulaBar />}
            <CellsGrid />
            <SheetsBar />
        </>
    )
}

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

export default function Spreadsheet() {
    const router = useRouter();
    const dispatch = useDispatch();
    const formulaBarVisible = useSelector((state: RootState) => state.formulaBarVisible).value;
    const toolBarVisible = useSelector((state: RootState) => state.toolBarVisible).value;

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
            }).then(res => {
                dispatch(setSpreadSheet(res));
            })
    }, [router, dispatch]);

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

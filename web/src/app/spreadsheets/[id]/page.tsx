'use client'

import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";
import { Provider } from 'react-redux'
import store from '../../lib/redux/store'
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GetSpreadSheet } from "@/app/api/spreadsheet";
import { SpreadSheet, State } from "@/app/types/SpreadSheet";

export default function Spreadsheet() {
    const router = useRouter();
    const [spreadsheet, setSpreadSheet] = useState<SpreadSheet>({
        CreatedAt: new Date(),
        DeletedAt: null,
        Favorited: false,
        LastOpened: new Date(),
        PK: "",
        Sheets: [{
            SheetName: "sheet 1",
            State: new Map<string, State>(),
        }],
        SK: " asd",
        SpreadSheetTitle: "asdas",
        UpdatedAt: new Date(),
        UserID: 4224,
        UserName: "sadasd",
    });
    const [formulaBarVisible, setFormulaBarVisible] = useState<boolean>(true);
    const [toolBarVisible, setToolBarVisible] = useState<boolean>(true);
    const selectStart = useRef<string>("A1");
    const selectEnd = useRef<string>("A1");
    const copyStart = useRef<string | null>(null);
    const copyEnd = useRef<string | null>(null);
    const cutStart = useRef<string | null>(null);
    const cutEnd = useRef<string | null>(null);

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
                setSpreadSheet(res);
            })
    }, [router]);

    return (
        <Provider store={store}>
            <MenuBar selectStart={selectStart} selectEnd={selectEnd} copyStart={copyStart} copyEnd={copyEnd} cutStart={cutStart} cutEnd={cutEnd} spreadsheet={spreadsheet} formulaBarVisible={formulaBarVisible} toolBarVisible={toolBarVisible} setFormulaBarVisible={setFormulaBarVisible} setToolBarVisible={setToolBarVisible} />
            {toolBarVisible && <ToolsBar />}
            {formulaBarVisible && <FormulaBar />}
            <CellsGrid spreadsheet={spreadsheet} setSpreadSheet={setSpreadSheet} selectStart={selectStart} selectEnd={selectEnd} copyStart={copyStart} copyEnd={copyEnd} cutStart={cutStart} cutEnd={cutEnd} formulaBarVisible={formulaBarVisible} toolBarVisible={toolBarVisible} />
            <SheetsBar />
        </Provider>
    )
}

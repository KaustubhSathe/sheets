'use client'

import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../lib/redux/store'
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { GetSpreadSheet } from "@/app/api/spreadsheet";
import { setValue as setSpreadSheetMetaData } from '../../lib/redux/spreadSheetMetaDataSlice';
import React from "react";
import { SpreadSheet } from "@/app/types/SpreadSheet";
import globals from "@/app/lib/globals/globals";
import { GetComments } from "@/app/api/comment";
import { Comment } from "@/app/types/Comment";
import { setValue as setComments } from '../../lib/redux/commentsSlice';
import { setValue as setNotes } from '../../lib/redux/notesSlice';
import { GetNotes } from "@/app/api/note";


export default function Spreadsheet() {
    const router = useRouter();
    const dispatch = useDispatch();
    const formulaBarVisible = useSelector((state: RootState) => state.formulaBarVisible).value;
    const toolBarVisible = useSelector((state: RootState) => state.toolBarVisible).value;
    const pathname = usePathname();

    useEffect(() => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
        const spreadsheet_id = window.location.href.split("/")[window.location.href.split("/").length - 1]
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
                globals.spreadsheet = res;
                dispatch(setSpreadSheetMetaData({
                    SpreadSheetID: res.SK.slice(12),
                    CreatedAt: res.CreatedAt,
                    Favorited: res.Favorited,
                    UpdatedAt: res.UpdatedAt,
                    UserName: res.UserName,
                    SpreadSheetTitle: res.SpreadSheetTitle,
                    SheetsData: res.Sheets.map(x => {
                        return {
                            SheetIndex: x.SheetIndex,
                            SheetName: x.SheetName,
                        }
                    })
                }));
                if (res && res.Sheets && res.Sheets[globals.selectedSheet] && res.Sheets[globals.selectedSheet].State) {
                    for (let j = 0; j < globals.columns; j++) {
                        for (let i = 0; i < globals.rows; i++) {
                            const key = String.fromCharCode(65 + j) + (i + 1).toString();
                            let elem = document.getElementById(key) as HTMLTextAreaElement
                            globals.spreadsheet.Sheets[globals.selectedSheet].State[key] = {
                                BackGroundColor: res.Sheets[globals.selectedSheet].State[key] ? res.Sheets[globals.selectedSheet].State[key].BackGroundColor : "#FFFFFF",
                                FontColor: res.Sheets[globals.selectedSheet].State[key] ? res.Sheets[globals.selectedSheet].State[key].FontColor : "Black",
                                FontFamily: res.Sheets[globals.selectedSheet].State[key] ? res.Sheets[globals.selectedSheet].State[key].FontFamily : "Roboto",
                                FontStyle: "normal",
                                FontWeight: "normal",
                                TextContent: res.Sheets[globals.selectedSheet].State[key] ? res.Sheets[globals.selectedSheet].State[key].TextContent : "",
                                TextDecoration: "normal",
                                FontSize: res.Sheets[globals.selectedSheet].State[key] ? res.Sheets[globals.selectedSheet].State[key].FontSize : 16
                            }
                            elem.value = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].TextContent
                            elem.style.backgroundColor = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].BackGroundColor
                            elem.style.color = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].FontColor
                            elem.style.fontFamily = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].FontFamily
                            elem.style.fontStyle = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].FontStyle
                            elem.style.fontWeight = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].FontWeight
                            elem.style.textDecoration = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].TextDecoration
                            elem.style.fontSize = globals.spreadsheet.Sheets[globals.selectedSheet].State[key].FontSize + "px"
                        }
                    }
                }
            })

        GetComments(access_token, spreadsheet_id)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            }).then((res: Comment[]) => {
                dispatch(setComments(res));
            })


        GetNotes(access_token, spreadsheet_id)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            }).then(res => {
                dispatch(setNotes(res))
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

'use client'

import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../lib/redux/store'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import { Note } from "@/app/types/Note";
import { setValue as setTextFormat } from '../../lib/redux/textFormatSlice'

export default function Spreadsheet() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [greyedOut, setGreyedOut] = useState<boolean>(true);
    const formulaBarVisible = useSelector((state: RootState) => state.formulaBarVisible).value;
    const toolBarVisible = useSelector((state: RootState) => state.toolBarVisible).value;

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
                    Versions: res.Versions.map(x => {
                        return {
                            CreatedAt: x.CreatedAt,
                            VersionName: x.VersionName,
                            VersionID: x.VersionID,
                        }
                    }),
                    SheetsData: res.Versions[0].Sheets.map(x => {
                        return {
                            SheetIndex: x.SheetIndex,
                            SheetName: x.SheetName,
                        }
                    })
                }));
                if (res && res.Versions && res.Versions[0] && res.Versions[0].Sheets && res.Versions[0].Sheets[globals.selectedSheet] && res.Versions[0].Sheets[globals.selectedSheet].State) {
    
                    for (let i = 0; i < globals.spreadsheet.Versions[0].Sheets.length; i++) {
                        if (!globals.hfInstance.doesSheetExist(globals.spreadsheet.Versions[0].Sheets[i].SheetName)) {
                            globals.hfInstance.addSheet(globals.spreadsheet.Versions[0].Sheets[i].SheetName)
                            globals.hfInstance.addColumns(i, [0, globals.columns])
                            globals.hfInstance.addRows(i, [0, globals.rows])
                        }
                    }
                    for (let j = 0; j < globals.columns; j++) {
                        for (let i = 0; i < globals.rows; i++) {
                            const key = String.fromCharCode(65 + j) + (i + 1).toString();
                            let elem = document.getElementById(key) as HTMLTextAreaElement
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key] = {
                                TextAlign: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].TextAlign : "left",
                                BackGroundColor: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].BackGroundColor : "#FFFFFF",
                                FontColor: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontColor : "Black",
                                FontFamily: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontFamily : "Roboto",
                                FontStyle: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontStyle : "normal",
                                FontWeight: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontWeight : "normal",
                                TextContent: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].TextContent : "",
                                TextDecoration: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].TextDecoration : "none",
                                BackGroundImage: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].BackGroundImage : "",
                                FontSize: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontSize : 16
                            }
                            elem.value = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextContent
                            elem.style.textAlign = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextAlign
                            elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].BackGroundColor
                            elem.style.backgroundImage = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].BackGroundImage
                            elem.style.color = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontColor
                            elem.style.fontFamily = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontFamily
                            elem.style.fontStyle = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontStyle
                            elem.style.fontWeight = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontWeight
                            elem.style.textDecoration = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextDecoration
                            elem.style.fontSize = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontSize + "px"
                            globals.hfInstance.setCellContents({
                                col: j,
                                row: i,
                                sheet: globals.selectedSheet
                            }, globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextContent)
                        }
                    }

                }
                setGreyedOut(false)
                dispatch(setTextFormat(
                    {
                        FontFamily: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].FontFamily,
                        BackGroundColor: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].BackGroundColor,
                        BackGroundImage: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].BackGroundImage,
                        FontColor: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].FontColor,
                        FontSize: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].FontSize,
                        FontStyle: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].FontStyle,
                        FontWeight: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].FontWeight,
                        TextContent: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].TextContent,
                        TextDecoration: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].TextDecoration,
                        TextAlign: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].TextAlign
                    }
                ))
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
            }).then((res: Note[]) => {
                dispatch(setNotes(res))
            })

    }, [router, dispatch]);

    return (
        <>
            {greyedOut && <GreyOut />}
            <MenuBar />
            {toolBarVisible && <ToolsBar />}
            {formulaBarVisible && <FormulaBar />}
            <CellsGrid />
            <SheetsBar />
        </>
    )
}


function GreyOut() {
    return <div className="h-screen w-screen absolute z-[1000] bg-slate-500 opacity-50">
    </div>
}
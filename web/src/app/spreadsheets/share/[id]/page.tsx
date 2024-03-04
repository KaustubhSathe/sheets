"use client";

import { GetSpreadSheet, ShareSpreadSheet } from "@/app/api/spreadsheet"
import CellsGrid from "./components/CellsGrid"
import SheetsBar from "./components/SheetsBar"
import { useEffect } from "react";
import globals from "@/app/lib/globals/globals";
import { setValue as setSpreadSheetMetaData } from '../../../lib/redux/spreadSheetMetaDataSlice';
import { useDispatch } from "react-redux";
import { SpreadSheet } from "@/app/types/SpreadSheet";

export default function ShareSpreadsheet() {
    const dispatch = useDispatch();
    useEffect(() => {
        ShareSpreadSheet(window.location.href.split("/")[window.location.href.split("/").length - 1])
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then((res: SpreadSheet) => {

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
                if (res && res.Versions[0].Sheets && res.Versions[0].Sheets[globals.selectedSheet] && res.Versions[0].Sheets[globals.selectedSheet].State) {
                    for (let j = 0; j < globals.columns; j++) {
                        for (let i = 0; i < globals.rows; i++) {
                            const key = String.fromCharCode(65 + j) + (i + 1).toString();
                            let elem = document.getElementById(key) as HTMLTextAreaElement
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key] = {
                                BackGroundColor: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].BackGroundColor : "#FFFFFF",
                                FontColor: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontColor : "Black",
                                FontFamily: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontFamily : "Roboto",
                                FontStyle: "normal",
                                FontWeight: "normal",
                                TextContent: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].TextContent : "",
                                TextDecoration: "normal",
                                FontSize: res.Versions[0].Sheets[globals.selectedSheet].State[key] ? res.Versions[0].Sheets[globals.selectedSheet].State[key].FontSize : 16
                            }
                            elem.value = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextContent
                            elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].BackGroundColor
                            elem.style.color = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontColor
                            elem.style.fontFamily = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontFamily
                            elem.style.fontStyle = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontStyle
                            elem.style.fontWeight = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontWeight
                            elem.style.textDecoration = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextDecoration
                            elem.style.fontSize = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontSize + "px"
                        }
                    }
                }
            })
    }, [dispatch]);

    return (
        <>
            <CellsGrid />
            <SheetsBar />
        </>
    )
}

import { LuPlus, LuMenu } from 'react-icons/lu'
import { useCallback, useEffect, useRef, useState } from 'react';
import SheetsBox from './SheetBox';
import { MdCheck } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/redux/store';
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { setValue as setSpreadSheetMetaData } from '../../../lib/redux/spreadSheetMetaDataSlice'
import globals from '@/app/lib/globals/globals';
import { setValue as setComments } from '../../../lib/redux/commentsSlice';

export default function SheetsBar() {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData.value);
    const [selectedSheet, setSelectedSheet] = useState<number>(0);
    const dispatch = useDispatch();
    const [sheetsDropDown, setSheetsDropDown] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const comments = useSelector((state: RootState) => state.comments.value)
    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setSheetsDropDown(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);
    }, [click]);

    return (
        <div className="bg-[#F9FBFD] h-[37px] flex align-middle">
            <button className="ml-[46px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center" onClick={() => {
                globals.spreadsheet.Versions[0].Sheets.push({
                    SheetIndex: spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 : 0,
                    SheetName: "Sheet " + (spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 + 1 : 0 + 1).toString(),
                    State: {},
                })
                dispatch(setSpreadSheetMetaData({
                    ...spreadSheetMetaData,
                    SheetsData: [...spreadSheetMetaData.SheetsData, {
                        SheetIndex: spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 : 0,
                        SheetName: "Sheet " + (spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 + 1 : 0 + 1).toString(),
                    }]
                }))
                if (globals.saved) {
                    globals.saved = false
                    dispatch(setSaved(STATUS.UNSAVED))
                }
            }}>
                <LuPlus className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            <div ref={ref1} className="hover:cursor-pointer relative ml-[8px] mr-[8px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center" onClick={() => setSheetsDropDown(!sheetsDropDown)}>
                <LuMenu className="mt-auto mb-auto w-[20px] h-[20px]" />
                {
                    sheetsDropDown && spreadSheetMetaData && spreadSheetMetaData.SheetsData && <div className={`absolute left-0`} style={{ top: -1 * spreadSheetMetaData.SheetsData.length * 40 + 'px' }}>
                        {spreadSheetMetaData && spreadSheetMetaData.SheetsData && spreadSheetMetaData.SheetsData.map(x => (
                            <div key={x.SheetIndex} className="flex gap-2 justify-center w-[90px] h-[40px] bg-white hover:bg-slate-300" onClick={() => {
                                if (globals.spreadsheet && globals.spreadsheet.Versions[0].Sheets && globals.spreadsheet.Versions[0].Sheets[x.SheetIndex] && globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State) {
                                    for (let j = 0; j < globals.columns; j++) {
                                        for (let i = 0; i < globals.rows; i++) {
                                            const key = String.fromCharCode(65 + j) + (i + 1).toString();
                                            let elem = document.getElementById(key) as HTMLTextAreaElement
                                            // First save old state
                                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key] = {
                                                BackGroundColor: elem.style.backgroundColor,
                                                FontColor: elem.style.color,
                                                FontFamily: elem.style.fontFamily,
                                                FontStyle: elem.style.fontStyle,
                                                FontWeight: elem.style.fontWeight,
                                                TextContent: elem.value,
                                                TextDecoration: elem.style.textDecoration,
                                                FontSize: parseInt(elem.style.fontSize),
                                                BackGroundImage: "",
                                                TextAlign: elem.style.textAlign
                                            }
                                            if (!globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key]) {
                                                globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key] = {
                                                    BackGroundColor: "#FFFFFF",
                                                    FontColor: "Black",
                                                    FontFamily: "Roboto",
                                                    FontStyle: "underline",
                                                    FontWeight: "bold",
                                                    TextContent: "",
                                                    TextDecoration: "underline",
                                                    FontSize: parseInt(elem.style.fontSize),
                                                    BackGroundImage: "",
                                                    TextAlign: elem.style.textAlign
                                                }
                                            }
                                            elem.value = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].TextContent
                                            elem.style.textAlign = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].TextAlign
                                            elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].BackGroundColor
                                            elem.style.backgroundImage = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].BackGroundImage
                                            elem.style.color = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontColor
                                            elem.style.fontFamily = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontFamily
                                            elem.style.fontStyle = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontStyle
                                            elem.style.fontWeight = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontWeight
                                            elem.style.textDecoration = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].TextDecoration
                                            elem.style.fontSize = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontSize + "px"
                                        }
                                    }
                                }
                                globals.selectedSheet = x.SheetIndex
                                setSelectedSheet(x.SheetIndex)
                                dispatch(setComments([...comments]));
                            }}>
                                {selectedSheet === x.SheetIndex && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                                <span className="mt-auto mb-auto">{x.SheetName}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>

            {
                spreadSheetMetaData && spreadSheetMetaData.SheetsData && spreadSheetMetaData.SheetsData.map(x => <SheetsBox selectedSheet={selectedSheet} setSelectedSheet={setSelectedSheet} key={x.SheetIndex} sheetName={x.SheetName} index={x.SheetIndex} onClick={() => {
                    if (globals.spreadsheet && globals.spreadsheet.Versions[0].Sheets && globals.spreadsheet.Versions[0].Sheets[x.SheetIndex] && globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State) {
                        for (let j = 0; j < globals.columns; j++) {
                            for (let i = 0; i < globals.rows; i++) {
                                const key = String.fromCharCode(65 + j) + (i + 1).toString();
                                let elem = document.getElementById(key) as HTMLTextAreaElement
                                // First save old state
                                globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key] = {
                                    BackGroundColor: elem.style.backgroundColor,
                                    FontColor: elem.style.color,
                                    FontFamily: elem.style.fontFamily,
                                    FontStyle: elem.style.fontStyle,
                                    FontWeight: elem.style.fontWeight,
                                    TextContent: elem.value,
                                    TextDecoration: elem.style.textDecoration,
                                    FontSize: parseInt(elem.style.fontSize),
                                    BackGroundImage: "",
                                    TextAlign: elem.style.textAlign
                                }
                                if (!globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key]) {
                                    globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key] = {
                                        BackGroundColor: "#FFFFFF",
                                        FontColor: "Black",
                                        FontFamily: "Roboto",
                                        FontStyle: "underline",
                                        FontWeight: "bold",
                                        TextContent: "",
                                        TextDecoration: "underline",
                                        FontSize: parseInt(elem.style.fontSize),
                                        BackGroundImage: "",
                                        TextAlign: elem.style.textAlign
                                    }
                                }
                                elem.value = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].TextContent
                                elem.style.textAlign = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].TextAlign
                                elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].BackGroundColor
                                elem.style.backgroundImage = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].BackGroundImage
                                elem.style.color = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontColor
                                elem.style.fontFamily = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontFamily
                                elem.style.fontStyle = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontStyle
                                elem.style.fontWeight = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontWeight
                                elem.style.textDecoration = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].TextDecoration
                                elem.style.fontSize = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].FontSize + "px"
                            }
                        }
                    }
                    globals.selectedSheet = x.SheetIndex
                    setSelectedSheet(x.SheetIndex)
                    dispatch(setComments([...comments]));
                }
                } />)
            }
        </div>
    );
}
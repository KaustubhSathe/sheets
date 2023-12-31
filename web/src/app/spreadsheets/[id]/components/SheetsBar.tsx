import { LuPlus, LuMenu } from 'react-icons/lu'
import { useCallback, useEffect, useRef, useState } from 'react';
import SheetsBox from './SheetBox';
import { MdCheck } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/redux/store';
import { setValue as setSpreadSheetMetaData } from '../../../lib/redux/spreadSheetMetaDataSlice'
import { setValue as setSelectedSheet } from '../../../lib/redux/selectedSheetSlice'
import globals from '@/app/lib/globals/globals';
import { State } from '@/app/types/SpreadSheet';

export default function SheetsBar() {
    const selectedSheet = useSelector((state: RootState) => state.selectedSheet).value;
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;
    const { rows, columns } = useSelector((state: RootState) => state.totalRC).value;
    const dispatch = useDispatch();
    const [sheetsDropDown, setSheetsDropDown] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
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
                globals.spreadsheet.Sheets.push({
                    SheetIndex: spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 : 0,
                    SheetName: "Sheet " + (spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 : 0 + 1).toString(),
                    State: {},
                })
                dispatch(setSpreadSheetMetaData({
                    ...spreadSheetMetaData,
                    SheetsData: [...spreadSheetMetaData.SheetsData, {
                        SheetIndex: spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 : 0,
                        SheetName: "Sheet " + (spreadSheetMetaData.SheetsData.length ? spreadSheetMetaData.SheetsData[spreadSheetMetaData.SheetsData.length - 1].SheetIndex + 1 : 0 + 1).toString(),
                    }]
                }))
            }}>
                <LuPlus className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            <div ref={ref1} className="hover:cursor-pointer relative ml-[8px] mr-[8px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center" onClick={() => setSheetsDropDown(!sheetsDropDown)}>
                <LuMenu className="mt-auto mb-auto w-[20px] h-[20px]" />
                {
                    sheetsDropDown && spreadSheetMetaData && spreadSheetMetaData.SheetsData && <div className={`absolute left-0`} style={{ top: -1 * spreadSheetMetaData.SheetsData.length * 40 + 'px' }}>
                        {spreadSheetMetaData && spreadSheetMetaData.SheetsData && spreadSheetMetaData.SheetsData.map(x => (
                            <div key={x.SheetIndex} className="flex gap-2 justify-center w-[90px] h-[40px] bg-white hover:bg-slate-300" onClick={() => {
                                if (globals.spreadsheet && globals.spreadsheet.Sheets && globals.spreadsheet.Sheets[x.SheetIndex] && globals.spreadsheet.Sheets[x.SheetIndex].State) {
                                    for (let j = 0; j < columns; j++) {
                                        for (let i = 0; i < rows; i++) {
                                            const key = String.fromCharCode(65 + j) + (i + 1).toString();
                                            let elem = document.getElementById(key) as HTMLDivElement
                                            // First save old state
                                            globals.spreadsheet.Sheets[selectedSheet].State[key] = {
                                                BackGroundColor: elem.style.backgroundColor,
                                                FontColor: elem.style.color,
                                                FontFamily: elem.style.fontFamily,
                                                FontStyle: elem.style.fontStyle,
                                                FontWeight: elem.style.fontWeight,
                                                TextContent: elem.innerText,
                                                TextDecoration: elem.style.textDecoration,
                                            }
                                            if (!globals.spreadsheet.Sheets[x.SheetIndex].State[key]) {
                                                globals.spreadsheet.Sheets[x.SheetIndex].State[key] = {
                                                    BackGroundColor: "#FFFFFF",
                                                    FontColor: "Black",
                                                    FontFamily: "Roboto",
                                                    FontStyle: "underline",
                                                    FontWeight: "bold",
                                                    TextContent: "",
                                                    TextDecoration: "underline",
                                                }
                                            }
                                            elem.innerText = globals.spreadsheet.Sheets[x.SheetIndex].State[key].TextContent
                                        }
                                    }
                                }
                                dispatch(setSelectedSheet(x.SheetIndex))
                            }}>
                                {selectedSheet === x.SheetIndex && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                                <span className="mt-auto mb-auto">{x.SheetName}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>

            {
                spreadSheetMetaData && spreadSheetMetaData.SheetsData && spreadSheetMetaData.SheetsData.map(x => <SheetsBox key={x.SheetIndex} index={x.SheetIndex} onClick={() => {
                    if (globals.spreadsheet && globals.spreadsheet.Sheets && globals.spreadsheet.Sheets[x.SheetIndex] && globals.spreadsheet.Sheets[x.SheetIndex].State) {
                        console.log(selectedSheet)
                        console.log(x.SheetIndex)
                        console.log(globals.spreadsheet)
                        for (let j = 0; j < columns; j++) {
                            for (let i = 0; i < rows; i++) {
                                const key = String.fromCharCode(65 + j) + (i + 1).toString();
                                let elem = document.getElementById(key) as HTMLDivElement
                                // First save old state
                                globals.spreadsheet.Sheets[selectedSheet].State[key] = {
                                    BackGroundColor: elem.style.backgroundColor,
                                    FontColor: elem.style.color,
                                    FontFamily: elem.style.fontFamily,
                                    FontStyle: elem.style.fontStyle,
                                    FontWeight: elem.style.fontWeight,
                                    TextContent: elem.innerText,
                                    TextDecoration: elem.style.textDecoration,
                                }
                                if (!globals.spreadsheet.Sheets[x.SheetIndex].State[key]) {
                                    globals.spreadsheet.Sheets[x.SheetIndex].State[key] = {
                                        BackGroundColor: "#FFFFFF",
                                        FontColor: "Black",
                                        FontFamily: "Roboto",
                                        FontStyle: "underline",
                                        FontWeight: "bold",
                                        TextContent: "",
                                        TextDecoration: "underline",
                                    }
                                }
                                if (key === "A1") {
                                    console.log(globals.spreadsheet.Sheets[x.SheetIndex].State)
                                    console.log(globals.spreadsheet.Sheets[selectedSheet].State)
                                }
                                elem.innerText = globals.spreadsheet.Sheets[x.SheetIndex].State[key].TextContent
                            }
                        }
                    }
                    dispatch(setSelectedSheet(x.SheetIndex))
                }
                } />)
            }
        </div>
    );
}
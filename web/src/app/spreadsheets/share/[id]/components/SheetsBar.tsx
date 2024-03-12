import globals from '@/app/lib/globals/globals';
import { RootState } from '@/app/lib/redux/store';
import SheetsBox from '@/app/spreadsheets/[id]/components/SheetBox';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuPlus, LuMenu } from 'react-icons/lu'
import { MdCheck } from 'react-icons/md';
import { useSelector } from 'react-redux';

export default function SheetsBar() {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;
    const [selectedSheet, setSelectedSheet] = useState<number>(0);
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
        <div className="bg-[#F9FBFD] h-[37px] flex align-middle pl-[46px]">
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
                                        TextAlign: "left"
                                    }
                                }
                                elem.value = globals.spreadsheet.Versions[0].Sheets[x.SheetIndex].State[key].TextContent
                            }
                        }
                    }
                    globals.selectedSheet = x.SheetIndex
                    setSelectedSheet(x.SheetIndex)
                }
                } />)
            }
        </div>
    );
}
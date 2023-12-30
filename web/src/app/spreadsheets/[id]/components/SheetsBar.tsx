import { LuPlus, LuMenu } from 'react-icons/lu'
import { useCallback, useEffect, useRef, useState } from 'react';
import SheetsBox from './SheetBox';
import { MdCheck } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/redux/store';
import { setValue as setSpreadSheet } from '../../../lib/redux/spreadsheetSlice'
import { setValue as setSelectedSheet } from '../../../lib/redux/selectedSheetSlice'
import { State } from '@/app/types/SpreadSheet';

export default function SheetsBar() {
    const selectedSheet = useSelector((state: RootState) => state.selectedSheet).value;
    const spreadsheet = useSelector((state: RootState) => state.spreadsheet).value;
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
                dispatch(setSpreadSheet({
                    ...spreadsheet,
                    Sheets: [...spreadsheet.Sheets, {
                        SheetIndex: spreadsheet.Sheets.length ? spreadsheet.Sheets[spreadsheet.Sheets.length - 1].SheetIndex + 1 : 1,
                        SheetName: "Sheet " + (spreadsheet.Sheets.length ? spreadsheet.Sheets[spreadsheet.Sheets.length - 1].SheetIndex + 1 : 1).toString(),
                        State: {},
                    }]
                }))
            }}>
                <LuPlus className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            <div ref={ref1} className="hover:cursor-pointer relative ml-[8px] mr-[8px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center" onClick={() => setSheetsDropDown(!sheetsDropDown)}>
                <LuMenu className="mt-auto mb-auto w-[20px] h-[20px]" />
                {
                    sheetsDropDown && spreadsheet && spreadsheet.Sheets && <div className={`absolute left-0`} style={{ top: -1 * spreadsheet.Sheets.length * 40 + 'px' }}>
                        {spreadsheet && spreadsheet.Sheets && spreadsheet.Sheets.map(x => (
                            <div key={x.SheetIndex} className="flex gap-2 justify-center w-[90px] h-[40px] bg-white hover:bg-slate-300" onClick={() => dispatch(setSelectedSheet(x.SheetIndex))}>
                                {selectedSheet === x.SheetIndex && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                                <span className="mt-auto mb-auto">{x.SheetName}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>

            {
                spreadsheet && spreadsheet.Sheets && spreadsheet.Sheets.map(x => <SheetsBox key={x.SheetIndex} index={x.SheetIndex} onClick={() => dispatch(setSelectedSheet(x.SheetIndex))} />)
            }
        </div>
    );
}
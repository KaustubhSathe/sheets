import { SpreadSheet, State } from '@/app/types/SpreadSheet';
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { setValue as setSelectedCell } from '../../../lib/redux/selectedCellSlice';
import { useDispatch } from "react-redux";
import { Dispatch, SetStateAction } from 'react';


export default function Cell({ i, j, spreadsheet, setSpreadSheet }: { i: number, j: number, spreadsheet: SpreadSheet, setSpreadSheet: Dispatch<SetStateAction<SpreadSheet>> }) {
    const dispatch = useDispatch()

    return (
        <div className={`relative m-0 p-0 w-full rowbar-${(i + 1).toString()} h-[30px]`}>
            <div className="peer overflow-x-clip overflow-y-clip pl-[4px] break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] outline-none m-0 resize-none"
                contentEditable
                spellCheck={false}
                id={String.fromCharCode(65 + j) + (i + 1).toString()}
                onFocus={(e) => {
                    dispatch(setSelectedCell(e.currentTarget.id))
                }}
                onInput={(e) => {
                    dispatch(setValueFormulaBar(e.currentTarget.innerText))
                    const id = String.fromCharCode(65 + j) + (i + 1).toString()
                    console.log(spreadsheet)
                    const newss: SpreadSheet = {
                        CreatedAt: spreadsheet.CreatedAt,
                        DeletedAt: spreadsheet.DeletedAt,
                        Favorited: spreadsheet.Favorited,
                        LastOpened: spreadsheet.LastOpened,
                        PK: spreadsheet.PK,
                        Sheets: [{
                            SheetName: spreadsheet.Sheets[0].SheetName,
                            State: new Map<string, State>(spreadsheet.Sheets[0].State)
                        }],
                        SK: spreadsheet.SK,
                        SpreadSheetTitle: spreadsheet.SpreadSheetTitle,
                        UpdatedAt: spreadsheet.UpdatedAt,
                        UserID: spreadsheet.UserID,
                        UserName: spreadsheet.UserName,
                    }
                    newss?.Sheets[0].State.set(id, {
                        BackGroundColor: "blue",
                        Bold: false,
                        FontColor: "blue",
                        FontType: "helvetica",
                        Italic: false,
                        StrikeThrough: false,
                        TextContent: e.currentTarget.innerText,
                        Underline: false
                    })
                    setSpreadSheet(newss)
                }}
                key={String.fromCharCode(65 + j) + (i + 1).toString()}
            ></div>
            <div className="absolute bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full peer-focus:bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
            </div>
        </div>
    );
}
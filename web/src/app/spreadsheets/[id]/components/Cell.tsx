import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { setValue as setSelectedCell } from '../../../lib/redux/selectedCellSlice';
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { useDispatch } from "react-redux";
import globals from '@/app/lib/globals/globals';
import { useRef, useState } from 'react';


export default function Cell({ i, j }: { i: number, j: number }) {
    const dispatch = useDispatch()
    const id = String.fromCharCode(65 + j) + (i + 1).toString();
    const oldText = useRef<string>("");

    return (
        <div className={`relative m-0 p-0 w-full rowbar-${(i + 1).toString()} h-[30px] hover:cursor-cell focus:cursor-text`}>
            <textarea className="overflow-hidden text-sm peer hover:cursor-cell focus:cursor-text overflow-x-clip overflow-y-clip p-[4px] break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] outline-none m-0 resize-none"
                spellCheck={false}
                id={id}
                onFocus={(e) => {
                    oldText.current = e.currentTarget.value
                    dispatch(setSelectedCell(e.currentTarget.id))
                    const fontSelector = document.getElementById("fontSelector") as HTMLSelectElement
                    const fontSizeSelector = document.getElementById("fontSizeSelector") as HTMLInputElement
                    const boldSelector = document.getElementById("boldSelector") as HTMLButtonElement
                    const itaclicSelector = document.getElementById("italicSelector") as HTMLButtonElement
                    const strikethroughSelector = document.getElementById("strikethroughSelector") as HTMLButtonElement
                    if (globals.spreadsheet.Sheets[globals.selectedSheet].State[id]) {
                        fontSelector.value = globals.spreadsheet.Sheets[globals.selectedSheet].State[id].FontFamily
                        boldSelector.style.backgroundColor = globals.spreadsheet.Sheets[globals.selectedSheet].State[id].FontWeight === "bold" ? "#d3e3fd" : "inherit"
                        fontSizeSelector.value = globals.spreadsheet.Sheets[globals.selectedSheet].State[id].FontSize ? globals.spreadsheet.Sheets[globals.selectedSheet].State[id].FontSize.toString() : "16"
                        itaclicSelector.style.backgroundColor = globals.spreadsheet.Sheets[globals.selectedSheet].State[id].FontStyle === "italic" ? "#d3e3fd" : "inherit"
                        strikethroughSelector.style.backgroundColor = globals.spreadsheet.Sheets[globals.selectedSheet].State[id].TextDecoration === "line-through" ? "#d3e3fd" : "inherit"
                    }
                }}
                onInput={(e) => {
                    if (globals.saved) {
                        globals.saved = false
                        dispatch(setSaved(STATUS.UNSAVED))
                    }
                    const currentText = e.currentTarget.value
                    const oldTextVal = oldText.current
                    const currentTarget = e.currentTarget
                    globals.undoStack.push({
                        Action: () => {
                            currentTarget.value = currentText
                        },
                        Inverse: () => {
                            currentTarget.value = oldTextVal
                        }
                    })
                    currentTarget.value = currentText
                    oldText.current = currentText
                    dispatch(setValueFormulaBar(currentText))
                }}
                key={String.fromCharCode(65 + j) + (i + 1).toString()}
            />
            <div className="absolute bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full peer-focus:bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
            </div>
        </div>
    );
}
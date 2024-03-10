import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { useDispatch } from "react-redux";
import globals from '@/app/lib/globals/globals';
import { useRef } from 'react';
import { DetailedCellError, ExportedCellChange, ExportedChange, FunctionPluginDefinition, SimpleCellAddress } from 'hyperformula';
import { setValue as setTextFormat } from '../../../lib/redux/textFormatSlice'

export default function Cell({ i, j }: { i: number, j: number }) {
    const dispatch = useDispatch()
    const id = String.fromCharCode(65 + j) + (i + 1).toString();
    const oldText = useRef<string>("");

    return (
        <div data-testid="cell-wrapper" className={`relative m-0 p-0 w-full rowbar-${(i + 1).toString()} h-[30px] hover:cursor-cell focus:cursor-text`}>
            <textarea data-testid="cell-textbox" className="overflow-hidden text-sm peer hover:cursor-cell focus:cursor-text overflow-x-clip overflow-y-clip p-[4px] break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] outline-none m-0 resize-none"
                spellCheck={false}
                id={id}
                onFocus={(e) => {
                    oldText.current = e.currentTarget.value
                    globals.selectStart = e.currentTarget.id
                    const formulaBox = document.getElementById("formulaBox") as HTMLInputElement
                    if (formulaBox) {
                        formulaBox.value = e.target.value
                    }
                    if (globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id]) {
                        dispatch(setTextFormat(
                            {
                                FontFamily: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontFamily,
                                BackGroundColor: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].BackGroundColor,
                                BackGroundImage: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].BackGroundImage,
                                FontColor: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontColor,
                                FontSize: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontSize,
                                FontStyle: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontStyle,
                                FontWeight: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontWeight,
                                TextContent: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextContent,
                                TextDecoration: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextDecoration,
                                TextAlign: globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextAlign
                            }
                        ))
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
                    const address = globals.hfInstance.simpleCellAddressFromString(id, globals.selectedSheet)
                    const changes: ExportedChange[] = globals.hfInstance.setCellContents(address as SimpleCellAddress, currentText)
                    for (let i = 1; i < changes.length; i++) {
                        const key = String.fromCharCode(65 + (changes[i] as ExportedCellChange).col) + ((changes[i] as ExportedCellChange).row + 1).toString()
                        const elem = document.getElementById(key) as HTMLTextAreaElement
                        if (elem) {
                            elem.value = changes[i].newValue?.toString() as string
                        }
                    }
                    const calculated = globals.hfInstance.getCellValue(address as SimpleCellAddress)
                    currentTarget.value = calculated instanceof DetailedCellError ? currentText : calculated?.toString() as string
                    oldText.current = calculated instanceof DetailedCellError ? currentText : calculated?.toString() as string
                    const formulaBox = document.getElementById("formulaBox") as HTMLInputElement
                    if (formulaBox) {
                        formulaBox.value = currentTarget.value
                    }
                }}
                key={String.fromCharCode(65 + j) + (i + 1).toString()}
            />
            <div id={id + "comment"}
                data-testid={id + "comment"}
                className="w-0 h-0 border-r-[10px] border-solid border-b-[10px] border-b-transparent border-r-transparent absolute top-0 right-0 z-50"></div>
            <div
                data-testid="drag-marker"
                className="absolute bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full peer-focus:bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
            </div>
        </div>
    );
}
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { useDispatch } from "react-redux";
import globals from '@/app/lib/globals/globals';
import { useRef, useState } from 'react';
import { DetailedCellError, ExportedCellChange, ExportedChange, FunctionPluginDefinition, SimpleCellAddress } from 'hyperformula';
import { setValue as setTextFormat } from '../../../lib/redux/textFormatSlice'
import { FormulaList } from "./FormulaList";
import { setValue as setSelectStart } from '../../../lib/redux/selectStartSlice';

export default function Cell({ i, j }: { i: number, j: number }) {
    const dispatch = useDispatch()
    const id = String.fromCharCode(65 + j) + (i + 1).toString();
    const oldText = useRef<string>("");
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div ref={ref} data-testid="cell-wrapper" className={`relative m-0 p-0 w-full rowbar-${(i + 1).toString()} h-[30px] hover:cursor-cell focus:cursor-text`}>
            <textarea data-testid="cell-textbox" className="overflow-hidden text-sm peer hover:cursor-cell focus:cursor-text overflow-x-clip overflow-y-clip p-[4px] break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] outline-none m-0 resize-none"
                spellCheck={false}
                id={id}
                onBlur={() => {
                    dispatch(setSelectStart({
                        bottom: ref.current?.getBoundingClientRect().bottom as number,
                        id: id,
                        top: ref.current?.getBoundingClientRect().top as number,
                        left: ref.current?.getBoundingClientRect().left as number,
                        right: ref.current?.getBoundingClientRect().right as number,
                        text: "",
                        display: "none"
                    }))
                }}
                onFocus={(e) => {
                    oldText.current = e.currentTarget.value
                    globals.selectStart = e.currentTarget.id
                    const currentText = e.currentTarget.value
                    if (currentText.charAt(0) === "=") {
                        dispatch(setSelectStart({
                            bottom: ref.current?.getBoundingClientRect().bottom as number,
                            id: id,
                            top: ref.current?.getBoundingClientRect().top as number,
                            left: ref.current?.getBoundingClientRect().left as number,
                            right: ref.current?.getBoundingClientRect().right as number,
                            text: currentText,
                            display: "block"
                        }))
                    }
                    const formulaBox = document.getElementById("formulaBox") as HTMLInputElement
                    if (formulaBox) {
                        const address = globals.hfInstance.simpleCellAddressFromString(id, globals.selectedSheet) as SimpleCellAddress
                        formulaBox.value = globals.hfInstance.doesCellHaveFormula(address) ? globals.hfInstance.getCellFormula(address) + "" : currentText
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
                    const formulaBox = document.getElementById("formulaBox") as HTMLInputElement
                    if (formulaBox) {
                        const address = globals.hfInstance.simpleCellAddressFromString(id, globals.selectedSheet) as SimpleCellAddress
                        formulaBox.value = globals.hfInstance.doesCellHaveFormula(address) ? globals.hfInstance.getCellFormula(address) + "" : currentText
                    }
                    if (currentText.charAt(0) === "=") {
                        dispatch(setSelectStart({
                            bottom: ref.current?.getBoundingClientRect().bottom as number,
                            id: id,
                            top: ref.current?.getBoundingClientRect().top as number,
                            left: ref.current?.getBoundingClientRect().left as number,
                            right: ref.current?.getBoundingClientRect().right as number,
                            text: currentText,
                            display: "block"
                        }))
                    }
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
                    globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextContent = currentText
                    const calculated = globals.hfInstance.getCellValue(address as SimpleCellAddress)
                    currentTarget.value = calculated instanceof DetailedCellError ? currentText : calculated?.toString() as string
                    oldText.current = calculated instanceof DetailedCellError ? currentText : calculated?.toString() as string
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
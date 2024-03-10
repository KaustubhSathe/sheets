import { AiOutlineSearch } from 'react-icons/ai'
import { LuUndo2, LuRedo2, LuPrinter, LuMinus, LuPlus } from 'react-icons/lu'
import { BiBold, BiItalic, BiStrikethrough, BiFontColor, BiColorFill } from 'react-icons/bi'
import globals from '@/app/lib/globals/globals';
import { Command } from '@/app/types/Command';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/lib/redux/store';
import { setValue as setTextFormat } from '../../../lib/redux/textFormatSlice'
import { useEffect, useRef } from 'react';
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { FaAlignLeft, FaAlignRight, FaAlignCenter } from "react-icons/fa";


export default function ToolsBar() {
    return (
        <div className="bg-[#EDF2FA] h-[40px] flex overflow-x-scroll overflow-y-hidden" id='toolsbar'>
            <Search />

            <UndoRedo />

            <Printer />

            <Zoom />

            <Divider />

            <FontSelector />

            <Divider />

            <FontResizer />

            <Divider />

            <BoldButton />

            <ItalicButton />

            <StrikeThroughButton />

            <Divider />

            <LeftAlign />

            <CenterAlign />

            <RightAlign />

            <Divider />

            <FontColorButton />

            <BackGroundColorPickerButton />
        </div>
    );
}

export function Search() {
    return (
        <div className="relative h-[100%]">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <AiOutlineSearch className="mt-auto mb-auto mr-[8px] w-[20px] h-[20px]" />
            </div>
            <input type="text" className="pt-[4px] pb-[4px] pl-[28px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[200px] outline-none" placeholder="Search Commands" />
        </div>
    )
}

export function UndoRedo() {
    const dispatch = useDispatch()

    return (
        <>
            <button onClick={() => {
                if (globals.undoStack.length) {
                    globals.undoStack[globals.undoStack.length - 1].Inverse()
                    globals.redoStack.push(globals.undoStack.pop() as Command);
                }
                if (globals.saved) {
                    globals.saved = false
                    dispatch(setSaved(STATUS.UNSAVED))
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuUndo2 />
            </button>
            <button onClick={() => {
                if (globals.redoStack.length) {
                    globals.redoStack[globals.redoStack.length - 1].Action()
                    globals.undoStack.push(globals.redoStack.pop() as Command);
                }
                if (globals.saved) {
                    globals.saved = false
                    dispatch(setSaved(STATUS.UNSAVED))
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuRedo2 />
            </button>
        </>
    )
}

export function Printer() {
    return (
        <button onClick={() => {
            window.print()
        }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
            <LuPrinter />
        </button>
    )
}

export function Zoom() {
    return (
        <select onClick={(e) => {
            // @ts-ignore
            document.body.style.zoom = (e.target as HTMLSelectElement).value
        }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit">
            <option value={1}>100%</option>
            <option value={0.9}>90%</option>
            <option value={0.8}>80%</option>
            <option value={0.7}>70%</option>
            <option value={0.6}>60%</option>
            <option value={0.5}>50%</option>
            <option value={0.4}>40%</option>
            <option value={0.3}>30%</option>
            <option value={0.2}>20%</option>
            <option value={0.1}>10%</option>
        </select>
    )
}

export function LeftAlign() {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    return (
        <button onClick={(e) => {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let cell = document.getElementById(id) as HTMLTextAreaElement;
                    if (cell) {
                        cell.style.textAlign = "left"
                        globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextAlign = "left"
                    }
                }
            }
            dispatch(setTextFormat({
                ...textFormat,
                TextAlign: "left",
            }))
            if (globals.saved) {
                globals.saved = false
                dispatch(setSaved(STATUS.UNSAVED))
            }
        }}
            id="leftAlign"
            data-testid="leftAlign"
            className="ml-[8px] hover:bg-slate-200 rounded-lg hover:rounded-md mt-[4px] mb-[4px] p-[6px]"
            style={{
                backgroundColor: textFormat.TextAlign === "left" ? "#d3e3fd" : "inherit"
            }}
        >
            <FaAlignLeft />
        </button>
    )
}

export function CenterAlign() {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    return (
        <button onClick={(e) => {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let cell = document.getElementById(id) as HTMLTextAreaElement;
                    if (cell) {
                        cell.style.textAlign = "center"
                        globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextAlign = "center"
                    }
                }
            }
            dispatch(setTextFormat({
                ...textFormat,
                TextAlign: "center",
            }))
            if (globals.saved) {
                globals.saved = false
                dispatch(setSaved(STATUS.UNSAVED))
            }
        }}
            id="centerAlign"
            data-testid="centerAlign"
            className="ml-[8px] hover:bg-slate-200 rounded-lg hover:rounded-md mt-[4px] mb-[4px] p-[6px]"
            style={{
                backgroundColor: textFormat.TextAlign === "center" ? "#d3e3fd" : "inherit"
            }}
        >
            <FaAlignCenter />
        </button>
    )
}

export function RightAlign() {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    return (
        <button onClick={(e) => {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let cell = document.getElementById(id) as HTMLTextAreaElement;
                    if (cell) {
                        cell.style.textAlign = "right"
                        globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextAlign = "right"
                    }
                }
            }
            dispatch(setTextFormat({
                ...textFormat,
                TextAlign: "right",
            }))
            if (globals.saved) {
                globals.saved = false
                dispatch(setSaved(STATUS.UNSAVED))
            }
        }}
            id="rightAlign"
            data-testid="rightAlign"
            className="ml-[8px] hover:bg-slate-200 rounded-lg hover:rounded-md mt-[4px] mb-[4px] p-[6px]"
            style={{
                backgroundColor: textFormat.TextAlign === "right" ? "#d3e3fd" : "inherit"
            }}
        >
            <FaAlignRight />
        </button>
    )
}

export function BoldButton() {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    return (
        <button onClick={(e) => {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let cell = document.getElementById(id) as HTMLTextAreaElement;
                    if (cell) {
                        cell.style.fontWeight = textFormat.FontWeight === "normal" ? "bold" : "normal"
                        globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontWeight = textFormat.FontWeight === "normal" ? "bold" : "normal"
                    }
                }
            }
            dispatch(setTextFormat(textFormat.FontWeight === "normal" ? {
                ...textFormat,
                FontWeight: "bold",
            } : {
                ...textFormat,
                FontWeight: "normal"
            }))
            if (globals.saved) {
                globals.saved = false
                dispatch(setSaved(STATUS.UNSAVED))
            }
        }}
            id="boldSelector"
            data-testid="boldSelector"
            className="ml-[8px] hover:bg-slate-200 rounded-lg hover:rounded-md mt-[4px] mb-[4px] p-[6px]"
            style={{
                backgroundColor: textFormat.FontWeight === "normal" ? "inherit" : "#d3e3fd"
            }}
        >
            <BiBold />
        </button>
    )
}

export function ItalicButton() {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    return (
        <button onClick={() => {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let cell = document.getElementById(id) as HTMLTextAreaElement;
                    if (cell) {
                        cell.style.fontStyle = textFormat.FontStyle === "normal" ? "italic" : "normal"
                        globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontStyle = textFormat.FontStyle === "normal" ? "italic" : "normal"
                    }
                }
            }
            dispatch(setTextFormat(textFormat.FontStyle === "normal" ? {
                ...textFormat,
                FontStyle: "italic",
            } : {
                ...textFormat,
                FontStyle: "normal"
            }))
            if (globals.saved) {
                globals.saved = false
                dispatch(setSaved(STATUS.UNSAVED))
            }
        }}
            id="italicSelector"
            data-testid="italicSelector"
            className="ml-[8px] rounded-lg hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]"
            style={{
                backgroundColor: textFormat.FontStyle === "normal" ? "inherit" : "#d3e3fd"
            }}
        >
            <BiItalic />
        </button>
    );
}

export function StrikeThroughButton() {
    const dispatch = useDispatch()
    const textFormat = useSelector((state: RootState) => state.textFormat.value)

    return (
        <button onClick={() => {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let cell = document.getElementById(id) as HTMLTextAreaElement;
                    if (cell) {
                        cell.style.textDecoration = textFormat.TextDecoration === "none" ? "line-through" : "none"
                        globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextDecoration = textFormat.TextDecoration === "none" ? "line-through" : "none"
                    }
                }
            }
            dispatch(setTextFormat(textFormat.TextDecoration === "none" ? {
                ...textFormat,
                TextDecoration: "line-through",
            } : {
                ...textFormat,
                TextDecoration: "none"
            }))
            if (globals.saved) {
                globals.saved = false
                dispatch(setSaved(STATUS.UNSAVED))
            }
        }}
            id="strikethroughSelector"
            data-testid="strikethroughSelector"
            className="ml-[8px] rounded-lg hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]"
            style={{
                backgroundColor: textFormat.TextDecoration === "none" ? "inherit" : "#d3e3fd"
            }}
        >
            <BiStrikethrough />
        </button>
    )
}

export function FontColorButton() {
    const ref = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    return (
        <button onClick={() => {
            ref.current?.click()
        }} className="ml-[8px] hover:bg-slate-200 relative hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
            <BiFontColor />
            <input ref={ref}
                onChange={(e) => {
                    const color = e.currentTarget.value
                    for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                        for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                            const id = String.fromCharCode(j) + i.toString();
                            let cell = document.getElementById(id) as HTMLTextAreaElement;
                            if (cell) {
                                cell.style.color = color
                                globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontColor = color
                            }
                        }
                    }
                    if (globals.saved) {
                        globals.saved = false
                        dispatch(setSaved(STATUS.UNSAVED))
                    }
                }} id='fontColorPicker' className='inline-block float-right w-0 h-0' type='color' />
        </button>
    );
}

export function BackGroundColorPickerButton() {
    const ref = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    return (
        <button onClick={() => {
            ref.current?.click()
        }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
            <BiColorFill />
            <input ref={ref} onChange={(e) => {
                const color = e.currentTarget.value
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let cell = document.getElementById(id) as HTMLTextAreaElement;
                        if (cell) {
                            cell.style.backgroundColor = color
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].BackGroundColor = color
                        }
                    }
                }
                if (globals.saved) {
                    globals.saved = false
                    dispatch(setSaved(STATUS.UNSAVED))
                }
            }} id='backgroundColorPicker' className='inline-block float-right w-0 h-0' type='color' />
        </button>
    )
}

export function FontResizer() {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    useEffect(() => {
        if (globals.spreadsheet && globals.spreadsheet.Versions) {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let cell = document.getElementById(id) as HTMLTextAreaElement;
                    if (cell) {
                        cell.style.fontSize = textFormat.FontSize + "px"
                        globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontSize = textFormat.FontSize
                    }
                }
            }
        }
        if (globals.saved) {
            globals.saved = false
            dispatch(setSaved(STATUS.UNSAVED))
        }
    }, [textFormat, dispatch])

    return (
        <>
            <button onClick={() => dispatch(setTextFormat({
                ...textFormat,
                FontSize: textFormat.FontSize - 1
            }))} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuMinus />
            </button>
            <input
                id="fontSizeSelector"
                type="number"
                className="pt-[4px] pb-[4px] pl-[4px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[60px] outline-none"
                value={textFormat.FontSize}
                onChange={(e) => dispatch(setTextFormat({
                    ...textFormat,
                    FontSize: parseInt(e.target.value)
                }))}
            />
            <button onClick={() => dispatch(setTextFormat({
                ...textFormat,
                FontSize: textFormat.FontSize + 1
            }))} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuPlus />
            </button>
        </>
    )
}

export function Divider() {
    return (
        <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>
    )
}

export function FontSelector() {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    return (
        <select
            onChange={(e) => {
                const fontFamily = (e.target as HTMLSelectElement).value
                if (globals.saved) {
                    globals.saved = false
                    dispatch(setSaved(STATUS.UNSAVED))
                }
                dispatch(setTextFormat({
                    ...textFormat,
                    FontFamily: fontFamily
                }))
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let elem = document.getElementById(id) as HTMLTextAreaElement;
                        if (elem) {
                            elem.style.fontFamily = fontFamily
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontFamily = fontFamily
                        }
                    }
                }
            }}
            data-testid="fontSelector"
            className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit"
            id="fontSelector"
            value={textFormat.FontFamily}
        >
            <option value={"Arial"}>Arial</option>
            <option value={"Verdana"}>Verdana</option>
            <option value={"Times New Roman"}>Times New Roman</option>
            <option value={"Garamond"}>Garamond</option>
            <option value={"Roboto"}>Roboto</option>
        </select>
    )
}
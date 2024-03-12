import { Dispatch, MouseEventHandler, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { PiTextBBold } from "react-icons/pi";
import { MdOutlineFormatAlignLeft, MdOutlineFormatSize, MdOutlineFormatClear, MdArrowRight, MdCheck } from "react-icons/md";
import { BiBold, BiItalic, BiUnderline, BiStrikethrough } from "react-icons/bi";
import { FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa";
import { MdOutlineVerticalAlignTop, MdOutlineVerticalAlignCenter, MdVerticalAlignBottom } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/lib/redux/store";
import globals from "@/app/lib/globals/globals";
import { setValue as setTextFormat } from '../../../lib/redux/textFormatSlice'
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import React from "react";

export default function FormatButton({ text }: { text: string }) {
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const [textDropDown, setTextDropDown] = useState<boolean>(false);
    const [alignmentDropDown, setAlignmentDropDown] = useState<boolean>(false);
    const [fontDropDown, setFontDropDown] = useState<boolean>(false);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setDropDownVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <div className="inline-block relative">
            <span ref={ref1} onClick={() => setDropDownVisible(!dropDownVisible)} className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
            {dropDownVisible && <div className="absolute top-[1.7rem] z-50 left-0 w-[320px] bg-white rounded-md shadow-md shadow-slate-600">
                <TextOption dropDownVisible={dropDownVisible} textDropDown={textDropDown} setAlignmentDropDown={setAlignmentDropDown} setFontDropDown={setFontDropDown} setTextDropDown={setTextDropDown} />
                <AlignmentOption dropDownVisible={dropDownVisible} alignmentDropDown={alignmentDropDown} setAlignmentDropDown={setAlignmentDropDown} setFontDropDown={setFontDropDown} setTextDropDown={setTextDropDown} />
                <FontSizeOption dropDownVisible={dropDownVisible} fontDropDown={fontDropDown} setAlignmentDropDown={setAlignmentDropDown} setFontDropDown={setFontDropDown} setTextDropDown={setTextDropDown} />
                <ClearFormattingOption setAlignmentDropDown={setAlignmentDropDown} setFontDropDown={setFontDropDown} setTextDropDown={setTextDropDown} />
            </div>
            }
        </div>
    );
}

export function TextOption({
    dropDownVisible,
    textDropDown,
    setTextDropDown,
    setAlignmentDropDown,
    setFontDropDown
}: {
    dropDownVisible: boolean,
    textDropDown: boolean,
    setTextDropDown: Dispatch<SetStateAction<boolean>>,
    setAlignmentDropDown: Dispatch<SetStateAction<boolean>>,
    setFontDropDown: Dispatch<SetStateAction<boolean>>
}) {
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    const dispatch = useDispatch()

    return (
        <div className="relative">
            <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onMouseOver={() => {
                setTextDropDown(true)
                setAlignmentDropDown(false)
                setFontDropDown(false)
            }}>
                <PiTextBBold className="w-6 h-6 ml-2 mt-auto mb-auto" />
                <span className="inline-block mt-auto mb-auto">Text</span>
                <MdArrowRight className="block mt-auto mb-auto ml-auto mr-1 h-8 w-8 text-gray-500" />
            </div>
            {dropDownVisible && textDropDown && <div className="absolute right-[-200px] top-0 w-[200px] bg-white shadow-md shadow-slate-600">
                <div onClick={() => {
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
                }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <BiBold className="w-6 h-6 ml-1 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto font-normal">Bold</span>
                    {textFormat.FontWeight === "bold" && <MdCheck className="inline-block ml-auto mr-4 mt-auto mb-auto font-semibold" />}
                </div>
                <div onClick={() => {
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
                }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <BiItalic className="w-6 h-6 ml-1 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto font-normal">Italic</span>
                    {textFormat.FontStyle === "italic" && <MdCheck className="inline-block ml-auto mr-4 mt-auto mb-auto font-semibold" />}
                </div>
                {/* <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <BiUnderline className="w-6 h-6 ml-1 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto font-normal">Underline</span>
                </div> */}
                <div onClick={() => {
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
                }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <BiStrikethrough className="w-6 h-6 ml-1 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto font-normal">Strike-through</span>
                    {textFormat.TextDecoration === "line-through" && <MdCheck className="inline-block ml-auto mr-4 mt-auto mb-auto font-semibold" />}
                </div>
            </div>}
        </div>
    )
}

export function AlignmentOption({
    dropDownVisible,
    alignmentDropDown,
    setTextDropDown,
    setAlignmentDropDown,
    setFontDropDown
}: {
    dropDownVisible: boolean,
    alignmentDropDown: boolean,
    setTextDropDown: Dispatch<SetStateAction<boolean>>,
    setAlignmentDropDown: Dispatch<SetStateAction<boolean>>,
    setFontDropDown: Dispatch<SetStateAction<boolean>>
}) {
    const dispatch = useDispatch()
    const textFormat = useSelector((state: RootState) => state.textFormat.value)
    
    return (
        <div className="relative">
            <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onMouseOver={() => {
                setTextDropDown(false)
                setAlignmentDropDown(true)
                setFontDropDown(false)
            }}>
                <MdOutlineFormatAlignLeft className="w-6 h-6 ml-2 mt-auto mb-auto" />
                <span className="inline-block mt-auto mb-auto">Alignment</span>
                <MdArrowRight className="block mt-auto mb-auto ml-auto mr-1 h-8 w-8 text-gray-500" />
            </div>
            {dropDownVisible && alignmentDropDown && <div className="shadow-md shadow-slate-600 absolute right-[-200px] top-0 w-[200px] bg-white">
                <div onClick={() => {
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
                        TextAlign: "left"
                    }))

                    if (globals.saved) {
                        globals.saved = false
                        dispatch(setSaved(STATUS.UNSAVED))
                    }
                }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <FaAlignLeft className="w-4 h-4 ml-1 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto font-normal">Left</span>
                    {textFormat.TextAlign === "left" && <MdCheck className="inline-block ml-auto mr-4 mt-auto mb-auto font-semibold" />}
                </div>
                <div onClick={() => {
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
                        TextAlign: "center"
                    }))

                    if (globals.saved) {
                        globals.saved = false
                        dispatch(setSaved(STATUS.UNSAVED))
                    }
                }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <FaAlignCenter className="w-4 h-4 ml-1 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto font-normal">Center</span>
                    {textFormat.TextAlign === "center" && <MdCheck className="inline-block ml-auto mr-4 mt-auto mb-auto font-semibold" />}
                </div>
                <div onClick={() => {
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
                        TextAlign: "right"
                    }))

                    if (globals.saved) {
                        globals.saved = false
                        dispatch(setSaved(STATUS.UNSAVED))
                    }
                }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <FaAlignRight className="w-4 h-4 ml-1 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto font-normal">Right</span>
                    {textFormat.TextAlign === "right" && <MdCheck className="inline-block ml-auto mr-4 mt-auto mb-auto font-semibold" />}
                </div>
            </div>}
        </div>
    )
}

export function FontSizeOption({
    dropDownVisible,
    fontDropDown,
    setTextDropDown,
    setAlignmentDropDown,
    setFontDropDown
}: {
    dropDownVisible: boolean,
    fontDropDown: boolean,
    setTextDropDown: Dispatch<SetStateAction<boolean>>,
    setAlignmentDropDown: Dispatch<SetStateAction<boolean>>,
    setFontDropDown: Dispatch<SetStateAction<boolean>>
}) {
    const dispatch = useDispatch()
    const textFormat = useSelector((state: RootState) => state.textFormat.value)

    const onClick = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
        for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
            for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                const id = String.fromCharCode(j) + i.toString();
                let cell = document.getElementById(id) as HTMLTextAreaElement;
                if (cell) {
                    cell.style.fontSize = (e.target as HTMLDivElement).childNodes[0].textContent + "px"
                    globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontSize = parseInt((e.target as HTMLDivElement).childNodes[0].textContent as string)
                }
            }
        }
        dispatch(setTextFormat({
            ...textFormat,
            FontSize: parseInt((e.target as HTMLDivElement).childNodes[0].textContent as string)
        }))

        if (globals.saved) {
            globals.saved = false
            dispatch(setSaved(STATUS.UNSAVED))
        }
    }, [dispatch, textFormat])

    return (
        <div className="relative">
            <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onMouseOver={() => {
                setTextDropDown(false)
                setAlignmentDropDown(false)
                setFontDropDown(true)
            }}>
                <MdOutlineFormatSize className="w-6 h-6 ml-2 mt-auto mb-auto" />
                <span className="inline-block mt-auto mb-auto">Font Size</span>
                <MdArrowRight className="block mt-auto mb-auto ml-auto mr-1 h-8 w-8 text-gray-500" />
            </div>
            {dropDownVisible && fontDropDown && <div className="shadow-md shadow-slate-600 absolute right-[-60px] top-0 w-[60px] bg-white">
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">6</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">7</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">8</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">9</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">10</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">11</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">12</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">14</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">18</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">24</span>
                </div>
                <div onClick={onClick} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                    <span className="inline-block mt-auto mb-auto font-normal">36</span>
                </div>
            </div>}
        </div>
    )
}

export function ClearFormattingOption({
    setTextDropDown,
    setAlignmentDropDown,
    setFontDropDown
}: {
    setTextDropDown: Dispatch<SetStateAction<boolean>>,
    setAlignmentDropDown: Dispatch<SetStateAction<boolean>>,
    setFontDropDown: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer rounded-md h-[40px]" onMouseOver={() => {
            setTextDropDown(false)
            setAlignmentDropDown(false)
            setFontDropDown(false)
        }}>
            <MdOutlineFormatClear className="w-6 h-6 ml-2 mt-auto mb-auto" />
            <span className="inline-block mt-auto mb-auto">Clear Formatting</span>
        </div>
    )
}
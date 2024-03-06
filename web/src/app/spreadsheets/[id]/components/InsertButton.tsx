import globals from "@/app/lib/globals/globals";
import { RootState } from "@/app/lib/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { MdOutlineImage } from "react-icons/md";
import { MdOutlineEmojiEmotions, MdOutlineInsertComment, MdOutlineStickyNote2 } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setValue as setSpreadSheetMetaData } from '../../../lib/redux/spreadSheetMetaDataSlice'
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { ImageOpenDialog } from "./ImageOpenDialog";

export default function InsertButton({ text }: { text: string }) {
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;
    const [imageOpenDialog, setImageOpenDialog] = useState<boolean>(false);
    const dispatch = useDispatch();
    const ref1 = useRef<HTMLDivElement>(null);

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
        <>
            {imageOpenDialog && <ImageOpenDialog setImageOpenDialog={setImageOpenDialog} />}
            <div className="inline-block relative">
                <span ref={ref1} onClick={() => setDropDownVisible(!dropDownVisible)} className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
                {dropDownVisible && <div className="absolute top-[1.7rem] z-50 left-0 w-[320px] bg-white rounded-md shadow-md shadow-slate-600">
                    <div onClick={() => {
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
                        globals.saved = false
                        dispatch(setSaved(STATUS.UNSAVED))
                    }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <BsFillFileEarmarkSpreadsheetFill className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Sheet</span>
                    </div>
                    <div onClick={() => setImageOpenDialog(true)} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <MdOutlineImage className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Insert an image in the cell</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <MdOutlineEmojiEmotions className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Emoji</span>
                    </div>
                    <div onClick={(e) => {
                        e.preventDefault();
                        const comment = document.getElementById("comment") as HTMLDivElement;
                        const cell = document.getElementById(globals.selectStart) as HTMLDivElement
                        comment.style.display = "block"
                        comment.style.zIndex = "1000"
                        comment.style.position = "absolute"

                        // bottom case
                        if (Math.abs(e.clientY - window.innerHeight) < comment.offsetHeight) {
                            comment.style.top = cell.getBoundingClientRect().top - comment.offsetHeight + cell.offsetHeight + "px"
                        } else {
                            comment.style.top = cell.getBoundingClientRect().top + "px"
                        }

                        // right case
                        if (Math.abs(e.clientX - window.innerWidth) < comment.offsetWidth) {
                            comment.style.left = cell.getBoundingClientRect().left - comment.offsetWidth + "px"
                        } else {
                            comment.style.left = cell.getBoundingClientRect().right + "px"
                        }
                        const contextmenu = document.getElementById("contextmenu") as HTMLDivElement;
                        contextmenu.style.display = "none";
                    }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <MdOutlineInsertComment className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Comment</span>
                    </div>
                    <div onClick={(e) => {
                        e.preventDefault();
                        const note = document.getElementById("note") as HTMLDivElement;
                        const x = document.getElementById(globals.selectStart) as HTMLDivElement
                        note.style.display = "block"
                        note.style.zIndex = "1000"
                        note.style.position = "absolute"
                        note.style.top = x.getBoundingClientRect().top + "px"
                        note.style.left = x.getBoundingClientRect().right + "px"
                        const contextmenu = document.getElementById("contextmenu") as HTMLDivElement;
                        contextmenu.style.display = "none";
                    }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] rounded-md">
                        <MdOutlineStickyNote2 className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Note</span>
                    </div>
                </div>
                }
            </div>
        </>
    );
}
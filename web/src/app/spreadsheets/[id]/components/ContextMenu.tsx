import { IoMdCopy } from "react-icons/io";
import { MdOutlineContentCut, MdOutlineContentPaste } from "react-icons/md";
import { BiCommentAdd } from "react-icons/bi";
import { MdInsertDriveFile } from "react-icons/md";
import globals from "@/app/lib/globals/globals";
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { useDispatch } from "react-redux";

export default function ContextMenu() {
    const dispatch = useDispatch()

    return (
        <div id="contextmenu" className="hidden w-[250px] bg-white shadow-lg shadow-slate-400">
            <div onClick={() => {
                const contextmenu = document.getElementById("contextmenu") as HTMLDivElement;
                contextmenu.style.display = "none";
                globals.cutStart = globals.selectStart;
                globals.cutEnd = globals.selectEnd;
                globals.copyStart = null;
                globals.copyEnd = null;
            }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                <MdOutlineContentCut className="w-5 h-5 ml-2 mt-auto mb-auto" />
                <span className="inline-block mt-auto mb-auto">Cut</span>
            </div>
            <div onClick={() => {
                const contextmenu = document.getElementById("contextmenu") as HTMLDivElement;
                contextmenu.style.display = "none";
                globals.copyStart = globals.selectStart;
                globals.copyEnd = globals.selectEnd;
                globals.cutStart = null;
                globals.cutEnd = null;
            }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                <IoMdCopy className="w-5 h-5 ml-2 mt-auto mb-auto" />
                <span className="inline-block mt-auto mb-auto">Copy</span>
            </div>
            <div onClick={() => {
                const contextmenu = document.getElementById("contextmenu") as HTMLDivElement;
                contextmenu.style.display = "none";
                if (globals.copyStart !== null && globals.copyEnd !== null) {
                    const width = Math.max(globals.copyStart.charCodeAt(0), globals.copyEnd.charCodeAt(0)) - Math.min(globals.copyStart.charCodeAt(0), globals.copyEnd.charCodeAt(0)) + 1;
                    const length = Math.max(parseInt(globals.copyStart.substring(1)), parseInt(globals.copyEnd.substring(1))) - Math.min(parseInt(globals.copyStart.substring(1)), parseInt(globals.copyEnd.substring(1))) + 1;
                    for (let j = 0; j < width; j++) {
                        for (let i = 0; i < length; i++) {
                            const x0 = parseInt(globals.copyStart.substring(1)) + i;
                            const y0 = globals.copyStart.charCodeAt(0) + j;
                            const x1 = parseInt(globals.selectStart.substring(1)) + i;
                            const y1 = globals.selectStart.charCodeAt(0) + j;
                            const id0 = String.fromCharCode(y0) + x0.toString();
                            const id1 = String.fromCharCode(y1) + x1.toString();
                            let elem0 = document.getElementById(id0) as HTMLTextAreaElement;
                            let elem1 = document.getElementById(id1) as HTMLTextAreaElement;
                            if (elem1 && elem0) {
                                elem1.value = elem0.value
                            }
                        }
                    }
                }

                if (globals.cutStart !== null && globals.cutEnd !== null) {
                    const width = Math.max(globals.cutStart.charCodeAt(0), globals.cutEnd.charCodeAt(0)) - Math.min(globals.cutStart.charCodeAt(0), globals.cutEnd.charCodeAt(0)) + 1;
                    const length = Math.max(parseInt(globals.cutStart.substring(1)), parseInt(globals.cutEnd.substring(1))) - Math.min(parseInt(globals.cutStart.substring(1)), parseInt(globals.cutEnd.substring(1))) + 1;
                    for (let j = 0; j < width; j++) {
                        for (let i = 0; i < length; i++) {
                            const x0 = parseInt(globals.cutStart.substring(1)) + i;
                            const y0 = globals.cutStart.charCodeAt(0) + j;
                            const x1 = parseInt(globals.selectStart.substring(1)) + i;
                            const y1 = globals.selectStart.charCodeAt(0) + j;
                            const id0 = String.fromCharCode(y0) + x0.toString();
                            const id1 = String.fromCharCode(y1) + x1.toString();
                            let elem0 = document.getElementById(id0) as HTMLTextAreaElement;
                            let elem1 = document.getElementById(id1) as HTMLTextAreaElement;
                            if (elem1 && elem0) {
                                elem1.value = elem0.value
                                elem0.value = ""
                            }
                        }
                    }

                    globals.cutStart = null;
                    globals.cutEnd = null;
                }
                globals.saved = false
                dispatch(setSaved(STATUS.UNSAVED))
            }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                <MdOutlineContentPaste className="w-5 h-5 ml-2 mt-auto mb-auto" />
                <span className="inline-block mt-auto mb-auto">Paste</span>
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
                <BiCommentAdd className="w-5 h-5 ml-2 mt-auto mb-auto" />
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
            }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                <MdInsertDriveFile className="w-5 h-5 ml-2 mt-auto mb-auto" />
                <span className="inline-block mt-auto mb-auto">Insert Note</span>
            </div>
        </div>
    );
}
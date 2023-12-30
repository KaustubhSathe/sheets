import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { BiUndo, BiRedo } from "react-icons/bi";
import { MdOutlineContentCut } from "react-icons/md";
import { IoMdCopy } from "react-icons/io";
import { MdOutlineContentPaste } from "react-icons/md";
import globals from "@/app/lib/globals/globals";

export default function EditButton({ text }: { text: string }) {
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
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
        <div className="inline-block relative">
            <span ref={ref1} onClick={() => setDropDownVisible(!dropDownVisible)} className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
            {dropDownVisible && <div className="absolute top-[1.7rem] z-50 left-0 w-[320px] bg-white">
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                    <BiUndo className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Undo</span>
                    <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+Z</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                    <BiRedo className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Redo</span>
                    <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+Y</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                    globals.cutStart = globals.selectStart;
                    globals.cutEnd = globals.selectEnd;
                    globals.copyStart = null;
                    globals.copyEnd = null;
                }}>
                    <MdOutlineContentCut className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Cut</span>
                    <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+X</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                    globals.copyStart = globals.selectStart;
                    globals.copyEnd = globals.selectEnd;
                    globals.cutStart = null;
                    globals.cutEnd = null;
                }}>
                    <IoMdCopy className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Copy</span>
                    <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+C</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
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
                                let elem0 = document.getElementById(id0);
                                let elem1 = document.getElementById(id1);
                                if (elem1 && elem0) {
                                    elem1.innerText = elem0.innerText
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
                                let elem0 = document.getElementById(id0);
                                let elem1 = document.getElementById(id1);
                                if (elem1 && elem0) {
                                    elem1.innerText = elem0.innerText
                                    elem0.innerText = ""
                                }
                            }
                        }

                        globals.cutStart = null;
                        globals.cutEnd = null;
                    }
                }}>
                    <MdOutlineContentPaste className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Paste</span>
                    <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+V</span>
                </div>
            </div>
            }
        </div>
    );
}
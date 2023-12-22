import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { BiUndo, BiRedo } from "react-icons/bi";
import { MdOutlineContentCut } from "react-icons/md";
import { IoMdCopy } from "react-icons/io";
import { MdOutlineContentPaste } from "react-icons/md";

export default function EditButton({ text, selectStart, selectEnd, copyStart, copyEnd, cutStart, cutEnd }: { text: string, selectStart: MutableRefObject<string>, selectEnd: MutableRefObject<string>, copyStart: MutableRefObject<string | null>, copyEnd: MutableRefObject<string | null>, cutStart: MutableRefObject<string | null>, cutEnd: MutableRefObject<string | null> }) {
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
                    cutStart.current = selectStart.current;
                    cutEnd.current = selectEnd.current;
                    copyStart.current = null;
                    copyEnd.current = null;
                }}>
                    <MdOutlineContentCut className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Cut</span>
                    <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+X</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                    copyStart.current = selectStart.current;
                    copyEnd.current = selectEnd.current;
                    cutStart.current = null;
                    cutEnd.current = null;
                }}>
                    <IoMdCopy className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Copy</span>
                    <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+C</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                    if (copyStart.current !== null && copyEnd.current !== null) {
                        const width = Math.max(copyStart.current.charCodeAt(0), copyEnd.current.charCodeAt(0)) - Math.min(copyStart.current.charCodeAt(0), copyEnd.current.charCodeAt(0)) + 1;
                        const length = Math.max(parseInt(copyStart.current.substring(1)), parseInt(copyEnd.current.substring(1))) - Math.min(parseInt(copyStart.current.substring(1)), parseInt(copyEnd.current.substring(1))) + 1;
                        for (let j = 0; j < width; j++) {
                            for (let i = 0; i < length; i++) {
                                const x0 = parseInt(copyStart.current.substring(1)) + i;
                                const y0 = copyStart.current.charCodeAt(0) + j;
                                const x1 = parseInt(selectStart.current.substring(1)) + i;
                                const y1 = selectStart.current.charCodeAt(0) + j;
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

                    if (cutStart.current !== null && cutEnd.current !== null) {
                        const width = Math.max(cutStart.current.charCodeAt(0), cutEnd.current.charCodeAt(0)) - Math.min(cutStart.current.charCodeAt(0), cutEnd.current.charCodeAt(0)) + 1;
                        const length = Math.max(parseInt(cutStart.current.substring(1)), parseInt(cutEnd.current.substring(1))) - Math.min(parseInt(cutStart.current.substring(1)), parseInt(cutEnd.current.substring(1))) + 1;
                        for (let j = 0; j < width; j++) {
                            for (let i = 0; i < length; i++) {
                                const x0 = parseInt(cutStart.current.substring(1)) + i;
                                const y0 = cutStart.current.charCodeAt(0) + j;
                                const x1 = parseInt(selectStart.current.substring(1)) + i;
                                const y1 = selectStart.current.charCodeAt(0) + j;
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

                        cutStart.current = null;
                        cutEnd.current = null;
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
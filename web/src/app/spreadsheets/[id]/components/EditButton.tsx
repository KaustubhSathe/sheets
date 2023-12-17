import { useCallback, useEffect, useRef, useState } from "react";
import { BiUndo, BiRedo } from "react-icons/bi";
import { MdOutlineContentCut } from "react-icons/md";
import { IoMdCopy } from "react-icons/io";
import { MdOutlineContentPaste } from "react-icons/md";


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
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                    <BiRedo className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Redo</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                    <MdOutlineContentCut className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Cut</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                    <IoMdCopy className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Copy</span>
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                    <MdOutlineContentPaste className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Paste</span>
                </div>
            </div>
            }
        </div>
    );
}
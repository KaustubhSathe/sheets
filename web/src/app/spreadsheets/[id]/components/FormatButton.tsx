import { useCallback, useEffect, useRef, useState } from "react";
import { PiTextBBold } from "react-icons/pi";
import { MdOutlineFormatAlignLeft, MdOutlineFormatSize, MdOutlineFormatClear, MdArrowRight } from "react-icons/md";
import { BiBold, BiItalic, BiUnderline, BiStrikethrough } from "react-icons/bi";
import { FaAlignLeft, FaAlignCenter, FaAlignRight } from "react-icons/fa";
import { MdOutlineVerticalAlignTop, MdOutlineVerticalAlignCenter, MdVerticalAlignBottom } from "react-icons/md";


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
                    {dropDownVisible && textDropDown && <div className="absolute right-[-200px] top-0 w-[200px] bg-white">
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <BiBold className="w-6 h-6 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Bold</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <BiItalic className="w-6 h-6 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Italic</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <BiUnderline className="w-6 h-6 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Underline</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <BiStrikethrough className="w-6 h-6 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Strike-through</span>
                        </div>
                    </div>}
                </div>
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
                    {dropDownVisible && alignmentDropDown && <div className="absolute right-[-200px] top-0 w-[200px] bg-white">
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <FaAlignLeft className="w-4 h-4 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Left</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <FaAlignCenter className="w-4 h-4 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Center</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <FaAlignRight className="w-4 h-4 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Right</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <MdOutlineVerticalAlignTop className="w-4 h-4 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Top</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <MdOutlineVerticalAlignCenter className="w-4 h-4 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Middle</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <MdVerticalAlignBottom className="w-4 h-4 ml-1 mt-auto mb-auto" />
                            <span className="inline-block mt-auto mb-auto font-normal">Bottom</span>
                        </div>
                    </div>}
                </div>
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
                    {dropDownVisible && fontDropDown && <div className="absolute right-[-60px] top-0 w-[60px] bg-white">
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">6</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">7</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">8</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">9</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">10</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">11</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">12</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">14</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">18</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">24</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4">
                            <span className="inline-block mt-auto mb-auto font-normal">36</span>
                        </div>
                    </div>}
                </div>
                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer rounded-md h-[40px]" onMouseOver={() => {
                    setTextDropDown(false)
                    setAlignmentDropDown(false)
                    setFontDropDown(false)
                }}>
                    <MdOutlineFormatClear className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Clear Formatting</span>
                </div>
            </div>
            }
        </div>
    );
}
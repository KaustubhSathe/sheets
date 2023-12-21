import { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { GoTriangleDown } from "react-icons/go";

export default function SheetsBox({ selected, index, onClick, deleteSheet }: { selected: boolean, index: number, onClick: MouseEventHandler<HTMLDivElement>, deleteSheet: MouseEventHandler<HTMLDivElement> }) {
    const [dropdown, setDropDown] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const [name, setName] = useState<string>(`Sheet ${index}`);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setDropDown(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <div ref={ref1} onClick={onClick} className={`relative ${selected ? 'bg-[#E1E9F7]' : 'bg-inherit'} flex align-middle ${selected ? '' : 'hover:bg-slate-200 hover:cursor-pointer'}`}>
            <input id={`sheet${index}`} onChange={(e) => {
                if (selected) {
                    setName(e.currentTarget.value)
                    e.currentTarget.style.width = ((e.currentTarget.value.length + 1) * 8) + 'px'
                }
            }} className={`w-[60px] bg-inherit outline-blue-600 mr-[8px] ml-[8px] inline-block h-[25px] mt-auto mb-auto ${selected ? 'text-[#2F59D0] font-bold' : ''}`} value={name} />
            <GoTriangleDown onClick={() => {
                if (selected) {
                    setDropDown(true)
                }
            }} className={`mt-auto mb-auto mr-[8px] ${selected ? 'hover:bg-slate-300 hover:rounded-full hover:cursor-pointer w-[20px] h-[20px]' : ''}`} />
            {dropdown && <div className="absolute top-[-90px] left-0 shadow-md sh">
                <div className="flex gap-2 justify-start bg-white hover:bg-slate-100 hover:cursor-pointer w-[150px] h-[30px] pl-2" onClick={() => {
                    document.getElementById(`sheet${index}`)?.focus()
                    setDropDown(false)
                }}>
                    <span className="inline-block mt-auto mb-auto font-semibold">Rename</span>
                </div>
                <div className="flex gap-2 justify-start bg-white hover:bg-slate-100 hover:cursor-pointer w-[150px] h-[30px] pl-2">
                    <span className="inline-block mt-auto mb-auto font-semibold">Duplicate</span>
                </div>
                <div className="flex gap-2 justify-start bg-white hover:bg-slate-100 hover:cursor-pointer w-[150px] h-[30px] pl-2" onClick={(e) => {
                    deleteSheet(e);
                    setDropDown(false)
                }}>
                    <span className="inline-block mt-auto mb-auto font-semibold">Delete</span>
                </div>
            </div>}
        </div>
    );
}
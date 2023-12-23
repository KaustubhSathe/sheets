import { LuPlus, LuMenu } from 'react-icons/lu'
import { useCallback, useEffect, useRef, useState } from 'react';
import SheetsBox from './SheetBox';
import { MdCheck } from 'react-icons/md';

export default function SheetsBar() {
    const [selectedSheet, setSelectedSheet] = useState<number>(1);
    const [totalSheets, setTotalSheets] = useState<number[]>([1]);
    const [sheetsDropDown, setSheetsDropDown] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setSheetsDropDown(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);
    }, [click]);

    return (
        <div className="bg-[#F9FBFD] h-[37px] flex align-middle">
            <button className="ml-[46px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center" onClick={() => setTotalSheets([...totalSheets, totalSheets[totalSheets.length - 1] ? totalSheets[totalSheets.length - 1] + 1 : 1])}>
                <LuPlus className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            <div ref={ref1} className="hover:cursor-pointer relative ml-[8px] mr-[8px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center" onClick={() => setSheetsDropDown(!sheetsDropDown)}>
                <LuMenu className="mt-auto mb-auto w-[20px] h-[20px]" />
                {
                    sheetsDropDown && <div className={`absolute left-0`} style={{ top: -1 * totalSheets.length * 40 + 'px' }}>
                        {totalSheets.map(x => (
                            <div key={x} className="flex gap-2 justify-center w-[90px] h-[40px] bg-white hover:bg-slate-300" onClick={() => setSelectedSheet(x)}>
                                {selectedSheet === x && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                                <span className="mt-auto mb-auto">{'Sheet ' + x}</span>
                            </div>
                        ))}
                    </div>
                }
            </div>

            {
                totalSheets.map(x => <SheetsBox selected={selectedSheet === x} key={x} index={x} onClick={() => { setSelectedSheet(x) }} deleteSheet={() => {
                    setTotalSheets(totalSheets.filter(id => id !== x))
                }} />)
            }
        </div>
    );
}
import { LuPlus, LuMenu } from 'react-icons/lu'
import { useState } from 'react';
import SheetsBox from './SheetBox';

export default function SheetsBar() {
    const [selectedSheet, setSelectedSheet] = useState<number>(1);
    const [totalSheets, setTotalSheets] = useState<number[]>([1]);

    return (
        <div className="bg-[#F9FBFD] h-[37px] flex align-middle">
            <button className="ml-[46px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center" onClick={() => setTotalSheets([...totalSheets, totalSheets[totalSheets.length - 1] ? totalSheets[totalSheets.length - 1] + 1 : 1])}>
                <LuPlus className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            <button className="ml-[8px] mr-[8px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center">
                <LuMenu className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            {
                totalSheets.map(x => <SheetsBox selected={selectedSheet === x} key={x} index={x} onClick={() => { setSelectedSheet(x) }} deleteSheet={() => {
                    setTotalSheets(totalSheets.filter(id => id !== x))
                }} />)
            }
        </div>
    );
}
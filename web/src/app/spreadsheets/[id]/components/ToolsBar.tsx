import { AiOutlineSearch } from 'react-icons/ai'
import { LuUndo2, LuRedo2, LuPrinter, LuMinus, LuPlus } from 'react-icons/lu'
import { BiBold, BiItalic, BiStrikethrough, BiFontColor, BiColorFill } from 'react-icons/bi'
import globals from '@/app/lib/globals/globals';
import { Command } from '@/app/types/Command';

export default function ToolsBar() {
    return (
        <div className="bg-[#EDF2FA] h-[40px] flex overflow-x-scroll overflow-y-hidden" id='toolsbar'>
            <div className="relative h-[100%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <AiOutlineSearch className="mt-auto mb-auto mr-[8px] w-[20px] h-[20px]" />
                </div>
                <input type="text" className="pt-[4px] pb-[4px] pl-[28px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[200px] outline-none" placeholder="Search Commands" />
            </div>
            <button onClick={() => {
                if (globals.undoStack.length) {
                    globals.undoStack[globals.undoStack.length - 1].Inverse()
                    globals.redoStack.push(globals.undoStack.pop() as Command);
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuUndo2 />
            </button>
            <button onClick={() => {
                if (globals.redoStack.length) {
                    globals.redoStack[globals.redoStack.length - 1].Action()
                    globals.undoStack.push(globals.redoStack.pop() as Command);
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuRedo2 />
            </button>
            <button onClick={() => {
                window.print()
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuPrinter />
            </button>
            <select onClick={(e) => {
                // @ts-ignore
                document.body.style.zoom = (e.target as HTMLSelectElement).value
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit">
                <option value={1}>100%</option>
                <option value={0.9}>90%</option>
                <option value={0.8}>80%</option>
                <option value={0.7}>70%</option>
                <option value={0.6}>60%</option>
                <option value={0.5}>50%</option>
                <option value={0.4}>40%</option>
                <option value={0.3}>30%</option>
                <option value={0.2}>20%</option>
                <option value={0.1}>10%</option>
            </select>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <select onClick={(e) => {
                const fontFamily = (e.target as HTMLSelectElement).value
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let elem = document.getElementById(id) as HTMLTextAreaElement;
                        if (elem) {
                            elem.style.fontFamily = fontFamily
                            globals.spreadsheet.Sheets[globals.selectedSheet].State[id].FontFamily = fontFamily
                        }
                    }
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit" id="fontSelector">
                <option value={"Arial"}>Arial </option>
                <option value={"Verdana"}>Verdana</option>
                <option value={"Times New Roman"}>Times New Roman</option>
                <option value={"Garamond"}>Garamond</option>
                <option value={"Roboto"}>Roboto</option>
            </select>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuMinus />
            </button>
            <input type="number" className="pt-[4px] pb-[4px] pl-[4px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[60px] outline-none" defaultValue={10} />
            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuPlus />
            </button>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiBold />
            </button>

            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiItalic />
            </button>

            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiStrikethrough />
            </button>

            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiFontColor />
            </button>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiColorFill />
            </button>

        </div>
    );
}
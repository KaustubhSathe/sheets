import { AiOutlineSearch } from 'react-icons/ai'
import { LuUndo2, LuRedo2, LuPrinter, LuMinus, LuPlus } from 'react-icons/lu'
import { BiBold, BiItalic, BiStrikethrough, BiFontColor, BiColorFill } from 'react-icons/bi'

export default function ToolsBar() {
    return (
        <div className="bg-[#EDF2FA] h-[40px] flex overflow-x-scroll overflow-y-hidden">
            <div className="relative h-[100%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <AiOutlineSearch className="mt-auto mb-auto mr-[8px] w-[20px] h-[20px]" />
                </div>
                <input type="text" className="pt-[4px] pb-[4px] pl-[28px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[200px] outline-none" placeholder="Search Commands" />
            </div>
            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuUndo2 />
            </button>
            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuRedo2 />
            </button>
            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuPrinter />
            </button>
            <select className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit">
                <option>100%</option>
                <option>90%</option>
                <option>80%</option>
                <option>70%</option>
                <option>60%</option>
                <option>50%</option>
                <option>40%</option>
                <option>30%</option>
                <option>20%</option>
                <option>10%</option>
            </select>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <select className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit">
                <option>Helvetica</option>
                <option>Sans-Serif</option>
                <option>Google Sans</option>
                <option>Cursive</option>
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
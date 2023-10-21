import { LuPlus, LuMenu } from 'react-icons/lu'
import { GoTriangleDown } from 'react-icons/go'

export default function SheetsBar() {
    return (
        <div className="bg-[#F9FBFD] h-[37px] flex align-middle">
            <button className="ml-[46px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center">
                <LuPlus className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            <button className="ml-[8px] hover:bg-slate-200 hover:rounded-full w-[37px] flex align-middle justify-center">
                <LuMenu className="mt-auto mb-auto w-[20px] h-[20px]" />
            </button>

            <div className="ml-[8px] bg-[#E1E9F7] flex align-middle">
                <span className="mr-[8px] ml-[8px] inline-block h-[25px] mt-auto mb-auto text-[#2F59D0] font-bold">Sheet 1</span>
                <GoTriangleDown className="mt-auto mb-auto mr-[8px] hover:bg-slate-300 hover:rounded-full hover:cursor-pointer w-[20px] h-[20px]" />
            </div>
            <div className="bg-inherit flex align-middle hover:bg-slate-200 hover:cursor-pointer">
                <span className="mr-[8px] ml-[8px] inline-block h-[25px] mt-auto mb-auto">Sheet 2</span>
                <GoTriangleDown className="mt-auto mb-auto mr-[8px]" />
            </div>
        </div>
    );
}
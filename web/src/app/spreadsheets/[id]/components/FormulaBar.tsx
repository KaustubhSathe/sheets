import { TbMathFunction } from 'react-icons/tb'

export default function FormulaBar() {
    return (
        <div className="bg-[#FFFFFF] h-[35px] flex">
            <input type="text" className="pt-[4px] pb-[4px] pl-[4px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[85px] outline-none" defaultValue={10} />

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <TbMathFunction className="mt-auto mb-auto ml-[8px]"/>

            <input type="text" className="pt-[4px] pb-[4px] pl-[4px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] mr-[8px] text-sm text-gray-900 border border-slate-300 rounded-lg w-[100%] outline-none" defaultValue={10} />            
        </div>
    );
}
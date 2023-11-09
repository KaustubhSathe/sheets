import { TbMathFunction } from 'react-icons/tb'
import { useSelector, useDispatch } from 'react-redux'
import { setValue } from '../../../lib/redux/nameBoxSlice'
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'

export default function FormulaBar() {
    //@ts-ignore
    const nameBoxValue = useSelector(state => state.nameBox.value)
    //@ts-ignore
    const formulaBarValue = useSelector(state => state.formulaBar.value)
    //@ts-ignore
    const selectedCell = useSelector(state => state.selectedCell.value)
    const dispatch = useDispatch()

    return (
        <div className="bg-[#FFFFFF] h-[35px] flex">
            <input type="text" className="pt-[4px] pb-[4px] pl-[4px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[85px] outline-none" value={nameBoxValue} onChange={(e) => dispatch(setValue(e.target.value))} />

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <TbMathFunction className="mt-auto mb-auto ml-[8px]" />

            <input type="text" className="pt-[4px] pb-[4px] pl-[4px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] mr-[8px] text-sm text-gray-900 border border-slate-300 rounded-lg w-[100%] outline-none" value={formulaBarValue} onChange={(e) => {
                dispatch(setValueFormulaBar(e.target.value))
                console.log(selectedCell)
                const selectedCellText = document.getElementById(selectedCell);
                if (selectedCellText) {
                    selectedCellText.innerText = e.target.value
                }
            }
            } />
        </div>
    );
}
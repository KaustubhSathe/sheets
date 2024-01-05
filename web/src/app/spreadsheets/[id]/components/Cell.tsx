import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { setValue as setSelectedCell } from '../../../lib/redux/selectedCellSlice';
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { useDispatch } from "react-redux";
import globals from '@/app/lib/globals/globals';


export default function Cell({ i, j }: { i: number, j: number }) {
    const dispatch = useDispatch()
    const id = String.fromCharCode(65 + j) + (i + 1).toString();

    return (
        <div className={`relative m-0 p-0 w-full rowbar-${(i + 1).toString()} h-[30px] hover:cursor-cell focus:cursor-text`}>
            <div className="peer hover:cursor-cell focus:cursor-text overflow-x-clip overflow-y-clip pl-[4px] break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] outline-none m-0 resize-none"
                spellCheck={false}
                contentEditable
                id={id}
                onFocus={(e) => {
                    dispatch(setSelectedCell(e.currentTarget.id))
                }}
                onInput={(e) => {
                    if (globals.saved) {
                        globals.saved = false
                        dispatch(setSaved(STATUS.UNSAVED))
                    }
                    dispatch(setValueFormulaBar(e.currentTarget.innerText))
                }}
                key={String.fromCharCode(65 + j) + (i + 1).toString()}
            ></div>
            <div className="absolute bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full peer-focus:bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
            </div>
        </div>
    );
}
import { setValue } from "@/app/lib/redux/nameBoxSlice";
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { setValue as setSelectedCell } from '../../../lib/redux/selectedCellSlice';
import { useDispatch } from "react-redux";

function getDownID(id: string): string {
    let col = id.match(/([A-Z]+)(\d+)/)?.at(1)
    let row = id.match(/([A-Z]+)(\d+)/)?.at(2)
    row = row ? row : "0"
    return col + (parseInt(row) + 1).toString();
}

function getUpID(id: string): string {
    let col = id.match(/([A-Z]+)(\d+)/)?.at(1)
    let row = id.match(/([A-Z]+)(\d+)/)?.at(2)
    row = row ? row : "0"
    return col + (parseInt(row) - 1).toString();
}

function getRightID(id: string): string {
    let col = id.match(/([A-Z]+)(\d+)/)?.at(1)
    let row = id.match(/([A-Z]+)(\d+)/)?.at(2)
    row = row ? row : "0"
    const colCode = col?.charCodeAt(0) ? col?.charCodeAt(0) : 65
    return String.fromCharCode(colCode + 1) + row;
}

function getLeftID(id: string): string {
    let col = id.match(/([A-Z]+)(\d+)/)?.at(1)
    let row = id.match(/([A-Z]+)(\d+)/)?.at(2)
    row = row ? row : "0"
    const colCode = col?.charCodeAt(0) ? col?.charCodeAt(0) : 65
    return String.fromCharCode(colCode - 1) + row;
}

export default function Cell({ i, j }: { i: number, j: number }) {
    const dispatch = useDispatch()

    return (
        <div className={`relative m-0 p-0 w-full rowbar-${(i + 1).toString()} h-[30px]`}>
            <div className="peer focus:border-[#1a73e8] focus:border-[3px] overflow-x-hidden overflow-y-hidden pl-[4px] break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] outline-none m-0 resize-none"
                contentEditable
                spellCheck={false}
                id={String.fromCharCode(65 + j) + (i + 1).toString()}
                onClick={(e) => {
                    dispatch(setValue(e.currentTarget.id))
                    dispatch(setSelectedCell(e.currentTarget.id))
                }}
                onInput={(e) => {
                    dispatch(setValueFormulaBar(e.currentTarget.innerText))
                }}
                onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                        const currentElementId = e.currentTarget.id
                        document.getElementById(getDownID(currentElementId))?.focus()
                        dispatch(setSelectedCell(getDownID(currentElementId)))
                    }

                    if (e.key === "ArrowUp") {
                        const currentElementId = e.currentTarget.id
                        document.getElementById(getUpID(currentElementId))?.focus()
                        dispatch(setSelectedCell(getUpID(currentElementId)))
                    }

                    if (e.key === "ArrowRight") {
                        const currentElementId = e.currentTarget.id
                        document.getElementById(getRightID(currentElementId))?.focus()
                        dispatch(setSelectedCell(getRightID(currentElementId)))
                    }

                    if (e.key === "ArrowLeft") {
                        const currentElementId = e.currentTarget.id
                        document.getElementById(getLeftID(currentElementId))?.focus()
                        dispatch(setSelectedCell(getLeftID(currentElementId)))
                    }
                }}
                key={String.fromCharCode(65 + j) + (i + 1).toString()}
            ></div>
            <div className="absolute -z-10 bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
            </div>
        </div>
    );
}
import { setValue } from '../../../lib/redux/nameBoxSlice'
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { useSelector, useDispatch } from 'react-redux'
import type { Reducer } from 'redux';
import { ColumnReducer, RowReducer } from '@/app/lib/redux/store';
import { useCallback, useEffect, useRef, useState } from 'react';

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

export default function CellsGrid() {
    const dispatch = useDispatch()
    const rowsValue = useSelector<RowReducer, number>(state => state.row.value)
    const columnsValue = useSelector<ColumnReducer, number>(state => state.column.value)
    const [activeColModifier, setActiveColModifier] = useState<string>("");

    const rowsNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < rowsValue; i++) {
        rowsNumbers.push((
            <div
                id={"row" + (i + 1).toString()}
                key={(i + 1).toString()}
                className="h-[30px] w-full flex justify-center align-middle border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] font-sans">
                {i + 1}
            </div>
        ));
    }

    const colNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < columnsValue; i++) {
        colNumbers.push((
            <div
                id={"column" + String.fromCharCode(65 + i)}
                key={String.fromCharCode(65 + i)}
                className="min-w-[66px] h-full text-center border-b-[1px] border-t-[1px] border-r-[1px] border-solid border-[#E1E1E1] relative"
            >
                <span>{String.fromCharCode(65 + i)}</span>
                <div
                    id={"colModifier" + String.fromCharCode(65 + i)}
                    onMouseDown={(e) => {
                        setActiveColModifier(e.currentTarget.id)
                        e.currentTarget.style.backgroundColor = '#517ea5'
                    }}
                    className={`block absolute h-full cursor-col-resize w-[3px] hover:h-[${rowsValue * 30 + 30}px] hover:bg-slate-300 right-[-1.5px] top-0 z-30 ${activeColModifier === "colModifier" + String.fromCharCode(65 + i) ? "bg-[#517ea5]" : ""}`}
                >
                </div>
            </div>
        ));
    }

    const cells: Array<React.ReactNode> = [];
    for (let i = 0; i < rowsValue; i++) {
        const x: Array<React.ReactNode> = [];
        for (let j = 0; j < columnsValue; j++) {
            x.push(
                <div className="relative m-0 p-0 h-full min-w-[66px]">
                    <div className="peer focus:border-[#1a73e8] focus:border-[3px] overflow-x-hidden overflow-y-hidden pl-[4px] outline-none break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1]"
                        contentEditable={true}
                        spellCheck={false}
                        id={String.fromCharCode(65 + j) + (i + 1).toString()}
                        onClick={(e) => {
                            dispatch(setValue(e.currentTarget.id))
                        }}
                        onInput={(e) => {
                            dispatch(setValueFormulaBar(e.currentTarget.outerText))
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                                const currentElementId = e.currentTarget.id
                                document.getElementById(getDownID(currentElementId))?.focus()
                            }

                            if (e.key === "ArrowUp") {
                                const currentElementId = e.currentTarget.id
                                document.getElementById(getUpID(currentElementId))?.focus()
                            }

                            if (e.key === "ArrowRight") {
                                const currentElementId = e.currentTarget.id
                                document.getElementById(getRightID(currentElementId))?.focus()
                            }

                            if (e.key === "ArrowLeft") {
                                const currentElementId = e.currentTarget.id
                                document.getElementById(getLeftID(currentElementId))?.focus()
                            }
                        }}
                        key={String.fromCharCode(65 + j) + (i + 1).toString()}
                    ></div>
                    <div className="absolute -z-10 bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full peer-focus:bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
                    </div>
                </div>
            );
        }
        cells.push((
            <div className="h-[30px] flex bg-inherit" key={(i + 1).toString()} id={"cellcontainer" + (i + 1).toString()}>
                {x}
            </div>
        ));
    }

    return (
        <div className="bg-[#FFFFFF] h-[calc(100vh-60px-40px-35px-37px)] relative overflow-scroll p-0 m-0 hover:cursor-cell">
            <div className="fixed bg-slate-400 h-[30px] w-[46px] z-10 inline-block"></div>
            <div className="h-[30px] ml-[46px] flex bg-inherit">
                {
                    colNumbers
                }
            </div>
            <div className="sticky left-0 bg-inherit w-[46px] overflow-x-hidden overflow-y-hidden inline-block float-left">
                {
                    rowsNumbers
                }
            </div>
            {
                cells
            }
        </div>
    );
}


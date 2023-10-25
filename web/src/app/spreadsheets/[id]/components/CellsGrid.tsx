import { setValue } from '../../../lib/redux/nameBoxSlice'
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { useDispatch } from 'react-redux'
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
    const [rowsValue, setRowsValue] = useState<number>(100)
    const [columnsValue, setColumnsValue] = useState<number>(26)
    const [activeCol, setActiveCol] = useState<string | null>(null);

    const mouseMove = useCallback((e: any) => {
        let offsetLeft = document.getElementById("column" + activeCol)?.offsetLeft
        offsetLeft = offsetLeft ? offsetLeft : 0
        const width = e.clientX - offsetLeft
        let element = document.getElementById("column" + activeCol)?.style
        if (element) {
            if (width > 30) {
                element.minWidth = width.toString() + 'px'
            }
        }
        element = document.getElementById("cellcontainer" + activeCol)?.style
        if (element) {
            if (width > 30) {
                element.minWidth = width.toString() + 'px'
            }
        }


        // for background color
        element = document.getElementById("colModifier" + activeCol)?.style
        if (element) {
            console.log(element)
            element.height = (rowsValue * 30 + 30).toString() + "px"
            element.backgroundColor = 'rgb(203,213,225,1)'
        }
    }, [activeCol, rowsValue]);

    const removeListeners = useCallback(() => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", removeListeners);
    }, [mouseMove]);

    const mouseUp = useCallback((e: any) => {
        if (activeCol != "") {
            let element = document.getElementById("colModifier" + activeCol)?.style
            if (element) {
                console.log(element)
                element.height = '100%'
                element.backgroundColor = ''
            }
            console.log("mpouse up")
            setActiveCol(null);
            removeListeners();
        }
    }, [activeCol, removeListeners]);

    useEffect(() => {
        if (activeCol !== null) {
            window.addEventListener("mousemove", mouseMove);
            window.addEventListener("mouseup", mouseUp);
        }

        return () => {
            removeListeners();
        };
    }, [activeCol, rowsValue, mouseMove, mouseUp, removeListeners]);

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
                    onMouseOver={(e) => {
                        e.currentTarget.style.height = (rowsValue * 30 + 30).toString() + "px"
                        e.currentTarget.style.backgroundColor = 'rgb(203,213,225,1)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.height = '100%'
                        e.currentTarget.style.backgroundColor = ''
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.height = (rowsValue * 30 + 30).toString() + "px"
                        e.currentTarget.style.backgroundColor = 'rgb(203,213,225,1)'
                        setActiveCol(String.fromCharCode(65 + i))
                    }}
                    className={`block absolute h-full cursor-col-resize w-[3px] right-[-1.5px] top-0 z-30`}
                >
                </div>
            </div>
        ));
    }

    const cells: Array<React.ReactNode> = [];
    for (let j = 0; j < columnsValue; j++) {
        const x: Array<React.ReactNode> = [];
        for (let i = 0; i < rowsValue; i++) {
            x.push(
                <div className="relative m-0 p-0 w-full h-[30px]">
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
            <div className="min-w-[66px] bg-inherit" key={String.fromCharCode(65 + j)} id={"cellcontainer" + String.fromCharCode(65 + j)}>
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
            <div className="ml-[46px] flex">
                {
                    cells
                }
            </div>
        </div>
    );
}


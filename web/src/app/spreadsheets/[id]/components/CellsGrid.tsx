import { setValue } from '../../../lib/redux/nameBoxSlice'
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { useDispatch } from 'react-redux'
import { useCallback, useEffect, useState } from 'react';
import Cell from './Cell';

export default function CellsGrid() {
    const dispatch = useDispatch()
    const [rows, setRowsValue] = useState<number>(100)
    const [columns, setColumnsValue] = useState<number>(26)
    const [activeCol, setActiveCol] = useState<string | null>(null);
    const [activeRow, setActiveRow] = useState<string | null>(null);

    const mouseMoveHorizontal = useCallback((e: MouseEvent) => {
        let element = document.getElementById("column" + activeCol)
        if (element) {
            let offsetLeft = document.getElementById("column" + activeCol)?.getBoundingClientRect().left
            offsetLeft = offsetLeft ? offsetLeft : 0
            const width = Math.max(e.clientX - offsetLeft, 30)
            element.style.minWidth = width.toString() + 'px'
            element = document.getElementById("cellcontainer" + activeCol)
            if (element) {
                element.style.minWidth = width.toString() + 'px'
            }
        }
        element = document.getElementById("colModifier" + activeCol)
        if (element) {
            let offsetBottom = document.getElementById("row" + rows)?.getBoundingClientRect().bottom
            offsetBottom = offsetBottom ? offsetBottom : 0
            element.style.height = (offsetBottom - (60 + 40 + 35)).toString() + "px"
            element.style.backgroundColor = 'rgb(203,213,225,1)'
        }
    }, [activeCol, rows]);

    const mouseMoveVertical = useCallback((e: MouseEvent) => {
        let element = document.getElementById("row" + activeRow)
        if (element) {
            let offsetTop = document.getElementById("row" + activeRow)?.getBoundingClientRect().top
            offsetTop = offsetTop ? offsetTop : 0
            const height = Math.max(e.clientY - offsetTop, 30)
            element.style.minHeight = height.toString() + 'px'
            const elems = document.getElementsByClassName("rowbar-" + activeRow) as HTMLCollectionOf<HTMLElement>
            for (let i = 0; i < elems.length; i++) {
                elems[i].style.height = height.toString() + 'px'
            }
        }
        // for background color
        element = document.getElementById("rowModifier" + activeRow)
        if (element) {
            element.style.width = '100vw'
            element.style.backgroundColor = 'rgb(203,213,225,1)'
        }
    }, [activeRow]);

    const removeListeners = useCallback(() => {
        window.removeEventListener("mousemove", mouseMoveHorizontal);
        window.removeEventListener("mousemove", mouseMoveVertical);
        window.removeEventListener("mouseup", removeListeners);
    }, [mouseMoveHorizontal, mouseMoveVertical]);

    const mouseUp = useCallback((e: MouseEvent) => {
        if (activeCol !== null) {
            let element = document.getElementById("colModifier" + activeCol)?.style
            if (element) {
                element.height = '100%'
                element.backgroundColor = ''
            }
            setActiveCol(null);
            removeListeners();
        }

        if (activeRow !== null) {
            let element = document.getElementById("rowModifier" + activeRow)?.style
            if (element) {
                element.width = '100%'
                element.backgroundColor = ''
            }
            setActiveRow(null);
            removeListeners();
        }
    }, [activeCol, activeRow, removeListeners]);

    useEffect(() => {
        if (activeCol !== null) {
            window.addEventListener("mousemove", mouseMoveHorizontal);
            window.addEventListener("mouseup", mouseUp);
        }

        if (activeRow !== null) {
            window.addEventListener("mousemove", mouseMoveVertical);
            window.addEventListener("mouseup", mouseUp);
        }

        return () => {
            removeListeners();
        };
    }, [activeCol, activeRow, rows, mouseMoveHorizontal, mouseMoveVertical, mouseUp, removeListeners]);

    const rowsNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < rows; i++) {
        rowsNumbers.push((
            <div
                id={"row" + (i + 1).toString()}
                key={(i + 1).toString()}
                className="h-[30px] w-full flex justify-center align-middle border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] font-sans relative">
                <span>{i + 1}</span>
                <div
                    id={"rowModifier" + (i + 1).toString()}
                    onMouseOver={(e) => {
                        e.currentTarget.style.width = '100vw'
                        e.currentTarget.style.zIndex = '10000'
                        e.currentTarget.style.backgroundColor = 'rgb(203,213,225,1)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.width = '100%'
                        e.currentTarget.style.backgroundColor = ''
                    }}
                    onMouseDown={(e) => {
                        e.currentTarget.style.width = "100vw"
                        console.log("mouse down" + (i + 1).toString())
                        e.currentTarget.style.backgroundColor = 'rgb(203,213,225,1)'
                        setActiveRow((i + 1).toString())
                    }}
                    className={`block absolute w-full cursor-row-resize h-[3px] bottom-[-1.5px] left-0 z-100000`}
                >
                </div>
            </div>
        ));
    }

    const colNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < columns; i++) {
        colNumbers.push((
            <div
                id={"column" + String.fromCharCode(65 + i)}
                key={String.fromCharCode(65 + i)}
                className="min-w-[70px] h-full text-center border-b-[1px] border-t-[1px] border-r-[1px] border-solid border-[#E1E1E1] relative"
            >
                <span>{String.fromCharCode(65 + i)}</span>
                <div
                    id={"colModifier" + String.fromCharCode(65 + i)}
                    onMouseOver={(e) => {
                        let offsetBottom = document.getElementById("row" + rows)?.getBoundingClientRect().bottom
                        offsetBottom = offsetBottom ? offsetBottom : 0
                        e.currentTarget.style.height = (offsetBottom - (60 + 40 + 35)).toString() + "px"
                        e.currentTarget.style.backgroundColor = 'rgb(203,213,225,1)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.height = '100%'
                        e.currentTarget.style.backgroundColor = ''
                    }}
                    onMouseDown={(e) => {
                        let offsetBottom = document.getElementById("row" + rows)?.getBoundingClientRect().bottom
                        offsetBottom = offsetBottom ? offsetBottom : 0
                        e.currentTarget.style.height = (offsetBottom - (60 + 40 + 35)).toString() + "px"
                        e.currentTarget.style.backgroundColor = 'rgb(203,213,225,1)'
                        setActiveCol(String.fromCharCode(65 + i))
                        console.log("mouse down" + String.fromCharCode(65 + i))
                    }}
                    className={`block absolute h-full cursor-col-resize w-[3px] right-[-1.5px] top-0 z-30`}
                >
                </div>
            </div>
        ));
    }

    const cells: Array<React.ReactNode> = [];
    for (let j = 0; j < columns; j++) {
        const x: Array<React.ReactNode> = [];
        for (let i = 0; i < rows; i++) {
            x.push(
                <Cell i={i} j={j} key={String.fromCharCode(65 + j) + (i + 1).toString()} />
            );
        }
        cells.push((
            <div className="min-w-[70px] bg-inherit" key={String.fromCharCode(65 + j)} id={"cellcontainer" + String.fromCharCode(65 + j)}>
                {x}
            </div>
        ));
    }

    return (
        <div id="cellgrid" className="bg-[#FFFFFF] h-[calc(100vh-60px-40px-35px-37px)] relative overflow-scroll p-0 m-0 hover:cursor-cell">
            <div className="fixed bg-slate-400 h-[30px] w-[46px] z-10 inline-block"></div>
            <div className="h-[30px] ml-[46px] flex bg-inherit">
                {
                    colNumbers
                }
            </div>
            <div className="sticky left-0 bg-inherit w-[46px] inline-block float-left">
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


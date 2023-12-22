import { setValue } from '../../../lib/redux/nameBoxSlice'
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { useDispatch } from 'react-redux'
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import Cell from './Cell';

export default function CellsGrid({ formulaBarVisible, toolBarVisible, selectStart, selectEnd, copyStart, copyEnd, cutStart, cutEnd }: { formulaBarVisible: boolean, toolBarVisible: boolean, selectStart: MutableRefObject<string>, selectEnd: MutableRefObject<string>, copyStart: MutableRefObject<string | null>, copyEnd: MutableRefObject<string | null>, cutStart: MutableRefObject<string | null>, cutEnd: MutableRefObject<string | null> }) {
    const dispatch = useDispatch()
    const [rows, setRowsValue] = useState<number>(100)
    const [columns, setColumnsValue] = useState<number>(26)
    const [activeCol, setActiveCol] = useState<string | null>(null);
    const [activeRow, setActiveRow] = useState<string | null>(null);
    const isMouseDown = useRef<boolean>(false);
    const ctrlDown = useRef<boolean>(false);

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
        let elem = document.getElementById(selectStart.current);
        if (elem) {
            elem.style.borderWidth = '3px';
            elem.style.borderColor = '#1a73e8';
            dispatch(setValue(selectStart.current))
        }

        document.addEventListener("keyup", (e) => {
            if (e.ctrlKey) {
                ctrlDown.current = false;
            }
        })

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey) {
                ctrlDown.current = true;
            }

            if (ctrlDown.current && e.key === "c") {
                e.preventDefault();
                copyStart.current = selectStart.current;
                copyEnd.current = selectEnd.current;
                cutStart.current = null;
                cutEnd.current = null;
            }

            if (ctrlDown.current && e.key === "x") {
                e.preventDefault();
                cutStart.current = selectStart.current;
                cutEnd.current = selectEnd.current;
                copyStart.current = null;
                copyEnd.current = null;
            }


            if (ctrlDown.current && e.key === "v") {
                e.preventDefault();
                if (copyStart.current !== null && copyEnd.current !== null) {
                    const width = Math.max(copyStart.current.charCodeAt(0), copyEnd.current.charCodeAt(0)) - Math.min(copyStart.current.charCodeAt(0), copyEnd.current.charCodeAt(0)) + 1;
                    const length = Math.max(parseInt(copyStart.current.substring(1)), parseInt(copyEnd.current.substring(1))) - Math.min(parseInt(copyStart.current.substring(1)), parseInt(copyEnd.current.substring(1))) + 1;
                    for (let j = 0; j < width; j++) {
                        for (let i = 0; i < length; i++) {
                            const x0 = parseInt(copyStart.current.substring(1)) + i;
                            const y0 = copyStart.current.charCodeAt(0) + j;
                            const x1 = parseInt(selectStart.current.substring(1)) + i;
                            const y1 = selectStart.current.charCodeAt(0) + j;
                            const id0 = String.fromCharCode(y0) + x0.toString();
                            const id1 = String.fromCharCode(y1) + x1.toString();
                            let elem0 = document.getElementById(id0);
                            let elem1 = document.getElementById(id1);
                            if (elem1 && elem0) {
                                elem1.innerText = elem0.innerText
                            }
                        }
                    }
                }

                if (cutStart.current !== null && cutEnd.current !== null) {
                    const width = Math.max(cutStart.current.charCodeAt(0), cutEnd.current.charCodeAt(0)) - Math.min(cutStart.current.charCodeAt(0), cutEnd.current.charCodeAt(0)) + 1;
                    const length = Math.max(parseInt(cutStart.current.substring(1)), parseInt(cutEnd.current.substring(1))) - Math.min(parseInt(cutStart.current.substring(1)), parseInt(cutEnd.current.substring(1))) + 1;
                    for (let j = 0; j < width; j++) {
                        for (let i = 0; i < length; i++) {
                            const x0 = parseInt(cutStart.current.substring(1)) + i;
                            const y0 = cutStart.current.charCodeAt(0) + j;
                            const x1 = parseInt(selectStart.current.substring(1)) + i;
                            const y1 = selectStart.current.charCodeAt(0) + j;
                            const id0 = String.fromCharCode(y0) + x0.toString();
                            const id1 = String.fromCharCode(y1) + x1.toString();
                            let elem0 = document.getElementById(id0);
                            let elem1 = document.getElementById(id1);
                            if (elem1 && elem0) {
                                elem1.innerText = elem0.innerText
                                elem0.innerText = ""
                            }
                        }
                    }

                    cutStart.current = null;
                    cutEnd.current = null;
                }
            }

            if (e.key === "Delete") {
                for (let j = Math.min(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j <= Math.max(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i <= Math.max(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let elem = document.getElementById(id);
                        if (elem) {
                            elem.innerText = ""
                        }
                    }
                }
            }
        });

        document.getElementById("cellgrid")?.addEventListener("mousedown", (e) => {
            for (let j = Math.min(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j <= Math.max(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i <= Math.max(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let elem = document.getElementById(id);
                    if (elem) {
                        elem.style.backgroundColor = "#FFFFFF";
                        elem.style.borderBottomWidth = '1px';
                        elem.style.borderRightWidth = '1px';
                        elem.style.borderTopWidth = '0px'
                        elem.style.borderLeftWidth = '0px'
                        elem.style.borderStyle = 'solid';
                        elem.style.borderColor = '#E1E1E1'
                    }
                    elem = document.getElementById("row" + (i).toString())
                    if (elem) {
                        elem.style.backgroundColor = "#FFFFFF";
                    }
                    elem = document.getElementById("column" + String.fromCharCode(j));
                    if (elem) {
                        elem.style.backgroundColor = "#FFFFFF";
                    }
                }
            }
            if (e.target && (e.target as HTMLDivElement).id) {
                selectStart.current = (e.target as HTMLDivElement).id
                selectEnd.current = (e.target as HTMLDivElement).id

                if (selectEnd.current === selectStart.current) {
                    dispatch(setValue(selectStart.current))
                } else {
                    dispatch(setValue(String.fromCharCode(Math.min(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0))) + Math.min(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))).toString() + ":" + String.fromCharCode(Math.max(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0))) + Math.max(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))).toString()))
                }
                (e.target as HTMLDivElement).style.borderWidth = '3px';
                (e.target as HTMLDivElement).style.borderColor = '#1a73e8';
            }
            isMouseDown.current = true;

            document.getElementById("cellgrid")?.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                const { clientX: mouseX, clientY: mouseY } = e;

                console.log("hello world")
            })
        })
        document.getElementById("cellgrid")?.addEventListener("mouseover", (e) => {
            if (isMouseDown.current) {
                for (let j = Math.min(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j <= Math.max(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i <= Math.max(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let elem = document.getElementById(id);
                        if (elem) {
                            elem.style.backgroundColor = "#FFFFFF";
                        }
                        elem = document.getElementById("row" + (i).toString())
                        if (elem) {
                            elem.style.backgroundColor = "#FFFFFF";
                        }
                        elem = document.getElementById("column" + String.fromCharCode(j));
                        if (elem) {
                            elem.style.backgroundColor = "#FFFFFF";
                        }
                    }
                }
                if (e.target && (e.target as HTMLDivElement).id) {
                    selectEnd.current = (e.target as HTMLDivElement).id;

                    if (selectEnd.current === selectStart.current) {
                        dispatch(setValue(selectStart.current))
                    } else {
                        dispatch(setValue(String.fromCharCode(Math.min(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0))) + Math.min(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))).toString() + ":" + String.fromCharCode(Math.max(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0))) + Math.max(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))).toString()))
                    }
                }
                for (let j = Math.min(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j <= Math.max(selectStart.current.charCodeAt(0), selectEnd.current.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i <= Math.max(parseInt(selectStart.current.substring(1)), parseInt(selectEnd.current.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let elem = document.getElementById(id);
                        if (elem) {
                            elem.style.backgroundColor = "#E6EFFD";
                        }
                        elem = document.getElementById("row" + (i).toString())
                        if (elem) {
                            elem.style.backgroundColor = "#D3E3FD";
                        }
                        elem = document.getElementById("column" + String.fromCharCode(j));
                        if (elem) {
                            elem.style.backgroundColor = "#D3E3FD";
                        }
                    }
                }
            }
        })
        document.getElementById("cellgrid")?.addEventListener("mouseup", (e) => {
            isMouseDown.current = false;
        })

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
    }, [activeCol, activeRow, rows, mouseMoveHorizontal, mouseMoveVertical, mouseUp, removeListeners, dispatch]);

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
                className="min-w-[80px] h-full text-center border-b-[1px] border-t-[1px] border-r-[1px] border-solid border-[#E1E1E1] relative"
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
            <div className="min-w-[80px] bg-inherit" key={String.fromCharCode(65 + j)} id={"cellcontainer" + String.fromCharCode(65 + j)}>
                {x}
            </div>
        ));
    }

    return (
        <div id="cellgrid" className={`bg-[#FFFFFF] ${formulaBarVisible && toolBarVisible ? 'h-[calc(100vh-60px-40px-35px-37px)]' : !formulaBarVisible && toolBarVisible ? 'h-[calc(100vh-60px-40px-37px)]' : formulaBarVisible && !toolBarVisible ? 'h-[calc(100vh-60px-35px-37px)]' : 'h-[calc(100vh-60px-37px)]'} relative overflow-scroll p-0 m-0 hover:cursor-cell`}>
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


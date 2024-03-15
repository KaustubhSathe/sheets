import { setValue as setNameBoxValue } from '../../../lib/redux/nameBoxSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useRef, useState } from 'react';
import Cell from './Cell';
import { setValue as setSelectStart } from '../../../lib/redux/selectStartSlice';
import { RootState } from '@/app/lib/redux/store';
import globals from '@/app/lib/globals/globals';
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import { Command } from '@/app/types/Command';
import ContextMenu from './ContextMenu';
import Comment from './Comment';
import Note from './Note';
import EmojiPicker from 'emoji-picker-react';
import { FormulaList } from './FormulaList';

export function getAdjacentID(id: string, key: string): string {
    let col = id.match(/([A-Z]+)(\d+)/)?.at(1)
    let row = id.match(/([A-Z]+)(\d+)/)?.at(2)
    row = row ? row : "0"
    const colCode = col?.charCodeAt(0) ? col?.charCodeAt(0) : 65
    if (key === "ArrowDown")
        return col + Math.min(parseInt(row) + 1, globals.rows).toString();

    if (key === "ArrowUp")
        return col + Math.max(1, parseInt(row) - 1).toString();

    if (key === "ArrowRight")
        return String.fromCharCode(Math.min(colCode + 1, globals.columns + 65 - 1)) + row;

    return String.fromCharCode(Math.max(colCode - 1, 65)) + row;
}

export default function CellsGrid() {
    const dispatch = useDispatch()
    const formulaBarVisible = useSelector((state: RootState) => state.formulaBarVisible).value;
    const toolBarVisible = useSelector((state: RootState) => state.toolBarVisible).value;
    const [activeCol, setActiveCol] = useState<string | null>(null);
    const [activeRow, setActiveRow] = useState<string | null>(null);
    const isMouseDown = useRef<boolean>(false);

    const mouseMoveHorizontalEventHandler = useCallback((e: MouseEvent) => {
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
            let offsetBottom = document.getElementById("row" + globals.rows)?.getBoundingClientRect().bottom
            offsetBottom = offsetBottom ? offsetBottom : 0
            element.style.height = (offsetBottom - (60 + 40 + 35)).toString() + "px"
            element.style.backgroundColor = 'rgb(203,213,225,1)'
        }
    }, [activeCol]);

    const mouseMoveVerticalEventHandler = useCallback((e: MouseEvent) => {
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

    const clearSelectedCells = useCallback(() => {
        for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
            for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                const id = String.fromCharCode(j) + i.toString();
                let elem = document.getElementById(id);
                if (elem) {
                    elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].BackGroundColor;
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
    }, []);

    const mouseDownEventHandler = useCallback((e: MouseEvent) => {
        const comment = document.getElementById("comment") as HTMLDivElement;
        comment.style.display = "none";
        const note = document.getElementById("note") as HTMLDivElement;
        note.style.display = "none";
        if (e.button === 2) {
            return;
        }
        const contextmenu = document.getElementById("contextmenu") as HTMLDivElement;
        contextmenu.style.display = "none";
        clearSelectedCells();
        if (e.target && (e.target as HTMLDivElement).id && /^[A-Z]\d+$/.test((e.target as HTMLDivElement).id)) {
            globals.selectStart = (e.target as HTMLDivElement).id
            globals.selectEnd = (e.target as HTMLDivElement).id

            if (globals.selectEnd === globals.selectStart) {
                dispatch(setNameBoxValue(globals.selectStart))
            } else {
                dispatch(setNameBoxValue(String.fromCharCode(Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0))) + Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))).toString() + ":" + String.fromCharCode(Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0))) + Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))).toString()))
            }
            (e.target as HTMLDivElement).style.borderWidth = '3px';
            (e.target as HTMLDivElement).style.borderColor = '#1a73e8';
        }
        isMouseDown.current = true;
    }, [dispatch, clearSelectedCells]);

    const mouseOverEventHandler = useCallback((e: MouseEvent) => {
        if (isMouseDown.current) {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let elem = document.getElementById(id);
                    if (elem) {
                        elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].BackGroundColor;
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
            if (e.target && (e.target as HTMLDivElement).id && /^[A-Z]\d+$/.test((e.target as HTMLDivElement).id)) {
                globals.selectEnd = (e.target as HTMLDivElement).id;

                if (globals.selectEnd === globals.selectStart) {
                    dispatch(setNameBoxValue(globals.selectStart))
                } else {
                    dispatch(setNameBoxValue(String.fromCharCode(Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0))) + Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))).toString() + ":" + String.fromCharCode(Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0))) + Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))).toString()))
                }
            }
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
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
    }, [dispatch]);

    const keyDownEventHandler = useCallback((e: KeyboardEvent) => {
        if ((e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "ArrowLeft" || e.key === "ArrowRight") && e.target && (e.target as HTMLDivElement).id) {
            clearSelectedCells();
            const currentElementId = (e.target as HTMLDivElement).id
            let elem = document.getElementById(currentElementId);
            if (elem) {
                elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[currentElementId].BackGroundColor ? globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[currentElementId].BackGroundColor : "white";
                elem.style.borderBottomWidth = '1px';
                elem.style.borderRightWidth = '1px';
                elem.style.borderTopWidth = '0px'
                elem.style.borderLeftWidth = '0px'
                elem.style.borderStyle = 'solid';
                elem.style.borderColor = '#E1E1E1'
            }
            elem = document.getElementById(getAdjacentID(currentElementId, e.key))
            if (elem) {
                elem.style.borderWidth = '3px';
                elem.style.borderColor = '#1a73e8';
                elem.focus();
                globals.selectStart = elem.id
                globals.selectEnd = elem.id
            }
            dispatch(setSelectStart({
                id: getAdjacentID(currentElementId, e.key),
                bottom: 0,
                left: 0,
                right: 0,
                text: "",
                top: 0,
                display: "none"
            }))
        }

        if (e.key === "Control") {
            globals.ctrlDown = true;
        }

        if (globals.ctrlDown && e.key === "c") {
            e.preventDefault();
            globals.copyStart = globals.selectStart;
            globals.copyEnd = globals.selectEnd;
            globals.cutStart = null;
            globals.cutEnd = null;
        }

        if (globals.ctrlDown && e.key === "x") {
            e.preventDefault();
            globals.cutStart = globals.selectStart;
            globals.cutEnd = globals.selectEnd;
            globals.copyStart = null;
            globals.copyEnd = null;
        }

        if (globals.ctrlDown && e.key === "z") {
            e.preventDefault();
            if (globals.undoStack.length) {
                globals.undoStack[globals.undoStack.length - 1].Inverse()
                globals.redoStack.push(globals.undoStack.pop() as Command);
            }
        }

        if (globals.ctrlDown && e.key === "y") {
            e.preventDefault();
            if (globals.redoStack.length) {
                globals.redoStack[globals.redoStack.length - 1].Action()
                globals.undoStack.push(globals.redoStack.pop() as Command);
            }
        }

        if (globals.ctrlDown && e.key === "v") {
            e.preventDefault();
            if (globals.copyStart !== null && globals.copyEnd !== null) {
                const width = Math.max(globals.copyStart.charCodeAt(0), globals.copyEnd.charCodeAt(0)) - Math.min(globals.copyStart.charCodeAt(0), globals.copyEnd.charCodeAt(0)) + 1;
                const length = Math.max(parseInt(globals.copyStart.substring(1)), parseInt(globals.copyEnd.substring(1))) - Math.min(parseInt(globals.copyStart.substring(1)), parseInt(globals.copyEnd.substring(1))) + 1;
                for (let j = 0; j < width; j++) {
                    for (let i = 0; i < length; i++) {
                        const x0 = parseInt(globals.copyStart.substring(1)) + i;
                        const y0 = globals.copyStart.charCodeAt(0) + j;
                        const x1 = parseInt(globals.selectStart.substring(1)) + i;
                        const y1 = globals.selectStart.charCodeAt(0) + j;
                        const id0 = String.fromCharCode(y0) + x0.toString();
                        const id1 = String.fromCharCode(y1) + x1.toString();
                        let elem0 = document.getElementById(id0) as HTMLTextAreaElement;
                        let elem1 = document.getElementById(id1) as HTMLTextAreaElement;
                        if (elem1 && elem0) {
                            elem1.value = elem0.value
                        }
                    }
                }
            }

            if (globals.cutStart !== null && globals.cutEnd !== null) {
                const width = Math.max(globals.cutStart.charCodeAt(0), globals.cutEnd.charCodeAt(0)) - Math.min(globals.cutStart.charCodeAt(0), globals.cutEnd.charCodeAt(0)) + 1;
                const length = Math.max(parseInt(globals.cutStart.substring(1)), parseInt(globals.cutEnd.substring(1))) - Math.min(parseInt(globals.cutStart.substring(1)), parseInt(globals.cutEnd.substring(1))) + 1;
                for (let j = 0; j < width; j++) {
                    for (let i = 0; i < length; i++) {
                        const x0 = parseInt(globals.cutStart.substring(1)) + i;
                        const y0 = globals.cutStart.charCodeAt(0) + j;
                        const x1 = parseInt(globals.selectStart.substring(1)) + i;
                        const y1 = globals.selectStart.charCodeAt(0) + j;
                        const id0 = String.fromCharCode(y0) + x0.toString();
                        const id1 = String.fromCharCode(y1) + x1.toString();
                        let elem0 = document.getElementById(id0) as HTMLTextAreaElement;
                        let elem1 = document.getElementById(id1) as HTMLTextAreaElement;
                        if (elem1 && elem0) {
                            elem1.value = elem0.value
                            elem0.value = ""
                        }
                    }
                }

                globals.cutStart = null;
                globals.cutEnd = null;
            }
            globals.saved = false
            dispatch(setSaved(STATUS.UNSAVED))
        }

        if (e.key === "Delete") {
            for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                    const id = String.fromCharCode(j) + i.toString();
                    let elem = document.getElementById(id) as HTMLTextAreaElement;
                    if (elem) {
                        elem.value = ""
                    }
                }
            }
            globals.saved = false
            dispatch(setSaved(STATUS.UNSAVED))
        }
    }, [dispatch, clearSelectedCells]);

    const keyUpEventHandler = useCallback((e: KeyboardEvent) => {
        if (e.key === "Control") {
            globals.ctrlDown = false;
        }
    }, []);

    const mouseUpEventHandler = useCallback(() => {
        isMouseDown.current = false;
        if (activeCol !== null) {
            let element = document.getElementById("colModifier" + activeCol)?.style
            if (element) {
                element.height = '100%'
                element.backgroundColor = ''
            }
            setActiveCol(null);
            document.getElementById("cellgrid")?.removeEventListener("mouseup", mouseUpEventHandler);
        }

        if (activeRow !== null) {
            let element = document.getElementById("rowModifier" + activeRow)?.style
            if (element) {
                element.width = '100%'
                element.backgroundColor = ''
            }
            setActiveRow(null);
            document.getElementById("cellgrid")?.removeEventListener("mouseup", mouseUpEventHandler);

        }
    }, [activeCol, activeRow])

    const contextMenuEventHandler = useCallback((e: MouseEvent) => {
        e.preventDefault();
        const { clientX: mouseX, clientY: mouseY } = e;
        const contextMenu = document.getElementById("contextmenu") as HTMLDivElement;
        contextMenu.style.display = "block"
        contextMenu.style.zIndex = "1000"
        contextMenu.style.position = "absolute"
        // left case
        if (Math.abs(mouseX - window.innerWidth) < 250) {
            contextMenu.style.left = mouseX - 250 + "px"
        } else {
            contextMenu.style.left = mouseX + "px"
        }

        // bottom case
        if (Math.abs(mouseY - window.innerHeight) < 200) {
            contextMenu.style.top = mouseY - 200 + "px"
        } else {
            contextMenu.style.top = mouseY + "px"
        }
    }, [])

    const removeListeners = useCallback(() => {
        document.removeEventListener("keyup", keyUpEventHandler)
        document.removeEventListener("keydown", keyDownEventHandler);
        document.getElementById("cellgrid")?.removeEventListener("mousedown", mouseDownEventHandler);
        document.getElementById("cellgrid")?.removeEventListener("mouseover", mouseOverEventHandler);
        document.getElementById("cellgrid")?.removeEventListener("mouseup", mouseUpEventHandler);
        document.getElementById("cellgrid")?.removeEventListener("contextmenu", contextMenuEventHandler)
        document.removeEventListener("mousemove", mouseMoveHorizontalEventHandler);
        document.removeEventListener("mousemove", mouseMoveVerticalEventHandler);
    }, [contextMenuEventHandler, keyDownEventHandler, keyUpEventHandler, mouseDownEventHandler, mouseMoveHorizontalEventHandler, mouseMoveVerticalEventHandler, mouseOverEventHandler, mouseUpEventHandler]);

    useEffect(() => {
        let elem = document.getElementById(globals.selectStart);
        if (elem) {
            elem.style.borderWidth = '3px';
            elem.style.borderColor = '#1a73e8';
            dispatch(setNameBoxValue(globals.selectStart))
        }

        document.addEventListener("keyup", keyUpEventHandler)
        document.addEventListener("keydown", keyDownEventHandler);
        document.getElementById("cellgrid")?.addEventListener("mousedown", mouseDownEventHandler);
        document.getElementById("cellgrid")?.addEventListener("mouseover", mouseOverEventHandler);
        document.getElementById("cellgrid")?.addEventListener("mouseup", mouseUpEventHandler);
        document.getElementById("cellgrid")?.addEventListener("contextmenu", contextMenuEventHandler)

        if (activeCol !== null) {
            document.addEventListener("mousemove", mouseMoveHorizontalEventHandler);
            document.addEventListener("mouseup", mouseUpEventHandler);
        }

        if (activeRow !== null) {
            document.addEventListener("mousemove", mouseMoveVerticalEventHandler);
            document.addEventListener("mouseup", mouseUpEventHandler);
        }

        return () => {
            removeListeners();
        };
    }, [activeCol, activeRow, mouseUpEventHandler, keyUpEventHandler, contextMenuEventHandler, keyDownEventHandler, mouseDownEventHandler, mouseOverEventHandler, removeListeners, dispatch, mouseMoveHorizontalEventHandler, mouseMoveVerticalEventHandler]);

    const rowsNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < globals.rows; i++) {
        rowsNumbers.push((
            <div
                id={"row" + (i + 1).toString()}
                data-testid={"row" + (i + 1).toString()}
                key={(i + 1).toString()}
                className="h-[30px] flex w-full justify-center align-middle border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] font-sans relative">
                <span className='mt-auto mb-auto'>{i + 1}</span>
                <div
                    id={"rowModifier" + (i + 1).toString()}
                    data-testid={"rowModifier" + (i + 1).toString()}
                    onMouseOver={(e) => {
                        e.currentTarget.style.zIndex = '5000'
                        e.currentTarget.style.width = '100vw'
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
                    className={`block absolute w-full cursor-row-resize h-[3px] bottom-[-1.5px] left-0 z-[5000]`}
                >
                </div>
            </div>
        ));
    }

    const colNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < globals.columns; i++) {
        colNumbers.push((
            <div
                id={"column" + String.fromCharCode(65 + i)}
                data-testid={"column" + String.fromCharCode(65 + i)}
                key={String.fromCharCode(65 + i)}
                className="min-w-[80px] h-full text-center border-b-[1px] border-t-[1px] border-r-[1px] border-solid border-[#E1E1E1] relative flex justify-center"
            >
                <span className='mt-auto mb-auto'>{String.fromCharCode(65 + i)}</span>
                <div
                    id={"colModifier" + String.fromCharCode(65 + i)}
                    data-testid={"colModifier" + String.fromCharCode(65 + i)}
                    onMouseOver={(e) => {
                        let offsetBottom = document.getElementById("row" + globals.rows)?.getBoundingClientRect().bottom
                        offsetBottom = offsetBottom ? offsetBottom : 0
                        e.currentTarget.style.height = (offsetBottom - (60 + 40 + 35)).toString() + "px"
                        e.currentTarget.style.backgroundColor = 'rgb(203,213,225,1)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.height = '100%'
                        e.currentTarget.style.backgroundColor = ''
                    }}
                    onMouseDown={(e) => {
                        let offsetBottom = document.getElementById("row" + globals.rows)?.getBoundingClientRect().bottom
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
    for (let j = 0; j < globals.columns; j++) {
        const x: Array<React.ReactNode> = [];
        for (let i = 0; i < globals.rows; i++) {
            x.push(
                <Cell i={i} j={j} key={String.fromCharCode(65 + j) + (i + 1).toString()} />
            );
        }
        cells.push((
            <div
                className="min-w-[80px] bg-inherit"
                key={String.fromCharCode(65 + j)}
                id={"cellcontainer" + String.fromCharCode(65 + j)}
                data-testid={"cellcontainer" + String.fromCharCode(65 + j)}
            >
                {x}
            </div>
        ));
    }

    return (
        <>
            <ContextMenu />
            <Comment />
            <Note />
            <FormulaList />
            <div data-testid="cellgrid" id="cellgrid" className={`bg-[#FFFFFF] ${formulaBarVisible && toolBarVisible ? 'h-[calc(100vh-60px-40px-35px-37px)]' : !formulaBarVisible && toolBarVisible ? 'h-[calc(100vh-60px-40px-37px)]' : formulaBarVisible && !toolBarVisible ? 'h-[calc(100vh-60px-35px-37px)]' : 'h-[calc(100vh-60px-37px)]'} relative overflow-scroll p-0 m-0 hover:cursor-cell`}>
                <div data-testid="greycell" className="fixed bg-slate-400 h-[30px] w-[46px] z-20 inline-block"></div>
                <div data-testid="columns" className="h-[30px] ml-[46px] flex bg-inherit z-10 sticky top-0">
                    {
                        colNumbers
                    }
                </div>
                <div data-testid="rows" className="sticky left-0 bg-inherit w-[46px] inline-block float-left z-10">
                    {
                        rowsNumbers
                    }
                </div>
                <div data-testid="cellbox" className="ml-[46px] flex z-10">
                    {
                        cells
                    }
                </div>
            </div>
        </>
    );
}


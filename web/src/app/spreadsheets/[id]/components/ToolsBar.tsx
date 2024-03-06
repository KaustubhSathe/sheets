import { AiOutlineSearch } from 'react-icons/ai'
import { LuUndo2, LuRedo2, LuPrinter, LuMinus, LuPlus } from 'react-icons/lu'
import { BiBold, BiItalic, BiStrikethrough, BiFontColor, BiColorFill } from 'react-icons/bi'
import globals from '@/app/lib/globals/globals';
import { Command } from '@/app/types/Command';

export default function ToolsBar() {
    return (
        <div className="bg-[#EDF2FA] h-[40px] flex overflow-x-scroll overflow-y-hidden" id='toolsbar'>
            <div className="relative h-[100%]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <AiOutlineSearch className="mt-auto mb-auto mr-[8px] w-[20px] h-[20px]" />
                </div>
                <input type="text" className="pt-[4px] pb-[4px] pl-[28px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[200px] outline-none" placeholder="Search Commands" />
            </div>
            <button onClick={() => {
                if (globals.undoStack.length) {
                    globals.undoStack[globals.undoStack.length - 1].Inverse()
                    globals.redoStack.push(globals.undoStack.pop() as Command);
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuUndo2 />
            </button>
            <button onClick={() => {
                if (globals.redoStack.length) {
                    globals.redoStack[globals.redoStack.length - 1].Action()
                    globals.undoStack.push(globals.redoStack.pop() as Command);
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuRedo2 />
            </button>
            <button onClick={() => {
                window.print()
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuPrinter />
            </button>
            <select onClick={(e) => {
                // @ts-ignore
                document.body.style.zoom = (e.target as HTMLSelectElement).value
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit">
                <option value={1}>100%</option>
                <option value={0.9}>90%</option>
                <option value={0.8}>80%</option>
                <option value={0.7}>70%</option>
                <option value={0.6}>60%</option>
                <option value={0.5}>50%</option>
                <option value={0.4}>40%</option>
                <option value={0.3}>30%</option>
                <option value={0.2}>20%</option>
                <option value={0.1}>10%</option>
            </select>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <select onClick={(e) => {
                const fontFamily = (e.target as HTMLSelectElement).value
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let elem = document.getElementById(id) as HTMLTextAreaElement;
                        if (elem) {
                            elem.style.fontFamily = fontFamily
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontFamily = fontFamily
                        }
                    }
                }
            }} data-testid="fontSelector" className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px] outline-none hover:cursor-pointer bg-inherit" id="fontSelector">
                <option value={"Arial"}>Arial </option>
                <option value={"Verdana"}>Verdana</option>
                <option value={"Times New Roman"}>Times New Roman</option>
                <option value={"Garamond"}>Garamond</option>
                <option value={"Roboto"}>Roboto</option>
            </select>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <button onClick={() => {
                const elem = document.getElementById("fontSizeSelector") as HTMLInputElement
                if (elem) {
                    elem.value = Math.max(0, (parseInt(elem.value)) - 1).toString()
                }
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let cell = document.getElementById(id) as HTMLTextAreaElement;
                        if (cell) {
                            cell.style.fontSize = elem.value + "px"
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontSize = parseInt(elem.value)
                        }
                    }
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuMinus />
            </button>
            <input onChange={(e) => {
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let cell = document.getElementById(id) as HTMLTextAreaElement;
                        if (cell) {
                            cell.style.fontSize = e.currentTarget.value + "px"
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontSize = parseInt(e.currentTarget.value)
                        }
                    }
                }
            }} id="fontSizeSelector" type="number" className="pt-[4px] pb-[4px] pl-[4px] pr-[8px] mt-[5px] mb-[5px] ml-[8px] text-sm text-gray-900 border border-gray-300 rounded-lg w-[60px] outline-none" defaultValue={10} />
            <button onClick={() => {
                const elem = document.getElementById("fontSizeSelector") as HTMLInputElement
                if (elem) {
                    elem.value = Math.max(0, (parseInt(elem.value)) + 1).toString()
                }
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let cell = document.getElementById(id) as HTMLTextAreaElement;
                        if (cell) {
                            cell.style.fontSize = elem.value + "px"
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontSize = parseInt(elem.value)
                        }
                    }
                }
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <LuPlus />
            </button>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <button onClick={(e) => {
                const elem = document.getElementById("boldSelector") as HTMLButtonElement
                if (elem) {
                    elem.style.backgroundColor = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "inherit" : "rgb(211, 227, 253)"
                }
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let cell = document.getElementById(id) as HTMLTextAreaElement;
                        if (cell) {
                            cell.style.fontWeight = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "bold" : "normal"
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontWeight = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "bold" : "normal"
                        }
                    }
                }
            }} id="boldSelector" data-testid="boldSelector" className="ml-[8px] hover:bg-slate-200 rounded-lg hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiBold />
            </button>

            <button onClick={(e) => {
                const elem = document.getElementById("italicSelector") as HTMLButtonElement
                if (elem) {
                    elem.style.backgroundColor = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "inherit" : "rgb(211, 227, 253)"
                }
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let cell = document.getElementById(id) as HTMLTextAreaElement;
                        if (cell) {
                            cell.style.fontStyle = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "italic" : "normal"
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontStyle = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "italic" : "normal"
                        }
                    }
                }
            }} id="italicSelector" data-testid="italicSelector" className="ml-[8px] rounded-lg hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiItalic />
            </button>

            <button onClick={(e) => {
                const elem = document.getElementById("strikethroughSelector") as HTMLButtonElement
                if (elem) {
                    elem.style.backgroundColor = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "inherit" : "rgb(211, 227, 253)"
                }
                for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                    for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                        const id = String.fromCharCode(j) + i.toString();
                        let cell = document.getElementById(id) as HTMLTextAreaElement;
                        if (cell) {
                            cell.style.textDecoration = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "line-through" : "none"
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextDecoration = elem.style.backgroundColor === "rgb(211, 227, 253)" ? "line-through" : "none"
                        }
                    }
                }
            }} id="strikethroughSelector" data-testid="strikethroughSelector" className="ml-[8px] rounded-lg hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiStrikethrough />
            </button>

            <button onClick={() => {
                const fontColorPicker = document.getElementById("fontColorPicker") as HTMLInputElement
                fontColorPicker.click()
            }} className="ml-[8px] hover:bg-slate-200 relative hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiFontColor />
                <input onChange={(e) => {
                    const color = e.currentTarget.value
                    for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                        for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                            const id = String.fromCharCode(j) + i.toString();
                            let cell = document.getElementById(id) as HTMLTextAreaElement;
                            if (cell) {
                                cell.style.color = color
                                globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontColor = color
                            }
                        }
                    }
                }} id='fontColorPicker' className='inline-block float-right w-0 h-0' type='color' />
            </button>

            <div className="h-[20px] w-[2px] mt-auto mb-auto ml-[8px] border-solid bg-slate-400"></div>

            <button onClick={() => {
                const backgroundColorPicker = document.getElementById("backgroundColorPicker") as HTMLInputElement
                backgroundColorPicker.click()
            }} className="ml-[8px] hover:bg-slate-200 hover:rounded-md mt-[4px] mb-[4px] p-[6px]">
                <BiColorFill />
                <input onChange={(e) => {
                    const color = e.currentTarget.value
                    for (let j = Math.min(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j <= Math.max(globals.selectStart.charCodeAt(0), globals.selectEnd.charCodeAt(0)); j++) {
                        for (let i = Math.min(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i <= Math.max(parseInt(globals.selectStart.substring(1)), parseInt(globals.selectEnd.substring(1))); i++) {
                            const id = String.fromCharCode(j) + i.toString();
                            let cell = document.getElementById(id) as HTMLTextAreaElement;
                            if (cell) {
                                cell.style.backgroundColor = color
                                globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].BackGroundColor = color
                            }
                        }
                    }
                }} id='backgroundColorPicker' className='inline-block float-right w-0 h-0' type='color' />
            </button>
        </div>
    );
}
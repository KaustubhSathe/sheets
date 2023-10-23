'use client'

import { setValue } from '../../../lib/redux/nameBoxSlice'
import { setValue as setValueFormulaBar } from '../../../lib/redux/formulaBarSlice'
import { useDispatch } from 'react-redux'

export default function CellsGrid() {
    const dispatch = useDispatch()
    
    const rowsNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < 1000; i++) {
        rowsNumbers.push((
            <div
                key={(i + 1).toString()}
                className="h-[30px] w-full flex justify-center align-middle border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] font-sans">
                {i + 1}
            </div>
        ));
    }

    const colNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < 50; i++) {
        colNumbers.push((
            <div
                key={String.fromCharCode(65 + i)}
                className="min-w-[66px] h-full text-center border-b-[1px] border-t-[1px] border-r-[1px] border-solid border-[#E1E1E1]">
                {String.fromCharCode(65 + i)}
            </div>
        ));
    }

    const cells: Array<React.ReactNode> = [];
    for (let i = 0; i < 500; i++) {
        const x: Array<React.ReactNode> = [];
        for (let j = 0; j < 50; j++) {
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
                        key={String.fromCharCode(65 + j) + (i + 1).toString()}
                    ></div>
                    <div className="absolute -z-10 bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full peer-focus:bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
                    </div>
                </div>
            );
        }
        cells.push((
            <div className="h-[30px] flex bg-inherit" key={(i + 1).toString()}>
                {x}
            </div>
        ));
    }

    return (
        <div className="bg-[#FFFFFF] h-[calc(100vh-60px-40px-35px-37px)] relative overflow-scroll p-0 m-0">
            <div className="fixed bg-[#747d8c] h-[30px] w-[46px] z-10"></div>
            <div className="sticky mt-[30px] left-0 bg-inherit w-[46px] overflow-x-hidden overflow-y-hidden">
                {
                    rowsNumbers
                }
            </div>
            <div className="hover:cursor-cell absolute top-0 left-[46px] h-[calc(100vh-60px-40px-35px-37px)] w-full bg-inherit m-0">
                <div className="h-[30px] flex bg-inherit">
                    {
                        colNumbers
                    }
                </div>
                {
                    cells
                }
            </div>
        </div>
    );
}


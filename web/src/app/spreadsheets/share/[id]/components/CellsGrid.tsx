import globals from '@/app/lib/globals/globals';
import Cell from './Cell';

export default function CellsGrid() {
    const rowsNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < globals.rows; i++) {
        rowsNumbers.push((
            <div
                id={"row" + (i + 1).toString()}
                key={(i + 1).toString()}
                className="h-[30px] w-full flex justify-center align-middle border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] font-sans relative">
                <span className='mt-auto mb-auto'>{i + 1}</span>
                <div
                    id={"rowModifier" + (i + 1).toString()}
                    className={`block absolute w-full cursor-row-resize h-[3px] bottom-[-1.5px] left-0 z-100000`}
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
                key={String.fromCharCode(65 + i)}
                className="min-w-[80px] h-full text-center border-b-[1px] border-t-[1px] border-r-[1px] border-solid border-[#E1E1E1] relative flex justify-center"
            >
                <span className='mt-auto mb-auto'>{String.fromCharCode(65 + i)}</span>
                <div
                    id={"colModifier" + String.fromCharCode(65 + i)}
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
            <div className="min-w-[80px] bg-inherit" key={String.fromCharCode(65 + j)} id={"cellcontainer" + String.fromCharCode(65 + j)}>
                {x}
            </div>
        ));
    }

    return (
        <>
            <div id="cellgrid" className={`bg-[#FFFFFF] h-[calc(100vh-37px)] relative overflow-scroll p-0 m-0 hover:cursor-cell`}>
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
        </>
    );
}


"use client";

export default function CellsGrid() {
    const rowsNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < 1000; i++) {
        rowsNumbers.push((
            <div className="h-[30px] w-[46px] flex justify-center align-middle">
                {i + 1}
            </div>
        ));
    }

    const colNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < 26; i++) {
        colNumbers.push((
            <div className="h-[30px] w-[46px] flex justify-center align-middle text-center">
                {String.fromCharCode(65 + i)}
            </div>
        ));
    }

    const cells: Array<React.ReactNode> = [];
    for (let i = 0; i < 1000; i++) {
        const x: Array<React.ReactNode> = [];
        for (let j = 0; j < 26; j++) {
            let cell = <div className={`h-[30px] w-[46px] border border-[1px] border-solid border-amber-600 contenteditable='true' spellcheck='false' rid=${i} cid=${j}`}></div>;
            x.push(cell);
        }
        cells.push((
            <div className="flex">
                {x}
            </div>
        ));
    }

    return (
        <div className="bg-[#FFFFFF] h-[calc(100vh-60px-40px-35px-37px)] relative overflow-scroll p-0 m-0">
            <div className="fixed bg-[#747d8c] h-[30px] w-[46px] z-10"></div>
            <div className="sticky mt-[30px] left-0 bg-slate-200 w-[46px]">
                {
                    rowsNumbers
                }
            </div>
            <div className="absolute top-0 left-[46px] w-[100%] h-[30px] bg-orange-500 m-0">
                <div className="flex sticky top-0 left-[46px] bg-green-700">
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


"use client";

export default function CellsGrid() {
    const rowsNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < 1000; i++) {
        rowsNumbers.push((
            <div className="h-[30px] w-full flex justify-center align-middle border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] font-sans">
                {i + 1}
            </div>
        ));
    }

    const colNumbers: Array<React.ReactNode> = [];
    for (let i = 0; i < 50; i++) {
        colNumbers.push((
            <div className="min-w-[66px] h-full inline-block text-center border-b-[1px] border-t-[1px] border-r-[1px] border-solid border-[#E1E1E1]">
                {String.fromCharCode(65 + i)}
            </div>
        ));
    }

    const cells: Array<React.ReactNode> = [];
    for (let i = 0; i < 1000; i++) {
        const x: Array<React.ReactNode> = [];
        for (let j = 0; j < 36; j++) {
            let cell = <div className={`pl-[4px] outline-none break-words break-all h-full min-w-[66px] inline-block border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] rid=${i} cid=${j}`}
                contentEditable={true}
                spellCheck={false}
            ></div>;
            x.push(cell);
        }
        cells.push((
            <div className="h-[30px] overflow-x-hidden overflow-y-hidden">
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
            <div className="absolute top-0 left-[46px] w-[100%] h-[30px] bg-inherit m-0">
                <div className="h-[30px] flex top-0 left-[46px] bg-inherit">
                    {
                        colNumbers.map(x => x)
                    }
                </div>
                {
                    cells
                }
            </div>
        </div>
    );
}


import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import store from '@/app/lib/redux/store'
import CellsGrid, { getAdjacentID } from './CellsGrid'

describe('<CellsGrid/>', () => {
    it('tests getAdjacentID function', () => {
        const down = getAdjacentID("J65", "ArrowDown")
        expect(down).toBe("J66")
        const up = getAdjacentID("J65", "ArrowUp")
        expect(up).toBe("J64")
        const left = getAdjacentID("J65", "ArrowLeft")
        expect(left).toBe("I65")
        const right = getAdjacentID("J65", "ArrowRight")
        expect(right).toBe("K65")
    })

    it('checks CellGrid attributes', () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const grid = screen.getByTestId("cellgrid")
        expect(grid).toHaveClass("bg-[#FFFFFF]")
        expect(grid).toHaveClass("h-[calc(100vh-60px-40px-35px-37px)]")
        expect(grid).toHaveClass("relative")
        expect(grid).toHaveClass("overflow-scroll")
        expect(grid).toHaveClass("p-0")
        expect(grid).toHaveClass("m-0")
        expect(grid).toHaveClass("hover:cursor-cell")
        expect(grid.childNodes).toHaveLength(4)
    })

    it('checks greycell attributes', () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const greycell = screen.getByTestId("greycell")
        expect(greycell).toHaveClass("fixed")
        expect(greycell).toHaveClass("bg-slate-400")
        expect(greycell).toHaveClass("h-[30px]")
        expect(greycell).toHaveClass("w-[46px]")
        expect(greycell).toHaveClass("z-20")
        expect(greycell).toHaveClass("inline-block")
    })

    it("checks column strip attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const columns = screen.getByTestId("columns")
        expect(columns).toHaveClass("bg-inherit")
        expect(columns).toHaveClass("flex")
        expect(columns).toHaveClass("ml-[46px]")
        expect(columns).toHaveClass("h-[30px]")
        expect(columns.childNodes).toHaveLength(26)
    })

    it("checks column cell attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const columnCell = screen.getByTestId("column" + String.fromCharCode(65 + 12))
        expect(columnCell).toHaveClass("min-w-[80px]");
        expect(columnCell).toHaveClass("h-full");
        expect(columnCell).toHaveClass("text-center");
        expect(columnCell).toHaveClass("border-b-[1px]");
        expect(columnCell).toHaveClass("border-t-[1px]");
        expect(columnCell).toHaveClass("border-r-[1px]")
        expect(columnCell).toHaveClass("border-solid");
        expect(columnCell).toHaveClass("border-[#E1E1E1]");
        expect(columnCell).toHaveClass("relative");
        expect(columnCell).toHaveClass("flex");
        expect(columnCell).toHaveClass("justify-center");
        expect(columnCell.childNodes).toHaveLength(2);
        expect(columnCell.childNodes[0]).toHaveClass("mt-auto");
        expect(columnCell.childNodes[0]).toHaveClass("mb-auto");
    })

    it("checks column modifier attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const columnModifier = screen.getByTestId("colModifier" + String.fromCharCode(65 + 12))
        expect(columnModifier).toHaveClass("block");
        expect(columnModifier).toHaveClass("absolute");
        expect(columnModifier).toHaveClass("h-full");
        expect(columnModifier).toHaveClass("cursor-col-resize");
        expect(columnModifier).toHaveClass("w-[3px]");
        expect(columnModifier).toHaveClass("right-[-1.5px]");
        expect(columnModifier).toHaveClass("z-30");
        expect(columnModifier).toHaveClass("top-0");
    })

    it("checks column modifier onmouseover behaviour", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const columnModifier = screen.getByTestId("colModifier" + String.fromCharCode(65 + 12))
        fireEvent.mouseOver(columnModifier, {})
        expect(columnModifier).toHaveStyle("backgroundColor: rgb(203,213,225,1);")
    })

    it("checks column modifier onmouseleave behavior", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const columnModifier = screen.getByTestId("colModifier" + String.fromCharCode(65 + 12));
        fireEvent.mouseLeave(columnModifier, {});
        expect(columnModifier).toHaveStyle("height: 100%; backgroundColor: ;")
    })

    it("checks row strip attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const rows = screen.getByTestId("rows")
        expect(rows).toHaveClass("sticky")
        expect(rows).toHaveClass("left-0")
        expect(rows).toHaveClass("bg-inherit")
        expect(rows).toHaveClass("w-[46px]")
        expect(rows).toHaveClass("inline-block")
        expect(rows).toHaveClass("float-left")
        expect(rows).toHaveClass("z-10")
    })

    it("checks row cell attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const rowCell = screen.getByTestId("row" + (12 + 1).toString())
        expect(rowCell).toHaveClass("h-[30px]")
        expect(rowCell).toHaveClass("w-full")
        expect(rowCell).toHaveClass("flex")
        expect(rowCell).toHaveClass("justify-center")
        expect(rowCell).toHaveClass("align-middle")
        expect(rowCell).toHaveClass("border-b-[1px]")
        expect(rowCell).toHaveClass("border-r-[1px]")
        expect(rowCell).toHaveClass("border-solid")
        expect(rowCell).toHaveClass("border-[#E1E1E1]")
        expect(rowCell).toHaveClass("font-sans")
        expect(rowCell).toHaveClass("relative")
        expect(rowCell.childNodes).toHaveLength(2)
        expect(rowCell.childNodes[0]).toHaveClass("mt-auto")
        expect(rowCell.childNodes[0]).toHaveClass("mb-auto")
    })

    it("checks row modifier attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const rowModifier = screen.getByTestId("rowModifier" + (12 + 1).toString())
        expect(rowModifier).toHaveClass("block")
        expect(rowModifier).toHaveClass("absolute")
        expect(rowModifier).toHaveClass("w-full")
        expect(rowModifier).toHaveClass("cursor-row-resize")
        expect(rowModifier).toHaveClass("h-[3px]")
        expect(rowModifier).toHaveClass("bottom-[-1.5px]")
        expect(rowModifier).toHaveClass("left-0")
        expect(rowModifier).toHaveClass("z-[5000]")
    })

    it("checks row modifier onmouseover behaviour", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const rowModifier = screen.getByTestId("rowModifier" + (12 + 1).toString())
        fireEvent.mouseOver(rowModifier, {})
        expect(rowModifier).toHaveStyle("zIndex: 5000;")
        expect(rowModifier).toHaveStyle("width: 100vw;")
        expect(rowModifier).toHaveStyle("backgroundColor: rgb(203,213,225,1);")
    })

    it("checks row modifier onmouseleave behaviour", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const rowModifier = screen.getByTestId("rowModifier" + (12 + 1).toString())
        fireEvent.mouseLeave(rowModifier, {})
        expect(rowModifier).toHaveStyle("width: 100%;")
        expect(rowModifier).toHaveStyle("backgroundColor: ;")
    })

    it("checks row modifier onmousedown behavior", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const rowModifier = screen.getByTestId("rowModifier" + (12 + 1).toString())
        fireEvent.mouseDown(rowModifier, {})
        expect(rowModifier).toHaveStyle("width: 100vw;")
        expect(rowModifier).toHaveStyle("backgroundColor: rgb(203,213,225,1);")
    })

    it("checks cellbox attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const cellbox = screen.getByTestId("cellbox")
        expect(cellbox).toHaveClass("ml-[46px]")
        expect(cellbox).toHaveClass("flex")
        expect(cellbox).toHaveClass("z-10")
    })

    it("checks cellcontainer attributes", () => {
        render(
            <Provider store={store}>
                <CellsGrid />
            </Provider>
        )
        const cellbox = screen.getByTestId("cellcontainer" + String.fromCharCode(65 + 12))
        expect(cellbox).toHaveClass("min-w-[80px]")
        expect(cellbox).toHaveClass("bg-inherit")
    })
})
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import Cell from './Cell'
import { Provider } from 'react-redux'
import store from '@/app/lib/redux/store'
import ToolsBar from './ToolsBar'
import globals from '@/app/lib/globals/globals'
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
        expect(greycell).toHaveClass("z-10")
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
    })
})
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { fireEvent, render, screen } from '@testing-library/react'
import Cell from './Cell'
import { Provider } from 'react-redux'
import store from '@/app/lib/redux/store'
import ToolsBar from './ToolsBar'
import globals from '@/app/lib/globals/globals'

describe('Cell', () => {
    it('checks Cell wrapper has all required classes', () => {
        render(
            <Provider store={store}>
                <Cell i={1} j={23} />
            </Provider>
        )
        const wrapper = screen.getByTestId('cell-wrapper')
        expect(wrapper).toBeInTheDocument()
        expect(wrapper).toHaveClass("relative")
        expect(wrapper).toHaveClass("m-0")
        expect(wrapper).toHaveClass("w-full")
        expect(wrapper).toHaveClass(`rowbar-${(1 + 1).toString()}`)
        expect(wrapper).toHaveClass("h-[30px]")
        expect(wrapper).toHaveClass("hover:cursor-cell")
        expect(wrapper).toHaveClass("focus:cursor-text")
    })

    it('checks Cell wrapper has 3 child nodes', () => {
        render(
            <Provider store={store}>
                <Cell i={1} j={23} />
            </Provider>
        )
        const children = screen.getByTestId('cell-wrapper').childNodes
        expect(children).toHaveLength(3)
    })

    it('checks Cell textbox has required attributes', () => {
        const i = 1
        const j = 23
        const id = String.fromCharCode(65 + j) + (i + 1).toString()
        render(
            <Provider store={store}>
                <Cell i={i} j={j} />
            </Provider>
        )
        const textbox = screen.getByTestId('cell-textbox')
        expect(textbox).toHaveAttribute("id", id)
        expect(textbox).toHaveAttribute("spellcheck", "false")
        expect(textbox).toHaveClass("overflow-hidden")
        expect(textbox).toHaveClass("text-sm")
        expect(textbox).toHaveClass("peer")
        expect(textbox).toHaveClass("hover:cursor-cell")
        expect(textbox).toHaveClass("focus:cursor-text")
        expect(textbox).toHaveClass("overflow-x-clip")
        expect(textbox).toHaveClass("overflow-y-clip")
        expect(textbox).toHaveClass("p-[4px]")
        expect(textbox).toHaveClass("break-words")
        expect(textbox).toHaveClass("break-all")
        expect(textbox).toHaveClass("h-full")
        expect(textbox).toHaveClass("w-full")
        expect(textbox).toHaveClass("border-b-[1px]")
        expect(textbox).toHaveClass("border-r-[1px]")
        expect(textbox).toHaveClass("border-solid")
        expect(textbox).toHaveClass("border-[#E1E1E1]")
        expect(textbox).toHaveClass("outline-none")
        expect(textbox).toHaveClass("m-0")
        expect(textbox).toHaveClass("resize-none")
    })

    it('checks Cell textbox onfocus behavior', () => {
        const i = 1
        const j = 23
        const id = String.fromCharCode(65 + j) + (i + 1).toString()
        render(
            <Provider store={store}>
                <Cell i={i} j={j} />
                <ToolsBar />
            </Provider>
        )

        const textbox = screen.getByTestId('cell-textbox')
        fireEvent.focus(textbox, {})
        const fontSelector = screen.getByTestId("fontSelector") as HTMLSelectElement
        expect(fontSelector).toHaveValue(globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].FontFamily)
        const boldSelector = screen.getByTestId("boldSelector")
        expect(boldSelector).toHaveStyle("background-color: inherit;")
        const italicSelector = screen.getByTestId("italicSelector")
        expect(italicSelector).toHaveStyle("background-color: inherit;")
        const strikethroughSelector = screen.getByTestId("strikethroughSelector")
        expect(strikethroughSelector).toHaveStyle("background-color: inherit;")
        expect(globals.selectStart).toBe(id)
    })

    it("checks Cell textbox oninput behavior", () => {
        const i = 1
        const j = 23
        const id = String.fromCharCode(65 + j) + (i + 1).toString()
        render(
            <Provider store={store}>
                <Cell i={i} j={j} />
                <ToolsBar />
            </Provider>
        )

        const textbox = screen.getByTestId('cell-textbox') as HTMLTextAreaElement
        fireEvent.input(textbox, { target: { value: 'helloworld' } })
        expect(textbox).toHaveValue("helloworld")
        expect(globals.saved).toBe(false)
            
    })
})
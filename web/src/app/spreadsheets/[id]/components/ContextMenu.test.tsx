import '@testing-library/jest-dom'
import store from "@/app/lib/redux/store"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import Comment from "./Comment"
import { CommentsDialog } from './CommentsDialog'

describe("<ContextMenu />", () => {
    it("checks ContextMenu component attributes", () => {
        render(
            <Provider store={store}>
                <CommentsDialog setCommentsDialog={() => { }} />
            </Provider>
        )
        const contextmenu = screen.getByTestId("contextmenu")
        expect(contextmenu).toHaveClass("hidden w-[250px] bg-white shadow-lg shadow-slate-400")
        expect(contextmenu.childNodes).toHaveLength(5)
        expect(contextmenu.childNodes[0]).toHaveClass("flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]")
    })
})
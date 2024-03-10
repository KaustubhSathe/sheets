import '@testing-library/jest-dom'
import store from "@/app/lib/redux/store"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import Comment from "./Comment"
import { CommentsDialog } from './CommentsDialog'

describe("<CommentsDialog />", () => {
    it("checks CommentsDialog component attributes", () => {
        render(
            <Provider store={store}>
                <CommentsDialog setCommentsDialog={() => { }} />
            </Provider>
        )
        const commentsDialog = screen.getByTestId("commentsDialog")
        expect(commentsDialog).toHaveClass("absolute right-0 z-[2000] w-[20vw] h-[100vh] bg-white rounded-xl p-[24px] flex flex-col gap-2")
        expect(commentsDialog.childNodes).toHaveLength(3)
        expect(commentsDialog.childNodes[0]).toHaveClass("text-3xl font-roboto font-normal text-slate-700 block")
        expect(commentsDialog.childNodes[1]).toBeInstanceOf(HTMLHRElement)
        expect(commentsDialog.childNodes[2]).toHaveClass("overflow-y-scroll h-[95%]")
    })
})
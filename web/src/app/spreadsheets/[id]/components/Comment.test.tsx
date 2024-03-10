import '@testing-library/jest-dom'
import store from "@/app/lib/redux/store"
import { render, screen } from "@testing-library/react"
import { Provider } from "react-redux"
import Comment from "./Comment"

describe("<Comment />", () => {
    it("checks comment component attributes", () => {
        render(
            <Provider store={store}>
                <Comment />
            </Provider>
        )

        const comment = screen.getByTestId("comment")
        expect(comment).toHaveClass("w-[350px]")
        expect(comment).toHaveClass("hidden")
        expect(comment).toHaveClass("bg-white")
        expect(comment).toHaveClass("shadow-lg")
        expect(comment).toHaveClass("shadow-slate-400")
        expect(comment).toHaveClass("rounded-lg")
        expect(comment).toHaveClass("p-4")
        expect(comment.childNodes).toHaveLength(3)
        expect(comment.childNodes[0]).toHaveClass("overflow-y-scroll")
        expect(comment.childNodes[0]).toHaveClass("max-h-[300px]")
        expect(comment.childNodes[1]).toHaveClass("resize-none")
        expect(comment.childNodes[1]).toHaveClass("outline-none")
        expect(comment.childNodes[1]).toHaveClass("border-[1px]")
        expect(comment.childNodes[1]).toHaveClass("rounded-full")
        expect(comment.childNodes[1]).toHaveClass("pl-4")
        expect(comment.childNodes[1]).toHaveClass("pr-4")
        expect(comment.childNodes[1]).toHaveClass("pt-2")
        expect(comment.childNodes[1]).toHaveClass("pb-2")
        expect(comment.childNodes[1]).toHaveClass("mb-3")
        expect(comment.childNodes[1]).toHaveClass("mt-3")
        expect(comment.childNodes[1]).toHaveClass("border-black")
        expect(comment.childNodes[1]).toHaveClass("w-full")
        expect(comment.childNodes[2]).toHaveClass("flex")
        expect(comment.childNodes[2]).toHaveClass("justify-end")
        expect(comment.childNodes[2]).toHaveClass("gap-3")
        expect(comment.childNodes[2].childNodes[0]).toHaveClass("w-[75px] h-[36px] text-blue-700 font-semibold hover:rounded-full hover:bg-blue-100")
        expect(comment.childNodes[2].childNodes[1]).toHaveClass("mr-4 w-[100px] h-[36px] font-semibold text-gray-500 bg-gray-200 rounded-full")
    })
})
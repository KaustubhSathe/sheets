import { RootState } from "@/app/lib/redux/store"
import { Dispatch, SetStateAction } from "react"
import { useSelector } from "react-redux"
import { CommentCard } from "./Comment"

export function CommentsDialog({ setCommentsDialog }: { setCommentsDialog: Dispatch<SetStateAction<boolean>> }) {
    const comments = useSelector((state: RootState) => state.comments.value)

    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[2000] flex justify-center align-middle" onClick={() => setCommentsDialog(false)}>
            </div >
            <div
                data-testid="commentsDialog"
                className="absolute right-0 z-[2000] w-[20vw] h-[100vh] bg-white rounded-xl p-[24px] flex flex-col gap-2"
            >
                <span className='text-3xl font-roboto font-normal text-slate-700 block'>Comments</span>
                <hr />
                <div className="overflow-y-scroll h-[95%]">
                    {comments.map(cc => {
                        return (
                            <CommentCard key={cc.SK} comment={cc} />
                        )
                    })}
                </div>
            </div>
        </>
    )
}

import { CreateComment, DeleteComment, UpdateComment } from "@/app/api/comment";
import globals from "@/app/lib/globals/globals";
import { RootState } from "@/app/lib/redux/store";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setValue as setComments } from '../../../lib/redux/commentsSlice';
import { Comment } from "@/app/types/Comment";
import { setValue as setSelectStart } from '../../../lib/redux/selectStartSlice';
import { SlOptionsVertical } from "react-icons/sl";

export function CommentCard({ comment }: { comment: Comment }) {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData.value);
    const ref = useRef<HTMLDivElement>(null)
    const ref1 = useRef<HTMLInputElement>(null)
    const [content, setContent] = useState<string>(comment.Content);
    const comments: Comment[] = useSelector((state: RootState) => state.comments.value)
    const [commentOptions, setCommentOptions] = useState<boolean>(false);
    const [editOption, setEditOption] = useState<boolean>(false);
    const [editable, setEditable] = useState<boolean>(false);
    const dispatch = useDispatch();

    const deleteComment = useCallback(async () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        const res = await DeleteComment(access_token, spreadSheetMetaData?.SpreadSheetID, comment.SK.slice(8));
        return res;
    }, [spreadSheetMetaData, comment]);

    const updateComment = useCallback(async () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        const res = await UpdateComment(access_token, spreadSheetMetaData?.SpreadSheetID, comment.SK.slice(8), content);
        return res;
    }, [spreadSheetMetaData, comment, content]);

    const click = useCallback((e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setCommentOptions(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <div key={comment.PK} className="w-full bg-slate-100 mb-2 p-2 rounded-lg">
            <div className="flex gap-2 mb-2">
                <div className="w-[40px] h-[40px] rounded-full bg-teal-800 flex justify-center">
                    <span className="mt-auto mb-auto text-white font-normal text-2xl">{spreadSheetMetaData?.UserName?.at(0)}</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-semibold">{spreadSheetMetaData?.UserName}</span>
                    <span>{new Date(comment.CreatedAt).toLocaleString()}</span>
                </div>
                <div onClick={() => {
                    setCommentOptions(true)
                }} ref={ref} className="relative flex justify-center ml-auto mt-1 mr-1 hover:rounded-full hover:bg-slate-300 hover:cursor-pointer w-[30px] h-[30px]">
                    <SlOptionsVertical className="mt-auto mb-auto" />
                    {commentOptions && <div className="absolute top-[32px] right-0 z-[100] bg-white rounded-lg shadow-lg w-[90px] flex flex-col gap-1 justify-center">
                        <div onClick={(e) => {
                            e.stopPropagation()
                            setEditOption(true)
                            setEditable(true)
                            setCommentOptions(false)
                            ref1.current?.focus();
                        }} className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer">
                            <span>Edit</span>
                        </div>
                        <div onClick={async () => {
                            const res = await deleteComment()
                            if (res.status === 200) {
                                dispatch(setComments(comments.filter(x => x.SK !== comment.SK)))
                            }
                        }} className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer">
                            <span>Delete</span>
                        </div>
                    </div>}
                </div>
            </div>
            <input ref={ref1} onChange={(e) => {
                if (editable) {
                    setContent(e.target.value)
                }
            }} type="text" className="bg-slate-300 w-full block rounded-lg pl-2 pr-2 pt-1 pb-1 break-all outline-none" value={content} />
            {editOption && <div className=" flex justify-end gap-3 mt-2 mr-2">
                <button onClick={() => {
                    setEditOption(false)
                    setEditable(false)
                }} className="w-[75px] h-[36px] text-blue-700 font-semibold rounded-full hover:bg-blue-100">Cancel</button>
                <button onClick={async () => {
                    const res = await updateComment()
                    if (res.status === 200) {
                        dispatch(setComments([...comments.filter(x => x.SK !== comment.SK), {
                            ...comment,
                            Content: content
                        }].sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime())));
                        setEditOption(false)
                        setEditable(false)
                    }
                }} className="w-[75px] h-[36px] text-white font-semibold rounded-full bg-blue-700 hover:shadow-sm hover:shadow-black">Save</button>
            </div>}
        </div>
    )
}

export default function Comment() {
    const [comment, setComment] = useState("");
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData.value);
    const selectStart = useSelector((state: RootState) => state.selectStart.value)
    const comments = useSelector((state: RootState) => state.comments.value)
    const filteredComments = comments.filter(x => x.CellID.localeCompare(selectStart) === 0)
    const dispatch = useDispatch();

    useEffect(() => {
        comments.forEach(cc => {
            const cellMarker = document.getElementById(cc.CellID + "comment") as HTMLDivElement
            cellMarker.style.borderRightColor = "#fcbc03"
            const cell = document.getElementById(cc.CellID) as HTMLDivElement
            cellMarker.addEventListener('mouseover', (e) => {
                dispatch(setSelectStart(cc.CellID))
                const comment = document.getElementById("comment") as HTMLDivElement;
                const x = document.getElementById(cc.CellID) as HTMLDivElement
                comment.style.display = "block"
                comment.style.zIndex = "1000"
                comment.style.position = "absolute"

                // bottom case
                if (Math.abs(e.clientY - window.innerHeight) < comment.offsetHeight) {
                    comment.style.top = x.getBoundingClientRect().top - comment.offsetHeight + cell.offsetHeight + "px"
                } else {
                    comment.style.top = x.getBoundingClientRect().top + "px"
                }

                // right case
                if (Math.abs(e.clientX - window.innerWidth) < comment.offsetWidth) {
                    comment.style.left = x.getBoundingClientRect().left - comment.offsetWidth + "px"
                } else {
                    comment.style.left = x.getBoundingClientRect().right + "px"
                }
            })

            cell.addEventListener('mouseover', (e) => {
                dispatch(setSelectStart(cc.CellID))
                const comment = document.getElementById("comment") as HTMLDivElement;
                const x = document.getElementById(cc.CellID) as HTMLDivElement
                comment.style.display = "block"
                comment.style.zIndex = "1000"
                comment.style.position = "absolute"

                // bottom case
                if (Math.abs(e.clientY - window.innerHeight) < comment.offsetHeight) {
                    comment.style.top = x.getBoundingClientRect().top - comment.offsetHeight + cell.offsetHeight + "px"
                } else {
                    comment.style.top = x.getBoundingClientRect().top + "px"
                }

                // right case
                if (Math.abs(e.clientX - window.innerWidth) < comment.offsetWidth) {
                    comment.style.left = x.getBoundingClientRect().left - comment.offsetWidth + "px"
                } else {
                    comment.style.left = x.getBoundingClientRect().right + "px"
                }
            })

            cell.addEventListener('mouseleave', () => {
                const comment = document.getElementById("comment") as HTMLDivElement;
                comment.style.display = "none";
            })

            cellMarker.addEventListener('mouseleave', () => {
                const comment = document.getElementById("comment") as HTMLDivElement;
                comment.style.display = "none";
            })
        })
    }, [comments, dispatch]);

    const saveComment = useCallback(async () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        const res = await CreateComment(access_token, comment, spreadSheetMetaData?.SpreadSheetID, globals.selectedSheet, selectStart);
        return res;
    }, [comment, spreadSheetMetaData, selectStart]);

    return (
        <div
            onMouseOver={() => {
                const comment = document.getElementById("comment") as HTMLDivElement;
                comment.style.display = "block";
            }}
            onMouseLeave={() => {
                const comment = document.getElementById("comment") as HTMLDivElement;
                comment.style.display = "none";
            }}
            id="comment"
            data-testid="comment"
            className="w-[350px] hidden bg-white shadow-lg shadow-slate-400 rounded-lg p-4">
            <div className="overflow-y-scroll max-h-[300px]">
                {filteredComments.sort((a, b) => new Date(a.CreatedAt).getTime() - new Date(b.CreatedAt).getTime()).map(cc => {
                    return <CommentCard key={cc.SK} comment={cc} />;
                })}
            </div>
            <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="resize-none outline-none border-[1px] rounded-full pl-4 pr-4 pt-2 pb-2 mb-3 mt-3 border-black w-full"
            />
            <div className="flex justify-end gap-3">
                <button onClick={() => {
                    const comment = document.getElementById("comment") as HTMLDivElement;
                    comment.style.display = "none"
                }}
                    className="w-[75px] h-[36px] text-blue-700 font-semibold hover:rounded-full hover:bg-blue-100">
                    Cancel
                </button>
                {comment === "" ? (<button className="mr-4 w-[100px] h-[36px] font-semibold text-gray-500 bg-gray-200 rounded-full">
                    Comment
                </button>) : (
                    <button onClick={async (e) => {
                        const res = await saveComment();
                        if (res.status === 200) {
                            const cc: Comment = await res.json();
                            dispatch(setComments([...comments, cc]));
                            setComment("");
                        } else {
                            console.log("some error", res.status)
                        }
                    }} className="mr-4 w-[100px] h-[36px] font-semibold text-white bg-[#0b57d0] rounded-full hover:shadow-sm hover:shadow-black">
                        Comment
                    </button>
                )}
            </div>
        </div>
    )
}
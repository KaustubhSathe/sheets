import { CreateComment } from "@/app/api/comment";
import globals from "@/app/lib/globals/globals";
import { RootState } from "@/app/lib/redux/store";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setValue as setComments } from '../../../lib/redux/commentsSlice';
import { Comment } from "@/app/types/Comment";
import { setValue as setSelectStart } from '../../../lib/redux/selectStartSlice';


export default function Comment() {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;
    const [comment, setComment] = useState("");
    const selectStart = useSelector((state: RootState) => state.selectStart.value)
    const comments = useSelector((state: RootState) => state.comments.value)
    const filteredComments = comments.filter(x => x.CellID.localeCompare(selectStart) === 0)
    const dispatch = useDispatch();

    useEffect(() => {
        comments.forEach(cc => {
            const cellMarker = document.getElementById(cc.CellID + "comment") as HTMLDivElement
            cellMarker.style.borderRightColor = "#fcbc03"
            const cell = document.getElementById(cc.CellID) as HTMLDivElement
            cell.onmouseover = () => {
                dispatch(setSelectStart(cc.CellID))
                const comment = document.getElementById("comment") as HTMLDivElement;
                const x = document.getElementById(cc.CellID) as HTMLDivElement
                comment.style.display = "block"
                comment.style.zIndex = "1000"
                comment.style.position = "absolute"
                comment.style.top = x.getBoundingClientRect().top + "px"
                comment.style.left = x.getBoundingClientRect().right + "px"
            }
            // cell.onmouseleave = () => {
            //     const comment = document.getElementById("comment") as HTMLDivElement;
            //     comment.style.display = "none";
            // }
        })
    }, [comments]);

    const saveComment = useCallback(async () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        const res = await CreateComment(access_token, comment, spreadSheetMetaData?.SpreadSheetID, globals.selectedSheet, selectStart);
        return res;
    }, [comment, spreadSheetMetaData, selectStart]);

    return (
        <div id="comment" className="w-[350px] hidden bg-white shadow-lg shadow-slate-400 rounded-lg p-4">
            <div className="flex gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-teal-800 flex justify-center">
                    <span className="mt-auto mb-auto text-white font-normal text-2xl">{spreadSheetMetaData?.UserName?.at(0)}</span>
                </div>
                <span className="mt-auto mb-auto text-black font-normal text-2xl">{spreadSheetMetaData?.UserName}</span>
            </div>
            <div>
                {filteredComments.map(cc => {
                    return (
                        <div key={cc.PK}>
                            <span>{cc.Content}</span>
                        </div>
                    );
                })}
            </div>
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none outline-none border-[1px] rounded-full pl-4 pr-4 pt-2 pb-2 mb-3 mt-3 border-black w-full" />
            <div className="flex justify-end gap-3">
                <button className="w-[75px] h-[36px] text-blue-700 font-semibold hover:rounded-full hover:bg-blue-100">
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
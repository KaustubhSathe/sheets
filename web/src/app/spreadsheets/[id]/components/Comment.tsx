import { CreateComment } from "@/app/api/comment";
import globals from "@/app/lib/globals/globals";
import { RootState } from "@/app/lib/redux/store";
import { useCallback, useState } from "react";
import { useSelector } from "react-redux";

export default function Comment() {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;
    const [comment, setComment] = useState("");
    const selectStart = useSelector((state: RootState) => state.selectStart.value)
    const comments = useSelector((state: RootState) => state.comments.value)

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
                {globals.comments.map(cc => {
                    if (cc.CellID === globals.selectStart) {
                        return (<div key={cc.CellID}>
                            <span>{cc.Content}</span>
                        </div>);
                    }

                    return null;
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
                            setComment("");
                            const cc = await res.json();
                            globals.comments.push(cc);
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
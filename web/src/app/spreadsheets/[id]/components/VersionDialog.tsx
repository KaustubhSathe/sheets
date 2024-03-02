import { RootState } from "@/app/lib/redux/store";
import { comment } from "postcss";
import { Dispatch, SetStateAction, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useSelector } from "react-redux";

function VersionCard({ version }: { version: { VersionName: string, CreatedAt: Date } }) {
    const [options, setOptions] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null)
    return (
        <div className="w-full h-[70px] bg-slate-400 rounded-lg p-2">
            <input type="text" value={version.VersionName} className="outline outline-[1px] rounded-full pl-2 bg-inherit block mb-2" />
            <div onClick={() => {
                setOptions(true)
            }} ref={ref} className="relative flex justify-center ml-auto mt-1 mr-1 hover:rounded-full hover:bg-slate-300 hover:cursor-pointer w-[30px] h-[30px]">
                <SlOptionsVertical className="mt-auto mb-auto" />
                {options && <div className="absolute top-[32px] right-0 z-[100] bg-white rounded-lg shadow-lg w-[90px] flex flex-col gap-1 justify-center">
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
                    </div>
            <span><strong>Created At:</strong> {new Date(version.CreatedAt).toLocaleString()}</span>
        </div>
            );
}

            export function VersionDialog({setVersionHistory}: {setVersionHistory: Dispatch<SetStateAction<boolean>> }) {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData.value);
                return (
                <>
                    <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setVersionHistory(false)}>
                    </div >
                    <div className="absolute right-0 z-[1000] w-[20vw] h-[100vh] bg-white rounded-xl p-[24px] flex flex-col gap-2">
                        <span className='text-3xl font-roboto font-normal text-slate-700 block'>Version History</span>
                        <hr />
                        {spreadSheetMetaData.Versions.map(v => <VersionCard key={v.VersionName} version={v} />)}
                        <button className="bg-blue-700 w-[200px] h-[40px] rounded-full text-white font-semibold hover:shadow-md hover:shadow-black ml-auto mr-auto mt-auto">Add new version</button>
                    </div>
                </>
                )
}
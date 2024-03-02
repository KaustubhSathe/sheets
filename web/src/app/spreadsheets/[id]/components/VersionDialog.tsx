import globals from "@/app/lib/globals/globals";
import { RootState } from "@/app/lib/redux/store";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { setValue as setSpreadSheetMetaData } from '../../../lib/redux/spreadSheetMetaDataSlice';

function VersionCard({ version, currentVersion }: { version: { VersionName: string, CreatedAt: Date }, currentVersion: boolean }) {
    const [options, setOptions] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null)
    const ref1 = useRef<HTMLInputElement>(null)
    console.log(currentVersion)

    const click = useCallback((e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            setOptions(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <div className="w-full  bg-slate-400 rounded-lg p-2">
            <div className="flex justify-between">
                <input type="text" ref={ref1} value={version.VersionName} className="outline outline-[1px] rounded-full pl-2 bg-inherit block mb-2" />
                <div onClick={() => setOptions(true)} ref={ref} className="float-right relative flex justify-center ml-auto mr-1 hover:rounded-full hover:bg-slate-300 hover:cursor-pointer w-[30px] h-[30px]">
                    <SlOptionsVertical className="mt-auto mb-auto" />
                    {options && <div className="absolute top-[32px] right-0 z-[100] bg-white rounded-lg shadow-lg w-[160px] flex flex-col gap-1 justify-center">
                        <div onClick={(e) => {
                            e.stopPropagation()
                            setOptions(false)
                            ref1.current?.focus()
                        }} className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer hover:rounded-lg">
                            <span>Name this version</span>
                        </div>
                        {!currentVersion && <div className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer hover:rounded-lg">
                            <span>Restore this version</span>
                        </div>}
                        {!currentVersion && <div className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer hover:rounded-lg">
                            <span>Delete</span>
                        </div>}
                    </div>}
                </div>
            </div>
            {currentVersion && <span className="block text-green-700 font-semibold text-sm">Current Version</span>}
            <span><strong>Created At:</strong> {new Date(version.CreatedAt).toLocaleString()}</span>
        </div>
    );
}

export function VersionDialog({ setVersionHistory }: { setVersionHistory: Dispatch<SetStateAction<boolean>> }) {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData.value);
    const dispatch = useDispatch();
    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setVersionHistory(false)}>
            </div >
            <div className="absolute right-0 z-[1000] w-[20vw] h-[100vh] bg-white rounded-xl p-[24px] flex flex-col gap-2">
                <span className='text-3xl font-roboto font-normal text-slate-700 block'>Version History</span>
                <hr />
                {spreadSheetMetaData.Versions.map((v, i) => <VersionCard key={v.VersionName} version={v} currentVersion={i === 0} />)}
                <button onClick={() => {
                    globals.spreadsheet.Versions.push({
                        CreatedAt: new Date(),
                        Sheets: globals.spreadsheet.Versions[0].Sheets,
                        VersionName: "Version" + (globals.spreadsheet.Versions.length + 1),
                        VersionID: uuidv4
                    })
                    dispatch(setSpreadSheetMetaData({
                        ...spreadSheetMetaData,
                        Versions: globals.spreadsheet.Versions.map(x => {
                            return {
                                CreatedAt: x.CreatedAt,
                                VersionName: x.VersionName
                            }
                        }),
                    }));
                }} className="bg-blue-700 w-[200px] h-[40px] rounded-full text-white font-semibold hover:shadow-md hover:shadow-black ml-auto mr-auto mt-auto">Add new version</button>
            </div>
        </>
    )
}
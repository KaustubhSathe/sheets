import globals from "@/app/lib/globals/globals";
import { RootState } from "@/app/lib/redux/store";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import { useDispatch, useSelector } from "react-redux";
import { setValue as setSpreadSheetMetaData } from '../../../lib/redux/spreadSheetMetaDataSlice';
import { v4 as uuidv4 } from 'uuid';
import { STATUS, setValue as setSaved } from "../../../lib/redux/savedSlice"
import debounce from "debounce";
import { useRouter } from "next/navigation";
import { UpdateSheets } from "@/app/api/spreadsheet";

function VersionCard({ version, currentVersion }: { version: { VersionName: string, CreatedAt: Date, VersionID: string }, currentVersion: boolean }) {
    const [options, setOptions] = useState<boolean>(false);
    const [editable, setEditable] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null)
    const ref1 = useRef<HTMLInputElement>(null)
    const [versionName, setVersionName] = useState<string>(version.VersionName);
    const dispatch = useDispatch();
    const router = useRouter();
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData.value);

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
                <input type="text" ref={ref1} onChange={(e) => {
                    if (editable) {
                        globals.spreadsheet.Versions.forEach(x => {
                            if (x.VersionID === version.VersionID) {
                                x.VersionName = e.target.value
                            }
                        })
                        setVersionName(e.target.value)
                    }
                }} onKeyUp={debounce((e) => {
                    if (editable) {
                        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
                        if (access_token === null) {
                            return router.push("/")
                        }
                        UpdateSheets(access_token, {
                            Versions: globals.spreadsheet.Versions,
                            SpreadSheetID: globals.spreadsheet?.SK.slice(12),
                        }).then(res => {
                            if (res.status === 200) {
                                setEditable(false)
                                setVersionName(e.target.value)
                            }
                        })
                    }
                }, 500)} value={versionName} className="outline outline-[1px] rounded-full pl-2 bg-inherit block mb-2" />
                <div onClick={() => setOptions(true)} ref={ref} className="float-right relative flex justify-center ml-auto mr-1 hover:rounded-full hover:bg-slate-300 hover:cursor-pointer w-[30px] h-[30px]">
                    <SlOptionsVertical className="mt-auto mb-auto" />
                    {options && <div className="absolute top-[32px] right-0 z-[100] bg-white rounded-lg shadow-lg w-[160px] flex flex-col gap-1 justify-center">
                        <div onClick={(e) => {
                            e.stopPropagation()
                            setOptions(false)
                            setEditable(true)
                            ref1.current?.focus()
                        }} className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer hover:rounded-lg">
                            <span>Rename this version</span>
                        </div>
                        {!currentVersion && <div onClick={() => {
                            globals.spreadsheet.Versions = [...globals.spreadsheet.Versions.filter(x => x.VersionID === version.VersionID), ...globals.spreadsheet.Versions.filter(x => x.VersionID !== version.VersionID)]
                            for (let j = 0; j < globals.columns; j++) {
                                for (let i = 0; i < globals.rows; i++) {
                                    const key = String.fromCharCode(65 + j) + (i + 1).toString();
                                    let elem = document.getElementById(key) as HTMLTextAreaElement
                                    elem.value = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextContent
                                    elem.style.backgroundColor = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].BackGroundColor
                                    elem.style.color = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontColor
                                    elem.style.fontFamily = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontFamily
                                    elem.style.fontStyle = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontStyle
                                    elem.style.fontWeight = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontWeight
                                    elem.style.textDecoration = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextDecoration
                                    elem.style.fontSize = globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].FontSize + "px"
                                }
                            }
                            dispatch(setSpreadSheetMetaData({
                                ...spreadSheetMetaData,
                                Versions: globals.spreadsheet.Versions.map(x => {
                                    return {
                                        CreatedAt: x.CreatedAt,
                                        VersionName: x.VersionName,
                                        VersionID: x.VersionID
                                    }
                                }),
                            }));
                            if (globals.saved) {
                                globals.saved = false
                                dispatch(setSaved(STATUS.UNSAVED))
                            }
                        }} className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer hover:rounded-lg">
                            <span>Restore this version</span>
                        </div>}
                        {!currentVersion && <div onClick={() => {
                            globals.spreadsheet.Versions = globals.spreadsheet.Versions.filter(x => x.VersionID !== version.VersionID)
                            dispatch(setSpreadSheetMetaData({
                                ...spreadSheetMetaData,
                                Versions: globals.spreadsheet.Versions.map(x => {
                                    return {
                                        CreatedAt: x.CreatedAt,
                                        VersionName: x.VersionName,
                                        VersionID: x.VersionID
                                    }
                                }),
                            }));
                            if (globals.saved) {
                                globals.saved = false
                                dispatch(setSaved(STATUS.UNSAVED))
                            }
                        }} className="flex justify-start pl-2 hover:bg-slate-200 hover:cursor-pointer hover:rounded-lg">
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
    const [maxVersionsLimit, setMaxVersionsLimit] = useState<boolean>(false);

    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setVersionHistory(false)}>
            </div >
            <div className="absolute right-0 z-[1000] w-[25vw] h-[100vh] bg-white rounded-xl p-[24px] flex flex-col gap-2">
                <span className='text-3xl font-roboto font-normal text-slate-700 block'>Version History</span>
                <hr />
                <div className="overflow-y-scroll h-[80%] flex flex-col gap-2">
                    {spreadSheetMetaData.Versions.map((v, i) => <VersionCard key={v.VersionName} version={v} currentVersion={i === 0} />)}
                </div>
                <div className="w-full flex justify-center mt-auto flex-col gap-2">
                    {maxVersionsLimit && <span className="text-red-600 mr-auto mt-auto ml-auto scale-[1.05]">Max 5 versions allowed</span>}
                    <button onClick={() => {
                        if (globals.spreadsheet.Versions.length < 5) {
                            globals.spreadsheet.Versions.push({
                                CreatedAt: new Date(),
                                Sheets: globals.spreadsheet.Versions[0].Sheets,
                                VersionName: "Version" + (globals.spreadsheet.Versions.length + 1),
                                VersionID: uuidv4()
                            })
                            dispatch(setSpreadSheetMetaData({
                                ...spreadSheetMetaData,
                                Versions: globals.spreadsheet.Versions.map(x => {
                                    return {
                                        CreatedAt: x.CreatedAt,
                                        VersionName: x.VersionName,
                                        VersionID: x.VersionID
                                    }
                                }),
                            }));
                            if (globals.saved) {
                                globals.saved = false
                                dispatch(setSaved(STATUS.UNSAVED))
                            }
                        } else {
                            setMaxVersionsLimit(true)
                            setTimeout(() => setMaxVersionsLimit(false), 3000)
                        }
                    }} className="bg-blue-700 w-[200px] h-[40px] rounded-full text-white font-semibold hover:shadow-md hover:shadow-black ml-auto mr-auto mt-auto">Add new version</button>
                </div>
            </div>
        </>
    )
}
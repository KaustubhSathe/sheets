import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { IoMdFolderOpen, IoMdCopy, IoMdShare } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineFileDownload, MdDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdHistory } from "react-icons/md";
import { IoIosSave } from "react-icons/io";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { AiFillPrinter } from "react-icons/ai";
import { CopySpreadSheet, CreateSpreadSheet, DeleteSpreadSheet, UpdateSheets } from "@/app/api/spreadsheet";
import { SpreadSheet, State } from "@/app/types/SpreadSheet";
import { RxCross1 } from "react-icons/rx";
import Cloud from '../../../../../public/grey-cloud-2.svg'
import Image from "next/image";
import { useRouter } from "next/navigation";
import Papa from 'papaparse';
import { RootState } from "@/app/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import globals from "@/app/lib/globals/globals";
import { STATUS, setValue as setSaved } from "@/app/lib/redux/savedSlice";

export default function FileButton({ text, setVersionHistory, setShareDialog }: { text: string, setVersionHistory: Dispatch<SetStateAction<boolean>>, setShareDialog: Dispatch<SetStateAction<boolean>> }) {
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [detailsDialog, setDetailsDialog] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useDispatch();

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setDropDownVisible(false);
        }
    }, []);

    const saveSheet = useCallback(async () => {
        for (let j = 0; j < globals.columns; j++) {
            for (let i = 0; i < globals.rows; i++) {
                const key = String.fromCharCode(65 + j) + (i + 1).toString();
                const elem = document.getElementById(key) as HTMLTextAreaElement;
                const newState: State = {
                    BackGroundColor: elem.style.backgroundColor,
                    FontWeight: elem.style.fontWeight,
                    FontColor: elem.style.color,
                    FontStyle: elem.style.fontStyle,
                    FontFamily: elem.style.fontFamily,
                    TextContent: elem.value,
                    TextDecoration: elem.style.textDecoration,
                    FontSize: parseInt(elem.style.fontSize)
                }
                globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key] = newState;
            }
        }
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        const res = await UpdateSheets(access_token, {
            Versions: globals.spreadsheet.Versions,
            SpreadSheetID: globals.spreadsheet?.SK.slice(12),
        })

        return res;
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        document.addEventListener("keydown", async (e) => {
            if (e.key === "Control") {
                globals.ctrlDown = true;
            }
            if (globals.ctrlDown && e.key === 'o') {
                e.preventDefault();
                setOpenDialog(true)
            }
            if (globals.ctrlDown && e.key === 's' && !globals.saved) {
                e.preventDefault();
                dispatch(setSaved(STATUS.SAVING))
                const res = await saveSheet();
                if (res.status === 200) {
                    globals.saved = true
                    dispatch(setSaved(STATUS.SAVED))
                }
            }
        });

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click, saveSheet, dispatch]);

    const createSpreadSheet = () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        CreateSpreadSheet(access_token)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                }
            }).then((res: SpreadSheet) => {
                window.open(`/spreadsheets/${res.SK.slice(12)}`, '_blank');
            })
    }

    const copySpreadSheet = () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        CopySpreadSheet(access_token, spreadSheetMetaData?.SpreadSheetTitle, spreadSheetMetaData?.Favorited, globals.spreadsheet?.Versions)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                }
            }).then((res: SpreadSheet) => {
                window.open(`/spreadsheets/${res.SK.slice(12)}`, '_blank');
            })
    }

    return (
        <>
            {openDialog && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" >
                </div >
                <div className="absolute top-[10vh] left-[15vw] z-[1000] w-[70vw] h-[80vh] bg-white rounded-xl p-[24px]">
                    <div className="flex justify-between">
                        <div className="flex gap-3">
                            <BsFillFileEarmarkSpreadsheetFill className="w-8 h-8" style={{ color: '#0F9D58' }} />
                            <span className="text-2xl">Open a file</span>
                        </div>
                        <div className="w-[40px] h-[40px] flex justify-center hover:cursor-pointer hover:bg-slate-200 hover:rounded-full" onClick={() => setOpenDialog(false)}>
                            <RxCross1 className="w-[24px] h-[24px] mt-auto mb-auto" />
                        </div>
                    </div>
                    <hr className="mt-1" />
                    <div className="flex flex-col justify-center align-middle w-full h-full">
                        <Image src={Cloud} width={250} alt="Your SVG" className="ml-auto mr-auto" />
                        <div onClick={async () => {
                            const [fileHandle] = await window.showOpenFilePicker({
                                excludeAcceptAllOption: true,
                                multiple: false,
                                types: [
                                    {
                                        description: "Images",
                                        accept: {
                                            "text/csv": [".csv"],
                                        },
                                    },
                                ]
                            });

                            const fileData = await fileHandle.getFile();

                            Papa.parse(fileData, {
                                header: false,
                                skipEmptyLines: true,
                                complete: (results: { data: Array<Array<string>> }) => {
                                    for (let j = 0; j < globals.columns; j++) {
                                        for (let i = 0; i < globals.rows; i++) {
                                            const id = String.fromCharCode(65 + j) + (i + 1).toString();
                                            let cell = document.getElementById(id) as HTMLTextAreaElement;
                                            if (cell && results.data && results.data[i] && results.data[i][j]) {
                                                cell.value = results.data[i][j]
                                                globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[id].TextContent = results.data[i][j]
                                            }
                                        }
                                    }
                                    setOpenDialog(false)
                                }
                            })
                        }} className="ml-auto mr-auto w-[100px] h-[50px] bg-[#1A73E8] mt-4 rounded-md flex justify-center hover:cursor-pointer hover:bg-blue-600 hover:scale-[1.01] hover:shadow-sm hover:shadow-black">
                            <span className="font-roboto text-white font-medium mt-auto mb-auto">Browse</span>
                        </div>
                        <span className="ml-auto mr-auto block text-center mt-1 text-xl font-roboto text-[#80868B]">or drag a csv file here</span>
                    </div>
                </div>
            </>}
            {detailsDialog && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" >
                </div >
                <div className="absolute top-[40vh] left-[40vw] z-[1000] w-[20vw] h-[20vh] bg-white rounded-xl p-[24px]">
                    <div className="flex justify-between">
                        <div className="flex gap-3">
                            <span className="text-2xl">Document Details</span>
                        </div>
                        <div className="w-[40px] h-[40px] flex justify-center hover:cursor-pointer hover:bg-slate-200 hover:rounded-full" onClick={() => setDetailsDialog(false)}>
                            <RxCross1 className="w-[24px] h-[24px] mt-auto mb-auto" />
                        </div>
                    </div>
                    <div>
                        <span className="block mb-4">Owner: {spreadSheetMetaData?.UserName}</span>
                        <span className="block mb-4">Modified: {spreadSheetMetaData?.UpdatedAt.toString()}</span>
                        <span className="block">Created: {spreadSheetMetaData?.CreatedAt.toString()}</span>
                    </div>
                </div>
            </>}
            <div className="inline-block relative">
                <span ref={ref1} onClick={() => {
                    setDropDownVisible(true)
                }} className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
                {dropDownVisible && <div className="absolute top-[1.7rem] z-[1000] left-0 w-[320px] bg-white rounded-md shadow-md shadow-slate-600">
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={createSpreadSheet}>
                        <BsFillFileEarmarkSpreadsheetFill className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">New Spreadsheet</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setOpenDialog(!openDialog)}>
                        <IoMdFolderOpen className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Open</span>
                        <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+O</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={async () => {
                        dispatch(setSaved(STATUS.SAVING))
                        const res = await saveSheet();
                        if (res.status === 200) {
                            globals.saved = true
                            dispatch(setSaved(STATUS.SAVED))
                        }
                    }}>
                        <IoIosSave className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Save</span>
                        <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+S</span>
                    </div>
                    <div onClick={copySpreadSheet} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <IoMdCopy className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Make a copy</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setShareDialog(true)}>
                        <IoMdShare className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Share</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                        const win: Window = window;
                        win.location = "mailto:f2015466p@alumni.bits-pilani.ac.in";
                    }}>
                        <AiOutlineMail className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Email</span>
                    </div>
                    <div onClick={() => {
                        const csv = [];
                        for (let i = 0; i < globals.rows; i++) {
                            const rw = [];
                            for (let j = 0; j < globals.columns; j++) {
                                const key = String.fromCharCode(65 + j) + (i + 1).toString();
                                rw.push(globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[key].TextContent);
                            }
                            csv.push(rw);
                        }

                        const download = Papa.unparse(csv);

                        window.open("data:text/csv;charset=utf-8," + download)
                    }} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <MdOutlineFileDownload className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Download as csv</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => { document.getElementById("titleInput")?.focus() }}>
                        <MdDriveFileRenameOutline className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Rename</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={async (e) => {
                        const access_token = localStorage.getItem("spreadsheet_access_token") as string
                        const spreadsheet = window.location.href.split("/")[window.location.href.split("/").length - 1]
                        const res = await DeleteSpreadSheet(access_token, spreadsheet)
                        if (res.status === 200) {
                            router.push("/spreadsheets");
                        }
                    }}>
                        <RiDeleteBin6Line className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Move to bin</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setVersionHistory(true)}>
                        <MdHistory className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Version History</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setDetailsDialog(!openDialog)} >
                        <IoIosInformationCircleOutline className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Details</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                        window.print()
                    }}>
                        <AiFillPrinter className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Print</span>
                        <span className="inline-block mt-auto mb-auto ml-auto mr-4 text-base font-semibold text-gray-500">Ctrl+P</span>
                    </div>
                </div>
                }
            </div>
        </>
    );
}
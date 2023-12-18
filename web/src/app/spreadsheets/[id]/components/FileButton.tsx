import { useCallback, useEffect, useRef, useState } from "react";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { IoMdFolderOpen, IoMdCopy, IoMdShare } from "react-icons/io";
import { AiOutlineMail } from "react-icons/ai";
import { MdOutlineFileDownload, MdDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdHistory } from "react-icons/md";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { AiFillPrinter } from "react-icons/ai";
import { CopySpreadSheet, CreateSpreadSheet, DeleteSpreadSheet } from "@/app/api/spreadsheet";
import { SpreadSheet } from "@/app/types/SpreadSheet";
import { RxCross1 } from "react-icons/rx";
import Cloud from '../../../../../public/grey-cloud-2.svg'
import Image from "next/image";
import { useRouter } from "next/navigation";
import Papa from 'papaparse';

export default function FileButton({ text, spreadsheet }: { text: string, spreadsheet:  SpreadSheet | undefined }) {
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const router = useRouter();

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setDropDownVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    const createSpreadSheet = () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        CreateSpreadSheet(access_token)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    console.log(res.status);
                }
            }).then((res: SpreadSheet) => {
                window.open(`/spreadsheets/${res.SK.slice(12)}`, '_blank');
            })
    }

    const copySpreadSheet = () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        CopySpreadSheet(access_token, spreadsheet?.SpreadSheetTitle, spreadsheet?.Favorited, spreadsheet?.States)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    console.log(res.status);
                }
            }).then((res: SpreadSheet) => {
                window.open(`/spreadsheets/${res.SK.slice(12)}`, '_blank');
            })
    }

    return (
        <>
            {openDialog && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-40 flex justify-center align-middle" >
                </div >
                <div className="absolute top-[10vh] left-[15vw] z-50 w-[70vw] h-[80vh] bg-white rounded-xl p-[24px]">
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
                            console.log(fileData);

                            Papa.parse(fileData, {
                                header: true,
                                skipEmptyLines: true,
                                complete: (results) => {
                                    console.log(results.data)
                                }
                            })
                        }} className="ml-auto mr-auto w-[100px] h-[50px] bg-[#1A73E8] mt-4 rounded-md flex justify-center hover:cursor-pointer hover:bg-blue-600 hover:scale-[1.01] hover:shadow-sm hover:shadow-black">
                            <span className="font-roboto text-white font-medium mt-auto mb-auto">Browse</span>
                        </div>
                        <span className="ml-auto mr-auto block text-center mt-1 text-xl font-roboto text-[#80868B]">or drag a csv file here</span>
                    </div>
                </div>
            </>}
            <div className="inline-block relative">
                <span ref={ref1} onClick={() => setDropDownVisible(!dropDownVisible)} className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
                {dropDownVisible && <div className="absolute top-[1.7rem] z-50 left-0 w-[320px] bg-white">
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={createSpreadSheet}>
                        <BsFillFileEarmarkSpreadsheetFill className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">New Spreadsheet</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setOpenDialog(!openDialog)}>
                        <IoMdFolderOpen className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Open</span>
                    </div>
                    <div onClick={copySpreadSheet} className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <IoMdCopy className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Make a copy</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <IoMdShare className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Share as csv</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                        const win: Window = window;
                        win.location = "mailto:f2015466p@alumni.bits-pilani.ac.in";
                    }}>
                        <AiOutlineMail className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Email</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
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
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <MdHistory className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Version History</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]">
                        <IoIosInformationCircleOutline className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Details</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                        window.print()
                    }}>
                        <AiFillPrinter className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Print</span>
                    </div>
                </div>
                }
            </div>
        </>
    );
}
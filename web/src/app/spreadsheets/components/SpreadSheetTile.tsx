import { SlOptionsVertical } from 'react-icons/sl'
import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'
import { SpreadSheet } from '@/app/types/SpreadSheet';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { IoMdOpen } from 'react-icons/io'
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DeleteSpreadSheet, UpdateSpreadSheetTitle } from '@/app/api/spreadsheet';

export default function SpreadSheetTile({ spreadsheet, spreadSheets, setSpreadSheets }: { spreadsheet: SpreadSheet, spreadSheets: SpreadSheet[], setSpreadSheets: Dispatch<SetStateAction<SpreadSheet[]>> }) {
    const [optionVisible1, setOptionVisible1] = useState<boolean>(false);
    const [optionVisible2, setOptionVisible2] = useState<boolean>(false);
    const [renameModalVisible, setRenameModalVisible] = useState<boolean>(false);
    const [renameModalText, setRenameModalText] = useState<string>(spreadsheet.SpreadSheetTitle);
    const [spreadSheetData, setSpreadSheetData] = useState<SpreadSheet>(spreadsheet);
    const router = useRouter();

    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setOptionVisible1(false);
        }

        if (ref2.current && !ref2.current.contains(e.target as Node)) {
            setOptionVisible2(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <>
            <div onClick={(e) => {
                router.push(`/spreadsheets/${spreadsheet.SK.slice(12)}`);
            }} className="h-[50px] mt-2 mb-2 hover:bg-[#e3f7ea] hover:rounded-full hover:cursor-pointer flex align-middle justify-between">
                {/* For mobile sizes */}
                <div className="mt-auto mb-auto flex justify-center align-middle sm:hidden">
                    <div className="ml-3 flex align-middle justify-center">
                        <BsFillFileEarmarkSpreadsheetFill style={{ color: '#0F9D58' }} className="w-[20px] h-[20px] mt-auto mb-auto" />
                    </div>
                    <div className="mt-auto mb-auto">
                        <div className="ml-4 flex align-middle justify-center">
                            <span className="mt-auto mb-auto font-roboto font-normal text-sm">{spreadsheet.SpreadSheetTitle}</span>
                        </div>
                        <div className="ml-5 text-center flex align-middle justify-center">
                            <span className="mt-auto mb-auto text-[#786F6D] text-xs">{new Date(spreadsheet.LastOpened).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="relative mr-2 mt-auto mb-auto sm:hidden">
                    <div ref={ref1} onClick={(e) => {
                        setOptionVisible1(!optionVisible1);
                        e.stopPropagation();
                    }} className="mr-2 text-center flex align-middle justify-center hover:bg-slate-200 min-h-[40px] min-w-[40px] hover:rounded-full mt-auto mb-auto">
                        <SlOptionsVertical className="w-[20px] h-[20px] mt-auto mb-auto" />
                    </div>
                    {
                        optionVisible1 && <div className="absolute top-[100%] left-[-125px] z-10 w-[200px] bg-white shadow-sm shadow-black">
                            <ul>
                                <li className="flex h-[50px] justify-evenly align-middle hover:bg-slate-200">
                                    <MdDriveFileRenameOutline className="block w-[20px] h-[20px] mt-auto mb-auto" />
                                    <span className="block w-[120px] align-middle justify-center mt-auto mb-auto">Rename</span>
                                </li>
                                <li className="flex h-[50px] justify-evenly align-middle hover:bg-slate-200">
                                    <RiDeleteBin6Line className="block w-[20px] h-[20px] mt-auto mb-auto" />
                                    <span className="block w-[120px] align-middle justify-center mt-auto mb-auto">Remove</span>
                                </li>
                                <li className="flex h-[50px] justify-evenly align-middle hover:bg-slate-200">
                                    <IoMdOpen className="block w-[20px] h-[20px] mt-auto mb-auto" />
                                    <span className="block w-[120px] align-middle justify-center mt-auto mb-auto">Open in new tab</span>
                                </li>
                            </ul>
                        </div>
                    }
                </div>

                {/* For greater than sm sizes */}
                <div className="justify-center align-middle sm:block hidden mt-auto mb-auto">
                    <div className="ml-4 align-middle justify-center inline-block">
                        <BsFillFileEarmarkSpreadsheetFill style={{ color: '#0F9D58' }} className="w-[20px] h-[20px] mt-auto mb-auto" />
                    </div>
                    <div className="ml-4 align-middle justify-center inline-block">
                        <span className="mt-auto mb-auto font-roboto font-normal text-sm">{spreadSheetData.SpreadSheetTitle}</span>
                    </div>
                </div>
                <div className="sm:flex sm:align-middle sm:justify-between sm:w-[50%] hidden">
                    <div className="text-center mt-auto w-full h-full mb-auto align-middle flex justify-center">
                        <span className="mt-auto mb-auto text-[#786F6D] text-xs">{new Date(spreadsheet.LastOpened).toLocaleString()}</span>
                    </div>
                    <div className="relative mr-2 mt-auto mb-auto">
                        <div ref={ref2} onClick={(e) => {
                            setOptionVisible2(!optionVisible2);
                            e.stopPropagation();
                        }} className="text-center hover:bg-slate-200 min-h-[40px] min-w-[40px] hover:rounded-full mt-auto mb-auto align-middle justify-center flex">
                            <SlOptionsVertical className="w-[20px] h-[20px] m-auto" />
                        </div>
                        {
                            optionVisible2 && <div className="absolute top-[100%] left-[-80%] z-10 w-[200px] bg-white shadow-sm shadow-black">
                                <ul onClick={e => e.stopPropagation()}>
                                    <li onClick={(e) => {
                                        setRenameModalVisible(true);
                                        setRenameModalText(spreadSheetData.SpreadSheetTitle);
                                    }} className="flex h-[50px] justify-evenly align-middle hover:bg-slate-200">
                                        <MdDriveFileRenameOutline className="block w-[20px] h-[20px] mt-auto mb-auto" />
                                        <span className="block w-[120px] align-middle justify-center mt-auto mb-auto">Rename</span>
                                    </li>
                                    <li onClick={async (e) => {
                                        const access_token = localStorage.getItem("spreadsheet_access_token") as string
                                        const res = await DeleteSpreadSheet(access_token, spreadsheet.SK.slice(12))
                                        if (res.status === 200) {
                                            setSpreadSheets(spreadSheets.filter(x => x.SK !== spreadsheet.SK))
                                        }
                                    }} className="flex h-[50px] justify-evenly align-middle hover:bg-slate-200">
                                        <RiDeleteBin6Line className="block w-[20px] h-[20px] mt-auto mb-auto" />
                                        <span className="block w-[120px] align-middle justify-center mt-auto mb-auto">Remove</span>
                                    </li>
                                    <Link href={`/spreadsheets/${spreadsheet.SK.slice(12)}`} target='_blank' className="flex h-[50px] justify-evenly align-middle hover:bg-slate-200">
                                        <IoMdOpen className="block w-[20px] h-[20px] mt-auto mb-auto" />
                                        <span className="block w-[120px] align-middle justify-center mt-auto mb-auto">Open in new tab</span>
                                    </Link>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div >
            {
                renameModalVisible && (
                    <>
                        <div className="absolute z-10 top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-[50%]">
                        </div>
                        <div className="absolute top-[calc(50vh-120px)] left-[calc(50vw-212px)] z-20 zw-[430px] h-[240px] bg-white mt-auto mb-auto rounded-2xl pl-[42px] pr-[42px] pt-[30px] pb-[30px]">
                            <span className="block text-[24px] font-roboto mb-[22px]">Rename</span>
                            <span className="block text-[16px] font-roboto mb-[24px]">Please enter a new name for the item:</span>
                            <input type='text' placeholder={renameModalText} className="w-[340px] h-[30px] outline outline-1 p-2 rounded-md mb-[20px] border-none" value={renameModalText} onChange={e => setRenameModalText(e.target.value)} />
                            <div className="flex justify-end">
                                <button onClick={(e) => {
                                    setRenameModalVisible(false);
                                    e.preventDefault();
                                }} className="w-[85px] h-[36px] outline outline-1 rounded-md outline-[#DADCE0] text-[#137333] hover:outline-black hover:text-black">
                                    Cancel
                                </button>
                                <button onClick={async (e) => {
                                    const access_token = localStorage.getItem("spreadsheet_access_token") as string
                                    const res = await UpdateSpreadSheetTitle(access_token, spreadsheet.SK.slice(12), renameModalText);
                                    if (res.status === 200) {
                                        setSpreadSheets(spreadSheets.map(ss => {
                                            if (ss.SK === spreadsheet.SK) {
                                                ss.SpreadSheetTitle = renameModalText;
                                                return ss;
                                            }
                                            return ss;
                                        }))
                                        setSpreadSheetData({
                                            ...spreadsheet,
                                            SpreadSheetTitle: renameModalText,
                                        });
                                        setRenameModalVisible(false);
                                    }
                                }} className="w-[85px] h-[36px] ml-[16px] mr-[8px] bg-[#4d90fe] rounded-md text-white hover:bg-[#357AE8]">
                                    OK
                                </button>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    );
}
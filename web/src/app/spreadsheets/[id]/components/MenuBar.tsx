import Link from 'next/link'
import Sheet from '../../../../../public/sheets.svg'
import Image from 'next/image'
import { AiOutlineStar, AiOutlineMenu } from 'react-icons/ai'
import { FaClockRotateLeft } from 'react-icons/fa6'
import { MdOutlineInsertComment, MdShare } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { useCallback, useEffect, useRef, useState } from 'react'
import FileButton from './FileButton'
import EditButton from './EditButton'
import ViewButton from './ViewButton'
import InsertButton from './InsertButton'
import FormatButton from './FormatButton'
import HelpButton from './HelpButton'
import debounce from 'debounce'
import { UpdateSpreadSheetTitle } from '@/app/api/spreadsheet'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/lib/redux/store'
import SaveStatus from './SaveStatus'

export default function MenuBar() {
    const [menuDropDownVisible, setMenuDropDownVisible] = useState<boolean>(false);
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;
    const ref1 = useRef<HTMLDivElement>(null);
    const ref2 = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [spreadSheetTitle, setSpreadSheetTitle] = useState<string | undefined>(spreadSheetMetaData?.SpreadSheetTitle);
    const [versionHistory, setVersionHistory] = useState<boolean>(false);
    const [shareDialog, setShareDialog] = useState<boolean>(false);
    const [profileVisible, setProfileVisible] = useState<boolean>(false);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setMenuDropDownVisible(false);
        }
        if (ref2.current && !ref2.current.contains(e.target as Node)) {
            setProfileVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        setSpreadSheetTitle(spreadSheetMetaData?.SpreadSheetTitle);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click, spreadSheetMetaData]);

    return (
        <>
            {versionHistory && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-40 flex justify-center align-middle" onClick={() => setVersionHistory(false)}>
                </div >
                <div className="absolute right-0 z-50 w-[20vw] h-[100vh] bg-white rounded-xl p-[24px]">
                    <span className='text-3xl font-roboto font-normal text-slate-700 block'>Version History</span>
                    <div>
                        <div>1</div>
                        <div>2</div>
                        <div>3</div>
                        <div>4</div>
                        <div>5</div>
                    </div>
                </div>
            </>}
            {shareDialog && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-40 flex justify-center align-middle" onClick={() => setShareDialog(false)}>
                </div >
                <div className="absolute top-[40vh] left-[40vw] z-50 w-[20vw] h-[20vh] bg-white rounded-xl p-[24px]">
                    share logic
                </div>
            </>}
            <div className="bg-[#F9FBFD] h-[60px] w-full max-h-[60px] flex justify-between overflow-hidden sm:overflow-visible" id='menubar'>
                <div className='sm:min-w-[450px] h-full flex'>
                    <Link href="/spreadsheets" className='w-[60px] pl-[10px] pr-[10px] ml-[8px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer'>
                        <Image title='Sheets Home' width={27} height={27} src={Sheet} alt="sheet-icon" />
                    </Link>
                    <div className='p-[8px] w-full flex sm:inline'>
                        <input type='text' width={173} height={20} className='pl-[7px] mt-auto mb-auto' placeholder='Untitled SpreadSheet' id="titleInput" onKeyUp={debounce((e) => {
                            const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
                            if (access_token === null) {
                                return router.push("/")
                            }
                            UpdateSpreadSheetTitle(access_token, spreadSheetMetaData.SpreadSheetID, e.target.value)
                                .then(res => {
                                    if (res.status === 200) {
                                        setSpreadSheetTitle(e.target.value)
                                    }
                                })
                        }, 500)} value={spreadSheetTitle} onChange={(e) => setSpreadSheetTitle(e.target.value)} />
                        <AiOutlineStar className='w-[20px] h-[20px] inline-block mt-auto mb-auto mr-[8px] ml-[8px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-full' />
                        <SaveStatus />
                        <div className='mt-[2px] w-full hidden sm:block'>
                            <FileButton text={'File'} setVersionHistory={setVersionHistory} setShareDialog={setShareDialog} />
                            <EditButton text={'Edit'} />
                            <ViewButton text={'View'} />
                            <InsertButton text={'Insert'} />
                            <FormatButton text={'Format'} />
                            <HelpButton text={'Help'} />
                        </div>
                    </div>
                </div>
                <div className='sm:flex justify-end hidden relative'>
                    <div onClick={() => setVersionHistory(!versionHistory)} className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:cursor-pointer hover:bg-slate-200 flex align-middle justify-center">
                        <FaClockRotateLeft className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </div>

                    <Link href="#" className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:bg-slate-200 flex align-middle justify-center">
                        <MdOutlineInsertComment className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </Link>
                    <div onClick={() => setShareDialog(true)} className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:cursor-pointer hover:rounded-full hover:bg-slate-200 flex align-middle justify-center">
                        <MdShare className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </div>

                    <div ref={ref2} onClick={() => setProfileVisible(!profileVisible)} className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:cursor-pointer hover:bg-slate-200 flex align-middle justify-center">
                        <CgProfile className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </div>
                    {profileVisible && <div className="z-50 shadow-black shadow-md absolute right-[16px] bottom-[-200px] sm:bottom-[-195px] bg-[#E9EEF6] w-[200px] h-[200px] sm:w-[300px] sm:h-[200px] rounded-2xl flex flex-col align-middle justify-center gap-4">
                        <div className="ml-auto mr-auto w-[80%] h-[40px] rounded-2xl text-center">
                            <span className="m-auto block font-bold">Hi {spreadSheetMetaData.UserName}!!</span>
                        </div>
                        <div className="ml-auto mr-auto bg-slate-400 w-[80%] h-[40px] rounded-2xl text-center hover:bg-slate-500 hover:cursor-pointer flex" onClick={() => {
                            localStorage.removeItem("spreadsheet_access_token");
                            router.push("/");
                        }}>
                            <span className="m-auto block font-bold">Log Out</span>
                        </div>
                    </div>}
                </div>
                <div ref={ref1} onClick={() => setMenuDropDownVisible(!menuDropDownVisible)} className='mt-auto mb-auto mr-4 w-[40px] h-[40px] hover:bg-slate-400 hover:rounded-full hover:cursor-pointer sm:hidden flex justify-center relative'>
                    <AiOutlineMenu className='w-[32px] h-[32px] mb-auto mt-auto' />
                    {menuDropDownVisible && <div className='w-[40px] h-[40px] absolute top-7 left-0'>
                    </div>}
                </div>
            </div>
        </>
    );
}
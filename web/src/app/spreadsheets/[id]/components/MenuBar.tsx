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
import { SpreadSheet } from '@/app/types/SpreadSheet'
import debounce from 'debounce'
import { UpdateSpreadSheetTitle } from '@/app/api/spreadsheet'
import { useRouter } from 'next/navigation'

export default function MenuBar({ spreadsheet }: { spreadsheet: SpreadSheet | undefined }) {
    const [menuDropDownVisible, setMenuDropDownVisible] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [spreadSheetTitle, setSpreadSheetTitle] = useState<string | undefined>(spreadsheet?.SpreadSheetTitle);
    const [versionHistory, setVersionHistory] = useState<boolean>(false);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setMenuDropDownVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        setSpreadSheetTitle(spreadsheet?.SpreadSheetTitle);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click, spreadsheet]);

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
                            UpdateSpreadSheetTitle(access_token, spreadsheet?.SK.slice(12), e.target.value)
                                .then(res => {
                                    if (res.status === 200) {
                                        setSpreadSheetTitle(e.target.value)
                                    }
                                })
                        }, 500)} value={spreadSheetTitle} onChange={(e) => setSpreadSheetTitle(e.target.value)} />
                        <AiOutlineStar className='w-[20px] h-[20px] inline-block mt-auto mb-auto mr-[8px] ml-[8px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-full' />
                        <div className='mt-[2px] w-full hidden sm:block'>
                            <FileButton text={'File'} spreadsheet={spreadsheet} setVersionHistory={setVersionHistory} />
                            <EditButton text={'Edit'} />
                            <ViewButton text={'View'} />
                            <InsertButton text={'Insert'} />
                            <FormatButton text={'Format'} />
                            <HelpButton text={'Help'} />
                        </div>
                    </div>
                </div>
                <div className='sm:flex justify-end hidden'>
                    <div onClick={() => setVersionHistory(!versionHistory)} className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:cursor-pointer hover:bg-slate-200 flex align-middle justify-center">
                        <FaClockRotateLeft className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </div>

                    <Link href="#" className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:bg-slate-200 flex align-middle justify-center">
                        <MdOutlineInsertComment className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </Link>
                    <Link href="#" className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:bg-slate-200 flex align-middle justify-center">
                        <MdShare className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </Link>

                    <Link href="#" className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:bg-slate-200 flex align-middle justify-center">
                        <CgProfile className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                    </Link>
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
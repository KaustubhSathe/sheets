import Link from 'next/link'
import Sheet from '../../../../../public/sheets.svg'
import Image from 'next/image'
import { AiOutlineStar, AiOutlineMenu } from 'react-icons/ai'
import { FaClockRotateLeft } from 'react-icons/fa6'
import MenuButton from './MenuButton';
import { MdOutlineInsertComment, MdShare } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function MenuBar() {
    const [menuDropDownVisible, setMenuDropDownVisible] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setMenuDropDownVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <div className="bg-[#F9FBFD] h-[60px] w-full max-h-[60px] flex justify-between overflow-hidden sm:overflow-visible">
            <div className='sm:min-w-[450px] h-full flex'>
                <Link href="/spreadsheets" className='w-[60px] pl-[10px] pr-[10px] ml-[8px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer'>
                    <Image title='Sheets Home' width={27} height={27} src={Sheet} alt="sheet-icon" />
                </Link>
                <div className='p-[8px] w-full flex sm:inline'>
                    <input type='text' width={173} height={20} className='pl-[7px] mt-auto mb-auto' placeholder='Untitled SpreadSheet' />
                    <AiOutlineStar className='w-[20px] h-[20px] inline-block mt-auto mb-auto mr-[8px] ml-[8px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-full' />
                    <div className='mt-[2px] w-full hidden sm:block'>
                        <MenuButton text={'File'} />
                        <MenuButton text={'Edit'} />
                        <MenuButton text={'View'} />
                        <MenuButton text={'Insert'} />
                        <MenuButton text={'Format'} />
                        <MenuButton text={'Data'} />
                        <MenuButton text={'Tools'} />
                        <MenuButton text={'Help'} />
                    </div>
                </div>
            </div>
            <div className='sm:flex justify-end hidden'>
                <Link href="#" className="mt-auto mb-auto w-[50px] h-[50px] ml-[8px] mr-[8px] hover:rounded-full hover:bg-slate-200 flex align-middle justify-center">
                    <FaClockRotateLeft className=" w-[24px] h-[24px] ml-[8px] mr-[8px] mt-auto mb-auto" />
                </Link>

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
                    asda
                </div>}
            </div>
        </div>
    );
}
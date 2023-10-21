import Link from 'next/link'
import Sheet from '../../../../../public/sheets.svg'
import Image from 'next/image'
import { AiOutlineStar } from 'react-icons/ai'
import { FaClockRotateLeft } from 'react-icons/fa6'
import MenuButton from './MenuButton';
import { MdOutlineInsertComment, MdShare } from 'react-icons/md'
import { CgProfile } from 'react-icons/cg'

export default function MenuBar() {
    return (
        <div className="bg-[#F9FBFD] h-[60px] flex flex-grow-0 flex-shrink-0">
            <Link href="#" className='w-[60px] pl-[10px] pr-[10px] ml-[8px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer'>
                <Image title='Sheets Home' width={27} height={27} src={Sheet} alt="sheet-icon" />
            </Link>
            <div className='w-[calc(100%-350px-60px)] p-[8px]'>
                <input type='text' width={173} height={20} className='pl-[7px]' placeholder='Untitled SpreadSheet' />
                <AiOutlineStar className='w-[20px] h-[20px] inline-block mr-[8px] ml-[8px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-full' />
                <div className='mt-[2px] relative'>
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
            <div className='w-[350px] flex justify-end'>
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
        </div>
    );
}
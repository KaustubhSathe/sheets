'use client'

import Link from "next/link";
import Image from 'next/image'
import Sheet from '../../../public/sheets.svg'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import { CgProfile } from 'react-icons/cg'
import { PiPlusLight } from 'react-icons/pi'
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter()
  const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
  if (access_token === null) {
    return router.push("/")
  }
  localStorage.setItem("spreadsheet_access_token", access_token);

  return (
    <>
      <div className="h-[64px] w-full bg-[#ffffff] flex justify-start">
        <Link href="/spreadsheets" className='mb-auto mt-auto w-[60px] pl-[10px] pr-[10px] ml-[8px] flex align-middle justify-center hover:cursor-pointer'>
          <Image title='Sheets Home' width={30} height={30} src={Sheet} alt="sheet-icon" />
        </Link>
        <span className="mt-auto mb-auto font-sans font-semibold text-2xl text-[#5f6368]">Sheets</span>
        <div className="ml-[100px] h-[48px] w-[717px] bg-[#f1f3f4] mt-auto mb-auto flex align-middle justify-start rounded-xl relative focus-within:bg-[#ffffff] focus-within:scale-[1.01] focus-within:shadow-sm focus-within:shadow-black">
          <div className="left-[16px] top-[4px] absolute h-[40px] w-[40px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer">
            <HiOutlineMagnifyingGlass className="w-[25px] h-[25px] mt-auto mb-auto" />
          </div>
          <input type="text" className="ml-[70px] w-full mt-[8px] mb-[8px] bg-inherit mr-[40px] outline-none" placeholder="Search" />
        </div>
        <div className="mt-auto mb-auto ml-auto mr-[16px] h-[44px] w-[44px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer">
          <CgProfile className="w-[25px] h-[25px] mt-auto mb-auto" />
        </div>
      </div>
      <div className="h-[calc(100vh-64px)] w-full">
        <div className="h-[250px] w-full bg-[#f1f3f4]">
        </div>
      </div>
      <PiPlusLight className="fixed bottom-[24px] right-[24px] w-[60px] h-[60px] hover:opacity-[50%] hover:cursor-pointer shadow-sm shadow-black rounded-full" />
    </>
  )
}

'use client'

import { AiFillGithub, AiFillAndroid, AiFillApple, AiFillChrome, AiOutlineDesktop } from 'react-icons/ai'
import Sheet from '../../public/sheets.svg'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const router = useRouter()
  if (typeof window !== 'undefined') {
    const access_token = localStorage.getItem("spreadsheet_access_token")
    if (access_token !== null) {
      return router.push("/spreadsheets")
    }
  }
  return (
    <div className="w-full h-screen flex bg-slate-200">
      <div className="h-full w-[70%] flex flex-col align-middle justify-center gap-5">
        <div className='flex justify-center'>
          <span className="font-sans text-4xl font-semibold">Make data-driven decisions, in Work Sheets</span>
        </div>
        <div className='flex justify-center'>
          <span className="font-sans text-xl font-normal">Create and collaborate on online spreadsheets in real-time and from any device.</span>
        </div>
        <div className='flex justify-center'>
          <span className="font-sans text-3xl font-semibold">Available On:</span>
        </div>
        <div className="flex align-middle justify-center gap-3">
          <AiFillChrome className="w-[50px] h-[50px] hover:scale-[1.05] hover:cursor-pointer" />
          <AiFillAndroid className="w-[50px] h-[50px] hover:scale-[1.05] hover:cursor-pointer" />
          <AiFillApple className="w-[50px] h-[50px] hover:scale-[1.05] hover:cursor-pointer" />
          <AiOutlineDesktop className="w-[50px] h-[50px] hover:scale-[1.05] hover:cursor-pointer" />
        </div>
        <div className='flex justify-center'>
          <span className="font-sans text-2xl font-normal">Check the code here: <a href="https://github.com/KaustubhSathe/spreadsheet" target='_blank' className='text-blue-500 hover:text-blue-700'>Github</a></span>
        </div>
        <div className='flex justify-center'>
          <span className="font-sans text-2xl font-normal">Want to know how I built this. Click here: <a href="https://www.udemy.com/user/kaustubh-sathe-5/" target='_blank' className='text-blue-500 hover:text-blue-700'>Udemy</a></span>
        </div>
      </div>
      <div className="h-full w-[30%] text-center p-[8px]">
        <div className="border-[2px] h-full border-[#34a853] rounded-xl flex flex-col align-middle justify-center">
          <div className="flex align-middle justify-center gap-3 mb-[15px]">
            <Image title='Sheets' width={27} height={27} src={Sheet} alt="sheet-icon" className="mt-auto mb-auto" />
            <span className="mt-auto mb-auto font-sans font-bold text-xl">Work Sheets</span>
          </div>
          <div className='mb-[8px]'>
            <span className="font-bold">Welcome!!</span> &#128075;
          </div>
          <div>
            <span className="font-semibold font-sans">
              Login to unlock access to Work Sheets!!!
            </span>
          </div>
          <a href={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`} className="hover:bg-[#34a853] hover:cursor-pointer hover:scale-[1.02] hover:shadow-md hover:shadow-black h-[40px] m-[8px] mt-[16px] bg-in rounded-xl flex align-middle justify-center gap-3 border-[2px] border-black">
            <AiFillGithub className="w-[25px] h-[25px] mt-auto mb-auto" />
            <span className='mt-auto mb-auto font-bold'>Continue with Github</span>
          </a>
        </div>
      </div>
    </div>
  )
}

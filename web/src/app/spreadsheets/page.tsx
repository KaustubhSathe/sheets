'use client'

import Link from "next/link";
import Image from 'next/image'
import Sheet from '../../../public/sheets.svg'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import { CgProfile } from 'react-icons/cg'
import { PiPlusLight } from 'react-icons/pi'
import { useRouter } from "next/navigation";
import { Authenticate } from "../api/auth";
import { Viewport } from 'next'
import { CreateSpreadSheet, GetSpreadSheet } from "../api/spreadsheet";
import { useCallback, useEffect, useState } from "react";
import { SpreadSheet } from "./components/SpreadSheetTable";
import SpreadSheetTable from "./components/SpreadSheetTable";

export default function Dashboard() {
  const router = useRouter()
  const [spreadsheets, setSpreadSheets] = useState<SpreadSheet[]>([]);
  const authenticate = useCallback(Authenticate, []);
  const getspreadsheet = useCallback(GetSpreadSheet, []);

  useEffect(() => {
    const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
    if (access_token === null) {
      return router.push("/")
    } else {
      authenticate(access_token)
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem("spreadsheet_access_token", access_token)
          } else {
            localStorage.removeItem("spreadsheet_access_token");
            return router.push("/");
          }
        })

      getspreadsheet(access_token, "")
        .then(res => {
          if (res.status === 200) {
            return res.json();
          } else {
            console.log(res.status);
          }
        }).then(res => {
          setSpreadSheets(res);
        })
    }
    console.log("called");
  }, [router, authenticate, getspreadsheet]);

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
        router.push(`/spreadsheets/${res.SK.slice(12)}`)
      })
  }

  return (
    <div className="m-0 p-0">
      <div className="h-[64px] w-full bg-[#ffffff] flex justify-between">
        <div className="ml-4 flex mr-4">
          <Link href="/spreadsheets" className='mb-auto mt-auto min-w-[60px] pl-[10px] pr-[10px] flex align-middle justify-center hover:cursor-pointer'>
            <Image title='Sheets Home' width={30} height={30} src={Sheet} alt="sheet-icon" />
          </Link>
          <span className="mt-auto mb-auto inline-block font-sans font-semibold text-2xl text-[#5f6368]">Sheets</span>
        </div>
        <div className="mr-4 h-[48px] w-[60%] bg-[#f1f3f4] mt-auto mb-auto flex align-middle justify-start rounded-xl relative focus-within:bg-[#ffffff] focus-within:scale-[1.01] focus-within:shadow-sm focus-within:shadow-black">
          <div className="left-[4px] top-[4px] absolute h-[40px] w-[40px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer">
            <HiOutlineMagnifyingGlass className="w-[25px] h-[25px] mt-auto mb-auto" />
          </div>
          <input type="text" className="ml-[50px] w-full mt-[8px] mb-[8px] bg-inherit mr-[40px] outline-none" placeholder="Search" />
        </div>
        <div className="mr-4 mt-auto mb-auto min-h-[44px] min-w-[44px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer">
          <CgProfile className="w-[25px] h-[25px] mt-auto mb-auto" />
        </div>
      </div>
      <div className="h-[calc(100vh-64px)] w-full">
        <div className="h-[250px] w-full bg-[#f1f3f4]">
        </div>
        <div className="w-[75%] ml-auto mr-auto">
          <SpreadSheetTable spreadsheets={spreadsheets} />
        </div>
      </div>
      <PiPlusLight onClick={createSpreadSheet} className="z-10 fixed bottom-[24px] right-[24px] w-[60px] h-[60px] hover:opacity-[50%] hover:cursor-pointer shadow-sm shadow-black rounded-full bg-white" />
    </div>
  )
}

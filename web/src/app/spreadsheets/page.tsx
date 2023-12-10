'use client'

import Link from "next/link";
import Image from 'next/image'
import Sheet from '../../../public/sheets.svg'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import { CgProfile } from 'react-icons/cg'
import { PiPlusLight } from 'react-icons/pi'
import { useRouter } from "next/navigation";
import { Authenticate } from "../api/auth";
import { CreateSpreadSheet, GetSpreadSheet } from "../api/spreadsheet";
import { useCallback, useEffect, useRef, useState } from "react";
import SpreadSheetTable from "./components/SpreadSheetTable";
import { SpreadSheet } from "../types/SpreadSheet";
import Template from "./components/Template";
import Loading from "./components/Loading";

export default function Dashboard() {
  const router = useRouter()
  const [spreadsheets, setSpreadSheets] = useState<SpreadSheet[]>([]);
  const [profileVisible, setProfileVisible] = useState<boolean>(false);
  const [profileName, setProfileName] = useState<string>("");
  const [createNewSpreadSheetLoader, setCreateNewSpreadSheetLoader] = useState<boolean>(false);

  const authenticate = useCallback(Authenticate, []);
  const getspreadsheet = useCallback(GetSpreadSheet, []);

  const ref1 = useRef<HTMLDivElement>(null);

  const click = useCallback((e: MouseEvent) => {
    if (ref1.current && !ref1.current.contains(e.target as Node)) {
      setProfileVisible(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", click);

    return () => {
      document.removeEventListener("click", click);
    };
  }, [click]);

  useEffect(() => {
    const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token"))
    if (access_token === null) {
      return router.push("/")
    } else {
      authenticate(access_token)
        .then(async res => {
          if (res.status === 200) {
            localStorage.setItem("spreadsheet_access_token", access_token)
            const userInfo = await res.json();
            console.log(userInfo);
            setProfileName(userInfo.login);
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
          } else {
            localStorage.removeItem("spreadsheet_access_token");
            return router.push("/");
          }
        })
    }
  }, [router, authenticate, getspreadsheet]);

  const createSpreadSheet = () => {
    const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
    setCreateNewSpreadSheetLoader(true);
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
    <>
      {createNewSpreadSheetLoader && <>
        <div className="absolute w-[100%] h-[100%] bg-black opacity-20 z-100 flex justify-center align-middle" >
        </div >
        <div className="absolute top-[50%] left-[50%] z-1000"><Loading /></div>
      </>}
      <div className="m-0 p-0">
        <div className="relative h-[64px] w-full bg-[#ffffff] flex justify-between">
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
          <div ref={ref1} onClick={() => setProfileVisible(!profileVisible)} className="mr-4 mt-auto mb-auto min-h-[44px] min-w-[44px] flex align-middle justify-center hover:bg-slate-200 hover:rounded-full hover:cursor-pointer">
            <CgProfile className="w-[25px] h-[25px] mt-auto mb-auto" />
          </div>
          {profileVisible && <div className="shadow-black shadow-md absolute right-[16px] bottom-[-200px] sm:bottom-[-195px] bg-[#E9EEF6] w-[200px] h-[200px] sm:w-[300px] sm:h-[200px] rounded-2xl flex flex-col align-middle justify-center gap-4">
            <div className="ml-auto mr-auto w-[80%] h-[40px] rounded-2xl text-center">
              <span className="m-auto block font-bold">Hi, {profileName}!!</span>
            </div>
            <div className="ml-auto mr-auto bg-slate-400 w-[80%] h-[40px] rounded-2xl text-center hover:bg-slate-500 hover:cursor-pointer flex" onClick={() => {
              localStorage.removeItem("spreadsheet_access_token");
              router.push("/");
            }}>
              <span className="m-auto block font-bold">Log Out</span>
            </div>
          </div>}
        </div>

        <div className="h-[calc(100vh-64px)] w-full">
          <div className="h-[250px] w-full bg-[#f1f3f4] flex flex-col justify-center align-middle">
            <div className="h-[64px] w-[75%] flex justify-start ml-[14%]">
              <span className="mt-auto mb-auto font-medium font-roboto">Start a new spreadsheet from template</span>
            </div>
            <div className="w-[75%] flex justify-start align-middle m-auto mt-0 mb-auto overflow-x-scroll sm:overflow-hidden">
              <Template onClick={createSpreadSheet} templateName="Blank spreadsheet" />
              <Template onClick={createSpreadSheet} templateName="Blank spreadsheet" />
              <Template onClick={createSpreadSheet} templateName="Blank spreadsheet" />
              <Template onClick={createSpreadSheet} templateName="Blank spreadsheet" />
              <Template onClick={createSpreadSheet} templateName="Blank spreadsheet" />
              <Template onClick={createSpreadSheet} templateName="Blank spreadsheet" />
              <Template onClick={createSpreadSheet} templateName="Blank spreadsheet" />
            </div>
          </div>
          <div className="w-[75%] ml-auto mr-auto">
            <SpreadSheetTable spreadsheets={spreadsheets} setSpreadSheets={setSpreadSheets} />
          </div>
        </div>
        <PiPlusLight onClick={createSpreadSheet} className="z-10 fixed bottom-[24px] right-[24px] w-[60px] h-[60px] hover:opacity-[50%] hover:cursor-pointer shadow-sm shadow-black rounded-full bg-white" />
      </div>
    </>
  )
}

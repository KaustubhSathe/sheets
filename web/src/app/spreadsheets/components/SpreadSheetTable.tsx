import { SpreadSheet } from "@/app/types/SpreadSheet";
import SpreadSheetTile from "./SpreadSheetTile";
import { Dispatch, SetStateAction } from "react";
import Loading from "./Loading";

export default function SpreadSheetTable({ spreadsheets, setSpreadSheets, loader }: { spreadsheets: SpreadSheet[], setSpreadSheets: Dispatch<SetStateAction<SpreadSheet[]>>, loader: boolean }) {
    return (
        <div className="w-full mt-4 flex flex-col justify-center" id="spreadsheet-table">
            <div className="font-bold font-roboto text-[#212b3e] flex w-full justify-between m-0">
                <div className="text-left ml-4 sm:ml-6">
                    SpreadSheet Title
                </div>
                <div className="text-center hidden sm:block mr-[23%]">
                    Last Opened
                </div>
            </div>
            {
                loader ? <div className="ml-auto mr-auto flex justify-center mt-[100px]">
                    <Loading />
                </div> : spreadsheets.length === 0 ? <div className="ml-auto mr-auto mt-4">
                    You have 0 spreadsheets. Please create new.
                </div> : spreadsheets.sort((a, b) => {
                    return (new Date(b.LastOpened).getTime() - new Date(a.LastOpened).getTime());
                }).map(ss => (
                    <SpreadSheetTile key={ss.SK} spreadsheet={ss} spreadSheets={spreadsheets} setSpreadSheets={setSpreadSheets} />
                ))
            }
        </div>
    );
}
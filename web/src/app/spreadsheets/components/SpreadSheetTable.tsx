import { SpreadSheet } from "@/app/types/SpreadSheet";
import SpreadSheetTile from "./SpreadSheetTile";
import { Dispatch, SetStateAction } from "react";

export default function SpreadSheetTable({ spreadsheets, setSpreadSheets }: { spreadsheets: SpreadSheet[], setSpreadSheets: Dispatch<SetStateAction<SpreadSheet[]>> }) {
    return (
        <div className="w-full mt-4" id="spreadsheet-table">
            <div className="font-bold font-roboto text-[#212b3e] flex w-full justify-between m-0">
                <div className="text-left ml-4 sm:ml-6">
                    SpreadSheet Title
                </div>
                <div className="text-center hidden sm:block mr-[23%]">
                    Last Opened
                </div>
            </div>
            {
                spreadsheets.sort((a, b) => {
                    return (new Date(b.LastOpened).getTime() - new Date(a.LastOpened).getTime());
                }).map(ss => (
                    <SpreadSheetTile key={ss.SK} spreadsheet={ss} spreadSheets={spreadsheets} setSpreadSheets={setSpreadSheets}/>
                ))
            }
        </div>
    );
}
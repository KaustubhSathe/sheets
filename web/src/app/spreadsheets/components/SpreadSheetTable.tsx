import { SlOptionsVertical } from 'react-icons/sl'
import { BsFillFileEarmarkSpreadsheetFill } from 'react-icons/bs'

export type SpreadSheet = {
    PK: string,
    SK: string,
    CreatedAt: Date,
    UpdatedAt: Date,
    DeletedAt: Date | null,
    UserName: string,
    UserID: number,
    SpreadSheetTitle: string,
    Favorited: boolean,
    CSVs: string[],
    LastOpened: Date
}

export default function SpreadSheetTable({ spreadsheets }: { spreadsheets: SpreadSheet[] }) {
    return (
        <div className="w-full mt-4">
            <div className="font-bold font-roboto text-[#212b3e] flex w-full justify-start">
                <div className="text-left ml-8">
                    SpreadSheet Title
                </div>
                <div className="text-center ml-[60%]">
                    Last Opened
                </div>
            </div>
            {
                spreadsheets.sort((a, b) => {
                    return (new Date(b.LastOpened).getTime() - new Date(a.LastOpened).getTime());
                }).map(ss => (
                    <div key={ss.SK} className="h-[50px] mt-2 mb-2 hover:bg-[#e3f7ea] hover:rounded-full hover:cursor-pointer flex align-middle">
                        <div className="ml-4 flex align-middle justify-center">
                            <BsFillFileEarmarkSpreadsheetFill className="w-[20px] h-[20px] mt-auto mb-auto" />
                        </div>
                        <div className="ml-6 flex align-middle justify-center">
                            <span className="mt-auto mb-auto font-roboto font-normal">{ss.SpreadSheetTitle}</span>
                        </div>
                        <div className="ml-[58%] text-center flex align-middle justify-center">
                            <span className="mt-auto mb-auto text-[#786F6D]">{new Date(ss.LastOpened).toLocaleString()}</span>
                        </div>
                        <div className="ml-[10%] text-center flex align-middle justify-center hover:bg-slate-200 h-[40px] w-[40px] hover:rounded-full mt-auto mb-auto">
                            <SlOptionsVertical className="w-[20px] h-[20px] mt-auto mb-auto" />
                        </div>
                    </div>
                ))
            }
        </div>
    );
    return;
}
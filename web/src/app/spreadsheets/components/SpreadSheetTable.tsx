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
                    <div key={ss.SK} className="h-[50px] mt-2 mb-2 hover:bg-[#e3f7ea] hover:rounded-full hover:cursor-pointer flex align-middle justify-between">
                        {/* For mobile sizes */}
                        <div className="mt-auto mb-auto flex justify-center align-middle sm:hidden">
                            <div className="ml-3 flex align-middle justify-center">
                                <BsFillFileEarmarkSpreadsheetFill className="w-[20px] h-[20px] mt-auto mb-auto" />
                            </div>
                            <div className="mt-auto mb-auto">
                                <div className="ml-4 flex align-middle justify-center">
                                    <span className="mt-auto mb-auto font-roboto font-normal text-sm">{ss.SpreadSheetTitle}</span>
                                </div>
                                <div className="ml-5 text-center flex align-middle justify-center">
                                    <span className="mt-auto mb-auto text-[#786F6D] text-xs">{new Date(ss.LastOpened).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="sm:hidden mr-2 text-center flex align-middle justify-center hover:bg-slate-200 min-h-[40px] min-w-[40px] hover:rounded-full mt-auto mb-auto">
                            <SlOptionsVertical className="w-[20px] h-[20px] mt-auto mb-auto" />
                        </div>

                        {/* For greater than sm sizes */}
                        <div className="justify-center align-middle sm:block hidden mt-auto mb-auto">
                            <div className="ml-4 align-middle justify-center inline-block">
                                <BsFillFileEarmarkSpreadsheetFill className="w-[20px] h-[20px] mt-auto mb-auto" />
                            </div>
                            <div className="ml-4 align-middle justify-center inline-block">
                                <span className="mt-auto mb-auto font-roboto font-normal text-sm">{ss.SpreadSheetTitle}</span>
                            </div>
                        </div>
                        <div className="sm:flex sm:align-middle sm:justify-between sm:w-[50%] hidden">
                            <div className="text-center mt-auto w-full h-full mb-auto align-middle flex justify-center">
                                <span className="mt-auto mb-auto text-[#786F6D] text-xs">{new Date(ss.LastOpened).toLocaleString()}</span>
                            </div>
                            <div className="mr-2 text-center hover:bg-slate-200 min-h-[40px] min-w-[40px] hover:rounded-full mt-auto mb-auto align-middle justify-center flex">
                                <SlOptionsVertical className="w-[20px] h-[20px] m-auto" />
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
    return;
}
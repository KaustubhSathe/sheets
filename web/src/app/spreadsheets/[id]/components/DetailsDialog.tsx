import { RootState } from "@/app/lib/redux/store";
import { Dispatch, SetStateAction } from "react";
import { RxCross1 } from "react-icons/rx";
import { useSelector } from "react-redux";

export function DetailsDialog({ setDetailsDialog }: { setDetailsDialog: Dispatch<SetStateAction<boolean>> }) {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;

    return <>
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" >
        </div >
        <div className="absolute top-[40vh] left-[40vw] z-[1000] w-[20vw] h-[20vh] bg-white rounded-xl p-[24px]">
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <span className="text-2xl">Document Details</span>
                </div>
                <div className="w-[40px] h-[40px] flex justify-center hover:cursor-pointer hover:bg-slate-200 hover:rounded-full" onClick={() => setDetailsDialog(false)}>
                    <RxCross1 className="w-[24px] h-[24px] mt-auto mb-auto" />
                </div>
            </div>
            <div>
                <span className="block mb-4">Owner: {spreadSheetMetaData?.UserName}</span>
                <span className="block mb-4">Modified: {spreadSheetMetaData?.UpdatedAt.toString()}</span>
                <span className="block">Created: {spreadSheetMetaData?.CreatedAt.toString()}</span>
            </div>
        </div>
    </>
}
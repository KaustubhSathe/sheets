import { RootState } from "@/app/lib/redux/store";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";

export function ShareDialog({ setShareDialog }: { setShareDialog: Dispatch<SetStateAction<boolean>> }) {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData).value;

    return (
        <div className='flex justify-center'>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[2000] flex justify-center align-middle" onClick={() => setShareDialog(false)}>
            </div >
            <div className="absolute top-[40vh] z-[2000] h-[20vh] bg-white rounded-xl p-[24px] flex flex-col justify-center gap-2">
                <span className='font-semibold text-lg block ml-auto mr-auto'>Share URL at:</span>
                <a target='_blank' href={`${process.env.DOMAIN}/spreadsheets/share/${spreadSheetMetaData.SpreadSheetID}`} className='font-semibold text-lg block ml-auto mr-auto'>{process.env.DOMAIN}/spreadsheets/share/{spreadSheetMetaData.SpreadSheetID}</a>
            </div>
        </div>
    );
}
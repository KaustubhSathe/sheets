import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { RxCross1 } from "react-icons/rx";
import Image from "next/image";
import Cloud from '../../../../../public/grey-cloud-2.svg'
import globals from "@/app/lib/globals/globals";
import { Dispatch, SetStateAction } from "react";
import { STATUS, setValue as setSaved } from "@/app/lib/redux/savedSlice";
import { useDispatch } from "react-redux";


export function ImageOpenDialog({ setImageOpenDialog }: { setImageOpenDialog: Dispatch<SetStateAction<boolean>> }) {
    const dispatch = useDispatch();

    return <>
        <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" >
        </div >
        <div className="absolute top-[10vh] left-[15vw] z-[1000] w-[70vw] h-[80vh] bg-white rounded-xl p-[24px]">
            <div className="flex justify-between">
                <div className="flex gap-3">
                    <BsFillFileEarmarkSpreadsheetFill className="w-8 h-8" style={{ color: '#0F9D58' }} />
                    <span className="text-2xl">Open an image file</span>
                </div>
                <div className="w-[40px] h-[40px] flex justify-center hover:cursor-pointer hover:bg-slate-200 hover:rounded-full" onClick={() => setImageOpenDialog(false)}>
                    <RxCross1 className="w-[24px] h-[24px] mt-auto mb-auto" />
                </div>
            </div>
            <hr className="mt-1" />
            <div className="flex flex-col justify-center align-middle w-full h-full">
                <Image src={Cloud} width={250} alt="Your SVG" className="ml-auto mr-auto" />
                <div onClick={async () => {
                    try {
                        const [fileHandle] = await window.showOpenFilePicker({
                            excludeAcceptAllOption: true,
                            multiple: false,
                            types: [
                                {
                                    description: "Images",
                                    accept: {
                                        "image/*": ['.png', '.gif', '.jpeg', '.jpg'],
                                    },
                                },
                            ]
                        })

                        const fileData = await fileHandle.getFile();
                        const reader = new FileReader();
                        reader.onloadend = function () {
                            const elem = document.getElementById(globals.selectStart) as HTMLTextAreaElement
                            elem.style.backgroundImage = `url(${reader.result})`
                            globals.spreadsheet.Versions[0].Sheets[globals.selectedSheet].State[globals.selectStart].BackGroundImage = `url(${reader.result})`
                            setImageOpenDialog(false)
                            globals.saved = false
                            dispatch(setSaved(STATUS.UNSAVED))
                        }

                        reader.readAsDataURL(fileData)
                    } catch (e) {
                        console.error(e)
                    }
                }} className="ml-auto mr-auto w-[100px] h-[50px] bg-[#1A73E8] mt-4 rounded-md flex justify-center hover:cursor-pointer hover:bg-blue-600 hover:scale-[1.01] hover:shadow-sm hover:shadow-black">
                    <span className="font-roboto text-white font-medium mt-auto mb-auto">Browse</span>
                </div>
                <span className="ml-auto mr-auto block text-center mt-1 text-xl font-roboto text-[#80868B]">or drag a image file here</span>
            </div>
        </div>
    </>
}
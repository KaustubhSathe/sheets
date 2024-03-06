import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineLiveHelp, MdFunctions, MdKeyboard } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import Link from "next/link";


export default function HelpButton({ text }: { text: string }) {
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const [improve, setImprove] = useState<boolean>(false);
    const [privacyPolicy, setPrivacyPolicy] = useState<boolean>(false);
    const [termsOfService, setTermsOfService] = useState<boolean>(false);
    const [functions, setFunctions] = useState<boolean>(false);
    const [shortcuts, setShortCuts] = useState<boolean>(false);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setDropDownVisible(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <>
            {improve && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setImprove(false)}>
                </div >
                <div className="absolute top-[40vh] left-[40vw] z-[1000] w-[20vw] h-[20vh] bg-white rounded-xl p-[24px]">
                    <p>Drop a mail at <Link href="mailto:kaustubhsathe39443@gmail.com" target="_blank" className="text-blue-600 underline">kaustubhsathe39443@gmail.com</Link> or raise a issue at <Link href="https://github.com/KaustubhSathe/spreadsheet" target="_blank" className="text-blue-600 underline">https://github.com/KaustubhSathe/spreadsheet</Link></p>
                </div>
            </>
            }
            {privacyPolicy && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setPrivacyPolicy(false)}>
                </div >
                <div className="absolute top-[40vh] left-[40vw] z-[1000] w-[20vw] h-[20vh] bg-white rounded-xl p-[24px] flex justify-center">
                    <p className="font-roboto font-semibold text-3xl mt-auto mb-auto block">This app is made just for educational purpose. &#128516;</p>
                </div>
            </>
            }
            {termsOfService && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setTermsOfService(false)}>
                </div >
                <div className="absolute top-[40vh] left-[40vw] z-[1000] w-[20vw] h-[20vh] bg-white rounded-xl p-[24px] flex justify-center">
                    <p className="font-roboto font-semibold text-3xl mt-auto mb-auto block">Use or modify as per your convenience. &#128516;</p>
                </div>
            </>
            }
            {functions && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setFunctions(false)}>
                </div >
                <div className="absolute top-[40vh] left-[40vw] z-[1000] w-[20vw] h-[20vh] bg-white rounded-xl p-[24px] flex justify-center">
                    <p className="font-roboto font-semibold text-3xl mt-auto mb-auto block">List of functions</p>
                </div>
            </>
            }
            {shortcuts && <>
                <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setShortCuts(false)}>
                </div >
                <div className="absolute top-[40vh] left-[40vw] z-[1000] w-[20vw] h-[20vh] bg-white rounded-xl p-[24px] flex flex-col justify-start">
                    <p className="font-roboto font-semibold text-3xl mt-auto mb-auto block mr-auto ml-auto">List of shortcuts</p>
                    <div>
                        <span>Ctrl+S</span>
                    </div>
                </div>
            </>
            }
            <div className="inline-block relative">
                <span ref={ref1} onClick={() => setDropDownVisible(!dropDownVisible)} className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
                {dropDownVisible && <div className="absolute top-[1.7rem] z-[1000] left-0 w-[320px] bg-white rounded-md shadow-md shadow-slate-600">
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setImprove(!improve)}>
                        <MdOutlineLiveHelp className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Help WorkSheets Improve</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setPrivacyPolicy(!privacyPolicy)}>
                        <CgNotes className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Privacy Policy</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setTermsOfService(!termsOfService)}>
                        <CgNotes className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Terms Of Service</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => setFunctions(!functions)}>
                        <MdFunctions className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Functions</span>
                    </div>
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] rounded-md" onClick={() => setShortCuts(!shortcuts)}>
                        <MdKeyboard className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Keyboard Shortcuts</span>
                    </div>
                </div>
                }
            </div>
        </>
    );
}
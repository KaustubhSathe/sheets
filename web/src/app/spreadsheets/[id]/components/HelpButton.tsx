import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineLiveHelp, MdFunctions, MdKeyboard } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import Link from "next/link";
import { FORMULAS } from "./FormulaList";


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
            {improve && <Improve setImprove={setImprove} />}
            {privacyPolicy && <PrivacyPolicy setPrivacyPolicy={setPrivacyPolicy} />}
            {termsOfService && <TermsOfService setTermsOfService={setTermsOfService} />}
            {functions && <Functions setFunctions={setFunctions} />}
            {shortcuts && <ShortCuts setShortCuts={setShortCuts} />}
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

export function Functions({ setFunctions }: { setFunctions: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setFunctions(false)}>
            </div >
            <div className="flex justify-center w-screen h-screen absolute top-0 left-0">
                <div className="z-[2000] mt-auto mb-auto h-[60vh] w-[60vw] bg-white rounded-xl p-[24px] flex flex-col justify-start">
                    <p className="font-roboto font-semibold text-3xl block">List of functions</p>
                    <div className="overflow-y-scroll h-full flex flex-col gap-2">
                        <div
                            className="flex justify-between gap-1"
                        >
                            <span className="text-clip w-[33.33%] bg-red-300 font-bold text-center">Name</span>
                            <span className="text-clip w-[33.33%] bg-green-300 font-bold text-center">Description</span>
                            <span className="text-clip w-[33.33%] bg-blue-300 font-bold text-center">Syntax</span>
                        </div>
                        {FORMULAS.map(x => (
                            <div key={x.Description + x.Syntax}
                                className="flex justify-between gap-1"
                            >
                                <span className="text-clip w-[33.33%] bg-red-300">{x.Name}</span>
                                <span className="text-clip w-[33.33%] bg-green-300">{x.Description}</span>
                                <span className="text-clip w-[33.33%] bg-blue-300">{x.Syntax}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

const SHORTCUTS: {
    "Description": string,
    "Shortcut": string,
}[] = [
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
        {
            "Description": "Save sheet",
            "Shortcut": "Ctrl + S"
        },
    ]

export function ShortCuts({ setShortCuts }: { setShortCuts: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setShortCuts(false)}>
            </div >
            <div className="flex justify-center w-screen h-screen absolute top-0 left-0">
                <div className="z-[1000] mt-auto mb-auto w-[60vw] h-[60vh] bg-white rounded-xl p-[24px] flex flex-col justify-start">
                    <p className="font-roboto font-semibold text-3xl block mr-auto ml-auto">List of shortcuts</p>
                    <div className="overflow-y-scroll h-full w-full p-2">
                        <div className="flex justify-between w-full pl-10 pr-10">
                            <span className="text-lg font-semibold">Description</span>
                            <span className="text-lg font-semibold">Shortcut</span>
                        </div>
                        {
                            SHORTCUTS.map(x => (
                                <div key={x.Shortcut} className="flex justify-between w-full pl-10 pr-10">
                                    <span className="text-lg font-normal">{x.Description}</span>
                                    <span className="text-lg font-normal">{x.Shortcut}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export function TermsOfService({ setTermsOfService }: { setTermsOfService: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setTermsOfService(false)}>
            </div >
            <div className="flex justify-center w-screen h-screen absolute top-0 left-0">
                <div className="z-[1000] mb-auto mt-auto w-[40vw] h-[30vh] bg-white rounded-xl p-[24px] flex justify-center">
                    <p className="font-roboto font-semibold text-3xl mt-auto mb-auto block text-center">Use or modify as per your convenience. &#128516;</p>
                </div>
            </div>
        </>
    )
}

export function PrivacyPolicy({ setPrivacyPolicy }: { setPrivacyPolicy: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setPrivacyPolicy(false)}>
            </div >
            <div className="flex justify-center w-screen h-screen absolute top-0 left-0">
                <div className="z-[1000] mb-auto mt-auto w-[40vw] h-[20vh] bg-white rounded-xl p-[24px] flex justify-center">
                    <p className="font-roboto font-semibold text-3xl mt-auto mb-auto block text-center">This app is made just for educational purpose. &#128516;</p>
                </div>
            </div>
        </>
    )
}

export function Improve({ setImprove }: { setImprove: Dispatch<SetStateAction<boolean>> }) {
    return (
        <>
            <div className="absolute top-0 left-0 w-[100vw] h-[100vh] bg-black opacity-20 z-[1000] flex justify-center align-middle" onClick={() => setImprove(false)}>
            </div >
            <div className="flex justify-center w-screen h-screen absolute top-0 left-0">
                <div className="z-[1000] w-[40vw] h-[20vh] bg-white rounded-xl p-[24px] mt-auto mb-auto flex flex-col justify-center">
                    <p>Drop a mail at <Link href="mailto:kaustubhsathe39443@gmail.com" target="_blank" className="flex-wrap text-blue-600 underline text-center">kaustubhsathe39443@gmail.com</Link> or raise a issue at <Link href="https://github.com/KaustubhSathe/spreadsheet" target="_blank" className="text-blue-600 underline">https://github.com/KaustubhSathe/spreadsheet</Link></p>
                </div>
            </div>
        </>
    )
}
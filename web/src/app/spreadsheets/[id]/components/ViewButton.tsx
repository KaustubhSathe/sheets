import { RootState } from "@/app/lib/redux/store";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { BiShow, BiFullscreen } from "react-icons/bi";
import { FiZoomIn } from "react-icons/fi";
import { MdArrowRight } from "react-icons/md";
import { MdCheck } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setValue as setToolBarVisible } from "../../../lib/redux/toolBarVisibleSlice"
import { setValue as setFormulaBarVisible } from "../../../lib/redux/formulaBarVisibleSlice"

export default function ViewButton({ text }: { text: string }) {
    const toolBarVisible = useSelector((state: RootState) => state.toolBarVisible).value;
    const formulaBarVisible = useSelector((state: RootState) => state.formulaBarVisible).value;
    const dispatch = useDispatch();
    const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
    const ref1 = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState<boolean>(false);
    const [zoom, setZoom] = useState<boolean>(false);
    const [zoomValue, setZoomValue] = useState<number>(1);

    const click = useCallback((e: MouseEvent) => {
        if (ref1.current && !ref1.current.contains(e.target as Node)) {
            setDropDownVisible(false);
            setZoom(false);
            setShow(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", click);

        return () => {
            document.removeEventListener("click", click);
        };
    }, [click]);

    return (
        <div className="inline-block relative">
            <span ref={ref1} onClick={() => setDropDownVisible(!dropDownVisible)} className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
            {dropDownVisible && <div className="absolute top-[1.7rem] z-50 left-0 w-[320px] bg-white">
                <div className="relative">
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onMouseOver={() => {
                        setShow(true)
                        setZoom(false)
                    }}>
                        <BiShow className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Show</span>
                        <MdArrowRight className="block mt-auto mb-auto ml-auto mr-1 h-8 w-8 text-gray-500" />
                    </div>
                    {dropDownVisible && show && <div className="absolute right-[-200px] top-0 w-[200px] bg-white">
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => dispatch(setFormulaBarVisible(!formulaBarVisible))}>
                            {formulaBarVisible && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">Formula Bar</span>
                        </div>
                        <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => dispatch(setToolBarVisible(!toolBarVisible))}>
                            {toolBarVisible && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">Tool Bar</span>
                        </div>
                    </div>}
                </div>
                <div className="relative">
                    <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onMouseOver={() => {
                        setShow(false)
                        setZoom(true)
                    }}>
                        <FiZoomIn className="w-6 h-6 ml-2 mt-auto mb-auto" />
                        <span className="inline-block mt-auto mb-auto">Zoom</span>
                        <MdArrowRight className="block mt-auto mb-auto ml-auto mr-1 h-8 w-8 text-gray-500" />
                    </div>
                    {dropDownVisible && zoom && <div className="absolute right-[-100px] top-0 w-[100px] bg-white">
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '0.5'
                            setZoomValue(0.5)
                        }}>
                            {zoomValue === 0.5 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">50%</span>
                        </div>
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '0.75'
                            setZoomValue(0.75)
                        }}>
                            {zoomValue === 0.75 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">75%</span>
                        </div>
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '0.9'
                            setZoomValue(0.9)
                        }}>
                            {zoomValue === 0.9 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">90%</span>
                        </div>
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '1'
                            setZoomValue(1)
                        }}>
                            {zoomValue === 1 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">100%</span>
                        </div>
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '1.25'
                            setZoomValue(1.25)
                        }}>
                            {zoomValue === 1.25 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">125%</span>
                        </div>
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '1.5'
                            setZoomValue(1.5)
                        }}>
                            {zoomValue === 1.5 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">150%</span>
                        </div>
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '1.75'
                            setZoomValue(1.75)
                        }}>
                            {zoomValue === 1.75 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">175%</span>
                        </div>
                        <div className="flex gap-2 justify-center hover:bg-slate-100 hover:cursor-pointer h-[40px] pl-4" onClick={() => {
                            // @ts-ignore
                            document.body.style.zoom = '2'
                            setZoomValue(2)
                        }}>
                            {zoomValue === 2 && <MdCheck className="inline-block mt-auto mb-auto font-semibold" />}
                            <span className="inline-block mt-auto mb-auto font-semibold text-slate-500">200%</span>
                        </div>
                    </div>}
                </div>

                <div className="flex gap-2 justify-start hover:bg-slate-100 hover:cursor-pointer h-[40px]" onClick={() => {
                    document.body.requestFullscreen()
                }}>
                    <BiFullscreen className="w-6 h-6 ml-2 mt-auto mb-auto" />
                    <span className="inline-block mt-auto mb-auto">Fullscreen</span>
                </div>
            </div>
            }
        </div>
    );
}
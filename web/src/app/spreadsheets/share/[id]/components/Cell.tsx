import { useDispatch, useSelector } from "react-redux";
import globals from '@/app/lib/globals/globals';
import { useRef, useState } from 'react';
import { RootState } from '@/app/lib/redux/store';


export default function Cell({ i, j }: { i: number, j: number }) {
    const dispatch = useDispatch()
    const id = String.fromCharCode(65 + j) + (i + 1).toString();

    return (
        <div className={`relative m-0 p-0 w-full rowbar-${(i + 1).toString()} h-[30px] hover:cursor-cell focus:cursor-text`}>
            <textarea className="overflow-hidden text-sm peer hover:cursor-cell focus:cursor-text overflow-x-clip overflow-y-clip p-[4px] break-words break-all h-full w-full border-b-[1px] border-r-[1px] border-solid border-[#E1E1E1] outline-none m-0 resize-none"
                spellCheck={false}
                id={id}
                key={String.fromCharCode(65 + j) + (i + 1).toString()}
            />
            <div id={id + "comment"}
                className="w-0 h-0 border-r-[10px] border-solid border-b-[10px] border-b-transparent border-r-transparent absolute top-0 right-0 z-50"></div>
            <div className="absolute bottom-[-3px] right-[-3px] w-[10px] h-[10px] rounded-full peer-focus:bg-[#1a73e8] peer-focus:hover:cursor-crosshair peer-focus:z-10">
            </div>
        </div>
    );
}
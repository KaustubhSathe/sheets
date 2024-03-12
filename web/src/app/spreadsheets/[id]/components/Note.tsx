import { CreateNote } from '@/app/api/note';
import globals from '@/app/lib/globals/globals';
import { RootState } from '@/app/lib/redux/store';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setValue as setSelectStart } from '../../../lib/redux/selectStartSlice';
import { setValue as setNotes } from '../../../lib/redux/notesSlice'
import { Note } from '@/app/types/Note';

export default function Note() {
    const spreadSheetMetaData = useSelector((state: RootState) => state.spreadSheetMetaData.value);
    const selectStart = useSelector((state: RootState) => state.selectStart.value)
    const notes = useSelector((state: RootState) => state.notes.value)
    const [note, setNote] = useState<string>("");
    const dispatch = useDispatch();

    const saveNote = useCallback(async () => {
        const access_token = ((new URL(window.location.href).searchParams.get("access_token")) || localStorage.getItem("spreadsheet_access_token")) || "";
        const res = await CreateNote(access_token, note, spreadSheetMetaData?.SpreadSheetID, globals.selectedSheet, selectStart.id);
        return res;
    }, [note, selectStart, spreadSheetMetaData]);

    useEffect(() => {
        const filteredNote = notes.filter(x => x.CellID.localeCompare(selectStart.id) === 0)
        setNote(filteredNote.length > 0 ? filteredNote[0].Content : "")
        notes.forEach(cc => {
            const cellMarker = document.getElementById(cc.CellID + "comment") as HTMLDivElement
            cellMarker.style.borderRightColor = "#fcbc03"
            const cell = document.getElementById(cc.CellID) as HTMLDivElement
            cellMarker.addEventListener('mouseover', (e) => {
                dispatch(setSelectStart({
                    id: cc.CellID,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    text: "",
                    top: 0,
                    display: "none"
                }))
                const note = document.getElementById("note") as HTMLDivElement;
                const x = document.getElementById(cc.CellID) as HTMLDivElement
                note.style.display = "block"
                note.style.zIndex = "1000"
                note.style.position = "absolute"

                // bottom case
                if (Math.abs(e.clientY - window.innerHeight) < note.offsetHeight) {
                    note.style.top = x.getBoundingClientRect().top - note.offsetHeight + cell.offsetHeight + "px"
                } else {
                    note.style.top = x.getBoundingClientRect().top + "px"
                }

                // left case
                if (Math.abs(e.clientX) < note.offsetWidth) {
                    note.style.left = x.getBoundingClientRect().left + "px"
                    note.style.top = x.getBoundingClientRect().top - note.offsetHeight + "px"
                } else {
                    note.style.left = x.getBoundingClientRect().left - note.offsetWidth + "px"
                }

                // right case
                if (Math.abs(e.clientX - window.innerWidth) < note.offsetWidth) {
                    note.style.left = x.getBoundingClientRect().left - note.offsetWidth + "px"
                    note.style.top = x.getBoundingClientRect().top - note.offsetHeight + "px"
                } else {
                    note.style.left = x.getBoundingClientRect().left - note.offsetWidth + "px"
                }
            })

            cell.addEventListener('mouseover', (e) => {
                dispatch(setSelectStart({
                id: cc.CellID,
                bottom: 0,
                left: 0,
                right: 0,
                text: "",
                top: 0,
                display: "none"
            }))
                const note = document.getElementById("note") as HTMLDivElement;
                const x = document.getElementById(cc.CellID) as HTMLDivElement
                note.style.display = "block"
                note.style.zIndex = "1000"
                note.style.position = "absolute"

                // bottom case
                if (Math.abs(e.clientY - window.innerHeight) < note.offsetHeight) {
                    note.style.top = x.getBoundingClientRect().top - note.offsetHeight + cell.offsetHeight + "px"
                } else {
                    note.style.top = x.getBoundingClientRect().top + "px"
                }

                // left case
                if (Math.abs(e.clientX) < note.offsetWidth) {
                    note.style.left = x.getBoundingClientRect().left + "px"
                    note.style.top = x.getBoundingClientRect().top - note.offsetHeight + "px"
                } else {
                    note.style.left = x.getBoundingClientRect().left - note.offsetWidth + "px"
                }

                // right case
                if (Math.abs(e.clientX - window.innerWidth) < note.offsetWidth) {
                    note.style.left = x.getBoundingClientRect().right - note.offsetWidth + "px"
                    note.style.top = x.getBoundingClientRect().top - note.offsetHeight + "px"
                }
            })


            cell.addEventListener('mouseleave', () => {
                const comment = document.getElementById("note") as HTMLDivElement;
                comment.style.display = "none";
            })

            cellMarker.addEventListener('mouseleave', () => {
                const comment = document.getElementById("note") as HTMLDivElement;
                comment.style.display = "none";
            })
        })
    }, [notes, dispatch, selectStart]);

    return (
        <div
            onMouseOver={() => {
                const comment = document.getElementById("note") as HTMLDivElement;
                comment.style.display = "block";
            }}
            onMouseLeave={() => {
                const comment = document.getElementById("note") as HTMLDivElement;
                comment.style.display = "none";
            }}
            id="note" className='p-2 hidden bg-white outline outline-1 outline-black rounded-lg'>
            <textarea value={note} className="w-[350px] bg-white rounded-lg p-2 outline outline-[1px] outline-black" onChange={(e) => {
                setNote(e.target.value)
            }} />
            <div className='flex justify-end gap-2'>
                <button onClick={() => {
                    const comment = document.getElementById("note") as HTMLDivElement;
                    comment.style.display = "none"
                }} className='w-[75px] h-[36px] text-blue-700 font-semibold hover:rounded-full hover:bg-blue-100'>Cancel</button>
                {note === "" ? <button className='mr-4 w-[100px] h-[36px] font-semibold text-gray-500 bg-gray-200 rounded-full'>Save</button> :
                    <button onClick={async (e) => {
                        const res = await saveNote(); 
                        if (res.status === 200) {
                            const nn: Note = await res.json();
                            dispatch(setNotes([...notes.filter(x => x.CellID.localeCompare(selectStart.id) !== 0), nn]))
                        }
                    }} className="mr-4 w-[100px] h-[36px] font-semibold text-white bg-[#0b57d0] rounded-full hover:shadow-sm hover:shadow-black">
                        Save
                    </button>}
            </div>
        </div>
    )
}
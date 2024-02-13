import { SpreadSheet } from "@/app/types/SpreadSheet";
import { Command } from "@/app/types/Command";

const globals: {
    selectStart: string,
    selectEnd: string,
    copyStart: string | null,
    copyEnd: string | null,
    cutStart: string | null,
    cutEnd: string | null,
    spreadsheet: SpreadSheet,
    selectedSheet: number,
    rows: number,
    columns: number,
    saved: boolean,
    ctrlDown: boolean,
    undoStack: Command[],
    redoStack: Command[],
} =  {
    selectStart: "A1",
    selectEnd: "A1",
    copyStart: null,
    copyEnd: null,
    cutStart: null,
    cutEnd: null,
    spreadsheet: {} as SpreadSheet,
    selectedSheet: 0,
    columns: 26,
    rows: 100,
    saved: true,
    ctrlDown: false,
    undoStack: [],
    redoStack: []
}

export default globals;
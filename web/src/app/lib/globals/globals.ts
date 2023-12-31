import { SpreadSheet } from "@/app/types/SpreadSheet";

const globals: {
    selectStart: string,
    selectEnd: string,
    copyStart: string | null,
    copyEnd: string | null,
    cutStart: string | null,
    cutEnd: string | null,
    spreadsheet: SpreadSheet,
} =  {
    selectStart: "A1",
    selectEnd: "A1",
    copyStart: null,
    copyEnd: null,
    cutStart: null,
    cutEnd: null,
    spreadsheet: {} as SpreadSheet
}

export default globals;
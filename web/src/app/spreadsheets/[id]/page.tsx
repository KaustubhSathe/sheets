import CellsGrid from "./components/CellsGrid";
import FormulaBar from "./components/FormulaBar";
import MenuBar from "./components/MenuBar";
import SheetsBar from "./components/SheetsBar";
import ToolsBar from "./components/ToolsBar";

export default function Spreadsheet() {
    return (
        <>
            <MenuBar />
            <ToolsBar />
            <FormulaBar />
            <CellsGrid />
            <SheetsBar />
        </>
    )
}

export type Comment = {
    PK: string,
    SK: string,
    CreatedAt: Date,
    UpdatedAt: Date,
    DeletedAt: Date | null,
    UserName: string,
    UserID: number,
    SpreadSheetID: string,
    SheetNo: number,
    CellID: string,
    Content: string
}

export type SpreadSheet = {
    PK: string,
    SK: string,
    CreatedAt: Date,
    UpdatedAt: Date,
    DeletedAt: Date | null,
    UserName: string,
    UserID: number,
    SpreadSheetTitle: string,
    Favorited: boolean,
    Sheets: Sheet[],
    LastOpened: Date
}

export type Sheet = {
    SheetName: string,
    SheetIndex: number,
    State: {
        [key: string]: State
    }
}

export type State = {
    FontWeight: string,
    FontStyle: string,
    TextDecoration: string,
    FontColor: string,
    BackGroundColor: string,
    FontFamily: string,
    TextContent: string,
}
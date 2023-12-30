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
    Bold: boolean,
    Italic: boolean,
    StrikeThrough: boolean,
    Underline: boolean,
    FontColor: string,
    BackGroundColor: string,
    FontType: string,
    TextContent: string,
}
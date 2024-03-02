import { Sheet, Version } from "../types/SpreadSheet";

export async function GetSpreadSheet(access_token: string, spreadsheet_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet?spreadsheet_id=${spreadsheet_id}`, {
        method: "GET",
        headers: {
            'spreadsheet_access_token': access_token,
        },
    })

    return response;
}

export async function ShareSpreadSheet(spreadsheet_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/share?spreadsheet_id=${spreadsheet_id}`, {
        method: "GET",
    })

    return response;
}

export async function CreateSpreadSheet(access_token: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet`, {
        method: "POST",
        headers: {
            'spreadsheet_access_token': access_token,
        },
    })

    return response;
}

export async function CopySpreadSheet(access_token: string, spreadSheetTitle: string | undefined, favorited: boolean | undefined, versions: Version[] | undefined) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet_copy`, {
        method: "POST",
        headers: {
            'spreadsheet_access_token': access_token,
        },
        body: JSON.stringify({
            SpreadSheetTitle: spreadSheetTitle,
            Favorited: favorited,
            Versions: versions,
        })
    })

    return response;
}



export async function DeleteSpreadSheet(access_token: string, spreadsheet_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet?spreadsheet_id=${spreadsheet_id}`, {
        method: "DELETE",
        headers: {
            'spreadsheet_access_token': access_token,
        },
    })

    return response;
}

export async function UpdateSpreadSheetTitle(access_token: string, spreadsheet_id: string | undefined, newTitle: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet_title`, {
        method: "PATCH",
        headers: {
            'spreadsheet_access_token': access_token,
        },
        body: JSON.stringify({
            NewTitle: newTitle,
            SpreadSheetID: spreadsheet_id,
        }),
    })

    return response;
}


export async function UpdateSheets(access_token: string,  body: {
    Versions: Version[],
    SpreadSheetID: string,
}) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet_sheets`, {
        method: "PATCH",
        headers: {
            'spreadsheet_access_token': access_token,
        },
        body: JSON.stringify(body),
    })

    return response;
}
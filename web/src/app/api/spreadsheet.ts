export async function GetSpreadSheet(access_token: string, spreadsheet_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet?spreadsheet_id=${spreadsheet_id}`, {
        method: "GET",
        headers: {
            'spreadsheet_access_token': access_token,
        },
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

export async function CopySpreadSheet(access_token: string, spreadSheetTitle: string, favorited: boolean, states: String[]) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet_copy`, {
        method: "POST",
        headers: {
            'spreadsheet_access_token': access_token,
        },
        body: JSON.stringify({
            SpreadSheetTitle: spreadSheetTitle,
            Favorited: favorited,
            States: states,
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

export async function UpdateSpreadSheetTitle(access_token: string, spreadsheet_id: string, newTitle: string) {
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

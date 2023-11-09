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


export async function DeleteSpreadSheet(access_token: string, spreadsheet_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/spreadsheet?spreadsheet_id=${spreadsheet_id}`, {
        method: "DELETE",
        headers: {
            'spreadsheet_access_token': access_token,
        },
    })

    return response;
}

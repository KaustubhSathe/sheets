export async function CreateComment(access_token: string, content: string, spreadsheetID: string, sheetNo: number, cellID: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/comment`, {
        method: "POST",
        headers: {
            'spreadsheet_access_token': access_token,
        },
        body: JSON.stringify({
            "Content": content,
            "SpreadSheetID": spreadsheetID,
            "SheetNo": sheetNo,
            "CellID": cellID,
        })
    })

    return response;
}

export async function GetComments(access_token: string, spreadsheet_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/comment?spreadsheet_id=${spreadsheet_id}`, {
        method: "GET",
        headers: {
            'spreadsheet_access_token': access_token,
        },
    })

    return response;
}


export async function DeleteComment(access_token: string, spreadsheet_id: string, comment_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/comment?spreadsheet_id=${spreadsheet_id}&comment_id=${comment_id}`, {
        method: "DELETE",
        headers: {
            'spreadsheet_access_token': access_token,
        },
    })

    return response;
}


export async function UpdateComment(access_token: string, spreadsheet_id: string, comment_id: string, content: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/comment`, {
        method: "PATCH",
        body: JSON.stringify({
            "Content": content, 
            "SpreadSheetID": spreadsheet_id,
            "CommentID": comment_id,
        }),
        headers: {
            'spreadsheet_access_token': access_token,
        },
    })

    return response;
}
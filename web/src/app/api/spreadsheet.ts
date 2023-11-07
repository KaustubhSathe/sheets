export async function Get(access_token: string, spreadsheet_id: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/auth/authenticate`, {
        method: "POST",
        body: JSON.stringify({
            access_token
        })
    })

    return response;
}
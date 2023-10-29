export async function Authenticate(access_token: string) {
    const response = await fetch(`${process.env.API_DOMAIN}/api/auth/authenticate`, {
        method: "POST",
        body: JSON.stringify({
            access_token
        })
    })

    return response;
}
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    const code = (new URL(request.url)).searchParams.get("code");

    const formdata = {
        'code': String(code),
        'client_id': String(process.env.GITHUB_CLIENT_ID),
        'client_secret': String(process.env.GITHUB_CLIENT_SECRET)
    }

    const res: {
        access_token: string,
        token_type: string,
        scope: string
    } = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            'Accept': 'application/json'
        },
        body: new URLSearchParams(formdata)
    }).then(res => res.json())

    return Response.redirect(`${process.env.DOMAIN}/spreadsheets?access_token=${res.access_token}`)
}

import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // const access_token = (new URL(request.url).searchParams.get("access_token")) || request.headers.get("access_token")
    // if (access_token === null) {
    //     return NextResponse.redirect(`${process.env.DOMAIN}/error`)
    // }
    // const res = await fetch(`https://api.github.com/applications/${String(process.env.GITHUB_CLIENT_ID)}/token`, {
    //     body: JSON.stringify({
    //         "access_token": access_token
    //     }),
    //     headers: {
    //         Accept: "application/vnd.github+json",
    //         Authorization: "Basic " + btoa(`${String(process.env.GITHUB_CLIENT_ID)}:${String(process.env.GITHUB_CLIENT_SECRET)}`),
    //         "Content-Type": "application/x-www-form-urlencoded",
    //         "X-Github-Api-Version": "2022-11-28"
    //     },
    //     method: "POST"
    // });

    // console.log(res.status)

    return NextResponse.next()
}

export const config = {
    matcher: '/spreadsheets/:path*',
}
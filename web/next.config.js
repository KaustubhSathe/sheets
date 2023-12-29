/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        'GITHUB_CLIENT_ID': process.env.GITHUB_CLIENT_ID,
        'API_DOMAIN': 'https://pulpynl9a6.execute-api.ap-south-1.amazonaws.com'
    }
}

module.exports = nextConfig

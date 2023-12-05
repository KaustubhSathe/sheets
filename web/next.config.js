/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        'GITHUB_CLIENT_ID': process.env.GITHUB_CLIENT_ID,
        'API_DOMAIN': 'https://2798ugv1z7.execute-api.us-east-1.amazonaws.com'
    }
}

module.exports = nextConfig

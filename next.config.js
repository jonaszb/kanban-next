/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    redirects: async () => {
        return [
            {
                source: '/board',
                destination: '/',
                permanent: true,
            },
        ];
    },
};

module.exports = nextConfig;

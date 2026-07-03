const nextConfig = {
    reactStrictMode: false,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '3002',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: '127.0.0.1',
                port: '3002',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
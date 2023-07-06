/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snow3all.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NEXT_PUBLIC_RUN_MODE === "production" ? true : false,
  },
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 322, 384, 512, 576, 640, 750],
    deviceSizes: [320, 384, 420, 576, 732, 768, 828, 1024, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'http',
        hostname: 'adminapi.riderplay.co.kr',
        pathname: '/api/images/*',
      },
      {
        protocol: 'https',
        hostname: 'playadminapi.barogo.in',
        pathname: '/api/images/*',
      },
      {
        protocol: 'https',
        hostname: 'api.riderplay.co.kr',
        pathname: '/api/images/*',
      },
      {
        protocol: 'https',
        hostname: 'playapi.barogo.in',
        pathname: '/api/images/*',
      },
      {
        protocol: 'https',
        hostname: 't1.daumcdn.net',
        pathname: '/gift/message-card/template/image/*',
      },
      {
        protocol: 'https',
        hostname: 'st.kakaocdn.net',
        pathname: '/product/gift/*/*',
      },
      {
        protocol: 'https',
        hostname: 'k.kakaocdn.net',
        pathname: '/dn/*/*/*/*',
      }
    ],
  },
  domains: ['https://api.riderplay.co.kr', "*"]
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */

const runtimeCaching = require('next-pwa/cache');
const withPlugins = require("next-compose-plugins");
const withPWA = require("next-pwa");

const path = require('path')

const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    styledComponents: true,
    removeConsole: process.env.NEXT_PUBLIC_RUN_MODE === "production" ? true : false,
  },
  webpack: config => {
    // 아래를 추가합니다.
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },

  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 322, 384, 512, 576, 640, 750],
    deviceSizes: [320, 384, 420, 576, 732, 768, 828, 1024, 1200, 1920],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.riderplay.co.kr',
        port: '',
        pathname: '/api/images/*',
      },
      {
        protocol: 'https',
        hostname: 'playapi.barogo.in',
        port: '',
        pathname: '/api/images/*',
      },
    ],
    domains: ['https://playapi.barogo.in', "*"],
    domains: ['https://api.riderplay.co.kr', "*"]
  }
}

module.exports = withPlugins(
  [[
    withPWA, {
      pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        runtimeCaching,
      },
    }
    ,],], nextConfig)
// module.exports = withPWA(nextConfig)

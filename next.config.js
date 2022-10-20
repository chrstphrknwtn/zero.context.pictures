/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['64.media.tumblr.com']
  }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    unoptimized: true, // Disable image optimization to avoid caching issues with SVGs
  },
}

module.exports = nextConfig


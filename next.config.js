/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // Enable image optimization for better performance
    // SVGs are automatically served as-is (Next.js handles them without optimization by default)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ['image/avif', 'image/webp'],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Note: swcMinify is enabled by default in Next.js 14+
  // Optimize webpack for better chunk management and prevent cache issues
  webpack: (config, { dev, isServer }) => {
    // In development, use simpler chunking to prevent cache corruption
    if (dev) {
      // Use simpler module IDs in development to prevent chunk loading errors
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named', // More stable than 'deterministic' in dev
        chunkIds: 'named',
      };
    }
    
    // Only optimize chunking in production builds
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },
}

module.exports = nextConfig

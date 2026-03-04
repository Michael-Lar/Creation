/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // Enable image optimization for better performance
    // SVGs are automatically served as-is (Next.js handles them without optimization by default)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
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
        moduleIds: 'named', // Readable names in dev (deterministic is used in prod)
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
  // Redirects for SEO - handle old URLs that may have been indexed
  async redirects() {
    return [
      {
        source: '/about',
        destination: '/#about',
        permanent: true,
      },
      // Project ID → slug redirects (permanent 301)
      { source: '/projects/1',  destination: '/projects/10773-10775-ashton-ave',      permanent: true },
      { source: '/projects/2',  destination: '/projects/11047-11103-hartsook-st',     permanent: true },
      { source: '/projects/3',  destination: '/projects/152-n-la-brea-blvd',          permanent: true },
      { source: '/projects/4',  destination: '/projects/153-155-s-robertson-blvd',    permanent: true },
      { source: '/projects/5',  destination: '/projects/1601-1611-s-robertson-blvd',  permanent: true },
      { source: '/projects/6',  destination: '/projects/421-n-beverly-drive',         permanent: true },
      { source: '/projects/7',  destination: '/projects/431-n-fairfax-ave',           permanent: true },
      { source: '/projects/8',  destination: '/projects/4651-4661-w-pico-blvd',       permanent: true },
      { source: '/projects/9',  destination: '/projects/6801-n-figueroa-st',          permanent: true },
      { source: '/projects/10', destination: '/projects/7174-melrose-ave',            permanent: true },
      { source: '/projects/11', destination: '/projects/7801-7807-beverly-blvd',      permanent: true },
      { source: '/projects/12', destination: '/projects/7910-7928-w-3rd-st',          permanent: true },
    ];
  },
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone", // Disabled for dev mode stability
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium-min', 'puppeteer-extra', 'puppeteer-extra-plugin-stealth'],
  outputFileTracingExcludes: {
    '*': [
      './**/node_modules/@swc/core-linux-x64-gnu',
      './**/node_modules/@swc/core-linux-x64-musl',
      './**/node_modules/@esbuild/linux-x64',
      './**/node_modules/webpack',
      './**/node_modules/terser',
      './**/node_modules/typescript',
      './**/node_modules/eslint',
      './**/node_modules/jest',
      './**/node_modules/@types',
      './**/*.map',
      './**/*.d.ts',
    ],
  },
  experimental: {
    scrollRestoration: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.google.com' },
      { protocol: 'https', hostname: '**.gstatic.com' },
    ],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      puppeteer: 'puppeteer-core',
    };
    
    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 100,
          },
          gsap: {
            test: /[\\/]node_modules[\\/]gsap[\\/]/,
            name: 'gsap',
            priority: 90,
          },
          lenis: {
            test: /[\\/]node_modules[\\/]@studio-freight[\\/]lenis[\\/]/,
            name: 'lenis',
            priority: 80,
          },
          recharts: {
            test: /[\\/]node_modules[\\/]recharts[\\/]/,
            name: 'recharts',
            priority: 70,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
          },
        },
      },
    };
    
    return config;
  },
};

export default nextConfig;

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false, // Enable in dev to test offline mode
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  serverExternalPackages: ['puppeteer-core', '@sparticuz/chromium-min', 'puppeteer-extra', 'puppeteer-extra-plugin-stealth'],
  experimental: {
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
      '/api/v2/scrape': [
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
        './**/node_modules/next', // Experimental: try to exclude next internals if possible
      ],
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      puppeteer: 'puppeteer-core',
    };
    return config;
  },
};

export default withPWA(nextConfig);

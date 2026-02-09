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
  experimental: {},
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      puppeteer: 'puppeteer-core',
    };
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['puppeteer', 'website-scraper', 'website-scraper-puppeteer'],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['puppeteer', 'puppeteer-core', 'website-scraper', 'website-scraper-puppeteer'],
};

export default nextConfig;

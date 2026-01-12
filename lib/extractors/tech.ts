import * as cheerio from 'cheerio';

export interface DetectedTech {
    name: string;
    version?: string;
}

export function detectTechnologies(html: string, cssContent: string = ''): string[] {
    const techs = new Set<string>();
    const $ = cheerio.load(html);

    const htmlLower = html.toLowerCase();
    const cssLower = cssContent.toLowerCase();

    // Next.js
    if (
        $('script[src*="_next/static"]').length > 0 ||
        $('div#__next').length > 0 ||
        htmlLower.includes('next-head-count') ||
        htmlLower.includes('__next_data__') ||
        htmlLower.includes('next.js')
    ) {
        techs.add('Next.js');
        techs.add('React');
    }

    // React
    if (
        $('script[src*="react.development.js"]').length > 0 ||
        $('script[src*="react.production.min.js"]').length > 0 ||
        htmlLower.includes('react-root') ||
        htmlLower.includes('data-reactroot') ||
        htmlLower.includes('__react')
    ) {
        techs.add('React');
    }

    // Vue
    if (
        htmlLower.includes('data-v-') ||
        htmlLower.includes('__vue__') ||
        htmlLower.includes('vue.js') ||
        $('script[src*="vue.js"]').length > 0
    ) {
        techs.add('Vue.js');
    }

    // Angular
    if (
        $('[ng-version]').length > 0 ||
        htmlLower.includes('ng-app') ||
        htmlLower.includes('ng-controller') ||
        htmlLower.includes('_ngcontent-')
    ) {
        techs.add('Angular');
    }

    // Tailwind CSS
    if (
        htmlLower.includes('tailwind') ||
        htmlLower.includes('tw-') ||
        cssLower.includes('--tw-') ||
        cssLower.includes('tw-bg-')
    ) {
        techs.add('Tailwind CSS');
    }

    // Bootstrap
    if (
        htmlLower.includes('bootstrap') ||
        htmlLower.includes('bs-') ||
        cssLower.includes('.bs-') ||
        $('link[href*="bootstrap"]').length > 0
    ) {
        techs.add('Bootstrap');
    }

    // WordPress
    if (
        htmlLower.includes('wp-content') ||
        htmlLower.includes('wp-includes') ||
        htmlLower.includes('wp-block') ||
        $('meta[name="generator"]').attr('content')?.toLowerCase().includes('wordpress')
    ) {
        techs.add('WordPress');
    }

    // Shopify
    if (
        htmlLower.includes('shopify-section') ||
        htmlLower.includes('cdn.shopify.com') ||
        htmlLower.includes('shopify.checkout')
    ) {
        techs.add('Shopify');
    }

    // Google Analytics
    if (
        htmlLower.includes('googletagmanager') ||
        htmlLower.includes('ga-') ||
        htmlLower.includes('google-analytics')
    ) {
        techs.add('Google Analytics');
    }

    return Array.from(techs);
}

import * as cheerio from 'cheerio';

export interface ScrapedMetadata {
    title: string;
    description: string;
    keywords: string[];
    favicon: string;
}

export function extractMetadata(html: string, baseUrl: string): ScrapedMetadata {
    const $ = cheerio.load(html);

    const title = $('title').first().text() || $('meta[property="og:title"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    const keywordsRaw = $('meta[name="keywords"]').attr('content') || '';
    const keywords = keywordsRaw ? keywordsRaw.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 0) : [];

    let favicon =
        $('link[rel="apple-touch-icon"]').attr('href') ||
        $('link[rel="icon"]').attr('href') ||
        $('link[rel*="icon"]').attr('href') ||
        '/favicon.ico';

    if (favicon && !favicon.startsWith('http')) {
        try {
            favicon = new URL(favicon, baseUrl).toString();
        } catch { /* ignore */ }
    }

    return {
        title: title.trim(),
        description: description.trim(),
        keywords,
        favicon
    };
}

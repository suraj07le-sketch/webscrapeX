import * as cheerio from 'cheerio';

export interface SEOAudit {
    score: number;
    findings: Array<{
        title: string;
        status: 'pass' | 'fail' | 'warn';
        message: string;
        impact: 'high' | 'medium' | 'low';
    }>;
    metrics: {
        h1Count: number;
        h2Count: number;
        imagesWithoutAlt: number;
        totalImages: number;
        metaDescriptionLength: number;
        titleLength: number;
        hasCanonical: boolean;
        hasOgTags: boolean;
        hasSchemaOrg: boolean;
    };
}

export function auditSEO(html: string): SEOAudit {
    const $ = cheerio.load(html);
    const findings: SEOAudit['findings'] = [];
    let score = 100;

    const title = $('title').text().trim();
    const description = $('meta[name="description"]').attr('content') || '';
    const h1s = $('h1');
    const images = $('img');
    const canonical = $('link[rel="canonical"]').attr('href');
    const ogTags = $('meta[property^="og:"]');
    const schema = $('script[type="application/ld+json"]');

    // 1. Title Tag
    if (!title) {
        findings.push({ title: 'Title Tag', status: 'fail', message: 'Missing title tag.', impact: 'high' });
        score -= 15;
    } else if (title.length < 30 || title.length > 60) {
        findings.push({ title: 'Title Tag', status: 'warn', message: `Title length is ${title.length} characters. Recommended: 30-60.`, impact: 'medium' });
        score -= 5;
    } else {
        findings.push({ title: 'Title Tag', status: 'pass', message: 'Title tag is optimized.', impact: 'low' });
    }

    // 2. Meta Description
    if (!description) {
        findings.push({ title: 'Meta Description', status: 'fail', message: 'Missing meta description.', impact: 'high' });
        score -= 15;
    } else if (description.length < 120 || description.length > 160) {
        findings.push({ title: 'Meta Description', status: 'warn', message: `Description length is ${description.length} characters. Recommended: 120-160.`, impact: 'medium' });
        score -= 5;
    } else {
        findings.push({ title: 'Meta Description', status: 'pass', message: 'Meta description is optimized.', impact: 'low' });
    }

    // 3. Heading Structure
    if (h1s.length === 0) {
        findings.push({ title: 'H1 Tag', status: 'fail', message: 'Missing H1 heading.', impact: 'high' });
        score -= 10;
    } else if (h1s.length > 1) {
        findings.push({ title: 'H1 Tag', status: 'warn', message: 'Multiple H1 tags found. Stick to one per page.', impact: 'medium' });
        score -= 5;
    } else {
        findings.push({ title: 'H1 Tag', status: 'pass', message: 'H1 tag structure is correct.', impact: 'low' });
    }

    // 4. Image Alt Texts
    let altless = 0;
    images.each((i, el) => {
        if (!$(el).attr('alt')) altless++;
    });
    if (altless > 0) {
        findings.push({ title: 'Image Alt Text', status: 'fail', message: `${altless} images are missing alt attributes.`, impact: 'medium' });
        score -= Math.min(10, altless * 2);
    } else if (images.length > 0) {
        findings.push({ title: 'Image Alt Text', status: 'pass', message: 'All images have alt attributes.', impact: 'low' });
    }

    // 5. Canonical Tag
    if (!canonical) {
        findings.push({ title: 'Canonical Tag', status: 'warn', message: 'Missing canonical URL link.', impact: 'medium' });
        score -= 5;
    } else {
        findings.push({ title: 'Canonical Tag', status: 'pass', message: 'Canonical tag is present.', impact: 'low' });
    }

    // 6. Structured Data
    if (schema.length === 0) {
        findings.push({ title: 'Structured Data', status: 'warn', message: 'No Schema.org (JSON-LD) found.', impact: 'medium' });
        score -= 5;
    } else {
        findings.push({ title: 'Structured Data', status: 'pass', message: 'Structured data (JSON-LD) detected.', impact: 'low' });
    }

    return {
        score: Math.max(0, score),
        findings,
        metrics: {
            h1Count: h1s.length,
            h2Count: $('h2').length,
            imagesWithoutAlt: altless,
            totalImages: images.length,
            metaDescriptionLength: description.length,
            titleLength: title.length,
            hasCanonical: !!canonical,
            hasOgTags: ogTags.length > 0,
            hasSchemaOrg: schema.length > 0
        }
    };
}

import path from 'path';
import fs from 'fs/promises';
// import puppeteer from 'puppeteer-core'; // REMOVED TOP-LEVEL IMPORT
import { supabase, supabaseAdmin } from './supabase';
import { extractMetadata } from './extractors/meta';
import { extractColors } from './extractors/colors';
import { extractFonts } from './extractors/fonts';
import { detectTechnologies } from './extractors/tech';
import { extractContent } from './extractors/content';
import { ScrapeResult } from './scraper-types';

const supabaseClient = (supabaseAdmin || supabase) as any;

export async function scrapeWebsite(id: string, url: string): Promise<ScrapeResult> {
    const log = async (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
        console.log(`[${id}] ${message}`);
        await supabaseClient.from('logs').insert({ website_id: id, message, type });
    };

    try {
        let liveHtml = '';
        let browser;

        // Scope these so they are accessible later
        let networkImages = new Set<string>();
        let networkFonts = new Set<string>();
        let networkCSS = new Set<string>();

        try {
            await log('Launching deep-analysis browser (Hybrid Mode)...');

            // Stealth Plugin Implementation

            // Stealth Plugin Implementation
            const puppeteerExtra = (await import('puppeteer-extra')).default;
            const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;

            puppeteerExtra.use(StealthPlugin());

            if (process.env.BROWSER_WS_ENDPOINT) {
                // 1. Remote Browser (Highest Priority - Best for Vercel Pro/Scaling)
                await log(`Connecting to remote browser...`);
                browser = await puppeteerExtra.connect({
                    browserWSEndpoint: process.env.BROWSER_WS_ENDPOINT,
                });
            } else if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION) {
                // 2. Vercel Serverless (Uses @sparticuz/chromium)
                await log('Detected Serverless Environment. Launching Chromium...');
                try {
                    const chromium = (await import('@sparticuz/chromium-min')).default as any;
                    // Note: puppeteer-core is still needed for types/compat, but we use puppeteer-extra to launch

                    // Recommended settings for Vercel
                    chromium.setGraphicsMode = false;

                    browser = await puppeteerExtra.launch({
                        args: [
                            ...chromium.args,
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--window-size=1920,1080',
                            '--hide-scrollbars'
                        ],
                        defaultViewport: { width: 1920, height: 1080 },
                        executablePath: await chromium.executablePath(),
                        headless: chromium.headless,
                    });
                } catch (e: any) {
                    await log(`Serverless Chrome launch failed: ${e.message}`, 'error');
                    throw e;
                }
            } else {
                // 3. Local Development (Auto-detects Chrome)
                let executablePath = process.env.CHROME_EXECUTABLE_PATH;

                if (!executablePath) {
                    const commonPaths = [
                        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                        '/usr/bin/google-chrome',
                        '/usr/bin/chromium-browser'
                    ];
                    for (const p of commonPaths) {
                        try {
                            await fs.access(p);
                            executablePath = p;
                            await log(`Detected local Chrome at: ${p}`);
                            break;
                        } catch { }
                    }
                }

                if (executablePath) {
                    await log(`Launching local Chrome from ${executablePath}...`);
                    browser = await puppeteerExtra.launch({
                        args: ['--no-sandbox', '--disable-setuid-sandbox'],
                        executablePath: executablePath,
                        headless: true
                    });
                } else {
                    await log('No browser found. Please install Chrome or set CHROME_EXECUTABLE_PATH.', 'error');
                }
            }

            if (browser) {
                const page = await browser.newPage();
                await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

                // Network Interception for Assets (The "Pro" Way)
                // Variables defined in outer scope

                await page.setRequestInterception(true);
                page.on('request', (req: any) => {
                    const resourceType = req.resourceType();
                    if (['image', 'font', 'stylesheet'].includes(resourceType)) {
                        req.continue();
                    } else {
                        req.continue();
                    }
                });

                page.on('response', async (response) => {
                    const url = response.url();
                    const resourceType = response.request().resourceType();

                    if (resourceType === 'image' && !url.startsWith('data:')) {
                        networkImages.add(url);
                    } else if (resourceType === 'font') {
                        networkFonts.add(url);
                    } else if (resourceType === 'stylesheet') {
                        networkCSS.add(url);
                    }
                });

                await log(`Navigating to ${url}...`);
                try {
                    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
                } catch (e) {
                    await log('Navigation timeout reached, proceeding with partial load...', 'warning');
                }

                // Scroll to trigger lazy loading
                await log('Scrolling to trigger lazy loading...');
                await page.evaluate(async () => {
                    await new Promise<void>((resolve) => {
                        let totalHeight = 0;
                        let distance = 100; // Slower scroll
                        let timer = setInterval(() => {
                            let scrollHeight = document.body.scrollHeight;
                            window.scrollBy(0, distance);
                            totalHeight += distance;
                            if (totalHeight >= scrollHeight || totalHeight > 15000) { // Increased cap to 15000px
                                clearInterval(timer);
                                resolve();
                            }
                        }, 200); // Wait longer between scrolls (200ms)
                    });
                });

                await log('Performing deep DOM extraction (Colors, Fonts, Images)...');
                // Give a moment for final lazy loads to settle
                await new Promise(resolve => setTimeout(resolve, 2000));

                deepFindings = await page.evaluate(() => {
                    const colors = new Set<string>();
                    const fonts = new Set<string>();
                    const images = new Set<string>();

                    // Sample elements for colors and fonts
                    const allElements = document.querySelectorAll('*');
                    const sampleSize = Math.min(allElements.length, 1000);
                    for (let i = 0; i < sampleSize; i++) {
                        const el = allElements[i];
                        const style = window.getComputedStyle(el);

                        // Colors
                        if (style.color && style.color.startsWith('rgb')) colors.add(style.color);
                        if (style.backgroundColor && style.backgroundColor.startsWith('rgb') && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                            colors.add(style.backgroundColor);
                        }

                        // Fonts
                        if (style.fontFamily) {
                            const firstFont = style.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
                            if (firstFont && firstFont !== 'inherit') fonts.add(firstFont);
                        }

                        // Background Images
                        if (style.backgroundImage && style.backgroundImage !== 'none') {
                            const match = style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/);
                            if (match) images.add(match[1]);
                        }
                    }

                    // Regular Images & Lazy Loading Support
                    document.querySelectorAll('img').forEach(img => {
                        // Priority order for image source
                        const src = img.getAttribute('src') ||
                            img.getAttribute('data-src') ||
                            img.getAttribute('data-original') ||
                            img.getAttribute('data-lazy-src');

                        if (src && !src.startsWith('data:')) {
                            images.add(src);
                        }

                        // Parse srcset if available
                        if (img.srcset) {
                            const candidates = img.srcset.split(',').map(s => s.trim().split(' ')[0]);
                            candidates.forEach(url => {
                                if (url && !url.startsWith('data:')) images.add(url);
                            });
                        }
                    });

                    // background-images from all elements (computed style is expensive, so we do it selectively if needed)
                    // The previous sample loop checks computed styles, so we keep that.

                    return {
                        colors: Array.from(colors),
                        fonts: Array.from(fonts),
                        images: Array.from(images)
                    };
                });

                liveHtml = await page.content();
                await browser.close();

                // MERGE Network Findings with DOM Findings
                networkImages.forEach(img => deepFindings.images.push(img));
                networkFonts.forEach(font => deepFindings.fonts.push(font));

                // Remove duplicates
                deepFindings.images = Array.from(new Set(deepFindings.images));
                deepFindings.fonts = Array.from(new Set(deepFindings.fonts));

                await log(`Live analysis complete. Found ${deepFindings.colors.length} colors, ${deepFindings.fonts.length} fonts, and ${deepFindings.images.length} images (Network+DOM).`);
            }
        } catch (e: any) {
            await log(`Deep analysis partially failed: ${e.message}`, 'warning');
            if (browser) await browser.close();
        }

        // Use /tmp in Vercel/Lambda, otherwise fallback to local tmp
        const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION;
        const baseDir = isServerless ? '/tmp' : path.resolve(process.cwd(), 'tmp');
        const scrapeDir = path.join(baseDir, 'scrapes', id);

        let htmlContent = liveHtml;

        if (!htmlContent) {
            // Fallback to fetching HTML text directly if Puppeteer/Archive failed
            try {
                await log('Fetching static HTML content as fallback...');
                const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
                if (!resp.ok) throw new Error(`Status ${resp.status}`);
                htmlContent = await resp.text();
            } catch (e: any) {
                await log(`Static fetch failed: ${e.message}. Using minimal error page.`, 'warning');
                htmlContent = `<html><head><title>${url}</title></head><body><p>Scrape failed to retrieve content for ${url}</p></body></html>`;
            }
        }

        // Process Everything
        await log('Synthesizing results...');
        const metadata = extractMetadata(htmlContent, url);
        const technologies = detectTechnologies(htmlContent, deepFindings.colors.join(' '));

        const mergedImages: any[] = deepFindings.images.filter(u => u && !u.startsWith('data:')).map(url => ({ url, size: 0 }));
        const cssFiles: any[] = Array.from(networkCSS).map(url => ({ url, size: 0 })); // Use Network CSS
        const jsFiles: any[] = [];
        const rawAssets: any[] = [];
        const linksSet = new Set<string>();

        // Extract Links from rendered HTML
        const contentData = extractContent(htmlContent, url);
        contentData.links.internal.forEach((l: string) => linksSet.add(l));
        contentData.links.external.forEach((l: string) => linksSet.add(l));

        // Refine colors and fonts
        const processedColors = extractColors(deepFindings.colors.join(' '));
        const processedFonts = extractFonts('', htmlContent); // Checks for @import/google fonts
        deepFindings.fonts.forEach(f => processedFonts.push(f));

        // Process Images & Upload to Supabase Storage
        await log('Uploading top images to persistent storage...');
        const persistentImages: string[] = [];
        const topImages = mergedImages.map(img => {
            if (img.url.startsWith('/')) {
                img.url = new URL(img.url, url).href;
            }
            return img;
        }).slice(0, 100);

        for (const img of topImages) {
            try {
                const response = await fetch(img.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Referer': url
                    },
                    signal: AbortSignal.timeout(10000)
                });
                if (!response.ok) continue;

                const buffer = await response.arrayBuffer();
                const contentType = response.headers.get('content-type') || 'image/png';
                const filename = `img_${Math.random().toString(36).substring(7)}_${path.basename(img.url).split('?')[0]}`;
                const storagePath = `${id}/${filename}`;

                const { error: uploadError } = await supabaseClient.storage
                    .from('scrapes')
                    .upload(storagePath, buffer, { contentType, upsert: true });

                if (!uploadError) {
                    const { data: { publicUrl } } = supabaseClient.storage
                        .from('scrapes')
                        .getPublicUrl(storagePath);
                    persistentImages.push(publicUrl);
                }
            } catch (e) {
                // Skip failed downloads
            }
        }

        // Calculate Design Intelligence Scores
        const seoReadiness = Math.min(100, (
            (metadata.title ? 20 : 0) +
            (metadata.description ? 20 : 0) +
            (metadata.keywords.length > 0 ? 10 : 0) +
            (metadata.favicon ? 10 : 0) +
            (htmlContent.includes('<h1') ? 20 : 0) +
            (url.startsWith('https') ? 20 : 0)
        ));

        const technicalMaturity = (technologies.length > 3 ? 'Modern' : technologies.length > 0 ? 'Established' : 'Basic');

        const visualCohesion = (deepFindings.colors.length > 3 && deepFindings.fonts.length > 1) ? 'Unified' : 'Standard';

        const finalResult: ScrapeResult = {
            url,
            metadata: {
                title: metadata.title || 'No Title',
                description: metadata.description || 'No description found.',
                keywords: metadata.keywords || [],
                favicon: metadata.favicon || '/favicon.ico'
            },
            designIntelligence: {
                visualCohesion,
                technicalMaturity,
                seoReadiness
            },
            colors: processedColors.slice(0, 25),
            fonts: Array.from(new Set(processedFonts)).filter(f => f.length > 2).slice(0, 30),
            images: persistentImages.length > 0 ? persistentImages.map(url => ({ url })) : topImages,
            cssFiles,
            jsFiles,
            html: htmlContent,
            links: Array.from(linksSet).filter(l => l.length > 1).slice(0, 100),
            technologies,
            rawAssets
        };

        // Save Findings to Supabase
        await log(`Saving analysis results to database... (Client: ${supabaseAdmin ? 'Admin' : 'Anon'})`);
        const { error: metaError } = await supabaseClient.from('metadata').insert({
            website_id: id,
            title: finalResult.metadata.title,
            description: finalResult.metadata.description,
            keywords: finalResult.metadata.keywords,
            favicon: finalResult.metadata.favicon,
            color_palette: finalResult.colors,
            fonts: finalResult.fonts,
            technologies: finalResult.technologies,
            // images: persistentImages, // REMOVED: Column missing in DB schema causing crash
        });

        if (metaError) {
            await log(`Metadata insert failed: ${metaError.message}`, 'error');
            throw new Error(`Metadata DB Error: ${metaError.message}`);
        }

        // Save images to assets table
        const finalImagesToSave = persistentImages.length > 0
            ? persistentImages
            : topImages.map(img => img.url);

        if (finalImagesToSave.length > 0) {
            const imageAssets = finalImagesToSave.map((imgUrl: string) => ({
                website_id: id,
                file_type: 'image',
                url: imgUrl,
                created_at: new Date().toISOString()
            }));

            const { error: assetsError } = await supabaseClient
                .from('assets')
                .insert(imageAssets);

            if (assetsError) {
                await log(`Failed to save image assets: ${assetsError.message}`, 'warning');
            } else {
                await log(`Saved ${persistentImages.length} images to assets table`, 'success');
            }
        }

        if (rawAssets.length > 0) {
            await supabaseClient.from('assets').insert(rawAssets);
        }

        // Save JSON for UI retrieval - ensure directory exists
        await fs.mkdir(scrapeDir, { recursive: true });
        await fs.writeFile(path.join(scrapeDir, 'result.json'), JSON.stringify(finalResult, null, 2));

        // Update main status
        await supabaseClient.from('websites').update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            total_assets: rawAssets.length,
        }).eq('id', id);

        await log('Scrape completed successfully!', 'success');
        return finalResult;

    } catch (error: any) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        await log(`Scrape failed: ${errorMessage}`, 'error');
        await supabaseClient.from('websites').update({ status: 'failed' }).eq('id', id);
        throw error;
    }
}

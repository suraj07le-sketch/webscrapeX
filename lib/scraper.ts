import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import * as cheerio from 'cheerio';
// import puppeteer from 'puppeteer-core'; // REMOVED TOP-LEVEL IMPORT
import { supabase, supabaseAdmin } from './supabase';
import { extractMetadata } from './extractors/meta';
import { extractColors } from './extractors/colors';
import { extractFonts } from './extractors/fonts';
import { detectTechnologies } from './extractors/tech';
import { extractContent } from './extractors/content';
import { ScrapeResult } from './scraper-types';

const supabaseClient = (supabaseAdmin || supabase) as any;

export async function scrapeWebsite(id: string, url: string, skipDownloads: boolean = false, fastMode: boolean = true): Promise<ScrapeResult> {
    const log = async (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
        console.log(`[${id}] ${message}`);
        await supabaseClient.from('logs').insert({ website_id: id, message, type });
    };

    const startTime = Date.now();
    const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_VERSION);

    if (isServerless && !supabaseAdmin) {
        console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing! Scraper cannot save data.');
        // We continue, but it will likely fail.
    }

    // Time Budget Helper
    const checkTimeBudget = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed > 55) {
            throw new Error('TIME_BUDGET_EXCEEDED');
        }
    };

    try {
        let deepFindings = { colors: [] as string[], fonts: [] as string[], images: [] as string[] };
        let liveHtml = '';
        let browser;

        // Scope these so they are accessible later
        let networkImages = new Set<string>();
        let networkFonts = new Set<string>();
        let networkCSS = new Set<string>();

        // --- FAST MODE (CHEERIO) ---
        if (fastMode) {
            await log('Running Fast Mode (Cheerio)...');
            try {
                // Fetch HTML
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s hard timeout for fetch

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9'
                    },
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                liveHtml = await response.text();

                const $ = cheerio.load(liveHtml);

                // Extract Images
                $('img').each((i, el) => {
                    const src = $(el).attr('src') || $(el).attr('data-src');
                    if (src && !src.startsWith('data:')) deepFindings.images.push(src);

                    const srcset = $(el).attr('srcset');
                    if (srcset) {
                        srcset.split(',').map(s => s.trim().split(' ')[0]).forEach(u => {
                            if (u && !u.startsWith('data:')) deepFindings.images.push(u);
                        });
                    }
                });

                // Extract High-Value Metadata Images (OG, Twitter)
                const ogImage = $('meta[property="og:image"]').attr('content');
                if (ogImage) deepFindings.images.push(ogImage);

                const twitterImage = $('meta[name="twitter:image"]').attr('content');
                if (twitterImage) deepFindings.images.push(twitterImage);

                // Extract Icons
                $('link[rel*="icon"]').each((i, el) => {
                    const href = $(el).attr('href');
                    if (href) deepFindings.images.push(href);
                });

                // Extract Fonts (basic regex on styles/links)
                $('link[rel="stylesheet"]').each((i, el) => {
                    const href = $(el).attr('href');
                    if (href) networkCSS.add(href);
                });

                // Simple Font Family extraction from style tags (heuristic)
                const styleContent = $('style').text();
                const fontMatches = styleContent.match(/font-family:\s*['"]?([^;,'"}]+)['"]?/g);
                if (fontMatches) {
                    fontMatches.forEach(m => {
                        const f = m.replace(/font-family:\s*['"]?/g, '').replace(/['"]?$/g, '').trim();
                        deepFindings.fonts.push(f);
                    });
                }

                await log(`Fast Scan complete. Found ${deepFindings.images.length} candidate images.`);

            } catch (e: any) {
                await log(`Fast Mode failed (${e.message}). Falling back to Deep Mode...`, 'warning');
                // If fast mode fails, we could fallback, or if strict 10s is needed, we might just stop.
                // For now, let's allow fallback if we have time, but usually we won't.
                // If the user wants STRICT 10s, we should probably throw or return what we have.
            }
        }

        // --- DEEP MODE (PUPPETEER) ---
        if (!liveHtml && !fastMode) {
            try {
                await log('Launching deep-analysis browser (Hybrid Mode)...');
                // ... strict check for browser ...

                // Stealth Plugin Implementation
                const puppeteerExtra = (await import('puppeteer-extra')).default;
                const StealthPlugin = (await import('puppeteer-extra-plugin-stealth')).default;

                puppeteerExtra.use(StealthPlugin());

                checkTimeBudget();

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

                        const launchArgs = [
                            ...chromium.args,
                            '--no-sandbox',
                            '--disable-setuid-sandbox',
                            '--disable-web-security',
                            '--disable-features=IsolateOrigins',
                            '--disable-site-isolation-trials',
                            '--window-size=1920,1080',
                            '--hide-scrollbars'
                        ];

                        const proxyUrl = process.env.PROXY_URL;
                        if (proxyUrl) {
                            launchArgs.push(`--proxy-server=${proxyUrl}`);
                        }

                        browser = await puppeteerExtra.launch({
                            args: launchArgs,
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

                checkTimeBudget();

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

                    page.on('response', async (response: any) => {
                        const url = response.url();
                        const req = response.request();

                        if (!req) return;

                        const resourceType = req.resourceType();

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
                        // Reduced timeout to 30s to allow time for processing
                        // Using networkidle0 to wait for dynamic content
                        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
                    } catch (e: any) {
                        await log(`Navigation timeout/idle warning: ${e.message}, proceeding...`, 'warning');
                    }

                    // Explicitly wait for body to ensure substantial content
                    try {
                        await page.waitForSelector('body', { timeout: 5000 });
                    } catch (e) {
                        // ignore
                    }

                    checkTimeBudget();

                    // Scroll to trigger lazy loading (FASTER)
                    await log('Scrolling to trigger lazy loading...');
                    // Scroll to trigger lazy loading (FASTER)
                    await log('Scrolling to trigger lazy loading...');
                    await page.evaluate(async (isServerless: boolean) => {
                        await new Promise<void>((resolve) => {
                            let totalHeight = 0;
                            let distance = 300; // Faster scroll
                            // On Vercel, scroll less to save time/memory
                            const maxScroll = isServerless ? 10000 : 15000;

                            let timer = setInterval(() => {
                                let scrollHeight = document.body.scrollHeight;
                                window.scrollBy(0, distance);
                                totalHeight += distance;
                                if (totalHeight >= scrollHeight || totalHeight > maxScroll) {
                                    clearInterval(timer);
                                    resolve();
                                }
                            }, 100);
                        });
                    }, isServerless);

                    checkTimeBudget();

                    await log('Performing deep DOM extraction (Colors, Fonts, Images)...');
                    // Reduced wait
                    await new Promise(resolve => setTimeout(resolve, 1000));

                    deepFindings = await page.evaluate(() => {
                        const colors = new Set<string>();
                        const fonts = new Set<string>();
                        const images = new Set<string>();

                        // --- SHADOW DOM "AGENT" ---
                        // recursively find ALL elements including Shadow DOM
                        function getAllElements(root: Document | ShadowRoot | Element = document): Element[] {
                            const all: Element[] = [];
                            // Get all children in this root
                            const nodes = Array.from(root.querySelectorAll('*'));

                            nodes.forEach(node => {
                                all.push(node);
                                // Recursively check for shadow root
                                if (node.shadowRoot) {
                                    all.push(...getAllElements(node.shadowRoot));
                                }
                            });
                            return all;
                        }

                        const allElements = getAllElements();
                        const sampleSize = Math.min(allElements.length, 2000); // Increased sample size

                        for (let i = 0; i < allElements.length; i++) {
                            const el = allElements[i];

                            // Limit style checks to first 2000 elements for performance
                            if (i < 2000) {
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

                            // Image Elements (check ALL, not just sample)
                            if (el.tagName.toLowerCase() === 'img') {
                                const img = el as HTMLImageElement;
                                const src = img.getAttribute('src') ||
                                    img.getAttribute('data-src') ||
                                    img.getAttribute('data-original') ||
                                    img.currentSrc; // Use currentSrc as the ultimate truth

                                if (src && !src.startsWith('data:')) images.add(src);

                                // Srcset parsing
                                if (img.srcset) {
                                    img.srcset.split(',').map(s => s.trim().split(' ')[0]).forEach(url => {
                                        if (url && !url.startsWith('data:')) images.add(url);
                                    });
                                }
                            }

                            // SVGs (common in AI sites like Pucho)
                            if (el.tagName.toLowerCase() === 'svg' || el.tagName.toLowerCase() === 'image') {
                                // sometimes SVGs reference images via href/xlink:href
                                const href = el.getAttribute('href') || el.getAttribute('xlink:href');
                                if (href && !href.startsWith('data:')) images.add(href);
                            }
                        }

                        // background-images from all elements (computed style is expensive, so we do it selectively if needed)
                        // The previous sample loop checks computed styles, so we keep that.

                        return {
                            colors: Array.from(colors),
                            fonts: Array.from(fonts),
                            images: Array.from(images)
                        };
                    });

                    liveHtml = await page.content();
                    if (browser) await browser.close();

                    // MERGE Network Findings with DOM Findings
                    networkImages.forEach(img => deepFindings.images.push(img));
                    networkFonts.forEach(font => deepFindings.fonts.push(font));

                    // Remove duplicates
                    deepFindings.images = Array.from(new Set(deepFindings.images));
                    deepFindings.fonts = Array.from(new Set(deepFindings.fonts));

                    await log(`Live analysis complete. Found ${deepFindings.colors.length} colors, ${deepFindings.fonts.length} fonts, and ${deepFindings.images.length} images (Network+DOM).`);
                }
            } catch (e: any) {
                // ... existing catch ...
                // IF THE ERROR IS OUR CUSTOM TIMEOUT, WE CATCH IT GENTLY HERE
                if (e.message === 'TIME_BUDGET_EXCEEDED') {
                    await log('Time budget exceeded (55s). Stopping browser tasks and saving current progress.', 'warning');
                    // We proceed to process whatever 'deepFindings' and 'liveHtml' we have
                } else {
                    if (!fastMode) await log(`Deep analysis partially failed: ${e.message}`, 'warning');
                }
                if (browser) await browser.close();
            }
        }

        // Use /tmp in Vercel/Lambda, otherwise fallback to local tmp
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
        // Combine DOM colors with Network CSS for better tech (Tailwind/Bootstrap) detection
        const combinedCssForTech = deepFindings.colors.join(' ') + ' ' + Array.from(networkCSS).join(' ');
        const technologies = detectTechnologies(htmlContent, combinedCssForTech);

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

        // Safety: If we are running out of time (Vercel max 60s), skip heavy uploads
        const elapsed = (Date.now() - startTime) / 1000;
        const timeRemaining = 60 - elapsed;
        const safeImageLimit = (isServerless && timeRemaining < 20) ? 20 : (isServerless ? 50 : 100);

        if (timeRemaining < 10) {
            await log(`Time critical (${Math.round(timeRemaining)}s left). Skipping image downloads to save data.`, 'warning');
        }

        const persistentImages: string[] = [];
        const topImages = mergedImages.map(img => {
            if (img.url.startsWith('/')) {
                img.url = new URL(img.url, url).href;
            }
            return img;
        }).slice(0, safeImageLimit);

        if (!skipDownloads) {
            // --- PARALLEL DOWNLOADER ---
            await log(`Downloading ${topImages.length} images in parallel...`);
            const downloaded = await downloadAssets(id, topImages.map(img => img.url), url, supabaseClient);
            persistentImages.push(...downloaded);
        } else {
            await log('Skipping image downloads (Discovery Mode). Assets will be queued.', 'info');
            // We still want to return the URLs so the UI knows what exists
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

        // CRITICAL FIX FOR VERCEL: Upload the full result.json to Storage so it persists!
        try {
            await log('Persisting full result.json to Storage...');
            const jsonBuffer = Buffer.from(JSON.stringify(finalResult, null, 2));
            const { error: jsonUploadError } = await supabaseClient.storage
                .from('scrapes')
                .upload(`${id}/result.json`, jsonBuffer, { contentType: 'application/json', upsert: true });

            if (jsonUploadError) {
                await log(`Failed to upload result.json: ${jsonUploadError.message}`, 'warning');
            } else {
                await log('Successfully persisted full result data.', 'success');
            }
        } catch (e: any) {
            await log(`Error uploading result.json: ${e.message}`, 'warning');
        }

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

/**
 * Standalone function to download assets for an existing scrape ID
 */
export async function downloadAssets(id: string, imageUrls: string[], referer: string, sbClient?: any): Promise<string[]> {
    const client = sbClient || supabaseAdmin || supabase;
    const downloadedUrls: string[] = [];

    // Helper to download a single image
    const downloadImage = async (url: string) => {
        try {
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                    'Referer': referer
                },
                signal: AbortSignal.timeout(8000)
            });

            if (!response.ok) return null;

            const buffer = await response.arrayBuffer();
            const contentType = response.headers.get('content-type') || 'image/png';
            const safeName = path.basename(url.split('?')[0]).replace(/[^a-zA-Z0-9._-]/g, '_');
            const filename = `img_${crypto.randomUUID().substring(0, 8)}_${safeName}`;
            const storagePath = `${id}/${filename}`;

            const { error: uploadError } = await client.storage
                .from('scrapes')
                .upload(storagePath, buffer, { contentType, upsert: true });

            if (!uploadError) {
                const { data: { publicUrl } } = client.storage
                    .from('scrapes')
                    .getPublicUrl(storagePath);
                return publicUrl;
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    // Batch runner
    const batchSize = 10;
    for (let i = 0; i < imageUrls.length; i += batchSize) {
        const batch = imageUrls.slice(i, i + batchSize);
        const results = await Promise.all(batch.map(u => downloadImage(u)));
        results.forEach(res => {
            if (res) downloadedUrls.push(res);
        });
    }

    return downloadedUrls;
}

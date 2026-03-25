export type ScrapeMode = 'full' | 'social' | 'content' | 'design';
import { SEOAudit } from './extractors/seo';

export interface ScrapeResult {
    url: string;
    metadata: {
        title: string;
        description: string;
        keywords: string[];
        favicon: string;
    };
    colors: string[];
    fonts: string[];
    images: Array<{
        url: string;
        localPath?: string;
        size?: number; // bytes
    }>;
    cssFiles: Array<{
        name: string;
        size: number;
        content?: string; // Optional raw content
    }>;
    jsFiles: Array<{
        name: string;
        size: number;
    }>;
    html: string;
    links: string[];
    technologies: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rawAssets: any[];
    social?: SocialMetadata;
    contentAnalysis?: ContentAnalysis;
    linkedinProfile?: LinkedInProfile;
    designIntelligence?: {
        visualCohesion: string;
        technicalMaturity: string;
        seoReadiness: number;
    };
    screenshotUrl?: string;
    pdfUrl?: string;
    seo?: SEOAudit;
}

export interface LinkedInProfile {
    name: string;
    headline: string;
    location: string;
    about?: string;
    image?: string;
    connections?: string;
    experience: Array<{
        title: string;
        company: string;
        duration?: string;
        location?: string;
    }>;
    education: Array<{
        school: string;
        degree?: string;
        duration?: string;
    }>;
}

export interface SocialMetadata {
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    twitterCreator?: string;
}

export interface ContentAnalysis {
    readabilityScore?: number;
    readingTime?: number; // Estimated minutes
    cleanText?: string;   // Main article text
    byline?: string;      // Author/Byline
    wordCount?: number;
}

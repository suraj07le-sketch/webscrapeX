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
}

// Simple in-memory cache for development, can be swapped with Redis in production
interface CacheItem {
    data: any;
    timestamp: number;
    ttl: number;
}

class Cache {
    private cache = new Map<string, CacheItem>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes

    set(key: string, data: any, ttl: number = this.defaultTTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    get(key: string): any | null {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }
        
        // Check if expired
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Generate cache key from URL and parameters
    generateKey(url: string, mode: string, fastMode: boolean): string {
        const hash = require('crypto').createHash('md5')
            .update(`${url}:${mode}:${fastMode}`)
            .digest('hex');
        return `scrape:${hash}`;
    }

    // Clean expired items periodically
    cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.cache.entries()) {
            if (now - item.timestamp > item.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

export const cache = new Cache();

// Run cleanup every 10 minutes
if (typeof window === 'undefined') { // Server-side only
    setInterval(() => {
        cache.cleanup();
    }, 10 * 60 * 1000);
}
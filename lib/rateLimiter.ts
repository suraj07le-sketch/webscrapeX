interface RateLimitItem {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private limits = new Map<string, RateLimitItem>();
    private defaultWindow = 60 * 1000; // 1 minute
    private defaultMax = 10; // 10 requests per minute

    check(key: string, max: number = this.defaultMax, window: number = this.defaultWindow): { allowed: boolean; remaining: number; resetTime: number } {
        const now = Date.now();
        let item = this.limits.get(key);
        
        // Reset if window has passed
        if (!item || now > item.resetTime) {
            item = {
                count: 0,
                resetTime: now + window
            };
        }
        
        item.count++;
        this.limits.set(key, item);
        
        const allowed = item.count <= max;
        const remaining = Math.max(0, max - item.count);
        
        return {
            allowed,
            remaining,
            resetTime: item.resetTime
        };
    }

    // Cleanup old entries
    cleanup(): void {
        const now = Date.now();
        for (const [key, item] of this.limits.entries()) {
            if (now > item.resetTime) {
                this.limits.delete(key);
            }
        }
    }
}

export const rateLimiter = new RateLimiter();

// Run cleanup every 5 minutes
if (typeof window === 'undefined') { // Server-side only
    setInterval(() => {
        rateLimiter.cleanup();
    }, 5 * 60 * 1000);
}
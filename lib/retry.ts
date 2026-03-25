interface RetryOptions {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
    backoffFactor: number;
}

const defaultOptions: RetryOptions = {
    maxRetries: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 30000, // 30 seconds
    backoffFactor: 2
};

export async function withRetry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
): Promise<T> {
    const config = { ...defaultOptions, ...options };
    let lastError: Error;
    
    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            if (attempt === config.maxRetries) {
                throw lastError;
            }
            
            // Calculate delay with exponential backoff
            const delay = Math.min(
                config.baseDelay * Math.pow(config.backoffFactor, attempt),
                config.maxDelay
            );
            
            // Add jitter to prevent thundering herd
            const jitter = Math.random() * 0.3 * delay;
            await new Promise(resolve => setTimeout(resolve, delay + jitter));
        }
    }
    
    throw lastError!;
}

// Circuit breaker pattern
export class CircuitBreaker {
    private failures = 0;
    private lastFailureTime = 0;
    private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
    
    constructor(
        private failureThreshold = 5,
        private resetTimeout = 60000 // 1 minute
    ) {}
    
    async execute<T>(fn: () => Promise<T>): Promise<T> {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.resetTimeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }
        
        try {
            const result = await fn();
            
            // Success - reset if we were in HALF_OPEN
            if (this.state === 'HALF_OPEN') {
                this.state = 'CLOSED';
                this.failures = 0;
            }
            
            return result;
        } catch (error) {
            this.failures++;
            this.lastFailureTime = Date.now();
            
            if (this.failures >= this.failureThreshold) {
                this.state = 'OPEN';
            } else if (this.state === 'HALF_OPEN') {
                this.state = 'OPEN';
            }
            
            throw error;
        }
    }
    
    getState(): string {
        return this.state;
    }
    
    getFailures(): number {
        return this.failures;
    }
}
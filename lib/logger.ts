// Simple error logging utility
// Can be extended to use Sentry, DataDog, or other error tracking services

interface ErrorContext {
    userId?: string;
    scrapeId?: string;
    url?: string;
    mode?: string;
    timestamp?: string;
    userAgent?: string;
    ip?: string;
    [key: string]: any;
}

class ErrorLogger {
    private static instance: ErrorLogger;
    private isProduction = process.env.NODE_ENV === 'production';

    static getInstance(): ErrorLogger {
        if (!ErrorLogger.instance) {
            ErrorLogger.instance = new ErrorLogger();
        }
        return ErrorLogger.instance;
    }

    async logError(error: Error | string, context: ErrorContext = {}): Promise<void> {
        const errorData = {
            message: typeof error === 'string' ? error : error.message,
            stack: typeof error === 'string' ? undefined : error.stack,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            version: process.env.npm_package_version || 'unknown',
            ...context
        };

        // Always log to console
        console.error('Error logged:', errorData);

        // In production, you could send to external service
        if (this.isProduction) {
            try {
                // TODO: Integrate with Sentry or other error tracking service
                // await sentry.captureException(error, { extra: context });
                
                // For now, just log to console in production
                console.error('Production error:', JSON.stringify(errorData, null, 2));
            } catch (loggingError) {
                console.error('Failed to log error to external service:', loggingError);
            }
        }
    }

    async logWarning(message: string, context: ErrorContext = {}): Promise<void> {
        const warningData = {
            message,
            level: 'warning',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            ...context
        };

        console.warn('Warning logged:', warningData);

        if (this.isProduction) {
            // TODO: Send to external service
            console.warn('Production warning:', JSON.stringify(warningData, null, 2));
        }
    }

    async logInfo(message: string, context: ErrorContext = {}): Promise<void> {
        const infoData = {
            message,
            level: 'info',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            ...context
        };

        console.log('Info logged:', infoData);

        if (this.isProduction) {
            // TODO: Send to external service
            console.log('Production info:', JSON.stringify(infoData, null, 2));
        }
    }

    // Capture performance metrics
    async capturePerformance(
        operation: string,
        duration: number,
        context: ErrorContext = {}
    ): Promise<void> {
        const perfData = {
            operation,
            duration,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            ...context
        };

        console.log('Performance metric:', perfData);

        if (this.isProduction) {
            // TODO: Send to external service (e.g., Sentry performance, DataDog APM)
            console.log('Production performance:', JSON.stringify(perfData, null, 2));
        }
    }
}

export const errorLogger = ErrorLogger.getInstance();

// Convenience functions
export const logError = (error: Error | string, context?: ErrorContext) => 
    errorLogger.logError(error, context);

export const logWarning = (message: string, context?: ErrorContext) => 
    errorLogger.logWarning(message, context);

export const logInfo = (message: string, context?: ErrorContext) => 
    errorLogger.logInfo(message, context);

export const capturePerformance = (operation: string, duration: number, context?: ErrorContext) =>
    errorLogger.capturePerformance(operation, duration, context);
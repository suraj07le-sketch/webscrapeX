import { useState, useEffect, useCallback, useRef } from 'react';

interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class ClientCache {
    private cache = new Map<string, CacheItem<any>>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes

    set<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    get<T>(key: string): T | null {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }
        
        // Check if expired
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data as T;
    }

    delete(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    // Generate cache key
    generateKey(url: string, params?: Record<string, any>): string {
        const base = url;
        const paramString = params ? JSON.stringify(params) : '';
        
        // Simple hash function
        const hash = (str: string): string => {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32bit integer
            }
            return hash.toString(36);
        };
        
        return `${hash(base)}:${hash(paramString)}`;
    }
}

const clientCache = new ClientCache();

// Hook for cached fetch
export function useCachedFetch<T>(
    url: string | null,
    options?: RequestInit,
    cacheKey?: string,
    ttl?: number
) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(false);
    const controllerRef = useRef<AbortController | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            controllerRef.current?.abort();
        };
    }, []);

    const fetchData = useCallback(async (skipCache = false) => {
        if (!url) return;
        
        const key = cacheKey || url;
        
        // Check cache first
        if (!skipCache) {
            const cachedData = clientCache.get<T>(key);
            if (cachedData) {
                setData(cachedData);
                return;
            }
        }
        
        // Cancel any in-flight request
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            setData(result);
            
            // Cache the result
            clientCache.set(key, result, ttl);
        } catch (err) {
            // Silently ignore abort errors
            if (err instanceof DOMException && err.name === 'AbortError') {
                return;
            }
            setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }, [url, options, cacheKey, ttl]);

    // Initial fetch
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Refresh function
    const refresh = useCallback(() => {
        fetchData(true);
    }, [fetchData]);

    return { data, error, loading, refresh };
}

// Hook for cached mutation
export function useCachedMutation<T, P = any>(
    mutationFn: (params: P) => Promise<T>,
    options?: {
        onSuccess?: (data: T, params: P) => void;
        onError?: (error: Error, params: P) => void;
        invalidateKeys?: string[];
    }
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const mutate = useCallback(async (params: P): Promise<T | null> => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await mutationFn(params);
            
            // Invalidate cache keys if specified
            if (options?.invalidateKeys) {
                options.invalidateKeys.forEach(key => clientCache.delete(key));
            }
            
            options?.onSuccess?.(result, params);
            return result;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            options?.onError?.(error, params);
            return null;
        } finally {
            setLoading(false);
        }
    }, [mutationFn, options]);

    return { mutate, loading, error };
}

export { clientCache };
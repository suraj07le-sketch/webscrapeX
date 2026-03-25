'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface FetchState<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

interface UseFastFetchOptions {
  cacheTime?: number; // Time to keep data in cache (ms)
  staleTime?: number; // Time before data is considered stale (ms)
  retryCount?: number;
  retryDelay?: number;
  prefetch?: boolean;
  enabled?: boolean;
}

// In-memory cache with TTL
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export function useFastFetch<T>(
  url: string | null,
  options: UseFastFetchOptions = {}
) {
  const {
    cacheTime = 5 * 60 * 1000, // 5 minutes
    staleTime = 30 * 1000, // 30 seconds
    retryCount = 2,
    retryDelay = 1000,
    prefetch = false,
    enabled = true,
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    loading: false,
  });

  const mountedRef = useRef(true);
  const controllerRef = useRef<AbortController | null>(null);
  const cacheKey = url || '';

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const fetchWithRetry = useCallback(async (fetchUrl: string, attempt = 0): Promise<T> => {
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(fetchUrl, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'max-age=30',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      // Silently ignore abort errors (component unmounted or timeout during navigation)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw error; // Let caller handle via mountedRef check
      }
      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        return fetchWithRetry(fetchUrl, attempt + 1);
      }
      throw error;
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, [retryCount, retryDelay]);

  const fetchData = useCallback(async (skipCache = false) => {
    if (!url || !enabled) return;

    // Check cache first
    if (!skipCache) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < staleTime) {
        setState({ data: cached.data, error: null, loading: false });
        return;
      }
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await fetchWithRetry(url);
      
      if (mountedRef.current) {
        setState({ data, error: null, loading: false });
        
        // Cache the result
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: cacheTime,
        });
      }
    } catch (error) {
      // Silently ignore abort errors (component unmounted or timeout during navigation)
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
      if (mountedRef.current) {
        setState({
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          loading: false,
        });
      }
    }
  }, [url, enabled, cacheKey, staleTime, fetchWithRetry, cacheTime]);

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled]);

  // Refresh function
  const refresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Prefetch function (for navigation)
  const prefetchUrl = useCallback((prefetchUrl: string) => {
    const cached = cache.get(prefetchUrl);
    if (!cached || Date.now() - cached.timestamp > staleTime) {
      // Start fetching but don't update state
      fetchWithRetry(prefetchUrl)
        .then(data => {
          cache.set(prefetchUrl, {
            data,
            timestamp: Date.now(),
            ttl: cacheTime,
          });
        })
        .catch(() => {
          // Silently fail prefetch
        });
    }
  }, [staleTime, fetchWithRetry, cacheTime]);

  return {
    ...state,
    refresh,
    prefetchUrl,
  };
}

// Hook for prefetching on hover/focus
export function usePrefetch() {
  const prefetchUrl = useCallback((url: string) => {
    const cached = cache.get(url);
    if (!cached || Date.now() - cached.timestamp > 30000) {
      // Start prefetch in background
      fetch(url, { cache: 'force-cache' })
        .then(res => res.json())
        .then(data => {
          cache.set(url, {
            data,
            timestamp: Date.now(),
            ttl: 5 * 60 * 1000,
          });
        })
        .catch(() => {});
    }
  }, []);

  return { prefetchUrl };
}

// Hook for optimistic updates
export function useOptimisticMutation<T>(
  mutationFn: (data: T) => Promise<any>,
  options?: {
    onSuccess?: (data: any, variables: T) => void;
    onError?: (error: Error, variables: T) => void;
    invalidateKeys?: string[];
  }
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (data: T) => {
    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(data);
      
      // Invalidate cache keys if specified
      if (options?.invalidateKeys) {
        options.invalidateKeys.forEach(key => cache.delete(key));
      }
      
      options?.onSuccess?.(result, data);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      options?.onError?.(error, data);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [mutationFn, options]);

  return { mutate, loading, error };
}
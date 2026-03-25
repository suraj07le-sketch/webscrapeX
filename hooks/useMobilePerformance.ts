'use client';

import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fps: number;
  isLowEndDevice: boolean;
  isSlowNetwork: boolean;
  memoryUsage: number;
  isLowMemory: boolean;
}

export function useMobilePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    isLowEndDevice: false,
    isSlowNetwork: false,
    memoryUsage: 0,
    isLowMemory: false,
  });

  useEffect(() => {
    // Detect low-end devices
    const isLowEndDevice = (): boolean => {
      // Check hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;
      if (cores <= 2) return true;

      // Check device memory (if available)
      const memory = (navigator as any).deviceMemory;
      if (memory && memory <= 2) return true;

      // Check connection type
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        if (effectiveType === 'slow-2g' || effectiveType === '2g') return true;
      }

      return false;
    };

    // Detect slow network
    const isSlowNetwork = (): boolean => {
      const connection = (navigator as any).connection;
      if (connection) {
        const effectiveType = connection.effectiveType;
        const saveData = connection.saveData;
        
        if (saveData) return true;
        if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') return true;
      }
      
      // Check if using cellular data
      const type = (navigator as any).connection?.type;
      if (type === 'cellular') return true;
      
      return false;
    };

    // Calculate FPS
    const calculateFPS = (): Promise<number> => {
      return new Promise((resolve) => {
        let frames = 0;
        let startTime = performance.now();
        
        const countFrame = () => {
          frames++;
          const currentTime = performance.now();
          
          if (currentTime - startTime >= 1000) {
            resolve(frames);
          } else {
            requestAnimationFrame(countFrame);
          }
        };
        
        requestAnimationFrame(countFrame);
      });
    };

    // Check memory usage
    const getMemoryUsage = (): number => {
      const memory = (performance as any).memory;
      if (memory) {
        return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      }
      return 0;
    };

    // Initialize metrics
    const initializeMetrics = async () => {
      const fps = await calculateFPS();
      const lowEnd = isLowEndDevice();
      const slowNet = isSlowNetwork();
      const memory = getMemoryUsage();
      
      setMetrics({
        fps,
        isLowEndDevice: lowEnd,
        isSlowNetwork: slowNet,
        memoryUsage: memory,
        isLowMemory: memory > 0.8,
      });
    };

    initializeMetrics();

    // Update FPS periodically
    const interval = setInterval(async () => {
      const fps = await calculateFPS();
      setMetrics(prev => ({ ...prev, fps }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Optimization recommendations based on metrics
  const getOptimizations = useCallback(() => {
    const optimizations = {
      disableAnimations: metrics.fps < 30 || metrics.isLowEndDevice,
      reduceImageQuality: metrics.isSlowNetwork || metrics.isLowMemory,
      disablePrefetch: metrics.isSlowNetwork,
      useSimplifiedUI: metrics.isLowEndDevice || metrics.fps < 24,
      lazyLoadImages: true, // Always lazy load on mobile
      prefetchOnHover: !metrics.isSlowNetwork,
    };

    return optimizations;
  }, [metrics]);

  // Apply optimizations to document
  useEffect(() => {
    const optimizations = getOptimizations();
    
    // Add class to body for CSS optimizations
    document.body.classList.toggle('reduce-animations', optimizations.disableAnimations);
    document.body.classList.toggle('low-end-device', optimizations.useSimplifiedUI);
    
    // Set meta tag for save-data
    if (optimizations.reduceImageQuality) {
      const meta = document.createElement('meta');
      meta.name = 'format-detection';
      meta.content = 'telephone=no';
      document.head.appendChild(meta);
    }
  }, [getOptimizations]);

  return {
    ...metrics,
    optimizations: getOptimizations(),
  };
}

// Hook for connection-aware data fetching
export function useConnectionAwareFetch() {
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection;
    
    if (connection) {
      setConnectionType(connection.effectiveType || 'unknown');
      setSaveData(connection.saveData || false);

      const handleChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
        setSaveData(connection.saveData || false);
      };

      connection.addEventListener('change', handleChange);
      return () => connection.removeEventListener('change', handleChange);
    }
  }, []);

  const shouldReduceQuality = useCallback(() => {
    return saveData || connectionType === 'slow-2g' || connectionType === '2g' || connectionType === '3g';
  }, [saveData, connectionType]);

  const getFetchOptions = useCallback((url: string, options: RequestInit = {}) => {
    const defaultOptions: RequestInit = {
      cache: shouldReduceQuality() ? 'no-cache' : 'force-cache',
      ...options,
    };

    // Add save-data header if needed
    if (saveData) {
      defaultOptions.headers = {
        ...defaultOptions.headers,
        'Save-Data': 'on',
      };
    }

    return defaultOptions;
  }, [saveData, shouldReduceQuality]);

  return {
    connectionType,
    saveData,
    shouldReduceQuality: shouldReduceQuality(),
    getFetchOptions,
  };
}

// Hook for battery-aware optimizations
export function useBatteryAware() {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(true);
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    let battery: any;

    const updateBatteryInfo = () => {
      if (battery) {
        setBatteryLevel(battery.level * 100);
        setIsCharging(battery.charging);
        setIsLowBattery(battery.level < 0.2); // Less than 20%
      }
    };

    const initBattery = async () => {
      try {
        battery = await (navigator as any).getBattery();
        updateBatteryInfo();
        
        battery.addEventListener('levelchange', updateBatteryInfo);
        battery.addEventListener('chargingchange', updateBatteryInfo);
      } catch (error) {
        // Battery API not supported
        console.log('Battery API not supported');
      }
    };

    initBattery();

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', updateBatteryInfo);
        battery.removeEventListener('chargingchange', updateBatteryInfo);
      }
    };
  }, []);

  const getBatteryOptimizations = useCallback(() => {
    return {
      disableBackgroundSync: isLowBattery && !isCharging,
      reduceAnimations: isLowBattery && !isCharging,
      disableAutoPlay: isLowBattery,
      useDarkMode: true, // OLED screens save battery with dark mode
    };
  }, [isLowBattery, isCharging]);

  return {
    batteryLevel,
    isCharging,
    isLowBattery,
    optimizations: getBatteryOptimizations(),
  };
}
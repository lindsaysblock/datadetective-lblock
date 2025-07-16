/**
 * Performance Optimization Utilities
 * Centralized utilities for memory management, cleanup, and performance monitoring
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Performance constants for optimization thresholds
 */
export const PERFORMANCE_THRESHOLDS = {
  MEMORY_WARNING: 100, // MB
  MEMORY_CRITICAL: 200, // MB
  CLEANUP_INTERVAL: 300000, // 5 minutes
  DEBOUNCE_DELAY: 300, // ms
  THROTTLE_DELAY: 100, // ms
} as const;

/**
 * Memory usage tracker with automatic cleanup
 */
class MemoryManager {
  private static instance: MemoryManager;
  private cleanupTasks: Set<() => void> = new Set();
  private intervals: Set<NodeJS.Timeout> = new Set();
  private timeouts: Set<NodeJS.Timeout> = new Set();
  private listeners: Map<string, { element: EventTarget; type: string; listener: EventListener }> = new Map();

  private constructor() {
    this.startPerformanceMonitoring();
  }

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  /**
   * Register a cleanup task to be executed during memory cleanup
   */
  addCleanupTask(task: () => void): void {
    this.cleanupTasks.add(task);
  }

  /**
   * Remove a cleanup task
   */
  removeCleanupTask(task: () => void): void {
    this.cleanupTasks.delete(task);
  }

  /**
   * Safe setTimeout with automatic cleanup tracking
   */
  setTimeout(callback: () => void, delay: number): NodeJS.Timeout {
    const timeout = setTimeout(() => {
      callback();
      this.timeouts.delete(timeout);
    }, delay);
    this.timeouts.add(timeout);
    return timeout;
  }

  /**
   * Safe setInterval with automatic cleanup tracking
   */
  setInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const interval = setInterval(callback, delay);
    this.intervals.add(interval);
    return interval;
  }

  /**
   * Clear timeout and remove from tracking
   */
  clearTimeout(timeout: NodeJS.Timeout): void {
    clearTimeout(timeout);
    this.timeouts.delete(timeout);
  }

  /**
   * Clear interval and remove from tracking
   */
  clearInterval(interval: NodeJS.Timeout): void {
    clearInterval(interval);
    this.intervals.delete(interval);
  }

  /**
   * Safe addEventListener with automatic cleanup tracking
   */
  addEventListener(
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): string {
    const id = `${Date.now()}-${Math.random()}`;
    element.addEventListener(type, listener, options);
    this.listeners.set(id, { element, type, listener });
    return id;
  }

  /**
   * Remove event listener by ID
   */
  removeEventListener(id: string): void {
    const listenerData = this.listeners.get(id);
    if (listenerData) {
      listenerData.element.removeEventListener(listenerData.type, listenerData.listener);
      this.listeners.delete(id);
    }
  }

  /**
   * Get current memory usage (if available)
   */
  getMemoryUsage(): { used: number; total: number } | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: memory.usedJSHeapSize / (1024 * 1024), // Convert to MB
        total: memory.totalJSHeapSize / (1024 * 1024)
      };
    }
    return null;
  }

  /**
   * Force cleanup of unused references and resources
   */
  forceCleanup(): void {
    console.log('🧹 Performing memory cleanup...');
    
    // Execute all cleanup tasks
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Error during cleanup task:', error);
      }
    });

    // Clear abandoned timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();

    // Clear abandoned intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    // Clear event listeners
    this.listeners.forEach(({ element, type, listener }) => {
      element.removeEventListener(type, listener);
    });
    this.listeners.clear();

    // Suggest garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }

    console.log('✅ Memory cleanup completed');
  }

  /**
   * Start performance monitoring with automatic cleanup
   */
  private startPerformanceMonitoring(): void {
    const monitor = () => {
      const memory = this.getMemoryUsage();
      if (memory) {
        if (memory.used > PERFORMANCE_THRESHOLDS.MEMORY_CRITICAL) {
          console.warn(`🚨 Critical memory usage: ${memory.used.toFixed(2)}MB`);
          this.forceCleanup();
        } else if (memory.used > PERFORMANCE_THRESHOLDS.MEMORY_WARNING) {
          console.warn(`⚠️ High memory usage: ${memory.used.toFixed(2)}MB`);
        }
      }
    };

    this.setInterval(monitor, PERFORMANCE_THRESHOLDS.CLEANUP_INTERVAL);
  }
}

export const memoryManager = MemoryManager.getInstance();

/**
 * Hook for automatic cleanup of resources
 */
export const useCleanup = (cleanupFn: () => void) => {
  useEffect(() => {
    memoryManager.addCleanupTask(cleanupFn);
    return () => {
      memoryManager.removeCleanupTask(cleanupFn);
      cleanupFn();
    };
  }, [cleanupFn]);
};

/**
 * Hook for safe setTimeout with automatic cleanup
 */
export const useSafeTimeout = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const safeSetTimeout = useCallback((callback: () => void, delay: number) => {
    if (timeoutRef.current) {
      memoryManager.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = memoryManager.setTimeout(callback, delay);
    return timeoutRef.current;
  }, []);

  const clearSafeTimeout = useCallback(() => {
    if (timeoutRef.current) {
      memoryManager.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearSafeTimeout();
    };
  }, [clearSafeTimeout]);

  return { safeSetTimeout, clearSafeTimeout };
};

/**
 * Hook for safe setInterval with automatic cleanup
 */
export const useSafeInterval = () => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const safeSetInterval = useCallback((callback: () => void, delay: number) => {
    if (intervalRef.current) {
      memoryManager.clearInterval(intervalRef.current);
    }
    intervalRef.current = memoryManager.setInterval(callback, delay);
    return intervalRef.current;
  }, []);

  const clearSafeInterval = useCallback(() => {
    if (intervalRef.current) {
      memoryManager.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearSafeInterval();
    };
  }, [clearSafeInterval]);

  return { safeSetInterval, clearSafeInterval };
};

/**
 * Hook for safe event listeners with automatic cleanup
 */
export const useSafeEventListener = () => {
  const listenersRef = useRef<Set<string>>(new Set());

  const addSafeEventListener = useCallback((
    element: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ) => {
    const id = memoryManager.addEventListener(element, type, listener, options);
    listenersRef.current.add(id);
    return id;
  }, []);

  const removeSafeEventListener = useCallback((id: string) => {
    memoryManager.removeEventListener(id);
    listenersRef.current.delete(id);
  }, []);

  useEffect(() => {
    return () => {
      listenersRef.current.forEach(id => {
        memoryManager.removeEventListener(id);
      });
      listenersRef.current.clear();
    };
  }, []);

  return { addSafeEventListener, removeSafeEventListener };
};

/**
 * Debounce function with memory optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = PERFORMANCE_THRESHOLDS.DEBOUNCE_DELAY
): T => {
  let timeout: NodeJS.Timeout | null = null;
  
  const debounced = ((...args: Parameters<T>) => {
    if (timeout) {
      memoryManager.clearTimeout(timeout);
    }
    timeout = memoryManager.setTimeout(() => func(...args), delay);
  }) as T;

  return debounced;
};

/**
 * Throttle function with memory optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number = PERFORMANCE_THRESHOLDS.THROTTLE_DELAY
): T => {
  let isThrottled = false;
  
  const throttled = ((...args: Parameters<T>) => {
    if (!isThrottled) {
      func(...args);
      isThrottled = true;
      memoryManager.setTimeout(() => {
        isThrottled = false;
      }, delay);
    }
  }) as T;

  return throttled;
};

/**
 * Performance monitoring hook
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    const endTime = Date.now();
    const renderTime = endTime - renderTimeRef.current;
    
    if (renderTime > 100) { // Log slow renders
      console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime}ms`);
    }
    
    renderTimeRef.current = Date.now();
  });

  const markRenderStart = useCallback(() => {
    renderTimeRef.current = Date.now();
  }, []);

  return { markRenderStart };
};
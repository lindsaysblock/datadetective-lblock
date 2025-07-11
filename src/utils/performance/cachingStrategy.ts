
export interface CacheConfig {
  maxSize: number;
  ttl: number; // time to live in milliseconds
  cleanupInterval: number;
}

export class LRUCache<K, V> {
  private cache = new Map<K, { value: V; timestamp: number; accessCount: number }>();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: config.maxSize || 100,
      ttl: config.ttl || 5 * 60 * 1000, // 5 minutes
      cleanupInterval: config.cleanupInterval || 60 * 1000 // 1 minute
    };
    this.startCleanup();
  }

  set(key: K, value: V): void {
    const now = Date.now();
    
    // Remove oldest entries if at capacity
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      const oldestKey = this.findOldestKey();
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(key, {
      value,
      timestamp: now,
      accessCount: 1
    });
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    
    const now = Date.now();
    if (now - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return undefined;
    }
    
    entry.accessCount++;
    entry.timestamp = now; // Update for LRU
    return entry.value;
  }

  has(key: K): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    const now = Date.now();
    if (now - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private findOldestKey(): K | undefined {
    let oldestKey: K | undefined;
    let oldestTime = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }
    
    return oldestKey;
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > this.config.ttl) {
          this.cache.delete(key);
        }
      }
    }, this.config.cleanupInterval);
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }

  getStats(): {
    size: number;
    hitRate: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    let totalAccess = 0;
    let oldestTime = Date.now();
    let newestTime = 0;
    
    for (const entry of this.cache.values()) {
      totalAccess += entry.accessCount;
      oldestTime = Math.min(oldestTime, entry.timestamp);
      newestTime = Math.max(newestTime, entry.timestamp);
    }
    
    const hitRate = this.cache.size > 0 ? totalAccess / this.cache.size : 0;
    
    return {
      size: this.cache.size,
      hitRate,
      oldestEntry: oldestTime,
      newestEntry: newestTime
    };
  }
}

// Memoization decorator for pure functions
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  cacheConfig?: Partial<CacheConfig>
): T {
  const cache = new LRUCache<string, ReturnType<T>>(cacheConfig);
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

// Global analysis cache instance
export const analysisCache = new LRUCache<string, any>({
  maxSize: 50,
  ttl: 10 * 60 * 1000, // 10 minutes
  cleanupInterval: 2 * 60 * 1000 // 2 minutes
});

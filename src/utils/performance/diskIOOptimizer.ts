
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  size: number;
}

interface OptimizationConfig {
  maxMemoryCache: number;
  cacheExpiry: number;
  batchSize: number;
  compressionThreshold: number;
}

export class DiskIOOptimizer {
  private static instance: DiskIOOptimizer;
  private memoryCache = new Map<string, CacheEntry<any>>();
  private pendingWrites = new Map<string, any>();
  private writeQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;
  
  private config: OptimizationConfig = {
    maxMemoryCache: 50,
    cacheExpiry: 5 * 60 * 1000,
    batchSize: 100,
    compressionThreshold: 1024
  };

  static getInstance(): DiskIOOptimizer {
    if (!DiskIOOptimizer.instance) {
      DiskIOOptimizer.instance = new DiskIOOptimizer();
    }
    return DiskIOOptimizer.instance;
  }

  cacheData<T>(key: string, data: T, forceCache = false): void {
    const dataSize = this.estimateSize(data);
    
    if (!forceCache && dataSize > this.config.compressionThreshold * 10) {
      return;
    }

    this.enforceMemoryLimit();

    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      accessCount: 0,
      size: dataSize
    });
  }

  getCachedData<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.config.cacheExpiry) {
      this.memoryCache.delete(key);
      return null;
    }

    entry.accessCount++;
    return entry.data;
  }

  async batchOperation<T>(operations: Array<() => Promise<T>>): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const batchedOp = async () => {
        try {
          const results: T[] = [];
          for (const operation of operations) {
            const result = await operation();
            results.push(result);
          }
          resolve(results);
        } catch (error) {
          reject(error);
        }
      };

      this.writeQueue.push(batchedOp as any);
      this.processQueue();
    });
  }

  deferredWrite(key: string, data: any): void {
    this.pendingWrites.set(key, data);
    
    if (this.pendingWrites.size >= this.config.batchSize) {
      this.flushPendingWrites();
    }
  }

  flushPendingWrites(): Promise<void> {
    return new Promise((resolve) => {
      const writeOp = async () => {
        const writes = Array.from(this.pendingWrites.entries());
        this.pendingWrites.clear();
        
        await new Promise(r => setTimeout(r, 10));
        console.log(`Flushed ${writes.length} pending writes`);
        resolve();
      };

      this.writeQueue.push(writeOp);
      this.processQueue();
    });
  }

  async streamProcess<T, R>(
    data: T[], 
    processor: (chunk: T[]) => Promise<R[]>,
    chunkSize = 1000
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const chunkResults = await processor(chunk);
      results.push(...chunkResults);
      
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.writeQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    
    while (this.writeQueue.length > 0) {
      const operation = this.writeQueue.shift();
      if (operation) {
        try {
          await operation();
        } catch (error) {
          console.warn('Queue operation failed:', error);
        }
      }
    }
    
    this.isProcessingQueue = false;
  }

  private enforceMemoryLimit(): void {
    const currentSize = this.getCurrentCacheSize();
    const maxSize = this.config.maxMemoryCache * 1024 * 1024;
    
    if (currentSize > maxSize) {
      this.evictLeastUsed();
    }
  }

  private getCurrentCacheSize(): number {
    return Array.from(this.memoryCache.values())
      .reduce((total, entry) => total + entry.size, 0);
  }

  private evictLeastUsed(): void {
    const entries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => a.accessCount - b.accessCount);
    
    const removeCount = Math.floor(entries.length * 0.25);
    for (let i = 0; i < removeCount; i++) {
      this.memoryCache.delete(entries[i][0]);
    }
  }

  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2;
    } catch {
      return 1024;
    }
  }

  cleanup(): void {
    this.flushPendingWrites();
    this.memoryCache.clear();
    this.writeQueue.length = 0;
  }
}

export const diskIOOptimizer = DiskIOOptimizer.getInstance();

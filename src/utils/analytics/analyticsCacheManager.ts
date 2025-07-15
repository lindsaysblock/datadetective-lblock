
import { AnalysisResult } from '../analysis/types';
import { ParsedData } from '../dataParser';
import { diskIOOptimizer } from '../performance/diskIOOptimizer';

interface OptimizedCacheEntry {
  key: string;
  data: AnalysisResult[];
  timestamp: number;
  accessCount: number;
  compressed: boolean;
}

interface OptimizedCacheConfig {
  maxMemoryEntries: number;
  compressionThreshold: number;
  accessThreshold: number;
  cleanupInterval: number;
}

export class AnalyticsCacheManager {
  private cache = new Map<string, OptimizedCacheEntry>();
  private config: OptimizedCacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private hitCount = 0;
  private missCount = 0;
  private ioOperations = 0;

  constructor(config: Partial<OptimizedCacheConfig> = {}) {
    this.config = {
      maxMemoryEntries: 50,
      compressionThreshold: 1024,
      accessThreshold: 3,
      cleanupInterval: 30 * 1000,
      ...config
    };

    this.startOptimizedCleanup();
  }

  generateKey(data: ParsedData, analysisType?: string): string {
    const typePrefix = analysisType || 'general';
    const dataSignature = `${data.rowCount}_${data.columns?.length || 0}_${data.fileSize || 0}`;
    return `${typePrefix}_${dataSignature}`;
  }

  get(key: string): AnalysisResult[] | null {
    const memoryEntry = this.cache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      memoryEntry.accessCount++;
      this.hitCount++;
      return this.decompressIfNeeded(memoryEntry.data);
    }

    const diskCached = diskIOOptimizer.getCachedData<AnalysisResult[]>(key);
    if (diskCached) {
      this.hitCount++;
      
      if (memoryEntry && memoryEntry.accessCount >= this.config.accessThreshold) {
        this.promoteToMemory(key, diskCached);
      }
      
      return diskCached;
    }

    this.missCount++;
    return null;
  }

  set(key: string, data: AnalysisResult[]): void {
    this.ioOperations++;
    
    const compressed = this.shouldCompress(data);
    const processedData = compressed ? this.compress(data) : data;
    
    diskIOOptimizer.cacheData(key, processedData);
    
    if (this.cache.size < this.config.maxMemoryEntries) {
      this.cache.set(key, {
        key,
        data: processedData,
        timestamp: Date.now(),
        accessCount: 0,
        compressed
      });
    }
    
    if (this.ioOperations % 10 === 0) {
      this.deferredCleanup();
    }
  }

  invalidate(pattern?: string): number {
    let deletedCount = 0;
    
    if (!pattern) {
      deletedCount = this.cache.size;
      this.cache.clear();
      diskIOOptimizer.cleanup();
    } else {
      const regex = new RegExp(pattern);
      const keysToDelete: string[] = [];
      
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => {
        this.cache.delete(key);
        deletedCount++;
      });
    }
    
    return deletedCount;
  }

  getStats(): {
    hitRate: number;
    memoryEntries: number;
    ioOperations: number;
    compressionRatio: number;
    cacheSize: number;
    totalHits: number;
    totalMisses: number;
    memoryUsage: number;
  } {
    const total = this.hitCount + this.missCount;
    const compressedEntries = Array.from(this.cache.values()).filter(e => e.compressed).length;
    const memoryUsage = Array.from(this.cache.values()).reduce((total, entry) => {
      return total + this.estimateSize(entry.data);
    }, 0);
    
    return {
      hitRate: total > 0 ? (this.hitCount / total) * 100 : 0,
      memoryEntries: this.cache.size,
      ioOperations: this.ioOperations,
      compressionRatio: this.cache.size > 0 ? (compressedEntries / this.cache.size) * 100 : 0,
      cacheSize: this.cache.size,
      totalHits: this.hitCount,
      totalMisses: this.missCount,
      memoryUsage
    };
  }

  private promoteToMemory(key: string, data: AnalysisResult[]): void {
    if (this.cache.size >= this.config.maxMemoryEntries) {
      this.evictLeastUsed();
    }
    
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
      accessCount: this.config.accessThreshold,
      compressed: false
    });
  }

  private shouldCompress(data: AnalysisResult[]): boolean {
    const estimatedSize = this.estimateSize(data);
    return estimatedSize > this.config.compressionThreshold;
  }

  private compress(data: AnalysisResult[]): AnalysisResult[] {
    return data.map(result => ({
      ...result,
      description: result.description?.substring(0, 100) || '',
      compressed: true
    }));
  }

  private decompressIfNeeded(data: AnalysisResult[]): AnalysisResult[] {
    return data.map(result => {
      const { compressed, ...rest } = result as any;
      return rest;
    });
  }

  private deferredCleanup(): void {
    diskIOOptimizer.deferredWrite('cleanup_operation', {
      timestamp: Date.now(),
      cacheSize: this.cache.size
    });
  }

  private startOptimizedCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.optimizedCleanup();
    }, this.config.cleanupInterval);
  }

  private optimizedCleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry, now)) {
        expiredKeys.push(key);
      }
    }
    
    if (expiredKeys.length > 0) {
      expiredKeys.forEach(key => {
        this.cache.delete(key);
      });
      
      console.log(`🧹 Optimized cache cleanup: removed ${expiredKeys.length} entries`);
    }
  }

  private isExpired(entry: OptimizedCacheEntry, currentTime?: number): boolean {
    const now = currentTime || Date.now();
    return now - entry.timestamp > 5 * 60 * 1000;
  }

  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.accessCount - b.accessCount);
    
    const removeCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < removeCount; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  private estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2;
    } catch {
      return 1024;
    }
  }

  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    diskIOOptimizer.flushPendingWrites();
    this.cache.clear();
  }
}

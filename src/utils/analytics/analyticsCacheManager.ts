
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
      maxMemoryEntries: 50, // Reduced for better memory management
      compressionThreshold: 1024, // 1KB
      accessThreshold: 3, // Promote to memory after 3 accesses
      cleanupInterval: 30 * 1000, // 30 seconds
      ...config
    };

    this.startOptimizedCleanup();
  }

  generateKey(data: ParsedData, analysisType?: string): string {
    // More efficient key generation to reduce computation
    const typePrefix = analysisType || 'general';
    const dataSignature = `${data.rowCount}_${data.columns?.length || 0}_${data.fileSize || 0}`;
    return `${typePrefix}_${dataSignature}`;
  }

  get(key: string): AnalysisResult[] | null {
    // First check memory cache
    const memoryEntry = this.cache.get(key);
    if (memoryEntry && !this.isExpired(memoryEntry)) {
      memoryEntry.accessCount++;
      this.hitCount++;
      return this.decompressIfNeeded(memoryEntry.data);
    }

    // Then check disk I/O optimizer cache
    const diskCached = diskIOOptimizer.getCachedData<AnalysisResult[]>(key);
    if (diskCached) {
      this.hitCount++;
      
      // Promote to memory cache if accessed frequently
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
    
    // Always store in disk cache for persistence
    diskIOOptimizer.cacheData(key, processedData);
    
    // Store in memory cache if under limit
    if (this.cache.size < this.config.maxMemoryEntries) {
      this.cache.set(key, {
        key,
        data: processedData,
        timestamp: Date.now(),
        accessCount: 0,
        compressed
      });
    }
    
    // Batch cleanup to reduce I/O operations
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
      
      // Batch deletions to reduce I/O
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          keysToDelete.push(key);
        }
      }
      
      // Use batched operation for deletions
      diskIOOptimizer.batchOperation(
        keysToDelete.map(key => async () => {
          this.cache.delete(key);
          deletedCount++;
        })
      );
    }
    
    return deletedCount;
  }

  getOptimizedStats(): {
    hitRate: number;
    memoryEntries: number;
    ioOperations: number;
    compressionRatio: number;
  } {
    const total = this.hitCount + this.missCount;
    const compressedEntries = Array.from(this.cache.values()).filter(e => e.compressed).length;
    
    return {
      hitRate: total > 0 ? (this.hitCount / total) * 100 : 0,
      memoryEntries: this.cache.size,
      ioOperations: this.ioOperations,
      compressionRatio: this.cache.size > 0 ? (compressedEntries / this.cache.size) * 100 : 0
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
    const estimatedSize = JSON.stringify(data).length;
    return estimatedSize > this.config.compressionThreshold;
  }

  private compress(data: AnalysisResult[]): AnalysisResult[] {
    // Simple compression - remove verbose fields
    return data.map(result => ({
      ...result,
      description: result.description?.substring(0, 100) || '', // Truncate descriptions
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
    // Use deferred write for cleanup operations
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
    
    // Batch identify expired entries
    for (const [key, entry] of this.cache) {
      if (this.isExpired(entry, now)) {
        expiredKeys.push(key);
      }
    }
    
    // Use batched deletion
    if (expiredKeys.length > 0) {
      diskIOOptimizer.batchOperation(
        expiredKeys.map(key => async () => {
          this.cache.delete(key);
        })
      );
      
      console.log(`🧹 Optimized cache cleanup: removed ${expiredKeys.length} entries`);
    }
  }

  private isExpired(entry: OptimizedCacheEntry, currentTime?: number): boolean {
    const now = currentTime || Date.now();
    return now - entry.timestamp > 5 * 60 * 1000; // 5 minutes
  }

  private evictLeastUsed(): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.accessCount - b.accessCount);
    
    // Remove least used 20% to reduce frequent evictions
    const removeCount = Math.floor(entries.length * 0.2);
    for (let i = 0; i < removeCount; i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    // Final cleanup
    diskIOOptimizer.flushPendingWrites();
    this.cache.clear();
  }
}


import { AnalysisResult } from '../analysis/types';
import { ParsedData } from '../dataParser';

interface CacheEntry {
  key: string;
  data: AnalysisResult[];
  timestamp: number;
  accessCount: number;
  ttl: number;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  cleanupInterval: number;
  enableCompression: boolean;
}

export class AnalyticsCacheManager {
  private cache = new Map<string, CacheEntry>();
  private config: CacheConfig;
  private cleanupTimer: NodeJS.Timeout | null = null;
  private hitCount = 0;
  private missCount = 0;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      cleanupInterval: 60 * 1000, // 1 minute
      enableCompression: true,
      ...config
    };

    this.startCleanup();
  }

  generateKey(data: ParsedData, analysisType?: string): string {
    const dataHash = this.hashData(data);
    const typePrefix = analysisType || 'general';
    return `${typePrefix}_${dataHash}`;
  }

  get(key: string): AnalysisResult[] | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    entry.accessCount++;
    this.hitCount++;
    
    return this.config.enableCompression ? 
      this.decompress(entry.data) : 
      entry.data;
  }

  set(key: string, data: AnalysisResult[], ttl?: number): void {
    if (this.cache.size >= this.config.maxSize) {
      this.evictLeastUsed();
    }

    const processedData = this.config.enableCompression ? 
      this.compress(data) : 
      data;

    this.cache.set(key, {
      key,
      data: processedData,
      timestamp: Date.now(),
      accessCount: 0,
      ttl: ttl || this.config.defaultTTL
    });
  }

  invalidate(pattern?: string): number {
    let deletedCount = 0;
    
    if (!pattern) {
      deletedCount = this.cache.size;
      this.cache.clear();
    } else {
      const regex = new RegExp(pattern);
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          this.cache.delete(key);
          deletedCount++;
        }
      }
    }
    
    return deletedCount;
  }

  getStats(): {
    hitRate: number;
    missRate: number;
    totalHits: number;
    totalMisses: number;
    cacheSize: number;
    memoryUsage: number;
  } {
    const total = this.hitCount + this.missCount;
    
    return {
      hitRate: total > 0 ? (this.hitCount / total) * 100 : 0,
      missRate: total > 0 ? (this.missCount / total) * 100 : 0,
      totalHits: this.hitCount,
      totalMisses: this.missCount,
      cacheSize: this.cache.size,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private hashData(data: ParsedData): string {
    const hashInput = JSON.stringify({
      rowCount: data.rowCount,
      columnCount: data.columns.length,
      fileSize: data.fileSize,
      summary: data.summary
    });
    
    return this.simpleHash(hashInput);
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private evictLeastUsed(): void {
    let leastUsedKey = '';
    let lowestAccessCount = Infinity;
    
    for (const [key, entry] of this.cache) {
      if (entry.accessCount < lowestAccessCount) {
        lowestAccessCount = entry.accessCount;
        leastUsedKey = key;
      }
    }
    
    if (leastUsedKey) {
      this.cache.delete(leastUsedKey);
    }
  }

  private compress(data: AnalysisResult[]): AnalysisResult[] {
    // Simple compression simulation - in real implementation, use actual compression
    return data.map(result => ({
      ...result,
      compressed: true
    }));
  }

  private decompress(data: AnalysisResult[]): AnalysisResult[] {
    // Simple decompression simulation
    return data.map(result => {
      const { compressed, ...rest } = result as any;
      return rest;
    });
  }

  private startCleanup(): void {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.config.cleanupInterval);
  }

  private cleanup(): void {
    const now = Date.now();
    const expiredKeys: string[] = [];
    
    for (const [key, entry] of this.cache) {
      if (now - entry.timestamp > entry.ttl) {
        expiredKeys.push(key);
      }
    }
    
    expiredKeys.forEach(key => this.cache.delete(key));
    
    if (expiredKeys.length > 0) {
      console.log(`Cache cleanup: removed ${expiredKeys.length} expired entries`);
    }
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const entry of this.cache.values()) {
      totalSize += JSON.stringify(entry).length;
    }
    
    return totalSize;
  }

  stop(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
  }
}

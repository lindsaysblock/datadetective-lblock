
export class OptimizedDataProcessor {
  private static instance: OptimizedDataProcessor;
  private processingCache = new Map<string, any>();
  private maxCacheSize = 50;

  static getInstance(): OptimizedDataProcessor {
    if (!OptimizedDataProcessor.instance) {
      OptimizedDataProcessor.instance = new OptimizedDataProcessor();
    }
    return OptimizedDataProcessor.instance;
  }

  async processDataWithOptimization(data: any[], cacheKey?: string): Promise<any[]> {
    // Check cache first
    if (cacheKey && this.processingCache.has(cacheKey)) {
      console.log('📋 Using cached data processing result');
      return this.processingCache.get(cacheKey);
    }

    // Process data in chunks for better performance
    const chunkSize = 1000;
    const processedChunks: any[] = [];

    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const processedChunk = await this.processChunk(chunk);
      processedChunks.push(...processedChunk);

      // Allow UI to update between chunks
      if (i % (chunkSize * 5) === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    // Cache result if cache key provided
    if (cacheKey) {
      this.cacheResult(cacheKey, processedChunks);
    }

    return processedChunks;
  }

  private async processChunk(chunk: any[]): Promise<any[]> {
    return chunk.map(item => {
      // Optimize object structure and remove unnecessary properties
      const optimized = { ...item };
      
      // Remove null/undefined values to reduce memory
      Object.keys(optimized).forEach(key => {
        if (optimized[key] === null || optimized[key] === undefined) {
          delete optimized[key];
        }
      });

      return optimized;
    });
  }

  private cacheResult(key: string, result: any[]): void {
    // Implement LRU cache behavior
    if (this.processingCache.size >= this.maxCacheSize) {
      const firstKey = this.processingCache.keys().next().value;
      this.processingCache.delete(firstKey);
    }
    
    this.processingCache.set(key, result);
  }

  clearCache(): void {
    this.processingCache.clear();
    console.log('🧹 Data processing cache cleared');
  }

  optimizeMemoryUsage(): void {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
    
    // Clear old cache entries
    this.clearCache();
    
    console.log('🚀 Memory optimization applied');
  }
}

export const optimizedDataProcessor = OptimizedDataProcessor.getInstance();

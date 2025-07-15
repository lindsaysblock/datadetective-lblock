
import { diskIOOptimizer } from './diskIOOptimizer';

export class OptimizedDataProcessor {
  private static instance: OptimizedDataProcessor;
  private processingCache = new Map<string, any>();

  static getInstance(): OptimizedDataProcessor {
    if (!OptimizedDataProcessor.instance) {
      OptimizedDataProcessor.instance = new OptimizedDataProcessor();
    }
    return OptimizedDataProcessor.instance;
  }

  async processDataWithCaching(data: any[], cacheKey: string): Promise<any[]> {
    // Check memory cache first
    const cached = diskIOOptimizer.getCachedData(cacheKey);
    if (cached) {
      console.log('📋 Using cached processed data');
      return cached;
    }

    // Stream process large datasets to avoid memory spikes
    const processedData = await diskIOOptimizer.streamProcess(
      data,
      async (chunk) => this.processChunk(chunk),
      500 // Smaller chunks for better I/O
    );

    // Cache results efficiently
    diskIOOptimizer.cacheData(cacheKey, processedData);
    
    return processedData;
  }

  private async processChunk(chunk: any[]): Promise<any[]> {
    return chunk.map(item => {
      // Lightweight processing to reduce compute load
      const optimized = { ...item };
      
      // Remove null/undefined to reduce memory footprint
      Object.keys(optimized).forEach(key => {
        if (optimized[key] === null || optimized[key] === undefined) {
          delete optimized[key];
        }
      });

      return optimized;
    });
  }

  // Optimized file parsing with minimal I/O
  async parseFileOptimized(file: File): Promise<any> {
    const cacheKey = `file_${file.name}_${file.size}_${file.lastModified}`;
    
    // Check if already parsed
    const cached = diskIOOptimizer.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    // Read file in chunks to reduce memory usage
    const result = await this.readFileInChunks(file);
    
    // Cache with compression for large files
    diskIOOptimizer.cacheData(cacheKey, result, file.size > 1024 * 1024);
    
    return result;
  }

  private async readFileInChunks(file: File): Promise<any> {
    const chunkSize = 64 * 1024; // 64KB chunks
    const chunks: string[] = [];
    
    for (let start = 0; start < file.size; start += chunkSize) {
      const chunk = file.slice(start, start + chunkSize);
      const text = await chunk.text();
      chunks.push(text);
      
      // Yield to prevent blocking UI
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return chunks.join('');
  }

  clearCache(): void {
    this.processingCache.clear();
    console.log('🧹 Optimized processor cache cleared');
  }
}

export const optimizedDataProcessor = OptimizedDataProcessor.getInstance();

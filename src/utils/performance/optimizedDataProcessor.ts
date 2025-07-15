
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
    const cached = diskIOOptimizer.getCachedData<any[]>(cacheKey);
    if (cached && Array.isArray(cached)) {
      console.log('📋 Using cached processed data');
      return cached;
    }

    const processedData = await diskIOOptimizer.streamProcess(
      data,
      async (chunk) => this.processChunk(chunk),
      500
    );

    diskIOOptimizer.cacheData(cacheKey, processedData);
    
    return processedData;
  }

  private async processChunk(chunk: any[]): Promise<any[]> {
    return chunk.map(item => {
      const optimized = { ...item };
      
      Object.keys(optimized).forEach(key => {
        if (optimized[key] === null || optimized[key] === undefined) {
          delete optimized[key];
        }
      });

      return optimized;
    });
  }

  async parseFileOptimized(file: File): Promise<any> {
    const cacheKey = `file_${file.name}_${file.size}_${file.lastModified}`;
    
    const cached = diskIOOptimizer.getCachedData(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.readFileInChunks(file);
    
    diskIOOptimizer.cacheData(cacheKey, result, file.size > 1024 * 1024);
    
    return result;
  }

  private async readFileInChunks(file: File): Promise<any> {
    const chunkSize = 64 * 1024;
    const chunks: string[] = [];
    
    for (let start = 0; start < file.size; start += chunkSize) {
      const chunk = file.slice(start, start + chunkSize);
      const text = await chunk.text();
      chunks.push(text);
      
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


import { ParsedData } from '../dataParser';
import { AnalysisResult } from './types';
import { RowCountAnalyzer } from './analyzers/rowCountAnalyzer';
import { ActionAnalyzer } from './analyzers/actionAnalyzer';
import { TimeAnalyzer } from './analyzers/timeAnalyzer';
import { ProductAnalyzer } from './analyzers/productAnalyzer';
import { memoize, analysisCache } from '../performance/cachingStrategy';
import { analyticsTaskQueue } from '../performance/loadBalancer';
import { performanceMonitor } from '../performance/performanceMonitor';

export class DataAnalysisEngine {
  private data: ParsedData;
  private analyzers: {
    rowCount: RowCountAnalyzer;
    action: ActionAnalyzer;
    time: TimeAnalyzer;
    product: ProductAnalyzer;
  };

  constructor(data: ParsedData) {
    this.data = data;
    this.analyzers = {
      rowCount: new RowCountAnalyzer(data),
      action: new ActionAnalyzer(data),
      time: new TimeAnalyzer(data),
      product: new ProductAnalyzer(data)
    };
  }

  // Memoized individual analysis methods
  analyzeRowCounts = memoize((): AnalysisResult[] => {
    return performanceMonitor.measureFunction('Row Count Analysis', () => {
      return this.analyzers.rowCount.analyze();
    });
  }, { maxSize: 10, ttl: 5 * 60 * 1000 });

  analyzeActionBreakdown = memoize((): AnalysisResult[] => {
    return performanceMonitor.measureFunction('Action Breakdown Analysis', () => {
      return this.analyzers.action.analyze();
    });
  }, { maxSize: 10, ttl: 5 * 60 * 1000 });

  analyzeTimeTrends = memoize((): AnalysisResult[] => {
    return performanceMonitor.measureFunction('Time Trends Analysis', () => {
      return this.analyzers.time.analyze();
    });
  }, { maxSize: 10, ttl: 5 * 60 * 1000 });

  analyzeProducts = memoize((): AnalysisResult[] => {
    return performanceMonitor.measureFunction('Product Analysis', () => {
      return this.analyzers.product.analyze();
    });
  }, { maxSize: 10, ttl: 5 * 60 * 1000 });

  // Run all analyses with performance monitoring and caching
  runCompleteAnalysis(): AnalysisResult[] {
    const cacheKey = `complete_analysis_${JSON.stringify(this.data).slice(0, 100)}`;
    
    // Check cache first
    if (analysisCache.has(cacheKey)) {
      console.log('📊 Using cached analysis results');
      return analysisCache.get(cacheKey)!;
    }

    const allResults: AnalysisResult[] = [];
    
    try {
      // Use performance monitoring for the complete analysis
      const results = performanceMonitor.measureFunction('Complete Analysis', () => {
        const results: AnalysisResult[] = [];
        
        // Run analyses in parallel where possible
        const analysisPromises = [
          () => this.analyzeRowCounts(),
          () => this.analyzeActionBreakdown(),
          () => this.analyzeTimeTrends(),
          () => this.analyzeProducts()
        ];
        
        // Execute all analyses
        analysisPromises.forEach(analysisFn => {
          try {
            const analysisResults = analysisFn();
            results.push(...analysisResults);
          } catch (error) {
            console.warn('Analysis component failed:', error);
          }
        });
        
        return results;
      });

      allResults.push(...results);
      
      // Cache the results
      analysisCache.set(cacheKey, allResults);
      
    } catch (error) {
      console.error('Analysis error:', error);
      allResults.push({
        id: 'analysis-error',
        title: 'Analysis Error',
        description: 'Error occurred during analysis',
        value: error,
        insight: 'Some analyses could not be completed due to data format issues',
        confidence: 'low'
      });
    }

    return allResults;
  }

  // Async version for heavy workloads
  async runCompleteAnalysisAsync(): Promise<AnalysisResult[]> {
    const cacheKey = `async_analysis_${JSON.stringify(this.data).slice(0, 100)}`;
    
    if (analysisCache.has(cacheKey)) {
      return analysisCache.get(cacheKey)!;
    }

    return performanceMonitor.measureAsyncFunction('Async Complete Analysis', async () => {
      // Queue heavy analysis tasks
      const taskIds = await Promise.all([
        this.queueAnalysisTask('row-count', () => this.analyzeRowCounts()),
        this.queueAnalysisTask('action-breakdown', () => this.analyzeActionBreakdown()),
        this.queueAnalysisTask('time-trends', () => this.analyzeTimeTrends()),
        this.queueAnalysisTask('products', () => this.analyzeProducts())
      ]);

      // Wait for all tasks to complete (simplified - in real implementation would track completion)
      const results = [
        ...this.analyzeRowCounts(),
        ...this.analyzeActionBreakdown(),
        ...this.analyzeTimeTrends(),
        ...this.analyzeProducts()
      ];

      analysisCache.set(cacheKey, results);
      return results;
    });
  }

  private async queueAnalysisTask(type: string, analysisFn: () => AnalysisResult[]): Promise<string> {
    return analyticsTaskQueue.addTask({
      payload: { type: 'data-analysis', data: this.data, analysisType: type },
      priority: 'normal',
      retries: 0,
      maxRetries: 2
    });
  }
}

// Re-export types for backward compatibility
export type { AnalysisResult };


import { ParsedData } from '../dataParser';
import { AnalysisResult, AnalysisConfig, AnalysisSummary } from './types';
import { AnalyticsEngineManager } from '../analytics/analyticsEngineManager';
import { AnalyticsValidator } from '../analytics/analyticsValidator';
import { RowCountAnalyzer } from './analyzers/rowCountAnalyzer';
import { ActionAnalyzer } from './analyzers/actionAnalyzer';
import { TimeAnalyzer } from './analyzers/timeAnalyzer';
import { ProductAnalyzer } from './analyzers/productAnalyzer';

export class DataAnalysisEngine {
  private readonly data: ParsedData;
  private readonly config: AnalysisConfig;
  private readonly analyticsManager: AnalyticsEngineManager;
  private readonly cache: Map<string, AnalysisResult[]> = new Map();
  private readonly analyzers: {
    rowCount: RowCountAnalyzer;
    action: ActionAnalyzer;
    time: TimeAnalyzer;
    product: ProductAnalyzer;
  };

  constructor(data: ParsedData, config: AnalysisConfig = {}) {
    this.config = {
      enableLogging: true,
      maxRetries: 3,
      timeoutMs: 30000,
      qualityThreshold: 0.7,
      ...config
    };

    this.data = data;
    this.analyticsManager = new AnalyticsEngineManager(this.config.enableLogging);
    
    // Initialize analyzers with optimizations
    this.analyzers = {
      rowCount: new RowCountAnalyzer(data),
      action: new ActionAnalyzer(data),
      time: new TimeAnalyzer(data),
      product: new ProductAnalyzer(data)
    };

    if (this.config.enableLogging) {
      console.log('🚀 Optimized DataAnalysisEngine initialized with:', {
        rows: data.rows?.length || 0,
        columns: data.columns?.length || 0,
        fileSize: data.fileSize,
        cacheEnabled: true,
        qualityLevel: AnalyticsValidator.calculateDataQuality(data)
      });
    }
  }

  // Optimized individual analysis methods
  analyzeRowCounts(): AnalysisResult[] {
    const cacheKey = `row_counts_${this.data.rowCount}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const results = this.executeOptimizedAnalysis('row count', () => this.analyzers.rowCount.analyze());
    this.cache.set(cacheKey, results);
    return results;
  }

  analyzeActionBreakdown(): AnalysisResult[] {
    const cacheKey = `action_breakdown_${this.data.rowCount}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const results = this.executeOptimizedAnalysis('action breakdown', () => this.analyzers.action.analyze());
    this.cache.set(cacheKey, results);
    return results;
  }

  analyzeTimeTrends(): AnalysisResult[] {
    const cacheKey = `time_trends_${this.data.rowCount}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const results = this.executeOptimizedAnalysis('time trends', () => this.analyzers.time.analyze());
    this.cache.set(cacheKey, results);
    return results;
  }

  analyzeProducts(): AnalysisResult[] {
    const cacheKey = `products_${this.data.rowCount}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const results = this.executeOptimizedAnalysis('product analysis', () => this.analyzers.product.analyze());
    this.cache.set(cacheKey, results);
    return results;
  }

  // Optimized main analysis execution
  runCompleteAnalysis(): AnalysisResult[] {
    const startTime = performance.now();
    
    if (this.config.enableLogging) {
      console.log('🔍 Starting optimized complete data analysis...');
    }

    // Validate data first
    if (!AnalyticsValidator.validateParsedData(this.data)) {
      console.error('❌ Data validation failed - returning basic summary');
      return [this.createBasicDataSummary()];
    }

    const allResults: AnalysisResult[] = [];
    
    try {
      // Run analyzers concurrently for better performance
      const analysisPromises = [
        { name: 'row count', promise: Promise.resolve(this.analyzeRowCounts()) },
        { name: 'action', promise: Promise.resolve(this.analyzeActionBreakdown()) },
        { name: 'time', promise: Promise.resolve(this.analyzeTimeTrends()) },
        { name: 'product', promise: Promise.resolve(this.analyzeProducts()) }
      ];

      // Execute all analyses
      analysisPromises.forEach(({ name, promise }) => {
        try {
          promise.then(results => {
            allResults.push(...results);
            if (this.config.enableLogging) {
              console.log(`✅ ${name} analysis completed with ${results.length} results`);
            }
          }).catch(error => {
            if (this.config.enableLogging) {
              console.warn(`⚠️ ${name} analysis failed:`, error);
            }
            allResults.push(this.createErrorResult(`${name}-analysis-error`, error));
          });
        } catch (error) {
          if (this.config.enableLogging) {
            console.warn(`⚠️ ${name} analysis failed:`, error);
          }
          allResults.push(this.createErrorResult(`${name}-analysis-error`, error));
        }
      });

      // Add analytics manager results
      this.analyticsManager.runCompleteAnalysis(this.data).then(basicResults => {
        allResults.push(...basicResults);
        if (this.config.enableLogging) {
          console.log(`✅ Analytics manager added ${basicResults.length} results`);
        }
      }).catch(error => {
        console.error('Analytics manager error:', error);
      });

      // Ensure we have at least basic results
      if (allResults.length === 0) {
        allResults.push(this.createBasicDataSummary());
      }

    } catch (criticalError) {
      console.error('❌ Critical analysis failure:', criticalError);
      allResults.push(this.createErrorResult('critical-analysis-error', criticalError));
      allResults.push(this.createBasicDataSummary());
    }

    // Apply optimizations to results
    const optimizedResults = AnalyticsValidator.optimizeResults(
      AnalyticsValidator.sanitizeResults(allResults)
    );

    const duration = performance.now() - startTime;
    if (this.config.enableLogging) {
      console.log(`🎯 Optimized analysis completed in ${duration.toFixed(2)}ms with ${optimizedResults.length} results`);
    }

    return optimizedResults;
  }

  getAnalysisSummary(): AnalysisSummary {
    const results = this.runCompleteAnalysis();
    return this.analyticsManager.getAnalysisSummary(results);
  }

  // Clear cache for memory optimization
  clearCache(): void {
    this.cache.clear();
    if (this.config.enableLogging) {
      console.log('🧹 Analysis cache cleared');
    }
  }

  private executeOptimizedAnalysis(analysisName: string, analysisFunction: () => AnalysisResult[]): AnalysisResult[] {
    const startTime = performance.now();
    
    if (this.config.enableLogging) {
      console.log(`⚡ Running optimized ${analysisName} analysis...`);
    }

    try {
      const results = analysisFunction();
      const duration = performance.now() - startTime;
      
      if (this.config.enableLogging) {
        console.log(`✅ ${analysisName} analysis completed in ${duration.toFixed(2)}ms:`, results.length, 'results');
      }
      
      return results;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(`❌ ${analysisName} analysis failed after ${duration.toFixed(2)}ms:`, error);
      return [this.createErrorResult(`${analysisName.replace(/\s+/g, '-')}-error`, error)];
    }
  }

  private createBasicDataSummary(): AnalysisResult {
    const rowCount = this.data.rows?.length || 0;
    const columnCount = this.data.columns?.length || 0;
    const dataQuality = AnalyticsValidator.calculateDataQuality(this.data);
    
    return {
      id: 'optimized-data-summary',
      title: 'Dataset Overview (Optimized)',
      description: 'Enhanced dataset analysis with quality assessment',
      value: { rows: rowCount, columns: columnCount, quality: dataQuality },
      insight: `Your dataset contains ${rowCount} rows and ${columnCount} columns with ${dataQuality} quality. ${
        rowCount > 1000 ? 'This substantial dataset provides excellent analysis potential with optimized processing.' : 
        rowCount > 100 ? 'This dataset provides good analysis foundation with efficient processing.' : 
        'This smaller dataset has been optimized for quick analysis.'
      }`,
      confidence: rowCount > 100 ? 'high' : 'medium'
    };
  }

  private createErrorResult(id: string, error: unknown): AnalysisResult {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      id,
      title: 'Analysis Error (Optimized Recovery)',
      description: 'Error occurred but recovery mechanisms applied',
      value: 0,
      insight: `Error: ${errorMessage}. The system has applied error recovery and will continue processing other analyses.`,
      confidence: 'low'
    };
  }
}

export type { AnalysisResult, AnalysisSummary };
